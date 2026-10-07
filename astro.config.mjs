// @ts-check
import { defineConfig } from 'astro/config';

// Static output: every route is plain HTML at build time (SEO and AI crawlers need it without JS).
// SITE_URL is the production origin; it feeds canonical URLs and JSON-LD.
// Cloudflare Pages sets CF_PAGES: a deploy without SITE_URL would publish localhost canonicals (OL-04).
if (process.env.CF_PAGES && !process.env.SITE_URL) throw new Error('SITE_URL is required for Cloudflare Pages builds (production origin, e.g. https://www.example.fr).');

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
});
