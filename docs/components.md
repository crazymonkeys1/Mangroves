# Component catalogue (v14)

Each entry: purpose · composition (lower levels used) · props · tokens/styles · mobile behaviour · design-file source. Names are roles; variants are props. Add new components here in the same change that creates them. Hierarchy rules: `docs/design-system.md` §1–2.

Source of the current design: `Mangroves Guadeloupe (Detail landing v12).dc.html` (monolith; sections carry `data-screen-label`) and `Guide Offer Card.dc.html`. Inline styles there are the visual reference; implement with tokens, not literals.

## Atoms

| Name | Purpose | Props | Spec |
|---|---|---|---|
| `Icon` | Meaningful line icon | `name`, `size` (15/17/24), `tone` (secondary/brand/inverse), `label?` | §6 set; decorative = `aria-hidden` |
| `Button` | Perform an action | `variant` (primary, neutral, secondary), `size` (md 52 / sm 44), `fullWidth`, `href?` | `text-body-strong`; radius-control; primary = `action-primary` fill (one per viewport); neutral = `action-neutral`; secondary = `surface-card` + `border-default`; min-height ≥ 44 |
| `IconButton` | Icon-only action (menu, close, carousel) | `icon`, `label` (required, → aria-label), `size` 44 | 44×44, no border, hover wash `surface-sunken`; menu icon morphs to × |
| `TextLink` | Navigation inside text or standalone | `href`, `external?` | inherits style; `action-primary` underline 2px, offset 4; hit area ≥ 44 when standalone (`ActionLink` padding) |
| `Chip` | Compact tag or toggle | `kind` (static, tag, toggle, link), `selected`, `icon?` | `text-caption-strong`; `surface-card` + `border-subtle`; selected = `action-neutral`; radius from `--chip-radius` (control 8; filter contexts set full); `tag` = attribute inside a card or row: `surface-page`, no border, radius full, padding 4×8 |
| `Badge` | Non-interactive label on cards/photos | `tone` (neutral, operator, status), `operator?` | `text-caption-strong`; on photos `surface-card` 94 % |
| `Eyebrow` | Orientation label | `tone` (brand, secondary, danger, inverse, operator) | `text-eyebrow` |
| `Field` | Text input | `label` (required), `type`, `inputmode`, `autocomplete`, `required`, `error?` | 52 high (48 in toolbars), 16 px, radius-control, visible label above in `text-caption` |
| `Switch` | Boolean control | `checked`, `label` | 40×24 track `control-off/on`, 16 thumb (`--space-4`, nearest token to the 18 of the design), `elevation-thumb` |
| `Avatar` | Person photo | `src`, `size` (22/36/48/64/72), `ring?` | circle; fallback `surface-sunken` |
| `Rule` | Divider | `weight` (default, subtle) | 1px `border-*` |

## Molecules

| Name | Purpose | Composed of | Notes |
|---|---|---|---|
| `SectionHead` | Opens a section | `Eyebrow` + `h2.text-heading` | gap `space-2` |
| `FactCell` | One fact | `Icon` + caption label + `text-body-strong` value | label above value; 2 per row on mobile |
| `FactGrid` | Key facts | many `FactCell`, `Rule`s | `repeat(auto-fit, minmax(140px,1fr))`, container border, radius-container |
| `SearchField` | Search | `Icon` + `Field` (borderless) in pill | 48 high; placeholder "Rechercher"; aria-label full |
| `SwitchRow` | Setting with switch | `Icon` + label + `Switch` | 52 high, whole row is target |
| `TabToggle` | Subtle pick one of 2–3 (lead channel) | text buttons, 14 px; selected = `text-inverse` 600 + 2 px underline, others `text-inverse-secondary` 400; each ≥ 44 high; no fill, no track | Use when the choice is secondary to the field below it |
| `SegmentedControl` | Pick one of 2–3 where the choice is the main action (view switch, tour options) | `Button`-like segments | track `surface-sunken` (or inverse 12 %); selected `surface-card` + `elevation-thumb`; ≥ 44 |
| `Disclosure` | Fold/unfold | native `<details>` + summary | variants: `fold` (summary + toggle word), `faq` (question + "+"), `section` (eyebrow + heading + "Afficher ▾"); body scrolls past 300 px if a list |
| `AlertNote` | Safety/danger notice | `Disclosure` + dot + `Eyebrow`(danger) + `text-caption-strong` headline | `surface-danger`, `border-danger`; **folded by default**; body `text-caption` in `text-danger-body` |
| `CautionNote` | Unverified/estimated data | icon + `text-caption` "À confirmer" | `surface-caution`, `text-caution` |
| `DisclaimerFold` | Legal fine print | `Disclosure` + `text-legal` | folded by default; link to full notice opens it (`#avertissement`) |
| `QuoteCard` | Visitor/guide quote | glyph + `text-quote` + divider + caption author with tick | `surface-inset`, `border-subtle`, radius-container |
| `LinkRow` | External/internal list row | title `text-body` + meta `text-caption` + ↗ | min-height 44, top rule `border-default`; used in reading lists |
| `BreadcrumbTrail` | Hierarchy | `TextLink`s + `›` | `text-caption`; `tone: default \| inverse` (on photos); items without `href` render as text (unbuilt routes); `BreadcrumbList` JSON-LD |
| `PriceLabel` | Price + unit | `text-title` + `text-caption` | "dès 52 €" + "par adulte" |
| `OperatorChip` | Guide shortcut | `Avatar` 36 + name (`text-body`) + rating (strong) + star | outlined (`border-inverse`), transparent, on dark grounds |
| `ActionTile` | Compact secondary action | `Icon` + one word `text-caption-strong` | 44 min, `surface-inset`; full wording in aria-label |
| `PhotoCredit` | Image attribution | `text-caption` + `text-shadow-on-photo` | collapses behind ⓘ on small screens |
| `FilterGroup` | One filter dimension in the sheet | `Eyebrow` + `Chip`s (toggle) | chips 44 high |
| `NavMenu` | Mobile navigation | `IconButton` + panel of `NavLink` rows | native `<details>`, panel full width, rows 52, `elevation-overlap`, closes on navigation |

## Organisms

| Name | Purpose | Composed of | Mobile → desktop |
|---|---|---|---|
| `SiteHeader` | Brand and navigation | Logo (monogram + wordmark `text-title` clamp), `NavMenu`, inline nav | menu icon < sm → inline nav ≥ sm; sticky; padding 8×16 |
| `SiteFooter` | Site map and warning | link columns (`text-eyebrow` heads, `text-caption` links), `DisclaimerFold` | 1 col → 2 (sm) → 5 (md) |
| `Hero` | Page opening | photo, scrim, `Eyebrow`/`Badge`, `h1.text-display`, subtitle `text-quote`, optional `OperatorChip`s, `BreadcrumbTrail` (inverse), `Byline`, `PhotoCredit` | `variant`: site (carousel), directory, listing, article, profile (operator colour, `actions` slot); height `--hero-height` |
| `FilterBar` | Find sites | `SearchField`, filters trigger button (count badge) / inline `Chip`s + `Switch`es | 1 line < md → inline ≥ md |
| `FilterSheet` | All filters | header (`text-title` + close), `SwitchRow`, `FilterGroup`s, sort, sticky CTA | bottom sheet, radius-container top, max 85 vh |
| `ResultToolbar` | Count, clear, view switch | caption count, `TextLink` "Tout effacer", `SegmentedControl` (grille/liste) | wraps |
| `SiteCard` | A site in lists | cover + `Badge`s, `text-title` name, caption location (tight: 4 px below the title), caption meta, `Chip`s (`tag`), `FactGrid` (3), `Button` (no price, no guide badge: they live on the site page) | `variant`: grid, list, nearby |
| `FactStrip` | Key facts under a hero | `FactGrid` + guide `ActionTile`/CTA | 2×2 under title → overlaps hero ≥ md |
| `SiteSummary` | "Aperçu" | `SectionHead`, signature (`text-quote`), `text-lead`, tip callout, `FactGrid` "Bon à savoir" | |
| `PhotoGallery` | Photos + lightbox | grouped images, `PhotoCredit`, Lightbox (`overlay-lightbox`) | swipe |
| `AccessPanel` | How to get there | `FactGrid`, text, `TextLink` maps icon | |
| `SafetyPanel` | Rules, risks, bag | `SectionHead`, rule list, risk `Chip`s, bag `Chip`s, `AlertNote`, `DisclaimerFold` | |
| `GuidedTourCard` | One operator's tour | operator header (`operator-*`, `Avatar`, `PriceLabel`), `QuoteCard`/story, programme `FactGrid`, features, included/bring panels, reviews, about guide, footer actions | stacks |
| `GuideOfferCard` | Booking summary | tabs (`SegmentedControl`), `PriceLabel`, guide block, `FactGrid` tiles, `Button` primary, secondary `Button` | sticky column ≥ lg; below: `StickyBookingBar` |
| `StickyBookingBar` | Persistent booking | `PriceLabel` + caption + `Button` primary | fixed bottom after Aperçu; safe-area padding |
| `SocialVideoGrid` | Social posts | thumbnails with duration `Badge` | 2-col |
| `ReadingList` | "Ils en parlent" | `Disclosure`(section) + `LinkRow`s | folded |
| `FaqList` | Questions | `Disclosure`(faq)s | |
| `NearbySites` / `ExploreLinks` | Further navigation | `SiteCard`(nearby) / `Chip`(link)s | |
| `SourcesBar` | Breadcrumb + sources | `BreadcrumbTrail` + `Disclosure` | |
| `AboutUsBand` | "Qui sommes-nous" | inverse band, `Eyebrow`, `text-heading`, `Avatar` cards, `ActionTile`s | |
| `LeadCaptureBand` | Email/SMS capture | inverse band, `Eyebrow`, `text-title`, promise, `TabToggle` (SMS / e-mail), `Field` 52, `Button` primary 52 full width, consent `text-caption` | stacked at all widths |
| `ArticleBody` | SEO article | `text-display`, `text-lead`, toc, key points (`surface-brand-soft`), `PickList`, FAQ, author box | max 820 |
| `PickList` | Numbered ideas | number (`text-heading` secondary), photo, `text-title`, facts, link | |
| `CompareTable` | Boat vs kayak | rows of `text-body`, operator headers | to rebuild with tokens |

### Added while building (7 Oct 2026)

| Name | Level | Purpose | Notes |
|---|---|---|---|
| `Lightbox` | organism | Full-screen photo viewer for `PhotoGallery` and the site hero | native `<dialog>`, `overlay-lightbox`, Esc / arrows / swipe, caption with credit |
| `FeatureList` | molecule | Short benefits: icon tile + title + one line | `surface: page \| card`; used by GuidedTourCard, the guide profile and ArticleBody ("Pourquoi partir avec un guide") |
| `ArticleCard` | organism | An article in lists: image 3:2, optional category, title, brief, meta | `/idees` index (full) and "À lire aussi" (image + title) |
| `PageShell` | template | Document head (title, meta, canonical, Open Graph, JSON-LD, fonts), `SiteHeader`, main, `SiteFooter` | also opens a folded `<details>` when an in-page link targets it (`#alerte`, `#sources`, `#avertissement`) |

Implementation: `src/components/{atoms,molecules,organisms}/{Name}/{Name}.astro`, templates in `src/templates/`. Tier-3 local values (not yet tokens): icon sizes 15/17/24, avatar diameters 22–72, grid column minimums (140/190/220/240/260/280/300 px). See "Proposed additions" in the build notes.

## Templates

`PageShell` (SiteHeader, main slot, AboutUsBand? optional, SiteFooter) · `DirectoryTemplate` (Hero directory, FilterBar, AlertNote, ResultToolbar, grid of SiteCard, LeadCaptureBand, AboutUsBand) · `SiteDetailTemplate` (Hero site, FactStrip, SiteSummary, PhotoGallery, AccessPanel, SafetyPanel, GuidedTourCard*, SocialVideoGrid*, ReadingList*, FaqList, NearbySites, ExploreLinks, SourcesBar, GuideOfferCard/StickyBookingBar; * conditional) · `ArticleTemplate` · `ListingTemplate` (Hero listing, SiteCards, FaqList, ExploreLinks) · `ProfileTemplate` · `CompareTemplate` · `IdeasTemplate` · `ProseTemplate` (privacy).

## Section anchors (keep stable; used by links, SEO, JSON-LD)
`#essentiel`, `#photos`, `#acces`, `#preparer`, `#regles`, `#visiter`, `#reseaux`, `#ils-en-parlent`, `#faq`, `#proximite`, `#explorer`, `#sources`, `#qui-sommes-nous`, `#avertissement`.

## Rename map from the current design/docs (for reading old files)

| Old | New |
|---|---|
| `t-display / t-h2 / t-h3 / t-quote / t-lead / t-body / t-strong / t-small / t-small-strong / t-fine / t-label` | `text-display / -heading / -title / -quote / -lead / -body / -body-strong / -caption / -caption-strong / -legal / -eyebrow` |
| `--color-ink / body / muted / subtle / brand / accent` | `text-primary / text-primary / text-secondary / text-secondary / text-brand / action-primary` |
| `--color-canvas / surface / surface-2 / sand` | `surface-page / surface-card / surface-inset / surface-sunken` |
| `--color-line / line-soft` | `border-default / border-subtle` |
| `--color-alert*` | `status-danger / text-danger / text-danger-body / surface-danger / border-danger` |
| `--color-caution*` | `text-caution / surface-caution` |
| `--color-op-*` | `operator-*` |
| `--color-on-dark*` | `text-inverse / text-inverse-secondary / border-inverse` |
| `--radius-sm / -md / -pill` | `radius-control / -container / -full` |
| `--shadow-overlap / -bar / -thumb` | `elevation-overlap / -bar / -thumb` |
| `--bp-sm/md/lg` | `--breakpoint-sm/md/lg` |
| `Guide Offer Card` (DC) | `GuideOfferCard` |
| `hero-scrim`, `icon-action`, `list-divided`, `fact-cell`, `section-head`, `bottom-sheet`, `sticky-bar`, `lead-capture`, `filter-bar` | `Hero`, `ActionTile`, `Rule` pattern, `FactCell`, `SectionHead`, `FilterSheet`, `StickyBookingBar`, `LeadCaptureBand`, `FilterBar` |
