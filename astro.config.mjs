// @ts-check
import { defineConfig } from 'astro/config';

// Static output: every route is plain HTML at build time (SEO and AI crawlers need it without JS).
// SITE_URL is the production origin; it feeds canonical URLs and JSON-LD.
// Cloudflare Pages sets CF_PAGES and CF_PAGES_URL. Until launch, deploys are previews on *.pages.dev:
// not indexed (see src/lib/site-config.ts) and using the preview URL as origin.
// At launch set INDEXABLE=true and SITE_URL (the real domain); the build refuses one without the other (OL-04).
if (process.env.INDEXABLE === 'true' && !process.env.SITE_URL) throw new Error('INDEXABLE=true needs SITE_URL (the production origin, e.g. https://www.example.fr).');

export default defineConfig({
  site: process.env.SITE_URL || process.env.CF_PAGES_URL || 'http://localhost:4321',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
});
