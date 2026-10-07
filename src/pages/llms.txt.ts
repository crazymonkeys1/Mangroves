// llms.txt (llmstxt.org): a plain-text map of the site for AI assistants, with each site's opening answer.
import type { APIRoute } from 'astro';
import { getSites } from '../lib/data';
import { buildSitePage } from '../lib/site-page';

export const GET: APIRoute = ({ site }) => {
  const origin = site!.href;
  const pages = getSites().map((s) => buildSitePage(s, origin));
  const body = [
    '# Mangroves Gwada',
    '',
    '> Répertoire indépendant des mangroves de Guadeloupe et de Marie-Galante : où elles se trouvent, comment y aller seul ou avec un guide, et les sorties guidées de Yalodé (kayak) et Blue Lagoon (bateau). Informations sourcées ; tarifs relevés en septembre 2026.',
    '',
    '## Mangroves',
    '',
    ...pages.map((p) => `- [${p.name}](${p.canonical}): ${p.summary.answer}`),
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
