// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://katepluspat.com',
  output: 'static',
  image: {
    remotePatterns: [],
  },
  vite: {
    build: {
      rollupOptions: {
        // Pagefind is generated post-build; exclude from Rollup resolution
        external: ['/_pagefind/pagefind-ui.js'],
      },
    },
  },
});
