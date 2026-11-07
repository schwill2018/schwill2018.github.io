"""Copy validated model CSVs into the portfolio's published data directory."""
import argparse
import csv
import io
import math
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
SOURCE = "https://raw.githubusercontent.com/schwill2018/college-football-elo/main/"
SCHEMAS = {
    "current_elo_rankings.csv": {"rank", "team", "team_name", "elo", "elo_delta", "rank_delta", "conference", "as_of_date", "comparison_season", "comparison_game_type", "comparison_week"},
    "weekly_projections.csv": {"game_id", "game_type", "week", "gameday", "away_team_name", "home_team_name", "away_rank", "home_rank", "away_elo", "home_elo", "p_home", "p_away", "model_home_spread", "outcome", "prediction_source"},
    "performance_games.csv": {"game_id", "season", "game_type", "week", "home_conference", "away_conference", "home_division", "away_division", "p_home", "actual_home_win", "evaluation_type"},
}


def validate(filename, text):
    reader = csv.DictReader(io.StringIO(text.lstrip("\ufeff")))
    missing = SCHEMAS[filename] - set(reader.fieldnames or [])
    if missing:
        raise ValueError(f"{filename} is missing columns: {sorted(missing)}. Publish and run the college export update first.")
    rows = list(reader)
    if filename == "current_elo_rankings.csv" and not rows:
        raise ValueError("Empty FBS rankings.")
    keys = [(row.get("evaluation_type"), row["game_id"]) if filename == "performance_games.csv" else row.get("game_id", row.get("team")) for row in rows]
    if len(keys) != len(set(keys)):
        raise ValueError(f"Duplicate entries in {filename}.")
    for row in rows:
        for key in ["elo", "elo_delta", "rank_delta", "rank", "p_home", "p_away", "home_elo", "away_elo", "model_home_spread"]:
            if key in row and row[key].strip():
                value = float(row[key])
                if not math.isfinite(value) or (key in ["p_home", "p_away"] and not 0 <= value <= 1):
                    raise ValueError(f"Invalid {key} in {filename}.")
        if filename == "performance_games.csv":
            if row["evaluation_type"] not in {"historical", "deployed"} or row["actual_home_win"] not in {"0", "1"} or not row["p_home"].strip():
                raise ValueError("Invalid performance prediction or outcome.")
    return len(rows)


def main(source_dir=None):
    fetched = {}
    for filename in SCHEMAS:
        if source_dir is not None:
            text = (Path(source_dir) / filename).read_text(encoding="utf-8-sig")
        else:
            with urlopen(SOURCE + filename, timeout=60) as response:
                text = response.read().decode("utf-8-sig")
        count = validate(filename, text)
        fetched[filename] = text
        print(f"Validated {filename}: {count:,} rows")
    destination = ROOT / "assets/data/fbs-elo"
    destination.mkdir(parents=True, exist_ok=True)
    for filename, text in fetched.items():
        (destination / filename).write_text(text, encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, help="Read locally generated model outputs for preview.")
    args = parser.parse_args()
    main(args.source_dir)
