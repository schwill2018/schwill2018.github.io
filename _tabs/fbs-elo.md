---
layout: page
title: FBS ELO
icon: fas fa-football-ball
order: 9
permalink: /fbs-elo/
categories: [sports]
tags: [ELO, forecasting, football, FBS]
---

<div id="fbs-elo" data-page="rankings" data-rankings="{{ '/assets/data/fbs-elo/current_elo_rankings.csv' | relative_url }}" data-weekly="{{ '/assets/data/fbs-elo/weekly_projections.csv' | relative_url }}">
  <p id="fbs-updated">Loading current FBS Elo rankings…</p>
  <div class="table-wrapper">
    <table id="fbs-rankings">
      <thead><tr><th>Rank</th><th>Team</th><th>Elo</th><th>Elo Δ</th><th>Rank Δ</th><th>Conference</th></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  <nav aria-label="Rankings pages" class="d-flex align-items-center flex-wrap gap-3 mb-3">
    <button id="rankings-previous" type="button" class="btn btn-outline-secondary btn-sm" disabled>Previous</button>
    <span id="rankings-page" role="status" aria-live="polite"></span>
    <button id="rankings-next" type="button" class="btn btn-outline-secondary btn-sm" disabled>Next</button>
  </nav>
  <p id="fbs-delta-note" class="text-muted"></p>
  <p><a href="{{ '/assets/data/fbs-elo/current_elo_rankings.csv' | relative_url }}">Full table (CSV)</a> · <a href="{{ '/assets/data/fbs-elo/current_elo_rankings.csv' | relative_url }}" download="fbs-elo-rankings.csv">Download CSV</a></p>

  <h2>Weekly Predictions</h2>
  <p id="fbs-week"></p>
  <div class="mb-3">
    <label class="form-label" for="fbs-game-cutoff">Show games involving</label>
    <select id="fbs-game-cutoff" class="form-select" style="max-width: 18rem;">
      <option value="50" selected>At least one top-50 FBS team</option>
      <option value="25">At least one top-25 FBS team</option>
    </select>
  </div>
  <div class="table-wrapper">
    <table id="fbs-weekly">
      <thead><tr><th>Date</th><th>Away</th><th>Home</th><th>Away Elo</th><th>Home Elo</th><th>Away Win Probability</th><th>Home Win Probability</th><th>Home Spread</th><th>Outcome</th><th>Forecast</th></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  <p id="fbs-weekly-empty" class="text-muted" hidden>No games match this selection.</p>
  <p>Negative Home Spread favors the home team; positive favors the away team.</p>
  <p class="text-muted">Rankings and the game filter use current Elo ranks. A “Recorded” forecast was saved before kickoff. “Historical” is the model’s historical pregame estimate for a game played before tracking began; it is excluded from recorded-prediction performance.</p>
  <p id="fbs-load-error" class="text-danger" hidden>FBS Elo data could not be loaded. Please try again later.</p>
</div>

[View model performance]({% link _tabs/fbs-elo-performance.md %})

[Get the historical game data](https://raw.githubusercontent.com/schwill2018/college-football-elo/main/cfb_elo_history.csv)

<noscript>Enable JavaScript to sort and browse the tables, or use the Full table CSV link.</noscript>
<script src="{{ '/assets/js/fbs-elo.js' | relative_url }}" defer></script>
