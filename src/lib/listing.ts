// Listing pages (/ile/<slug>, /commune/<slug>, /activite/<slug>). Port of the prototype's views11() listing branch.
import { getActivityListings, getOperator, getSites, getWhyGuideTiles, type Site } from './data';
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
  const guided = sites.filter((s) => s.servedBy).length;
  const plural = sites.length > 1;
  const yalode = getOperator('yalode');
  const bluelagoon = getOperator('bluelagoon');
  const opening = openingAnswer(kind, def.label, sites);
  const faq = [
    { q: 'Combien de mangroves ?', a: `${sites.length} site${plural ? 's' : ''} référencé${plural ? 's' : ''} : ${sites.map((s) => s.name).join(', ')}.` },
    {
      q: 'Peut-on y aller sans guide ?',
      a: `Oui, l’accès est gratuit. ${opening.howTo}`,
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
    description: truncate(opening.sentence),
    canonical,
    ogImage: cover?.url,
    hero: {
      kindLabel: KIND_LABEL[kind],
      title: def.h1,
      intro: opening.sentence,
      slides: cover ? [{ src: cover.url, alt: '', caption: cover.caption, credit: cover.credit }] : [],
      crumbs: [{ label: 'Accueil', href: routes.home }, { label: KIND_LABEL[kind] }, { label: def.label }],
    },
    count: `${sites.length} mangrove${plural ? 's' : ''}`,
    priceDate: yalode.priceDate,
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

const WATER_MODES: Record<string, string> = { kayak: 'en kayak', bateau: 'en bateau', pedalo: 'en pédalo', canot: 'en canot' };
const GUIDE_LINE: Record<string, string> = { yalode: 'Pascal en kayak', bluelagoon: 'Jean-Eudes en bateau' };
const orList = (xs: string[]) => (xs.length > 1 ? xs.slice(0, -1).join(', ') + ' ou ' + xs[xs.length - 1] : xs[0] || '');
const andList = (xs: string[]) => (xs.length > 1 ? xs.slice(0, -1).join(', ') + ' et ' + xs[xs.length - 1] : xs[0] || '');

/**
 * The listing's opening answer (visible intro, meta description, llms.txt), built only from data.
 * Framing decided 7 Oct 2026: every mangrove is free to visit; some on foot, others from the water
 * (boat, kayak…); some can also be done with a guide, which brings real advantages.
 */
function openingAnswer(kind: Kind, label: string, sites: Site[]) {
  const n = sites.length;
  const where = kind === 'ile' ? `Sur ${label}` : kind === 'commune' ? `À ${label}` : 'En Guadeloupe';
  const onFoot = sites.filter((s) => s.activities.includes('marche'));
  const water = sites.filter((s) => !s.activities.includes('marche') && s.activities.some((a) => a in WATER_MODES));
  const modes = orList([...new Set(water.flatMap((s) => s.activities.filter((a) => a in WATER_MODES)))].map((a) => WATER_MODES[a]));
  const reach = onFoot.length === n ? 'à pied'
    : water.length === n ? `depuis l’eau, ${modes}`
    : andList([onFoot.length ? `${onFoot.length} à pied` : '', water.length ? `${water.length} depuis l’eau, ${modes}` : ''].filter(Boolean));
  const guidedSites = sites.filter((s) => s.servedBy);
  const guides = andList([...new Set(guidedSites.flatMap((s) => (s.servedBy === 'both' ? ['yalode', 'bluelagoon'] : [s.servedBy as string])))].map((k) => GUIDE_LINE[k]));
  const advantages = andList(getWhyGuideTiles().map((t) => t.title.charAt(0).toLowerCase() + t.title.slice(1)));
  const g = guidedSites.length;
  const who = g === n ? (n > 1 ? 'Toutes peuvent' : 'Elle peut') : `${g} d’entre elles ${g > 1 ? 'peuvent' : 'peut'}`;
  // All sites covered by the counts: "… gratuitement : 6 à pied et 3 depuis l'eau". Some without a known mode: "…, dont 1 à pied".
  const covered = onFoot.length + water.length === n;
  const joiner = !reach ? '' : !covered ? ', dont ' : onFoot.length && water.length ? ' : ' : ', ';
  const visit = `${where}, ${n} mangrove${n > 1 ? 's se visitent' : ' se visite'} gratuitement${joiner}${reach}.`;
  const withGuide = g ? ` ${who} aussi se faire avec un guide local (${guides}) : ${advantages}.` : '';
  const howTo = [onFoot.length ? `${onFoot.length === n ? 'Elles se visitent' : `${onFoot.length} mangrove${onFoot.length > 1 ? 's se visitent' : ' se visite'}`} à pied.` : '',
    water.length ? `${water.length === n ? (n > 1 ? 'Elles se découvrent' : 'Elle se découvre') : `${water.length} mangrove${water.length > 1 ? 's se découvrent' : ' se découvre'}`} depuis l’eau, avec votre embarcation, un loueur ou un guide.` : ''].filter(Boolean).join(' ');
  return { sentence: visit + withGuide, howTo: howTo || 'Renseignez-vous sur place pour l’accès.' };
}
