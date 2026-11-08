# frozen_string_literal: true

module Portfolio
  # Jekyll's site.tags covers posts only. Keep a separate index so projects and
  # tabs can share archives without changing the theme's post-specific behavior.
  class TopicTags < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      entries = site.posts.docs + site.pages + site.collections.fetch('tabs').docs
      entries = entries.reject do |entry|
        entry.data['redirect_url'] || entry.data['external_url']
      end.uniq(&:url)

      tags = {}
      entries.each do |entry|
        Array(entry.data['tags']).map(&:strip).reject(&:empty?).uniq.each do |tag|
          (tags[tag] ||= []) << entry
        end
      end
      tags.each_value { |items| items.sort_by! { |item| item.data.fetch('title', '').downcase } }

      site.data['topic_tags'] = tags
      site.data['trending_topic_tags'] = tags.keys.sort_by { |tag| [-tags[tag].size, tag.downcase] }.first(10)

      tags.each do |tag, items|
        slug = Jekyll::Utils.slugify(tag)
        archive = Jekyll::PageWithoutAFile.new(site, site.source, "tags/#{slug}", 'index.html')
        archive.data.merge!(
          'layout' => 'tag',
          'title' => tag,
          'description' => "Posts, projects, and dashboards about #{tag} by Will Schneider.",
          'posts' => items
        )
        site.pages << archive
      end

      # Keep bookmarks and indexed URLs working without showing obsolete labels
      # in the topic index or creating duplicate archives in the sitemap.
      site.data.fetch('tag_redirects', {}).each do |old_slug, tag|
        unless tags.key?(tag)
          raise Jekyll::Errors::FatalException, "Unknown target topic #{tag} for /tags/#{old_slug}/"
        end
        next if tags.keys.any? { |name| Jekyll::Utils.slugify(name) == old_slug }

        redirect = Jekyll::PageWithoutAFile.new(site, site.source, "tags/#{old_slug}", 'index.html')
        redirect.data.merge!(
          'layout' => 'tag-redirect',
          'title' => tag,
          'redirect_target' => "/tags/#{Jekyll::Utils.slugify(tag)}/",
          'sitemap' => false
        )
        site.pages << redirect
      end
    end
  end
end
