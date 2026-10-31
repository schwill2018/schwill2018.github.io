---
layout: page
title: FBS ELO Performance
icon: fas fa-chart-line
order: 10
permalink: /fbs-elo-performance/
categories: [sports]
tags: [ELO, forecasting, football, FBS]
---

<div id="fbs-elo" data-page="performance" data-performance="{{ '/assets/data/fbs-elo/performance_games.csv' | relative_url }}">
  <h2>Historical Model Performance</h2>
  <p>Prior-season predictions use only information available before each game. Filter by season and the team’s conference in that season.</p>
  <div class="row g-3 mb-3">
    <div class="col-sm-6"><label class="form-label" for="fbs-season">Season</label><select id="fbs-season" class="form-select"><option value="">All Seasons</option></select></div>
    <div class="col-sm-6"><label class="form-label" for="fbs-conference">Conference</label><select id="fbs-conference" class="form-select"><option value="">All Conferences</option></select></div>
  </div>
  <p id="fbs-historical-summary" role="status" aria-live="polite">Loading performance data…</p>
  <div class="table-wrapper">
    <table id="fbs-historical-performance">
      <thead><tr><th>Season</th><th>Conference</th><th>Games</th><th>Accuracy</th><th>Log Loss</th><th>Brier Score</th></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  <nav aria-label="Historical performance pages" class="d-flex align-items-center flex-wrap gap-3 mb-3">
    <button id="historical-previous" class="btn btn-outline-secondary btn-sm" type="button" disabled>Previous</button>
    <span id="historical-page" role="status" aria-live="polite"></span>
    <button id="historical-next" class="btn btn-outline-secondary btn-sm" type="button" disabled>Next</button>
  </nav>
  <p id="fbs-historical-empty" class="text-muted" hidden>No historical games match this selection.</p>
  <p class="text-muted">Conference rows include games involving an FBS team in that conference, including nonconference opponents. A game between two FBS conferences appears in both conference rows. Overall metrics count each game once.</p>

  <h2>Current Season Performance</h2>
  <p>Results from forecasts actually recorded before kickoff. Games played before recording began are not counted here.</p>
  <div class="row g-3 mb-3">
    <div class="col-sm-6"><label class="form-label" for="fbs-deployed-week">Week</label><select id="fbs-deployed-week" class="form-select"><option value="">All Weeks</option></select></div>
    <div class="col-sm-6"><label class="form-label" for="fbs-deployed-conference">Conference</label><select id="fbs-deployed-conference" class="form-select"><option value="">All Conferences</option></select></div>
  </div>
  <p id="fbs-deployed-summary" role="status" aria-live="polite"></p>
  <div class="table-wrapper">
    <table id="fbs-deployed-performance">
      <thead><tr><th>Week</th><th>Conference</th><th>Games</th><th>Accuracy</th><th>Log Loss</th><th>Brier Score</th></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  <nav aria-label="Current performance pages" class="d-flex align-items-center flex-wrap gap-3 mb-3">
    <button id="deployed-previous" class="btn btn-outline-secondary btn-sm" type="button" disabled>Previous</button>
    <span id="deployed-page" role="status" aria-live="polite"></span>
    <button id="deployed-next" class="btn btn-outline-secondary btn-sm" type="button" disabled>Next</button>
  </nav>
  <p id="fbs-deployed-empty" class="text-muted" hidden>No completed games with recorded pregame predictions match this selection yet.</p>
  <p id="fbs-load-error" class="text-danger" hidden>FBS performance data could not be loaded. Please try again later.</p>
</div>

[Full table (CSV)]({{ '/assets/data/fbs-elo/performance_games.csv' | relative_url }})

<a href="{{ '/assets/data/fbs-elo/performance_games.csv' | relative_url }}" download="fbs-elo-performance.csv">Download CSV</a>

[Back to FBS ELO]({% link _tabs/fbs-elo.md %})

<noscript>Enable JavaScript to filter the performance tables, or use the Full table CSV link.</noscript>
<script src="{{ '/assets/js/fbs-elo.js' | relative_url }}" defer></script>
