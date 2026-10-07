// French copy helpers and URL builders shared by the page models.
import type { Activity, Site } from './data';

/** "Rivière Salée" → "la Rivière Salée", "Îlet Blanc" → "l'Îlet Blanc", "Sentier…" → "le Sentier…". */
export function withArticle(name: string): string {
  const w = name.split(' ')[0];
  if (w === 'Mangrove') return 'la mangrove' + name.slice(8);
  if (/^[AEIOUÉÈÎH]/i.test(name)) return "l'" + name;
  const feminine = ['Rivière', 'Pointe', 'Baie', 'Plage', 'Forêt', 'Anse', 'Folle', 'Ravine', 'Réserve', 'Lagune', 'Presqu'];
  return (feminine.some((f) => w.startsWith(f)) ? 'la ' : 'le ') + name;
}

/** "le X" → "au X", "la X" → "à la X" (after "aller"). */
export const toArticle = (art: string) =>
  art.replace(/^le /, 'au ').replace(/^les /, 'aux ').replace(/^(la |l')/, 'à $1');

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const frNum = (n: number) => String(n).replace('.', ',');

export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Display island: Basse-Terre, Grande-Terre, Marie-Galante, La Désirade. */
export function subIsland(site: Site): string {
  if (site.island.startsWith('Guadeloupe')) return /Grande-Terre/.test(site.island) ? 'Grande-Terre' : 'Basse-Terre';
  return site.island === 'Désirade' ? 'La Désirade' : site.island;
}

/** Filter island (as in the prototype filter): Guadeloupe, Marie-Galante, Désirade… */
export const filterIsland = (site: Site) => (site.island.startsWith('Guadeloupe') ? 'Guadeloupe' : site.island);

export const firstCommune = (site: Site) => site.commune.split(' / ')[0];

export function activityLabel(activities: Activity[]): string {
  if (activities.includes('bateau') && activities.includes('kayak')) return 'Bateau et kayak';
  if (activities.includes('bateau')) return 'Bateau';
  if (activities.includes('kayak')) return 'Kayak';
  if (activities.includes('pedalo')) return 'Pédalo';
  if (activities.includes('canot')) return 'Canot';
  if (activities.includes('marche')) return 'À pied';
  return '';
}

export function activityIcon(activities: Activity[]): string {
  if (activities.includes('bateau')) return 'boat';
  if (activities.includes('kayak')) return 'waves';
  if (activities.includes('marche')) return 'footprints';
  if (activities.includes('pedalo') || activities.includes('canot')) return 'waves';
  return 'leaf';
}

export const WATER_MODES: Record<string, string> = { kayak: 'en kayak', bateau: 'en bateau', pedalo: 'en pédalo', canot: 'en canot' };
export const orList = (xs: string[]) => (xs.length > 1 ? xs.slice(0, -1).join(', ') + ' ou ' + xs[xs.length - 1] : xs[0] || '');
export const andList = (xs: string[]) => (xs.length > 1 ? xs.slice(0, -1).join(', ') + ' et ' + xs[xs.length - 1] : xs[0] || '');

/**
 * How a site is reached (access framing, CLAUDE.md "Decided"): every site is free; on foot, or from the water.
 * Returns '' when the data has no access mode (e.g. a site under restoration).
 */
export function howToReach(site: Site): { onFoot: boolean; water: boolean; text: string } {
  const onFoot = site.activities.includes('marche');
  const modes = orList(site.activities.filter((a) => a in WATER_MODES).map((a) => WATER_MODES[a]));
  const water = !!modes;
  const text = onFoot && water ? `à pied ou depuis l’eau, ${modes}` : onFoot ? 'à pied' : water ? `depuis l’eau, ${modes}` : '';
  return { onFoot, water, text };
}

/** Meta description: the opening answer, cut on a word at 155 characters. */
export const truncate = (s: string, max = 155) =>
  s.length <= max ? s : s.slice(0, s.lastIndexOf(' ', max - 3)).replace(/[\s,:;]+$/, '') + '…';

/** Operator links carry UTM tags (docs/design-system.md §9). */
export function utm(url: string, placement: string, slug: string): string {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}utm_source=mangroves-gwada&utm_medium=${placement}&utm_campaign=${slug}`;
}

/** Route prefixes that exist in src/pages. Add one when its page type is built (OL-10). */
const BUILT_ROUTES = ['/mangrove/', '/ile/', '/commune/', '/activite/', '/guides/', '/idees', '/comparatif'];
/** True when `href` points to a page we actually generate. Never link to anything else. */
export const isBuilt = (href: string) => {
  if (href.startsWith('#') || /^https?:/.test(href)) return true;
  const path = href.split('#')[0];
  return path === '/' || BUILT_ROUTES.some((p) => path.startsWith(p));
};
/** The href if its page exists, otherwise undefined (callers render plain text or skip). */
export const linkIfBuilt = (href: string) => (isBuilt(href) ? href : undefined);

/** Routes (docs/project.md §2 and CLAUDE.md "Decided"). */
export const routes = {
  home: '/',
  site: (slug: string) => `/mangrove/${slug}`,
  ideas: '/idees',
  article: (slug: string) => `/idees/${slug}`,
  guide: (guideSlug: string) => `/guides/${guideSlug}`,
  activity: (slug: string) => `/activite/${slug}`,
  island: (name: string) => `/ile/${slugify(name)}`,
  commune: (name: string) => `/commune/${slugify(name)}`,
  compare: '/comparatif',
  privacy: '/confidentialite',
};
