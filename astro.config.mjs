// @ts-check
import { defineConfig } from 'astro/config';

// Static output: every route is plain HTML at build time (SEO and AI crawlers need it without JS).
// SITE_URL is the production origin; it feeds canonical URLs and JSON-LD.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
});
