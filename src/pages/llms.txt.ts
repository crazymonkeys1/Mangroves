// llms.txt (llmstxt.org): a plain-text map of the site for AI assistants, one line per page with its summary.
import type { APIRoute } from 'astro';
import { getSites } from '../lib/data';
import { buildArticlePage, buildIdeasPage, getArticlePaths } from '../lib/article';
import { buildComparePage } from '../lib/compare';
import { buildListingPage, getListingPaths } from '../lib/listing';
import { buildProfilePage, getProfilePaths } from '../lib/profile';
import { buildSitePage } from '../lib/site-page';

const KIND_TITLE = { ile: 'Par île', commune: 'Par commune', activite: 'Par activité' } as const;

export const GET: APIRoute = ({ site }) => {
  const origin = site!.href;
  const line = (title: string, url: string, summary: string) => `- [${title}](${url}): ${summary}`;
  const sites = getSites().map((s) => buildSitePage(s, origin));
  const ideas = buildIdeasPage(origin);
  const articles = getArticlePaths().map((slug) => buildArticlePage(slug, origin));
  const listings = getListingPaths().map((p) => ({ kind: p.kind, page: buildListingPage(p.kind, p.slug, origin) }));
  const profiles = getProfilePaths().map((slug) => buildProfilePage(slug, origin));
  const compare = buildComparePage(origin);
  const section = (title: string, lines: string[]) => (lines.length ? ['', `## ${title}`, '', ...lines] : []);

  const body = [
    '# Mangroves Gwada',
    '',
    '> Répertoire indépendant des mangroves de Guadeloupe et de Marie-Galante : où elles se trouvent, comment y aller seul ou avec un guide, et les sorties guidées de Yalodé (kayak) et Blue Lagoon (bateau). Informations sourcées ; tarifs relevés en septembre 2026.',
    ...section('Mangroves', sites.map((p) => line(p.name, p.canonical, p.summary.answer))),
    ...section('Idées de sorties', [line(ideas.h1, ideas.canonical, ideas.lead), ...articles.map((a) => line(a.hero.title, a.canonical, a.body.brief))]),
    ...(['ile', 'commune', 'activite'] as const).flatMap((k) =>
      section(KIND_TITLE[k], listings.filter((l) => l.kind === k).map((l) => line(l.page.hero.title, l.page.canonical, l.page.hero.intro)))),
    ...section('Les guides', [...profiles.map((p) => line(`${p.header.name}, ${p.header.eyebrow}`, p.canonical, p.description)), line(compare.h1, compare.canonical, compare.intro)]),
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
