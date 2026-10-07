// Build-time switches read from the environment (Cloudflare Pages project settings).
// Indexing: on Cloudflare, nothing is indexed until INDEXABLE=true (set at launch, with SITE_URL).
// Local builds stay indexable so the step-review checks test the real launch setup.
export const INDEXABLE = process.env.CF_PAGES ? process.env.INDEXABLE === 'true' : true;
