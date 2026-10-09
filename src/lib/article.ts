// Article pages (/idees/<slug>) and the ideas index (/idees). Port of the prototype's article9() and ideas view.
import { articleSites, getArticle, getArticles, getOperator, getSiteContent, getWhyGuideTiles } from './data';
import { routes, truncate } from './format';

const authors = () => [getOperator('yalode'), getOperator('bluelagoon')];
const byline = (a: { updated: string; readTime: string }) => `Par Pascal & Jean-Eudes · Mis à jour le ${a.updated} · ${a.readTime}`;

export const getArticlePaths = () => getArticles().map((a) => a.slug);

export function buildArticlePage(slug: string, siteUrl: string) {
  const a = getArticle(slug);
  if (!a) throw new Error(`Unknown article "${slug}"`);
  const canonical = new URL(routes.article(slug), siteUrl).href;
  const sites = articleSites(a).sort((x, y) => (y.servedBy ? 1 : 0) - (x.servedBy ? 1 : 0) || (y.images.length ? 1 : 0) - (x.images.length ? 1 : 0));
  const lead = getOperator(a.operators[0] || 'yalode');

  const picks = sites.slice(0, 5).map((s, i) => {
    const key = s.servedBy === 'both' ? a.operators[0] || 'yalode' : s.servedBy;
    const o = key ? getOperator(key) : null;
    const facts = (o
      ? [['clock', 'Durée', o.durationShort], ['user', 'Dès', o.minAge ? o.minAge + ' ans' : 'Tous âges'], ['mountain', 'Niveau', o.about.level], ['signpost', 'Prix', 'dès ' + o.price]]
      : [['clock', 'Durée', s.duration], ['users', 'Public', s.kidFriendly ? 'En famille' : 'Adultes'], ['mountain', 'Niveau', s.difficulty], ['signpost', 'Accès', s.activities.length ? 'Gratuit' : '']]
    ).filter((f) => f[2]).map(([icon, label, value]) => ({ icon: icon as string, label: label as string, value: value as string }));
    const im = s.images[0];
    const sig = getSiteContent(s.slug).sig;
    return {
      number: String(i + 1).padStart(2, '0'),
      name: s.name,
      href: routes.site(s.slug),
      image: im ? { src: im.url, alt: `${im.caption} – ${s.name}`, credit: 'Photo : ' + im.credit } : null,
      kind: o ? 'Sortie guidée' : s.activities.length ? 'Accès gratuit' : 'Accès à confirmer',
      operator: o ? o.key : null,
      commune: s.commune,
      guide: o ? { photo: o.photo, label: s.servedBy === 'both' ? 'avec Pascal ou Jean-Eudes' : `avec ${o.guide} · ${o.name}` } : null,
      blurb: s.blurb,
      why: sig ? { label: a.selectionLabel, text: sig } : null,
      facts,
      linkLabel: o ? 'Voir la sortie' : 'Lire la fiche',
    };
  });

  const sources: { label: string; url: string }[] = [];
  const seen = new Set<string>();
  sites.slice(0, 5).forEach((s) => s.sources.forEach((src) => {
    const label = src.label.split(' — ')[0];
    if (!seen.has(label)) { seen.add(label); sources.push({ label, url: src.url }); }
  }));

  const toc = [
    ['#essentiel', "L'essentiel"], ['#en-detail', a.guideH2], ['#selection', 'Notre sélection'],
    ['#avant-de-partir', 'Avant de partir'], ['#faq', 'Questions fréquentes'], ['#avec-un-guide', 'Pourquoi partir avec un guide'],
  ].map(([href, label]) => ({ href, label }));

  const more = getArticles().filter((x) => x.slug !== slug).map((x) => ({ href: routes.article(x.slug), title: x.nav, image: x.heroImg }));

  return {
    priceNote: `Tarifs des sorties guidées relevés en ${getOperator('yalode').priceDate}, à confirmer lors de la réservation.`,
    title: a.metaTitle,
    description: truncate(a.metaDescription),
    canonical,
    ogImage: a.heroImg,
    hero: {
      crumbs: [{ label: 'Accueil', href: routes.home }, { label: 'Idées de sorties', href: routes.ideas }, { label: a.crumb }],
      category: a.category,
      title: a.title,
      slide: { src: a.heroImg, alt: '', caption: '', credit: a.heroCredit.replace(/^Photo : /, '') },
      authors: authors().map((o) => o.photo),
      byline: byline(a),
    },
    body: {
      intro: a.intro,
      brief: a.brief,
      toc,
      essentials: a.essentials,
      guideH2: a.guideH2,
      sections: a.sections,
      quote: { text: lead.about.story, by: `${lead.guide}, ${lead.name}` },
      know: a.know,
      before: a.before,
      whyGuide: { text: lead.about.why, tiles: getWhyGuideTiles(), toursHref: routes.activity('sortie-guidee') },
      author: { photos: authors().map((o) => o.photo), name: 'Écrit par Pascal & Jean-Eudes', bio: 'Guide kayak brevet d\'État à Vieux-Bourg et capitaine à Sainte-Rose, dans le Grand Cul-de-Sac Marin.' },
      sources: sources.slice(0, 6),
    },
    selection: { title: `Notre sélection : ${picks.length} idées`, picks },
    faq: { title: `${a.crumb} : questions fréquentes`, items: a.faq },
    more,
    jsonLd: [
      {
        '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.brief, image: a.heroImg, url: canonical, inLanguage: 'fr',
        dateModified: a.updatedIso,
        author: authors().map((o) => ({ '@type': 'Person', name: o.about.fullName, url: new URL(routes.guide(o.guideSlug), siteUrl).href })),
        publisher: { '@type': 'Organization', name: 'Mangroves Gwada', url: new URL('/', siteUrl).href },
      },
      { '@context': 'https://schema.org', '@type': 'ItemList', name: `Notre sélection : ${picks.length} idées`, itemListElement: picks.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: new URL(p.href, siteUrl).href })) },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Mangroves de Guadeloupe', item: new URL('/', siteUrl).href },
          { '@type': 'ListItem', position: 2, name: 'Idées de sorties', item: new URL(routes.ideas, siteUrl).href },
          { '@type': 'ListItem', position: 3, name: a.crumb, item: canonical },
        ],
      },
    ],
  };
}

export type ArticlePageModel = ReturnType<typeof buildArticlePage>;

export function buildIdeasPage(siteUrl: string) {
  const canonical = new URL(routes.ideas, siteUrl).href;
  const items = getArticles().map((a) => ({
    href: routes.article(a.slug), image: a.heroImg, category: a.category, title: a.title, brief: a.brief, meta: `Par Pascal & Jean-Eudes · ${a.readTime}`,
  }));
  return {
    priceNote: `Tarifs des sorties guidées relevés en ${getOperator('yalode').priceDate}, à confirmer lors de la réservation.`,
    title: 'Idées de sorties en mangrove en Guadeloupe',
    description: 'Nos idées pour choisir sa sortie : en famille, en bateau, en kayak, à pied ou pour les oiseaux. Écrits par Pascal et Jean-Eudes, mis à jour régulièrement.',
    canonical,
    crumbs: [{ label: 'Accueil', href: routes.home }, { label: 'Idées de sorties' }],
    eyebrow: 'Le blog',
    h1: 'Idées de sorties en mangrove',
    lead: 'Nos idées pour choisir sa sortie : en famille, en bateau, en kayak, à pied ou pour les oiseaux. Écrits par Pascal et Jean-Eudes, mis à jour régulièrement.',
    items,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Idées de sorties en mangrove', url: canonical, inLanguage: 'fr',
        mainEntity: { '@type': 'ItemList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.title, url: new URL(it.href, siteUrl).href })) } },
    ],
  };
}

export type IdeasPageModel = ReturnType<typeof buildIdeasPage>;
