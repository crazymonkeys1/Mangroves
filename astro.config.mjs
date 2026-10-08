// @ts-check
import { defineConfig } from 'astro/config';

// Static output: every route is plain HTML at build time (SEO and AI crawlers need it without JS).
// SITE_URL is the production origin; it feeds canonical URLs and JSON-LD.
// Pages are indexed by default (src/lib/site-config.ts). On Cloudflare (Workers Builds set WORKERS_CI,
// Pages set CF_PAGES) an indexed build needs a stable origin in SITE_URL (the workers.dev address now,
// the real domain later). Until SITE_URL is set on Workers, the current live address is used.
const LIVE_ORIGIN = 'https://mangroves.app-e5e.workers.dev';
if (process.env.CF_PAGES && process.env.INDEXABLE !== 'false' && !process.env.SITE_URL) throw new Error('Set SITE_URL in the Cloudflare project (e.g. https://mangroves-gwada.pages.dev), or INDEXABLE=false for a hidden preview.');

export default defineConfig({
  site: process.env.SITE_URL || (process.env.WORKERS_CI ? LIVE_ORIGIN : process.env.CF_PAGES_URL) || 'http://localhost:4321',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
});
