(() => {
  "use strict";
  const root = document.querySelector("#fbs-elo");
  if (!root) return;
  const byId = (id) => document.getElementById(id);
  const numeric = (value) => value !== undefined && value !== null && String(value).trim() !== "" && Number.isFinite(Number(value));
  const decimal = (value) => numeric(value) ? Number(value).toFixed(2) : "—";
  const probability = (value) => numeric(value) ? `${(Number(value) * 100).toFixed(1)}%` : "—";
  const signed = (digits) => (value) => numeric(value) ? `${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(digits)}` : "—";

  function parseCsv(text) {
    const records = [];
    let row = [], field = "", quoted = false;
    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      if (quoted) {
        if (character === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
        else if (character === '"') quoted = false;
        else field += character;
      } else if (character === '"') quoted = true;
      else if (character === ",") { row.push(field); field = ""; }
      else if (character === "\n") { row.push(field.replace(/\r$/, "")); records.push(row); row = []; field = ""; }
      else field += character;
    }
    if (field || row.length) { row.push(field.replace(/\r$/, "")); records.push(row); }
    const [header, ...rows] = records;
    if (!header) throw new Error("Empty CSV");
    header[0] = header[0].replace(/^\uFEFF/, "");
    return rows.filter((values) => values.some((value) => value !== ""))
      .map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""])));
  }

  async function loadCsv(url, columns) {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const rows = parseCsv(text);
    // A header-only file is valid while recorded-prediction performance is empty.
    const header = parseCsv(`${text.split(/\r?\n/)[0]}\n${columns.map(() => "x").join(",")}\n`)[0];
    if (columns.some((column) => !Object.hasOwn(header, column))) throw new Error("Missing CSV columns");
    return rows;
  }

  function tableController(id, columns, pager, pageSize = 25, defaultDirection = 1) {
    const table = byId(id), headers = [...table.tHead.rows[0].cells];
    const state = { rows: [], column: 0, direction: defaultDirection, page: 0 };
    const buttons = headers.map((header, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.style.cssText = "font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:inherit";
      button.dataset.label = header.textContent;
      button.addEventListener("click", () => {
        state.direction = state.column === index ? -state.direction : 1;
        state.column = index; state.page = 0; render();
      });
      header.replaceChildren(button);
      return button;
    });
    function render() {
      const column = columns[state.column];
      const rows = [...state.rows].sort((a, b) => {
        const left = a[column.key], right = b[column.key];
        const blankLeft = left === "" || left === undefined || left === null;
        const blankRight = right === "" || right === undefined || right === null;
        if (blankLeft || blankRight) return Number(blankLeft) - Number(blankRight);
        const order = column.numeric ? Number(left) - Number(right) : String(left).localeCompare(String(right), undefined, { numeric: true });
        return state.direction * order;
      });
      const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
      state.page = Math.min(state.page, pageCount - 1);
      const start = state.page * pageSize;
      const body = table.tBodies[0]; body.replaceChildren();
      rows.slice(start, start + pageSize).forEach((row) => {
        const tr = document.createElement("tr");
        columns.forEach((column) => {
          const cell = document.createElement("td");
          cell.textContent = column.format ? column.format(row[column.key]) : String(row[column.key] ?? "");
          if (column.numeric) cell.classList.add("text-end");
          tr.append(cell);
        });
        body.append(tr);
      });
      headers.forEach((header, index) => {
        const selected = index === state.column;
        header.setAttribute("aria-sort", selected ? (state.direction === 1 ? "ascending" : "descending") : "none");
        buttons[index].textContent = buttons[index].dataset.label + (selected ? (state.direction === 1 ? " ↑" : " ↓") : " ↕");
      });
      if (pager) {
        byId(`${pager}-previous`).disabled = state.page === 0;
        byId(`${pager}-next`).disabled = state.page + 1 >= pageCount;
        byId(`${pager}-page`).textContent = rows.length ? `${start + 1}–${Math.min(start + pageSize, rows.length)} of ${rows.length} · Page ${state.page + 1} of ${pageCount}` : "0 results";
      }
    }
    if (pager) {
      byId(`${pager}-previous`).addEventListener("click", () => { state.page -= 1; render(); });
      byId(`${pager}-next`).addEventListener("click", () => { state.page += 1; render(); });
    }
    return { setRows(rows) { state.rows = rows; state.page = 0; render(); } };
  }

  async function rankingsPage() {
    const [rankings, weekly] = await Promise.all([
      loadCsv(root.dataset.rankings, ["rank", "team_name", "elo", "elo_delta", "rank_delta", "conference", "as_of_date"]),
      loadCsv(root.dataset.weekly, ["game_id", "away_rank", "home_rank", "p_home", "outcome", "prediction_source"]),
    ]);
    if (!rankings.length) throw new Error("Empty rankings");
    if (rankings.some((row) => !numeric(row.rank) || !numeric(row.elo))) throw new Error("Invalid rankings");
    const rankingsTable = tableController("fbs-rankings", [
      { key: "rank", numeric: true }, { key: "team_name" }, { key: "elo", numeric: true, format: decimal },
      { key: "elo_delta", numeric: true, format: signed(2) }, { key: "rank_delta", numeric: true, format: signed(0) }, { key: "conference" },
    ], "rankings");
    rankingsTable.setRows(rankings);
    byId("fbs-updated").textContent = `Current FBS Elo rankings as of ${rankings[0].as_of_date}.`;
    const phase = rankings[0].comparison_game_type === "POST" ? "postseason " : "";
    byId("fbs-delta-note").textContent = `Elo Δ is the change from each team's latest completed game. Rank Δ is places gained (+) or lost (−) since the start of ${phase}Week ${rankings[0].comparison_week} of ${rankings[0].comparison_season}.`;
    const weeklyTable = tableController("fbs-weekly", [
      { key: "gameday" }, { key: "away_team_name" }, { key: "home_team_name" },
      { key: "away_elo", numeric: true, format: decimal }, { key: "home_elo", numeric: true, format: decimal },
      { key: "p_away", numeric: true, format: probability }, { key: "p_home", numeric: true, format: probability },
      { key: "model_home_spread", numeric: true, format: signed(1) }, { key: "outcome" },
      { key: "prediction_source", format: (value) => ({ "Recorded pregame": "Recorded", "Historical model": "Historical", "Unavailable": "Unavailable" }[value] || value) },
    ], null, Number.MAX_SAFE_INTEGER);
    function renderWeekly() {
      const cutoff = Number(byId("fbs-game-cutoff").value);
      const rows = weekly.filter((row) => (numeric(row.away_rank) && Number(row.away_rank) <= cutoff) || (numeric(row.home_rank) && Number(row.home_rank) <= cutoff));
      weeklyTable.setRows(rows);
      byId("fbs-weekly-empty").hidden = rows.length > 0;
    }
    byId("fbs-week").textContent = `FBS ${phase}Week ${rankings[0].comparison_week}: forecasts and results as of ${rankings[0].as_of_date}.`;
    byId("fbs-game-cutoff").addEventListener("change", renderWeekly);
    renderWeekly();
  }

  function conferences(row) {
    return [...new Set(["home", "away"].filter((side) => row[`${side}_division`] === "fbs")
      .map((side) => row[`${side}_conference`] || "Independent"))];
  }

  function metrics(rows) {
    let correct = 0, logLoss = 0, brier = 0;
    rows.forEach((row) => {
      const p = Number(row.p_home), actual = Number(row.actual_home_win);
      const clipped = Math.min(1 - 1e-15, Math.max(1e-15, p));
      correct += Number(Number(p >= 0.5) === actual);
      logLoss -= actual * Math.log(clipped) + (1 - actual) * Math.log(1 - clipped);
      brier += (p - actual) ** 2;
    });
    return { games: rows.length, accuracy: correct / rows.length, logloss: logLoss / rows.length, brier: brier / rows.length };
  }

  function options(select, values) {
    [...new Set(values)].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true })).forEach((value) => {
      const option = document.createElement("option"); option.value = value; option.textContent = value; select.append(option);
    });
  }

  async function performancePage() {
    const rows = await loadCsv(root.dataset.performance, ["season", "week", "game_type", "home_conference", "away_conference", "home_division", "away_division", "p_home", "actual_home_win", "evaluation_type"]);
    if (rows.some((row) => !numeric(row.p_home) || Number(row.p_home) < 0 || Number(row.p_home) > 1 || !["0", "1"].includes(row.actual_home_win))) throw new Error("Invalid performance values");
    const historical = rows.filter((row) => row.evaluation_type === "historical");
    const deployed = rows.filter((row) => row.evaluation_type === "deployed");
    const metricColumns = [
      { key: "conference" }, { key: "games", numeric: true }, { key: "accuracy", numeric: true, format: probability },
      { key: "logloss", numeric: true, format: (value) => Number(value).toFixed(3) },
      { key: "brier", numeric: true, format: (value) => Number(value).toFixed(3) },
    ];
    const historicalTable = tableController("fbs-historical-performance", [{ key: "season", numeric: true }, ...metricColumns], "historical", 25, -1);
    const deployedTable = tableController("fbs-deployed-performance", [{ key: "week_label" }, ...metricColumns], "deployed");
    options(byId("fbs-season"), historical.map((row) => row.season));
    options(byId("fbs-conference"), historical.flatMap(conferences));
    options(byId("fbs-deployed-conference"), deployed.flatMap(conferences));
    deployed.forEach((row) => { row.week_label = `${row.game_type === "POST" ? "Postseason " : ""}${row.week}`; });
    options(byId("fbs-deployed-week"), deployed.map((row) => row.week_label));
    function render(kind, source, table) {
      const historicalMode = kind === "historical";
      const selectedTime = byId(historicalMode ? "fbs-season" : "fbs-deployed-week").value;
      const selectedConference = byId(historicalMode ? "fbs-conference" : "fbs-deployed-conference").value;
      const selected = source.filter((row) => (!selectedTime || (historicalMode ? row.season : row.week_label) === selectedTime) && (!selectedConference || conferences(row).includes(selectedConference)));
      const grouped = new Map();
      selected.forEach((row) => {
        (selectedConference ? [selectedConference] : conferences(row)).forEach((conference) => {
          const key = JSON.stringify([historicalMode ? row.season : row.week_label, conference]);
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key).push(row);
        });
      });
      table.setRows([...grouped].map(([key, games]) => {
        const [time, conference] = JSON.parse(key);
        return { [historicalMode ? "season" : "week_label"]: time, conference, ...metrics(games) };
      }));
      byId(`fbs-${kind}-empty`).hidden = selected.length > 0;
      const result = metrics(selected);
      byId(`fbs-${kind}-summary`).textContent = selected.length ? `${result.games.toLocaleString()} unique games · Accuracy ${probability(result.accuracy)} · Log loss ${result.logloss.toFixed(3)} · Brier score ${result.brier.toFixed(3)}` : "";
    }
    ["fbs-season", "fbs-conference"].forEach((id) => byId(id).addEventListener("change", () => render("historical", historical, historicalTable)));
    ["fbs-deployed-week", "fbs-deployed-conference"].forEach((id) => byId(id).addEventListener("change", () => render("deployed", deployed, deployedTable)));
    render("historical", historical, historicalTable);
    render("deployed", deployed, deployedTable);
  }

  (root.dataset.page === "rankings" ? rankingsPage() : performancePage()).catch(() => {
    byId("fbs-load-error").hidden = false;
    const loading = byId("fbs-updated") || byId("fbs-historical-summary");
    if (loading) loading.textContent = "";
  });
})();
