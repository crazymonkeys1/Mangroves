// Boat vs kayak comparison page (/comparatif).
import { getCompare, getOperator } from './data';
import { routes, truncate } from './format';

export function buildComparePage(siteUrl: string) {
  const c = getCompare();
  const canonical = new URL(routes.compare, siteUrl).href;
  const ops = c.operators.map((x) => {
    const o = getOperator(x.key as 'yalode' | 'bluelagoon');
    return { key: o.key, name: o.name, mode: x.mode, text: x.text, idealFor: x.idealFor, profileHref: routes.guide(o.guideSlug), profileLabel: `Partir avec ${o.guide}` };
  });
  return {
    title: c.title,
    description: truncate(c.intro),
    canonical,
    crumbs: [{ label: 'Accueil', href: routes.home }, { label: 'Bateau ou kayak ?' }],
    h1: c.title,
    intro: c.intro,
    operators: ops,
    table: { caption: 'Bateau ou kayak : les différences', columns: ['En bateau · Blue Lagoon', 'En kayak · Yalodé'], rows: c.rows.map((r) => ({ label: r.label, values: [r.boat, r.kayak] })), priceDate: getOperator('yalode').priceDate },
    summary: { title: c.summaryTitle, text: c.summary },
    jsonLd: [
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Mangroves de Guadeloupe', item: new URL('/', siteUrl).href },
          { '@type': 'ListItem', position: 2, name: 'Bateau ou kayak ?', item: canonical },
        ],
      },
    ],
  };
}

export type ComparePageModel = ReturnType<typeof buildComparePage>;
