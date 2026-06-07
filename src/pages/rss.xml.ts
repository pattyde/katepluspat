import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { postSlugFromId } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Kate + Pat',
    description: "Kate and Pat's travel blog.",
    site: context.site!,
    items: sorted.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: `${post.data.country} — ${post.data.trip}`,
      link: `/${post.data.trip}/${postSlugFromId(post.id)}/`,
    })),
  });
}
