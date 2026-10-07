// sitemap.xml from the data layer: every indexable page we generate.
import type { APIRoute } from 'astro';
import { getSites } from '../lib/data';
import { routes } from '../lib/format';
import { getListingPaths } from '../lib/listing';
import { getProfilePaths } from '../lib/profile';
import { getArticlePaths } from '../lib/article';

export const GET: APIRoute = ({ site }) => {
  const paths = [routes.home, ...getSites().map((s) => routes.site(s.slug)), ...getListingPaths().map((p) => `/${p.kind}/${p.slug}`), ...getProfilePaths().map(routes.guide), routes.ideas, ...getArticlePaths().map(routes.article), routes.compare];
  const urls = paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
