// Builds everything the site detail page shows, from data. Port of the v12 prototype's
// detailBase() + v9For() (copy unchanged), with prototype-only concerns removed
// (tabs layout, hero palettes, JS layout switching).
import {
  getArticles, getBag, getDefaultSafety, getOperator, getRisk, getSiteContent, getSites, getSocial,
  getSourceTypeLabel, getVideos, getZone,
  type Operator, type OperatorKey, type Site,
} from './data';
import {
  activityIcon, activityLabel, cap, firstCommune, frNum, routes, subIsland, toArticle, truncate, utm, withArticle,
} from './format';
import { siteCard, type SiteCardModel } from './site-card';

export interface Fact { icon: string; label: string; value: string }
export interface KnowRow { icon: string; label: string; main?: string; note?: string; chips?: string[]; estimated?: boolean }
export interface Photo { src: string; thumb: string; alt: string; caption: string; credit: string; index: number }
export interface Faq { q: string; a: string }

export interface TourModel {
  key: OperatorKey;
  anchor: string;
  operatorName: string;
  photo: string;
  tourName: string;
  withLine: string;
  meta: string;
  price: string;
  priceNote: string;
  story: string;
  progFacts: Fact[];
  programme: string[];
  whyLabel: string;
  features: { icon: string; title: string; text: string }[];
  why: string;
  included: { icon: string; text: string }[];
  bring: { icon: string; text: string }[];
  listsEstimated: boolean;
  quotes: { quote: string; author: string }[];
  aboutLabel: string;
  fullName: string;
  role: string;
  bio: string;
  aboutFacts: Fact[];
  contactUrl: string;
  contactLabel: string;
  bookingUrl: string;
  bookLabel: string;
}

export interface GuideOfferModel {
  key: OperatorKey;
  optionLabel: string;
  price: string;
  priceUnit: string;
  priceExtra: string;
  rating: string;
  guide: string;
  photo: string;
  operatorName: string;
  credential: string;
  tourName: string;
  tourSummary: string;
  facts: Fact[];
  ctaUrl: string;
  ctaLabel: string;
  contactUrl: string;
  contactLabel: string;
  footnote: string;
}

export interface CompareColumn {
  label: string;
  price: string;
  photo?: string;
  icon?: string;
  operator?: OperatorKey;
  rows: { icon: string; label: string; value: string; ok: boolean }[];
}

const INCLUDED_ICONS: [string, string][] = [['Kayak', 'waves'], ['Pagaie', 'paddle'], ['gilet', 'vest'], ['Gilet', 'vest'], ['Bidon', 'backpack'], ['dégustation', 'leaf'], ['Embarcation', 'boat'], ['Masque', 'fish'], ['Commentaires', 'user']];
const BAG_ICONS: [string, string][] = [['Chapeau', 'hat'], ['lunettes', 'hat'], ['Crème', 'sun'], ['Anti-moustique', 'bug'], ['Répulsif', 'bug'], ['eau', 'droplet'], ['Chaussures', 'shoe'], ['Maillot', 'swimsuit'], ['Serviette', 'towel'], ['Jumelles', 'bird'], ['T-shirt', 'user'], ['Vêtements', 'user'], ['Sac', 'backpack'], ['Lampe', 'sun'], ['Repas', 'leaf']];
const includedIcon = (t: string) => (INCLUDED_ICONS.find(([k]) => t.includes(k)) || ['', 'backpack'])[1];
const bagIcon = (t: string) => (BAG_ICONS.find(([k]) => t.toLowerCase().includes(k.toLowerCase())) || ['', 'leaf'])[1];
const practical = (o: Operator, label: string) => o.practical.find((p) => p.label === label)?.value || null;
const OFFER_FACT_ICONS: Record<string, string> = { 'Durée': 'clock', 'Départ': 'pin', 'Horaires': 'calendar', 'Âge minimum': 'user', 'Groupe': 'users' };

export function buildSitePage(site: Site, siteUrl: string) {
  const X = getSiteContent(site.slug);
  const both = site.servedBy === 'both';
  const none = !site.servedBy;
  const opKeys: OperatorKey[] = both ? ['yalode', 'bluelagoon'] : site.servedBy ? [site.servedBy as OperatorKey] : [];
  const ops = opKeys.map(getOperator);
  const op = !both && ops.length ? ops[0] : null; // single partner
  const op0 = ops[0] || null;
  const yalode = getOperator('yalode');
  const bluelagoon = getOperator('bluelagoon');
  const zone = getZone(site.zone);
  const GCSM = site.zone === 'Grand Cul-de-Sac Marin';
  const art = withArticle(site.name);
  const Art = cap(art);
  const isl = subIsland(site);
  const commune = firstCommune(site);
  const guideNames = ops.map((o) => o.guide).join(' ou ');
  const priceFrom = both ? yalode.price : op0 ? op0.price : '';
  const pageUrl = new URL(routes.site(site.slug), siteUrl).href;
  const link = (url: string, placement: string) => utm(url, placement, site.slug);
  const estimated = new Set(X.estimated);

  // ---------- Opening answer (meta description, JSON-LD description, FAQ) ----------
  const selfZone = !site.zone || site.zone === site.name;
  const islandNote = !site.island.startsWith('Guadeloupe') ? ' (' + site.island + ')' : '';
  const place = site.commune + islandNote + (selfZone ? '' : ', dans le secteur du ' + site.zone);
  const answer = op
    ? `${Art} se trouve à ${place}. Le site se visite surtout ${op.mode.toLowerCase()} avec un guide : ${op.durationShort} au départ de ${op.departShort}, dès ${op.price} par adulte${op.minAge ? ', dès ' + op.minAge + ' ans' : ''}.`
    : both
      ? `${Art} se trouve à ${place}. Le site se visite avec un guide local, en bateau (Blue Lagoon, dès ${bluelagoon.price}) ou en kayak (Yalodé, dès ${yalode.price}, dès 3 ans).`
      : `${Art} se trouve à ${place}. ${site.access === 'libre' ? 'Le site est en accès libre' : 'Le site se visite'}${site.duration ? ', comptez ' + site.duration.toLowerCase() : ''}${site.difficulty ? ' (difficulté : ' + site.difficulty.toLowerCase() + ')' : ''}.`;
  const soloAnswer = op && GCSM
    ? "Possible en location, mais les règles changent d'une zone à l'autre dans le cœur du Parc national."
    : site.access === 'libre'
      ? `Oui. ${Art} est en accès libre. Un guide reste utile pour repérer la faune et comprendre le fonctionnement de la mangrove.`
      : GCSM
        ? "Pas vraiment. Le site se découvre depuis l'eau, dans le cœur du Parc national du Grand Cul-de-Sac Marin. Louer un kayak ou un bateau est possible auprès d'un loueur autorisé, mais les règles changent d'une zone à l'autre : le plus simple est de partir avec un prestataire autorisé par le Parc."
        : "Le site se découvre surtout depuis l'eau. Sans embarcation, l'accès est limité : une sortie guidée est le moyen le plus simple d'y entrer.";

  // ---------- Hero ----------
  const typeLabel = activityLabel(site.activities) || 'Mangrove';
  const images = site.images.map((im, index) => ({
    src: im.url,
    thumb: im.thumb || im.url,
    alt: `${im.caption} – ${site.name}`,
    caption: im.caption,
    credit: im.credit,
    index,
  }));
  const alert = X.alert ? { ...X.alert, items: X.alert.items || [] } : null;

  // ---------- Key facts (fact strip) ----------
  const NR = 'Non renseigné';
  const facts: Fact[] = [
    { icon: both ? 'boat' : activityIcon(site.activities), label: 'Visite', value: activityLabel(site.activities) || (site.activities.length ? '' : 'Visite libre') },
    { icon: 'mountain', label: 'Difficulté', value: site.difficulty || '' },
    { icon: 'clock', label: 'Durée', value: (op ? op.durationShort : site.duration) || '' },
    { icon: 'users', label: 'Enfants', value: op && op.minAge ? 'Dès ' + op.minAge + ' ans' : site.kidFriendly ? 'En famille' : 'Selon âge' },
  ].filter((f) => f.value && f.value !== NR);

  // ---------- Aperçu ----------
  const tipOp = X.tipBy ? getOperator(X.tipBy) : null;
  const splitNote = (value: string) => {
    const parts = value.split(/(?<=\.)\s+/);
    return { main: parts[0] || '', note: parts.slice(1).join(' ') || undefined };
  };
  const knowRows = ([
    ...(none ? facts.map((f) => ({ icon: f.icon, label: f.label, ...splitNote(f.value) })) : []),
    X.when ? { icon: 'calendar', label: 'Quand y aller', ...splitNote(X.when), estimated: estimated.has('when') } : null,
    site.protection.length ? { icon: 'shield', label: 'Protection', chips: site.protection } : null,
    site.pmr ? { icon: 'access', label: 'Accessibilité', main: 'Accessible aux personnes à mobilité réduite' } : null,
    X.aka && X.aka.length ? { icon: 'signpost', label: 'Aussi appelé', chips: X.aka } : null,
  ] as (KnowRow | null)[]).filter((r): r is KnowRow => !!r);

  // ---------- Photos ----------
  const opNames = ops.map((o) => o.name);
  const isOpImg = (i: number) => {
    const im = site.images[i];
    return im.rights === 'opérateur partenaire' && opNames.includes(im.sourceName || im.credit);
  };
  const siteImgs = images.filter((p) => !isOpImg(p.index));
  const opImgs = images.filter((p) => isOpImg(p.index));
  const photoGroups = none || !opImgs.length || !siteImgs.length
    ? [{ label: none ? 'Sur place' : 'Le site', caption: '', items: images }]
    : [
        { label: 'Le site', caption: 'La mangrove telle qu’on la voit depuis la rive ou le lagon.', items: siteImgs },
        { label: 'En sortie guidée avec ' + guideNames, caption: both ? 'En kayak avec Yalodé ou en bateau avec Blue Lagoon.' : 'Ce que l’on découvre pendant la sortie.', items: opImgs },
      ];

  // ---------- Accès ----------
  const accessTiles = [
    X.drive ? { icon: 'car', label: 'Pointe-à-Pitre', value: X.drive, estimated: estimated.has('drive') } : null,
    X.parking ? { icon: 'parking', label: 'Parking', value: X.parking, estimated: estimated.has('parking') } : null,
    X.bus ? { icon: 'bus', label: 'En bus', value: X.bus, estimated: estimated.has('bus') } : null,
    op0 ? { icon: 'anchor', label: 'Départ', value: both ? 'Sainte-Rose ou Vieux-Bourg' : op0.departShort.replace(/^la /, '') } : null,
    { icon: 'pin', label: 'Commune', value: site.commune },
  ].filter((t): t is Fact & { estimated?: boolean } => !!t).slice(0, 4);
  const mapUrl = site.gps
    ? `https://www.google.com/maps?q=${site.gps[0]},${site.gps[1]}`
    : 'https://www.google.com/maps/search/' + encodeURIComponent(`${site.name} ${site.commune} Guadeloupe`);
  const guideLine = both
    ? 'En kayak avec Pascal (Yalodé) depuis Vieux-Bourg, ou en bateau avec Jean-Eudes (Blue Lagoon) depuis Sainte-Rose. Le point de rendez-vous est confirmé à la réservation.'
    : op0
      ? `Avec ${op0.guide} (${op0.name}) : départ de ${op0.departShort}, le point de rendez-vous est confirmé à la réservation.`
      : '';
  const boat = !!op && op.kind === 'bateau';
  const free = site.access === 'libre';
  const compare: CompareColumn[] = op
    ? [
        { label: 'Seul', price: free ? 'Gratuit' : 'Location', icon: 'compass', rows: [
          { icon: boat ? 'boat' : 'waves', label: 'Embarcation', value: free ? 'Aucune, le site est à pied' : 'À louer chez un loueur autorisé', ok: free },
          { icon: 'map', label: 'Itinéraire', value: 'Chenaux à trouver seul', ok: false },
          { icon: 'shield', label: 'Règles du Parc', value: GCSM ? 'À connaître vous-même' : 'À respecter', ok: false },
          { icon: 'user', label: 'Âge', value: 'Selon votre expérience', ok: true },
        ] },
        { label: 'Avec ' + op.guide, price: 'dès ' + op.price, photo: op.photo, operator: op.key, rows: [
          { icon: boat ? 'boat' : 'waves', label: 'Embarcation', value: boat ? 'Bateau et capitaine' : 'Kayak et gilet fournis', ok: true },
          { icon: 'map', label: 'Itinéraire', value: boat ? 'Mangrove, îlet et récif' : 'Chenaux choisis par le guide', ok: true },
          { icon: 'shield', label: 'Règles du Parc', value: 'Appliquées par le guide', ok: true },
          { icon: 'user', label: 'Âge', value: op.minAge ? 'Dès ' + op.minAge + ' ans' : boat ? 'Tous âges' : 'Selon le guide', ok: true },
        ] },
      ]
    : [];

  // ---------- Sécurité ----------
  const safety = zone || getDefaultSafety();
  const bagList = Array.isArray(X.bag)
    ? X.bag
    : getBag(X.bag || (site.activities.some((a) => ['kayak', 'bateau', 'pedalo', 'canot'].includes(a)) ? 'water' : 'walk'));
  const bag = bagList.map((label) => ({ icon: bagIcon(label), label }));
  const risks = (X.risks || ['moustiques', 'soleil']).map(getRisk).filter(Boolean);

  // Nearest guided outing (for sites with no partner) and nearby sites.
  const others = getSites().filter((x) => x.slug !== site.slug);
  const score = (x: Site) => (site.zone && x.zone === site.zone ? 3 : 0) + (x.commune === site.commune ? 2 : 0) + (x.island === site.island ? 1 : 0);
  const nearestGuided = others.filter((x) => x.servedBy).sort((a, b) => score(b) - score(a))[0];
  const nearby: SiteCardModel[] = others
    .filter((x) => !(none && nearestGuided && x.slug === nearestGuided.slug))
    .sort((a, b) => score(b) + (b.servedBy ? 0.5 : 0) + (b.images.length ? 0.25 : 0) - (score(a) + (a.servedBy ? 0.5 : 0) + (a.images.length ? 0.25 : 0)))
    .slice(0, 3)
    .map(siteCard);

  // ---------- Sortie guidée ----------
  const tours: TourModel[] = ops.map((o) => ({
    key: o.key,
    anchor: 'sortie-' + o.key,
    operatorName: o.name,
    photo: o.photo,
    tourName: o.tourName,
    withLine: `Avec ${o.guide} de ${o.name}`,
    meta: o.credential.split(' · ').slice(0, 2).join(' · '),
    price: o.price.replace(' ', ''),
    priceNote: 'par adulte',
    story: o.about.story || o.tagline,
    progFacts: [
      { icon: 'clock', label: 'Durée', value: o.durationShort },
      { icon: 'user', label: 'Dès', value: o.minAge ? o.minAge + ' ans' : 'Tous âges' },
      { icon: 'mountain', label: 'Niveau', value: o.about.level || 'Facile' },
      { icon: 'anchor', label: 'Départ', value: o.departShort.replace(/^la base nautique de /, '') },
    ],
    programme: o.programme,
    whyLabel: 'Pourquoi y aller avec ' + o.guide,
    features: o.features,
    why: o.about.why,
    included: o.included.map((text) => ({ text, icon: includedIcon(text) })),
    bring: o.bring.map((text) => ({ text, icon: bagIcon(text) })),
    listsEstimated: o.estimated.includes('included') || o.estimated.includes('bring'),
    quotes: o.quotes,
    aboutLabel: 'À propos de ' + o.guide,
    fullName: o.about.fullName || o.guide,
    role: o.about.role || o.credential,
    bio: o.about.bio || o.blurb,
    aboutFacts: o.about.facts,
    contactUrl: link(o.contactUrl, 'tour-card'),
    contactLabel: 'Écrire à ' + o.guide,
    bookingUrl: link(o.bookingUrl, 'tour-card'),
    bookLabel: `Réserver sur ${o.name} →`,
  }));

  const offers: GuideOfferModel[] = ops.map((o) => {
    const [priceUnit, ...extra] = 'par adulte'.split(/ · |, /);
    return {
      key: o.key,
      optionLabel: o.key === 'yalode' ? 'Kayak' : 'Bateau',
      price: o.price,
      priceUnit,
      priceExtra: extra.join(' · '),
      rating: o.rating || '',
      guide: o.guide,
      photo: o.photo,
      operatorName: o.name,
      credential: o.credential.split(' · ').filter((t) => !/★|avis/.test(t)).join(' · '),
      tourName: o.tourName,
      tourSummary: o.tourSummary,
      facts: o.practical
        .filter((p) => p.value && OFFER_FACT_ICONS[p.label])
        .slice(0, 4)
        .map((p) => ({ icon: OFFER_FACT_ICONS[p.label], label: p.label, value: p.value as string })),
      ctaUrl: link(o.bookingUrl, 'guide-card'),
      ctaLabel: 'Réserver sur ' + o.name,
      contactUrl: link(o.contactUrl, 'guide-card'),
      contactLabel: 'Écrire à ' + o.guide,
      footnote: `Réservation directement auprès de ${o.name}, sans frais ajoutés par ce guide.`,
    };
  });

  const sticky = op
    ? { price: 'dès ' + op.price, sub: `avec ${op.guide} · ${op.name}`, cta: 'Réserver →', href: link(op.bookingUrl, 'sticky-bar'), external: true }
    : both
      ? { price: 'dès ' + yalode.price, sub: 'Bateau ou kayak, avec un guide local', cta: 'Choisir →', href: '#visiter', external: false }
      : null;

  // ---------- Social, reading list ----------
  const VIDEO_URL: Record<string, (q: string) => string> = {
    YouTube: (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q),
    Instagram: (q) => 'https://www.instagram.com/explore/tags/' + encodeURIComponent(q.replace(/\s+/g, '').toLowerCase()) + '/',
    TikTok: (q) => 'https://www.tiktok.com/search?q=' + encodeURIComponent(q),
  };
  const videos = getVideos(site.slug).map((v, i) => ({
    platform: v.platform,
    author: v.author,
    title: v.title,
    url: VIDEO_URL[v.platform](v.q),
    thumb: site.images.length ? site.images[i % site.images.length].thumb || site.images[i % site.images.length].url : '',
  }));
  const reads = [
    ...getSocial(site.slug).map((s) => ({ title: s.caption.split(/[.:]/)[0], publisher: s.handle, url: s.url })),
    ...site.sources
      .filter((s) => s.type === 'media' || s.type === 'office-tourisme')
      .map((s) => ({ title: s.label.split(' — ').slice(-1)[0], publisher: s.label.split(' — ')[0], url: s.url })),
  ];

  // ---------- FAQ (site-specific; questions without data are omitted) ----------
  const opPr = (label: string) => (op ? practical(op, label) : null);
  const baseFaq: (Faq | null)[] = [
    op
      ? { q: `Que comprend la sortie ${op.kind} à ${commune} ?`, a: op.tourSummary }
      : both
        ? { q: 'Kayak ou bateau : quelle sortie choisir ?', a: 'Le bateau pour voir mangrove, îlet et récif en une sortie ; le kayak pour entrer dans les chenaux étroits, au calme.' }
        : { q: `Comment visiter ${art} ?`, a: answer },
    op
      ? { q: `Combien coûte la sortie ${op.kind} ?`, a: `Dès ${op.price} ${op.priceNote} (tarif relevé en ${op.priceDate}, à confirmer lors de la réservation).` }
      : both
        ? { q: 'Combien coûte une sortie guidée ?', a: `Dès ${yalode.price} par adulte en kayak avec Yalodé, dès ${bluelagoon.price} par adulte en bateau avec Blue Lagoon (tarifs relevés en ${yalode.priceDate}).` }
        : null,
    op && op.minAge
      ? { q: 'À partir de quel âge ?', a: `Dès ${op.minAge} ans.` + (op.priceNote.includes(' · ') ? ' Tarif enfant : ' + op.priceNote.split(' · ').slice(1).join(' · ') + '.' : '') }
      : null,
    op
      ? { q: 'Combien de temps dure la sortie ?', a: (opPr('Durée') || op.durationShort) + '.' }
      : site.duration
        ? { q: 'Combien de temps prévoir ?', a: site.duration + (site.distanceKm ? ', pour ' + frNum(site.distanceKm) + ' km' : '') + '.' }
        : null,
    opPr('Départ') ? { q: 'Où est le point de départ ?', a: opPr('Départ') + (opPr('Horaires') ? '. Départs à ' + opPr('Horaires') : '') + '.' } : null,
    opPr('Annulation') ? { q: 'Peut-on annuler ?', a: opPr('Annulation') + '.' } : null,
    { q: `Où se trouve ${art} ?`, a: `${Art} se trouve à ${place}.` },
  ];
  const swim = site.activities.includes('bateau') || site.slug.startsWith('ilet')
    ? 'Oui, lors des haltes sur les îlets prévues pendant la sortie, selon les conditions.'
    : "Ce n'est pas un site de baignade : l'eau de mangrove est peu profonde et vaseuse.";
  const extraFaq: (Faq | null)[] = [
    { q: `Peut-on visiter ${art} sans guide ?`, a: none ? (site.access === 'libre' ? 'Oui, le site est en accès libre. ' : '') + (X.self || '') : soloAnswer },
    { q: 'Est-ce gratuit ?', a: free ? 'Oui, l’accès au site est gratuit.' : priceFrom ? `L’accès se fait en sortie guidée, dès ${priceFrom} par adulte.` : 'L’accès se fait avec un loueur ou une association, à tarif variable.' },
    { q: 'Peut-on se baigner ?', a: swim },
    { q: `${Art} est-il adapté aux enfants ?`, a: site.kidFriendly ? 'Oui, le site convient aux familles' + (op0 && op0.minAge ? ', dès ' + op0.minAge + ' ans en sortie guidée' : '') + '. Prévoyez protection solaire et anti-moustique.' : 'La sortie est longue ou peu aménagée : elle convient plutôt aux adultes et aux enfants marcheurs.' },
    X.when ? { q: 'Quand y aller ?', a: X.when } : null,
    { q: 'Que prévoir ?', a: bag.map((b) => b.label).join(', ') + '.' },
    tours.length ? { q: 'Qui guide la sortie ?', a: tours.map((t) => `${t.fullName} (${t.operatorName})`).join(' et ') + '. ' + tours.map((t) => t.bio.split('. ')[0]).join('. ') + '.' } : null,
    nearby.length ? { q: 'Que voir à proximité ?', a: nearby.map((n) => n.name).join(', ') + '.' } : null,
  ];
  const base = baseFaq.filter((f): f is Faq => !!f);
  const seen = new Set(base.map((f) => f.q.toLowerCase()));
  const faq = [...base, ...extraFaq.filter((f): f is Faq => !!f && !seen.has(f.q.toLowerCase()))];

  // ---------- Metadata and JSON-LD ----------
  const modeTitle = op ? op.kind : both ? 'bateau, kayak' : 'accès';
  const title = `${site.name} (${site.commune}) : ${modeTitle}, infos pratiques`;
  const description = truncate(answer);
  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org', '@type': 'TouristAttraction', name: site.name, description: answer, url: pageUrl, dateModified: '2026-09-30',
      image: site.images.map((im) => ({ '@type': 'ImageObject', contentUrl: im.url, caption: im.caption, creditText: im.credit, copyrightNotice: im.license })),
      ...(site.zone ? { containedInPlace: { '@type': 'Place', name: site.zone } } : {}),
      address: { '@type': 'PostalAddress', addressLocality: site.commune, addressRegion: 'Guadeloupe', addressCountry: 'FR' },
      ...(site.gps ? { geo: { '@type': 'GeoCoordinates', latitude: site.gps[0], longitude: site.gps[1] } } : {}),
      isAccessibleForFree: free,
      touristType: ['Amateurs de nature', ...(site.kidFriendly ? ['Familles'] : []), ...(site.birdwatching ? ["Observateurs d'oiseaux"] : [])],
    },
    ...ops.map((o) => ({
      '@context': 'https://schema.org', '@type': 'TouristTrip', name: `${o.tourName} · ${site.name}`, description: o.tourSummary, touristType: o.forWho,
      provider: { '@type': 'LocalBusiness', name: o.name, url: o.about.website },
      offers: { '@type': 'Offer', price: o.priceEur, priceCurrency: 'EUR', url: o.bookingUrl },
    })),
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Mangroves de Guadeloupe', item: new URL('/', siteUrl).href },
        { '@type': 'ListItem', position: 2, name: isl, item: new URL(routes.island(isl), siteUrl).href },
        { '@type': 'ListItem', position: 3, name: commune, item: new URL(routes.commune(commune), siteUrl).href },
        { '@type': 'ListItem', position: 4, name: site.name },
      ],
    },
  ];

  return {
    slug: site.slug,
    name: site.name,
    title,
    description,
    canonical: pageUrl,
    ogImage: site.images[0]?.url,
    jsonLd,
    hero: {
      typeLabel,
      typeIcon: activityIcon(site.activities),
      eyebrow: `${commune} · ${isl}`,
      lead: site.blurb || site.name,
      images,
      alertShort: alert?.title,
      hasGuide: !none,
    },
    facts: none ? [] : facts,
    guideCta: none ? null : { title: 'Y aller avec un guide', sub: `Avec ${guideNames} · dès`, price: priceFrom },
    summary: {
      h2: X.h2 || `${site.name}, mangrove de ${commune}`,
      sig: X.sig,
      paragraphs: site.paragraphs,
      tip: X.tip ? { label: tipOp ? 'Le conseil de ' + tipOp.guide : 'Le conseil de l’équipe', text: X.tip, photo: tipOp?.photo } : null,
      nameStory: X.nameStory ? { text: X.nameStory, estimated: estimated.has('nameStory') } : null,
      knowRows,
      alert,
    },
    photos: images.length ? { h2: site.name + ' en photos', groups: photoGroups } : null,
    access: {
      h2: alert && /Fermé/.test(alert.title) ? 'Accès : fermeture saisonnière' : 'Comment aller ' + toArticle(art),
      tiles: accessTiles,
      tilesEstimated: accessTiles.some((t) => 'estimated' in t && t.estimated),
      note: X.note || null,
      mapUrl,
      selfText: X.self || soloAnswer || answer,
      guideLine: none ? null : { text: guideLine, linkLabel: `Y aller avec ${guideNames} →` },
      compare: compare.length ? { title: 'Y aller seul.e ou avec un guide ?', columns: compare, soloHref: GCSM ? '#regles' : '#acces' } : null,
    },
    safety: {
      title: safety.safetyTitle,
      text: safety.safetyText,
      icon: zone ? 'shield' : 'leaf',
      rules: zone ? zone.rules : [],
      rulesLink: zone ? zone.rulesLink : null,
      risks,
      bag,
      estimated: estimated.has('risks') || estimated.has('bag'),
      noGuide: none && nearestGuided ? { href: routes.site(nearestGuided.slug), label: `Voir la sortie guidée la plus proche : ${nearestGuided.name} →` } : null,
    },
    tours,
    guideH2: 'Visiter ' + art + ' avec un guide',
    offers,
    sticky,
    videos: videos.length ? { h2: site.name + ' sur les réseaux', items: videos } : null,
    reads,
    faq: { h2: site.name + ' : questions fréquentes', items: faq },
    nearby,
    explore: getArticles().map((a) => ({ href: routes.article(a.slug), label: a.nav, icon: a.icon })),
    crumbs: [
      { label: 'Mangroves de Guadeloupe', href: routes.home },
      { label: isl, href: routes.island(isl) },
      { label: commune, href: routes.commune(commune) },
      { label: site.name },
    ],
    sources: site.sources.map((s) => ({ ...s, typeLabel: getSourceTypeLabel(s.type) })),
    photoCredits: site.images.map((im) => ({ caption: im.caption, credit: im.credit, license: im.license || im.rights || '', url: im.sourcePage || im.url })),
  };
}

export type SitePageModel = ReturnType<typeof buildSitePage>;
