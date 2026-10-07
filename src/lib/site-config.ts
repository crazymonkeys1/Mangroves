// Build-time switches read from the environment (Cloudflare Pages project settings).
// Indexing is on by default (decided 7 Oct 2026); set INDEXABLE=false to hide a deployment from crawlers.
export const INDEXABLE = process.env.INDEXABLE !== 'false';
