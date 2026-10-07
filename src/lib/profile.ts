// Guide profile pages (/guides/<slug>). Port of the prototype's views11() profile branch.
import { getOperators, getSites } from './data';
import { routes, truncate, utm } from './format';
import { siteCard } from './site-card';
import { tourFacts } from './site-page';

export const getProfilePaths = () => getOperators().map((o) => o.guideSlug);

export function buildProfilePage(guideSlug: string, siteUrl: string) {
  const o = getOperators().find((x) => x.guideSlug === guideSlug);
  if (!o) throw new Error(`Unknown guide "${guideSlug}"`);
  const a = o.about;
  const path = routes.guide(guideSlug);
  const canonical = new URL(path, siteUrl).href;
  const link = (url: string) => utm(url, 'profile', guideSlug);
  const sites = getSites().filter((s) => s.servedBy === o.key || s.servedBy === 'both');

  return {
    key: o.key,
    title: `${a.fullName}, ${o.name} : ${o.tourName}`,
    description: truncate(a.bio),
    canonical,
    ogImage: o.photo,
    header: {
      crumbs: [{ label: 'Accueil', href: routes.home }, { label: 'Les guides' }, { label: o.guide }],
      eyebrow: `${o.name} · ${o.mode}`,
      name: a.fullName,
      role: a.role,
      photo: o.photo,
      bookingUrl: link(o.bookingUrl),
      bookLabel: `Réserver sur ${o.name}`,
      contactUrl: link(o.contactUrl),
      contactLabel: `Écrire à ${o.guide}`,
    },
    about: { title: `Qui est ${o.guide} ?`, story: a.story, bio: a.bio, facts: a.facts },
    tour: { title: o.tourName, summary: o.tourSummary, facts: [...tourFacts(o).slice(0, 3), { icon: 'signpost', label: 'Tarif', value: 'dès ' + o.price }], features: o.features, priceDate: o.priceDate },
    quotes: { title: `Ils sont partis avec ${o.guide}`, items: o.quotes },
    sites: { title: `Les mangroves de ${o.guide}`, cards: sites.map(siteCard) },
    jsonLd: [
      {
        '@context': 'https://schema.org', '@type': 'Person', name: a.fullName, jobTitle: a.role.split(' · ')[0], image: o.photo, url: canonical, description: a.bio,
        worksFor: { '@type': 'LocalBusiness', name: o.name, url: a.website },
      },
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Mangroves de Guadeloupe', item: new URL('/', siteUrl).href },
          { '@type': 'ListItem', position: 2, name: a.fullName, item: canonical },
        ],
      },
    ],
  };
}

export type ProfilePageModel = ReturnType<typeof buildProfilePage>;
