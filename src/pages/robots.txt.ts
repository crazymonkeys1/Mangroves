// robots.txt: everything is public; AI crawlers are explicitly welcome (citability is a goal).
import type { APIRoute } from 'astro';
import { INDEXABLE } from '../lib/site-config';

export const GET: APIRoute = ({ site }) => {
  // Preview deploys (before launch): keep every crawler out.
  if (!INDEXABLE) return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  const agents = ['*', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'];
  const body = agents.map((a) => `User-agent: ${a}\nAllow: /`).join('\n\n') + `\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
