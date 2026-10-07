// robots.txt: everything is public; AI crawlers are explicitly welcome (citability is a goal).
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const agents = ['*', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'];
  const body = agents.map((a) => `User-agent: ${a}\nAllow: /`).join('\n\n') + `\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
