// Listing pages (/ile/<slug>, /commune/<slug>, /activite/<slug>). Port of the prototype's views11() listing branch.
import { getActivityListings, getOperator, getSites, type Site } from './data';
import { routes, slugify, subIsland, truncate } from './format';
import { siteCard } from './site-card';

type Kind = 'ile' | 'commune' | 'activite';
const KIND_LABEL: Record<Kind, string> = { ile: 'Par île', commune: 'Par commune', activite: 'Par activité' };

const ACTIVITY_TESTS: Record<string, (s: Site) => boolean> = {
  'sortie-guidee': (s) => !!s.servedBy,
  bateau: (s) => s.activities.includes('bateau'),
  kayak: (s) => s.activities.includes('kayak'),
  'a-pied': (s) => s.activities.includes('marche'),
  'pedalo-canot': (s) => s.activities.includes('pedalo') || s.activities.includes('canot'),
};

interface ListingDef { kind: Kind; slug: string; label: string; h1: string; test: (s: Site) => boolean }

function definitions(): ListingDef[] {
  const sites = getSites();
  const islands = ['Basse-Terre', 'Grande-Terre', 'Marie-Galante', 'La Désirade'].filter((x) => sites.some((s) => subIsland(s) === x));
  const communes = [...new Set(sites.flatMap((s) => s.commune.split(' / ')))];
  return [
    ...islands.map((label) => ({ kind: 'ile' as const, slug: slugify(label), label, h1: 'Les mangroves de ' + label, test: (s: Site) => subIsland(s) === label })),
    ...communes.map((label) => ({ kind: 'commune' as const, slug: slugify(label), label, h1: 'Mangroves à ' + label, test: (s: Site) => s.commune.split(' / ').includes(label) })),
    ...getActivityListings().map((p) => ({ kind: 'activite' as const, slug: p.slug, label: p.label, h1: p.h1, test: ACTIVITY_TESTS[p.slug] })),
  ].filter((d) => d.test && sites.some(d.test));
}

export const getListingPaths = () => definitions().map((d) => ({ kind: d.kind, slug: d.slug }));

export function buildListingPage(kind: Kind, slug: string, siteUrl: string) {
  const def = definitions().find((d) => d.kind === kind && d.slug === slug);
  if (!def) throw new Error(`Unknown listing ${kind}/${slug}`);
  const sites = getSites()
    .filter(def.test)
    .sort((x, y) => (y.servedBy ? 1 : 0) - (x.servedBy ? 1 : 0) || y.images.length - x.images.length);
  const free = sites.filter((s) => s.access === 'libre').length;
  const guided = sites.filter((s) => s.servedBy).length;
  const plural = sites.length > 1;
  const yalode = getOperator('yalode');
  const bluelagoon = getOperator('bluelagoon');
  const faq = [
    { q: 'Combien de mangroves ?', a: `${sites.length} site${plural ? 's' : ''} référencé${plural ? 's' : ''} : ${sites.map((s) => s.name).join(', ')}.` },
    {
      q: 'Peut-on y aller sans guide ?',
      a: free
        ? `${free} site${free > 1 ? 's sont' : ' est'} en accès libre et gratuit. Les autres se découvrent depuis l’eau, avec un loueur ou un guide.`
        : 'Ces sites se découvrent surtout depuis l’eau, avec un loueur ou un guide.',
    },
    guided
      ? { q: 'Quelle sortie guidée choisir ?', a: `En kayak avec ${yalode.guide} (${yalode.name}) depuis Vieux-Bourg, dès ${yalode.price}, ou en bateau avec ${bluelagoon.guide} (${bluelagoon.name}) depuis Sainte-Rose, environ ${bluelagoon.price}.` }
      : null,
  ].filter((f): f is { q: string; a: string } => !!f);
  const path = `/${kind}/${slug}`;
  const canonical = new URL(path, siteUrl).href;
  const cover = sites.find((s) => s.images.length)?.images[0];
  const cards = sites.map(siteCard);

  return {
    // Activity H1s already say what the page is; places get the suffix.
    title: kind === 'activite' ? def.h1 : `${def.h1} : accès et sorties guidées`,
    description: truncate(`${def.h1} : ${faq[0].a}`),
    canonical,
    ogImage: cover?.url,
    hero: {
      kindLabel: KIND_LABEL[kind],
      title: def.h1,
      intro: `${sites.length} mangrove${plural ? 's' : ''} à découvrir, avec l’accès, la durée et les sorties guidées quand il y en a.`,
      slides: cover ? [{ src: cover.url, alt: '', caption: cover.caption, credit: cover.credit }] : [],
      crumbs: [{ label: 'Accueil', href: routes.home }, { label: KIND_LABEL[kind] }, { label: def.label }],
    },
    count: `${sites.length} mangrove${plural ? 's' : ''}`,
    cards,
    faq: { title: `${def.label} : questions fréquentes`, items: faq },
    jsonLd: [
      {
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: def.h1, url: canonical, inLanguage: 'fr',
        mainEntity: { '@type': 'ItemList', itemListElement: cards.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: new URL(c.href, siteUrl).href })) },
      },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Mangroves de Guadeloupe', item: new URL('/', siteUrl).href },
          { '@type': 'ListItem', position: 2, name: def.h1, item: canonical },
        ],
      },
    ],
  };
}

export type ListingPageModel = ReturnType<typeof buildListingPage>;
