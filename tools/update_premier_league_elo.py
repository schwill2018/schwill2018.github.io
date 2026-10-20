"""Refresh Premier League portfolio tables from one model repository commit."""
import csv
import html
import io
import json
import math
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
REPO = 'schwill2018/premiere-league-elo'

def download(url):
    with urlopen(Request(url, headers={'User-Agent': 'portfolio-elo-updater'}), timeout=60) as response:
        return response.read().decode('utf-8-sig')

def records(text, required):
    reader = csv.DictReader(io.StringIO(text))
    missing = set(required) - set(reader.fieldnames or [])
    if missing:
        raise ValueError(f'Missing columns: {sorted(missing)}')
    return list(reader)

def clean(value):
    return html.escape(str(value or '')).replace('|', '&#124;').replace('\n', ' ')

def number(value, spec='.2f'):
    if value is None or not str(value).strip():
        return '—'
    result = float(value)
    if not math.isfinite(result):
        raise ValueError('Non-finite table value')
    return format(result, spec)

def render(rankings, weekly, history, metadata):
    rankings = sorted(rankings, key=lambda row: int(row['rank']))
    history = sorted(history, key=lambda row: (int(row['season']), row['gameday'], row['gametime'], row['game_id']))
    season = int(metadata['current_season'])
    season_games = [g for g in history if int(g['season']) == season]
    comparison_week = (int(weekly[0]['week']) if weekly else
                       max((int(g['week']) for g in season_games), default=0))
    baseline, changes = {}, {}
    for game in season_games:
        for side in ('home', 'away'):
            team = game[f'{side}_team']
            baseline.setdefault(team, float(game[f'elo_{side}_pre']))
    for game in season_games:
        for side in ('home', 'away'):
            team = game[f'{side}_team']
            changes[team] = float(game[f'elo_{side}_post']) - float(game[f'elo_{side}_pre'])
            if int(game['week']) < comparison_week:
                baseline[team] = float(game[f'elo_{side}_post'])
    current = {r['team']: float(r['elo']) for r in rankings}
    baseline = {team: baseline.get(team, elo) for team, elo in current.items()}
    def ranks(values):
        return {team: 1 + sum(other > elo for other in values.values()) for team, elo in values.items()}
    old_rank, new_rank = ranks(baseline), ranks(current)
    lines = ['---', 'layout: page', 'title: Premier League Elo', 'icon: fas fa-futbol', 'order: 11',
             'permalink: /premier-league-elo/', 'categories: [sports]', 'tags: [ELO, forecasting, soccer]', '---', '',
             f"Current Premier League Elo rankings as of **{clean(rankings[0].get('as_of_date'))}**.", '',
             f"Latest completed match in the source: **{clean(metadata['latest_result_date'])}**.", '',
             '| Rank | Team | Elo | Elo Δ | Rank Δ |', '| ---: | --- | ---: | ---: | ---: |']
    for row in rankings:
        team = row['team']
        lines.append(f"| {row['rank']} | {clean(team)} | {number(row['elo'])} | {changes.get(team, 0):+.2f} | {old_rank[team] - new_rank[team]:+d} |")
    lines += ['', "Elo Δ is the change from each team's latest completed game this season. "
              f"Rank Δ is places gained (+) or lost (−) since the start of Matchday {comparison_week}; 0 means unchanged.",
              '', '## Weekly Predictions', '']
    if weekly:
        lines += [f"Matchday **{int(weekly[0]['week'])} of 38**. Kickoff times are UK local time.", '',
                  '| Date | Time | Away | Home | Away Elo | Home Elo | Away Win Probability | Home Win Probability | Home Spread | Forecast Date | Outcome |',
                  '| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |']
        for row in sorted(weekly, key=lambda r: (r['gameday'], r['gametime'], r['game_id'])):
            result = row['result']
            outcome = {'HOME': row['home_team'], 'AWAY': row['away_team'], 'DRAW': 'Draw', 'TBD': 'TBD'}[result]
            if result != 'TBD':
                outcome += f" ({number(row['home_score'], '.0f')}–{number(row['away_score'], '.0f')} home–away)"
            values = [clean(row['gameday'][:10]), clean(row['gametime']), clean(row['away_team']), clean(row['home_team']),
                      number(row['away_elo']), number(row['home_elo']), number(row['p_away'], '.1%'), number(row['p_home'], '.1%'),
                      number(row['model_home_spread'], '+.1f'), clean(row['as_of_date']) or '—', clean(outcome)]
            lines.append('| ' + ' | '.join(values) + ' |')
    else:
        lines += ['No weekly fixtures are currently available from the source.']
    lines += ['', 'Win probabilities use a two-outcome Elo approximation; draws are not separately modeled. Negative Home Spread favors the home team; positive favors the away team.', '',
              'Weekly forecasts stay fixed while rankings update daily. Completed games remain visible until the matchday finishes. A dash means no pregame forecast was recorded.', '',
              '[View model performance]({% link _tabs/premier-league-elo-performance.md %})', '',
              '[Click here to get the data](https://raw.githubusercontent.com/schwill2018/premiere-league-elo/main/pl_elo_history.csv)', '',
              '<script src="{{ \'/assets/js/nfl-rankings-sort.js\' | relative_url }}" defer></script>']
    return '\n'.join(lines) + '\n'

def main():
    # Pin downloads to one commit so a simultaneous model update cannot mix files.
    commit = json.loads(download(f'https://api.github.com/repos/{REPO}/commits/main'))['sha']
    base = f'https://raw.githubusercontent.com/{REPO}/{commit}/'
    files = {name: download(base + name) for name in (
        'current_elo_rankings.csv', 'weekly_projections.csv', 'performance_games.csv', 'pl_elo_history.csv', 'run_metadata.json')}
    metadata = json.loads(files['run_metadata.json'])
    if metadata.get('offline') is not False:
        raise ValueError('Refusing to publish an offline model run')
    rankings = records(files['current_elo_rankings.csv'], ['rank', 'team', 'elo', 'as_of_date'])
    if len(rankings) != 20 or len({r['team'] for r in rankings}) != 20:
        raise ValueError('Expected 20 unique Premier League teams')
    weekly = records(files['weekly_projections.csv'], ['game_id', 'week', 'gameday', 'gametime', 'home_team', 'away_team',
        'home_elo', 'away_elo', 'p_home', 'p_away', 'model_home_spread', 'as_of_date', 'result', 'home_score', 'away_score'])
    performance = records(files['performance_games.csv'], ['season', 'week', 'game_id', 'p_home', 'actual_home_win', 'evaluation_type'])
    for row in performance:
        if row['evaluation_type'] not in {'historical', 'deployed'} or row['actual_home_win'] not in {'0', '1'} or not 0 <= float(row['p_home']) <= 1:
            raise ValueError('Invalid performance record')
    history = records(files['pl_elo_history.csv'], ['season', 'week', 'game_id', 'gameday', 'gametime', 'home_team', 'away_team',
        'elo_home_pre', 'elo_home_post', 'elo_away_pre', 'elo_away_post'])
    page = render(rankings, weekly, history, metadata)
    data_dir = ROOT / 'assets/data/premier-league-elo'
    data_dir.mkdir(parents=True, exist_ok=True)
    (ROOT / '_tabs/premier-league-elo.md').write_text(page, encoding='utf-8')
    for name in ['performance_games.csv', 'run_metadata.json']:
        (data_dir / name).write_text(files[name], encoding='utf-8')
    print(f'Updated Premier League pages from {commit}; {len(rankings)} teams, {len(weekly)} weekly games, {len(performance)} performance records')

if __name__ == '__main__':
    main()
