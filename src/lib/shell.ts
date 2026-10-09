// Data for the page shell (header, footer, "Qui sommes-nous"), shared by every page.
import { getActivityListings, getArticles, getOperator, getSites } from './data';
import { isBuilt, linkIfBuilt, routes, slugify, subIsland, utm } from './format';

export function shellData() {
  const sites = getSites();
  const islands = ['Basse-Terre', 'Grande-Terre', 'Marie-Galante', 'La Désirade'].filter((x) => sites.some((s) => subIsland(s) === x));
  const communeCounts = sites
    .flatMap((s) => s.commune.split(' / '))
    .reduce<Record<string, number>>((acc, c) => ((acc[c] = (acc[c] || 0) + 1), acc), {});
  const communes = Object.entries(communeCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c]) => c);
  const yalode = getOperator('yalode');
  const bluelagoon = getOperator('bluelagoon');

  // Only link to pages that exist (OL-10). "Les guides" falls back to the on-page "Qui sommes-nous" band.
  const nav = [
    { href: routes.ideas, label: 'Idées de sorties' },
    { href: linkIfBuilt(routes.guide(yalode.guideSlug)) || '/#qui-sommes-nous', label: 'Les guides' },
  ].filter((l) => isBuilt(l.href));
  const footer = [
    { title: 'Par activité', links: getActivityListings().map((p) => ({ href: routes.activity(p.slug), label: p.label })) },
    { title: 'Par île', links: islands.map((x) => ({ href: `/ile/${slugify(x)}`, label: x })) },
    { title: 'Par commune', links: communes.map((c) => ({ href: routes.commune(c), label: c })) },
    { title: 'Idées de sorties', links: [...getArticles().map((a) => ({ href: routes.article(a.slug), label: a.nav })), { href: routes.ideas, label: 'Toutes les idées' }] },
    {
      title: 'Les guides',
      links: [
        { href: routes.guide(yalode.guideSlug), label: `${yalode.guide} · ${yalode.name}` },
        { href: routes.guide(bluelagoon.guideSlug), label: `${bluelagoon.guide} · ${bluelagoon.name}` },
        { href: routes.compare, label: 'Bateau ou kayak ?' },
        { href: routes.privacy, label: 'Confidentialité' },
      ],
    },
  ]
    .map((c) => ({ ...c, links: c.links.filter((l) => isBuilt(l.href)) }))
    .filter((c) => c.links.length > 0);

  return {
    nav,
    footer,
    aboutUs: {
      title: 'Nous, c’est Pascal et Jean-Eudes',
      paragraphs: [
        'Deux guides locaux, tombés amoureux de la Guadeloupe et de sa mangrove. Ils veulent en montrer la beauté au plus grand nombre pour qu\'elle soit respectée et protégée.',
        'Ce site recense les mangroves de l\'archipel, avec les infos utiles pour y aller seul ou accompagné. Et si l\'envie vous prend, vous pouvez partir avec l\'un d\'eux.',
      ],
      guides: [yalode, bluelagoon].map((o) => ({
        key: o.key,
        name: o.name,
        guide: o.guide,
        photo: o.photo,
        credential: o.credential.split(' · ')[0],
        pitch: o.about.pitch,
        contactUrl: utm(o.contactUrl, 'about-us', 'site'),
        profileHref: linkIfBuilt(routes.guide(o.guideSlug)),
        website: utm(o.about.website, 'about-us', 'site'),
        domain: o.about.domain,
      })),
    },
  };
}

export type ShellData = ReturnType<typeof shellData>;
