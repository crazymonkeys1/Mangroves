// Card model for a site in lists (directory, nearby). Port of the prototype's cardFor().
import { getOperator, type Site } from './data';
import { activityIcon, activityLabel, filterIsland, routes } from './format';

export interface SiteCardModel {
  slug: string;
  href: string;
  name: string;
  commune: string;
  blurb: string;
  image: { src: string; alt: string } | null;
  activity: { icon: string; label: string };
  level: string;
  guide: { photo: string; label: string } | null;
  tags: { icon: string; label: string }[];
  stats: { label: string; value: string }[];
  price: { amount: string; unit: string };
  cta: string;
  rowSide: string;
  /** Values the directory filters read from data-* attributes. */
  filter: {
    island: string;
    activities: string;
    difficulty: string;
    kids: boolean;
    served: boolean;
    birds: boolean;
    photo: boolean;
    search: string;
  };
}

export function siteCard(s: Site): SiteCardModel {
  const both = s.servedBy === 'both';
  const o = s.servedBy ? getOperator(both ? 'yalode' : s.servedBy as 'yalode' | 'bluelagoon') : null;
  const tags = [
    o ? { icon: 'signpost', label: 'Gratuit' } : null,
    s.kidFriendly ? { icon: 'users', label: 'En famille' } : null,
    s.birdwatching ? { icon: 'bird', label: 'Oiseaux' } : null,
    s.pmr ? { icon: 'access', label: 'Accessible PMR' } : null,
  ].filter((t): t is { icon: string; label: string } => !!t).slice(0, 3);
  const img = s.images[0];
  return {
    slug: s.slug,
    href: routes.site(s.slug),
    name: s.name,
    commune: s.commune,
    blurb: s.blurb,
    image: img ? { src: img.url, alt: `${img.caption} – ${s.name}` } : null,
    activity: { icon: activityIcon(s.activities), label: activityLabel(s.activities) || 'Visite libre' },
    level: s.difficulty || 'Facile',
    guide: o ? { photo: o.photo, label: both ? 'avec Pascal ou Jean-Eudes' : 'avec ' + o.guide } : null,
    tags,
    stats: o
      ? [
          { label: 'Durée', value: o.durationShort },
          { label: 'Dès', value: o.minAge ? o.minAge + ' ans' : 'Tous âges' },
          { label: 'Guide', value: both ? 'Pascal / J.-Eudes' : o.guide },
        ]
      : [],
    price: o
      ? { amount: 'dès\u00a0' + o.price, unit: 'par adulte' }
      : { amount: s.activities.length ? 'Gratuit' : 'Accès à confirmer', unit: '' },
    cta: o ? 'Voir la sortie' : 'Voir la mangrove',
    rowSide: o ? (both ? 'Gratuit, ou avec Pascal ou Jean-Eudes' : `Gratuit, ou avec ${o.guide} · ${o.name}`) : s.activities.length ? 'Gratuit' : 'Accès à confirmer',
    filter: {
      island: filterIsland(s),
      activities: s.activities.join(' '),
      difficulty: s.difficulty || '',
      kids: s.kidFriendly,
      served: !!s.servedBy,
      birds: s.birdwatching,
      photo: s.photogenic,
      search: `${s.name} ${s.commune} ${s.island}`.toLowerCase(),
    },
  };
}
