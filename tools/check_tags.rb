# frozen_string_literal: true

# Run with: bundle exec ruby tools/check_tags.rb
# Build the real site and verify navigation across its different content types.
require 'jekyll'
require 'nokogiri'
require 'uri'

root = File.expand_path('..', __dir__)
site = Jekyll::Site.new(Jekyll.configuration('source' => root, 'destination' => File.join(root, '_site')))
site.process

def assert(condition, message)
  abort "FAIL: #{message}" unless condition
end

def document(site, url)
  Nokogiri::HTML(File.read(File.join(site.dest, url, 'index.html')))
end

expected = {
  'forecasting' => %w[/posts/aircraft-ts-report/ /nfl-elo/ /fbs-elo/ /premier-league-elo/],
  'sports-analytics' => %w[/projects/nhl-predictions/ /nfl-elo/ /nfl-elo-performance/
                          /fbs-elo/ /fbs-elo-performance/ /premier-league-elo/ /premier-league-elo-performance/],
  'nhl' => %w[/projects/nhl-predictions/],
  'football' => %w[/nfl-elo/ /nfl-elo-performance/],
  'hypermobility' => %w[/projects/hip-hypermobility/],
  'recommender-systems' => %w[/posts/dual-supervision/ /projects/data-science-capstone/]
}
expected.each do |slug, urls|
  archive = document(site, "/tags/#{slug}/")
  actual = archive.css('#page-tag ul a').map { |link| link['href'] }
  assert(actual.sort == urls.sort, "#{slug} should list its canonical pages exactly once")
  assert(archive.at_css('#page-tag h1 span').text.to_i == urls.size, "#{slug} count should match its listing")
end

index = document(site, '/tags/')
labels = index.css('#tags a').map { |link| link.children.first.text.strip }
assert(labels == labels.sort_by(&:downcase), 'Tags index should be alphabetically ordered')
assert(index.at_css('#tags a[href="/tags/sports-analytics/"] span').text.to_i == 7,
       'Tags index should count projects and dashboards without redirected duplicates')

%w[/projects/nhl-predictions/ /nfl-elo/ /fbs-elo-performance/].each do |url|
  page = document(site, url)
  assert(page.css('nav[aria-label="Page topics"] a').size >= 4, "#{url} should display clickable topic tags")
  assert(page.css('h1').size == 1, "#{url} should retain one page heading")
end
assert(document(site, '/aboutme/').css('nav[aria-label="Page topics"]').empty?, 'About should have no topic tags')

# Previously published tag URLs should redirect directly to an existing topic.
redirects = site.data.fetch('tag_redirects')
%w[aircraft imputation random-forest dual-supervision].each do |slug|
  assert(redirects.key?(slug), "Previously published /tags/#{slug}/ should be preserved")
end
redirects.each do |old_slug, tag|
  redirect = document(site, "/tags/#{old_slug}/")
  target = "/tags/#{Jekyll::Utils.slugify(tag)}/"
  assert(redirect.at_css('meta[http-equiv="refresh"]')['content'] == "0; url=#{target}",
         "#{old_slug} should redirect to #{target}")
  assert(redirect.at_css('link[rel="canonical"]')['href'] == "#{site.config['url']}#{target}",
         "#{old_slug} should identify the canonical archive")
  assert(document(site, target).at_css('#page-tag'), "#{old_slug} should not redirect to another redirect")
end

# Check every rendered tag link, including post footers and the sidebar.
links_checked = 0
Dir.glob(File.join(site.dest, '**/*.html')).each do |path|
  Nokogiri::HTML(File.read(path)).css('a[href^="/tags/"]').each do |link|
    target = URI::DEFAULT_PARSER.unescape(link['href'])
    assert(File.file?(File.join(site.dest, target, 'index.html')), "Missing tag destination #{target} in #{path}")
    links_checked += 1
  end
end

puts "PASS: canonical archive membership, counts, alphabetical index, page tags, #{redirects.size} legacy redirects, and #{links_checked} tag links"
