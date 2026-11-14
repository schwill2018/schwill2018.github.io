# Chirpy Starter

[![Gem Version](https://img.shields.io/gem/v/jekyll-theme-chirpy)][gem]&nbsp;
[![GitHub license](https://img.shields.io/github/license/cotes2020/chirpy-starter.svg?color=blue)][mit]

When installing the [**Chirpy**][chirpy] theme through [RubyGems.org][gem], Jekyll can only read files in the folders
`_data`, `_layouts`, `_includes`, `_sass` and `assets`, as well as a small part of options of the `_config.yml` file
from the theme's gem. If you have ever installed this theme gem, you can use the command
`bundle info --path jekyll-theme-chirpy` to locate these files.

The Jekyll team claims that this is to leave the ball in the user’s court, but this also results in users not being
able to enjoy the out-of-the-box experience when using feature-rich themes.

To fully use all the features of **Chirpy**, you need to copy the other critical files from the theme's gem to your
Jekyll site. The following is a list of targets:

```shell
.
├── _config.yml
├── _plugins
├── _tabs
└── index.html
```

To save you time, and also in case you lose some files while copying, we extract those files/configurations of the
latest version of the **Chirpy** theme and the [CD][CD] workflow to here, so that you can start writing in minutes.

## Usage

Check out the [theme's docs](https://github.com/cotes2020/jekyll-theme-chirpy/wiki).

### Topic tags

Maintain topic labels in each page's YAML `tags` list. Use consistent spelling and
capitalization so related posts, project pages, and Elo tabs share an archive.
The `topic-tags.rb` plugin builds `/tags/<slug>/` pages, the Tags index, and sidebar
counts from those lists. Redirect-only posts are excluded to avoid listing a
project twice. Pages using the `page` layout display their tags below the content.
Previously published tag URLs are preserved with redirects listed in
`_data/tag_redirects.yml`.

When changing tags on the NFL or Premier League rankings, also update the tags
written by `.github/workflows/update_nfl_elo_page.yml` or
`tools/update_premier_league_elo.py` so the next refresh preserves them.

Run `bundle exec ruby tools/check_tags.rb` to build the site and check tag archive
membership, counts, displayed labels, and link destinations.

## Contributing

This repository is automatically updated with new releases from the theme repository. If you encounter any issues or want to contribute to its improvement, please visit the [theme repository][chirpy] to provide feedback.

## Usage and AI Processing Notice

This repository powers the portfolio website for Will Schneider. It is provided for human portfolio review, educational inspection, and professional evaluation only. It may not be used for AI training, machine learning training, model fine-tuning, embedding generation, retrieval indexing, vector database ingestion, dataset construction, benchmark construction, synthetic data generation, code synthesis, scraping, bulk downloading, or derivative automated systems without written permission.

See [`AI_USE.md`](AI_USE.md) for the full notice.

# Content License

Copyright © 2026 Will Schneider. All rights reserved.

All original portfolio content, project writeups, posts, reports, images, analysis, code examples, downloadable files, and documentation authored by Will Schneider are reserved unless otherwise stated.

No permission is granted to use the original content in this repository or on the generated website for AI training, machine learning training, model fine-tuning, embedding generation, retrieval indexing, vector database ingestion, dataset construction, benchmark construction, synthetic data generation, code synthesis, scraping, bulk downloading, or derivative automated systems without prior written permission.

Third-party theme files and dependencies remain subject to their own licenses.
