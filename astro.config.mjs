import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://ldh1103.github.io',
  base: '/ai-study-blog',
  integrations: [mdx()],
});
