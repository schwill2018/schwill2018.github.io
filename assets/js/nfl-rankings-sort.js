(() => {
  const table = document.querySelector("table");
  if (!table) return;
  const headers = [...table.tHead.rows[0].cells];
  headers.forEach((header, column) => {
    header.dataset.label = header.textContent.trim();
    const button = document.createElement("button");
    button.type = "button";
    button.style.cssText = "font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer;";
    button.textContent = header.dataset.label + (column === 0 ? " ↑" : " ↕");
    header.replaceChildren(button);
    header.setAttribute("aria-sort", column === 0 ? "ascending" : "none");
    button.addEventListener("click", () => {
      const ascending = header.getAttribute("aria-sort") !== "ascending";
      const rows = [...table.tBodies[0].rows];
      rows.sort((a, b) => {
        const x = a.cells[column].textContent.trim();
        const y = b.cells[column].textContent.trim();
        const order = Number.isNaN(Number(x)) ? x.localeCompare(y) : Number(x) - Number(y);
        return ascending ? order : -order;
      });
      table.tBodies[0].append(...rows);
      headers.forEach(other => {
        other.setAttribute("aria-sort", other === header ? (ascending ? "ascending" : "descending") : "none");
        other.firstElementChild.textContent = other.dataset.label +
          (other === header ? (ascending ? " ↑" : " ↓") : " ↕");
      });
    });
  });
})();
