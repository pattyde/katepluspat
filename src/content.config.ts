import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const trips = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/trips' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    slug: z.string(),
    dateRange: z.string(),
    countries: z.array(z.string()),
    heroImage: z.string().optional(),
    summary: z.string().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.coerce.date(),
    author: z.string().default('katepluspat'),
    trip: z.string(),
    country: z.string(),
    tags: z.array(z.string()).default([]),
    images: z.array(z.object({
      path: z.string(),
      caption: z.string().default(''),
    })).default([]),
  }),
});

export const collections = { trips, posts };
