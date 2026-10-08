# Design system: Mangroves Gwada (v14)

Authoritative rules. Values live in `design-system/tokens.css` (tokens) and `design-system/typography.css` (text styles). Components are catalogued in `docs/components.md`. Read this file fully at the start of a session; consult the others as needed.

## 0. Ten rules that cover 90 % of the work

1. **Only tier-2 tokens in components.** No raw hex, px size, shadow, z-index or font value outside `tokens.css` / `typography.css`. Tier 1 `--palette-*` is for defining tokens only.
2. **Only the 11 text styles.** Never set font-size, weight, line-height, letter-spacing or text colour by hand.
3. **Mobile first.** Base CSS = 360 px. Add `@media (min-width: …)` only to enlarge; breakpoints 600 / 880 / 1180. No `max-width` queries, no JS layout logic.
4. **One loud element per block.** One filled button per viewport; one `text-body-strong` value per fact; labels never bold.
5. **Tap targets ≥ 44 px** in both axes, 8 px apart.
6. **Three shapes, flat by default.** `radius-control` 8, `radius-container` 14, `radius-full`; border `1px`; shadow only for overlap.
7. **Colour by role.** Secondary text = `text-secondary`; danger = red family only; success = brand; accent = the single conversion action; operator colour = that operator only.
8. **Disclaimers and alerts are folded by default** on every width.
9. **No emoji in UI.** SVG line icons next to a text label (or `aria-label`).
10. **French copy, sentence case**, `lang="fr"`. Caps only in `text-eyebrow`.

If a need isn't covered: pick the nearest existing token or component, build it, and list it under "Proposed additions" in your reply. Do not add tokens, styles or components silently.

## 1. Architecture (atomic hierarchy)

| Level | What it is | Lives in | May use |
|---|---|---|---|
| 0 Primitives | Raw palette values | `tokens.css` tier 1 | nothing |
| 1 Tokens | Roles: colour, type, space, shape, elevation, layout, motion | `tokens.css` tier 2 | primitives |
| 2 Text styles | Named type roles (`text-*`) | `typography.css` | tokens |
| 3 Atoms | Single-purpose controls and marks: Button, Chip, Field… | `components/atoms/` | tokens, text styles |
| 4 Molecules | Small groups of atoms with one job: FactCell, QuoteCard, Disclosure… | `components/molecules/` | atoms, tokens, text styles |
| 5 Organisms | Self-contained page regions: SiteHeader, FilterBar, SiteCard… | `components/organisms/` | molecules, atoms |
| 6 Templates | Page skeletons with slots, no content | `templates/` | organisms |
| 7 Pages | A route filled with data | `pages/` (or routes) | templates + data |

Rules of composition: a level may use only levels below it; atoms never contain other atoms; organisms receive data through props (no data fetching inside molecules/atoms); pages are the only place that fetch and map data.

## 2. Naming conventions

**Principle: name the role, never the look.** A name must survive a change of colour, size, shape or layout. Banned words in names: colours (coral, sand, green), sizes (big, small, large), shapes (pill, round, card-ish), positions (left, top), counts, page names, versions.

| Thing | Convention | Examples | Counter-examples |
|---|---|---|---|
| Palette (tier 1) | `--palette-{hue}-{step}` | `--palette-forest-900` | used in a component |
| Colour token | `--color-{group}-{role}[-{variant}]`, groups: `text`, `surface`, `border`, `action`, `status`, `operator`, `overlay`, `social` | `--color-text-secondary`, `--color-surface-inverse` | `--color-sand`, `--color-grey-2` |
| Scale tokens | ordinal steps | `--space-4`, `--font-size-6` | `--space-16px`, `--font-size-md` |
| Shape / elevation | by job | `--radius-container`, `--elevation-overlap` | `--radius-14`, `--shadow-big` |
| Text style class | `.text-{role}` | `.text-title`, `.text-caption` | `.text-18-bold` |
| Component | PascalCase noun for what it does | `FactCell`, `AlertNote`, `SiteCard` | `BigCard`, `DarkBand`, `PillButton`, `HomeHero2` |
| Variant / size / state | props, not names: `variant`, `size`, `tone`, `density`, `selected` | `<Button variant="primary">` | `PrimaryButton` |
| CSS class | BEM on the component name: `.block`, `.block__part`, `.block--modifier`; state via `aria-*` / `data-state` | `.disclosure__summary`, `.chip[aria-pressed="true"]` | `.red`, `.mt-16` |
| Files | `components/{atoms,molecules,organisms}/{Name}/{Name}.{ext}` | `molecules/FactCell/` | `Card2.tsx` |
| Domain nouns | see Glossary (§7 of `docs/project.md`): site, zone, operator, guide, tour, article | | "guide" for an article |
| Routes | kebab-case, plural for lists | `/mangrove/:slug` | camelCase |

Variant values may describe intent (`primary`, `neutral`, `danger`, `inverse`), never appearance (`dark`, `outline`) unless the outline is the function (`secondary`).

## 3. Tokens (what for, when)

### 3.1 Colour
| Token | Value | Use | Do not |
|---|---|---|---|
| `text-primary` | forest-900 | All reading text, titles, values | |
| `text-secondary` | forest-700 | Captions, credits, labels, legal, icons | Mimic with opacity |
| `text-brand` | green-600 | Eyebrows, brand icons, success marks | Body text |
| `text-inverse` / `-secondary` | white / green-200 | On dark bands and photos | Below `-secondary` |
| `text-danger` / `-body` | red-800 / red-900 | Alert titles / alert body | Links |
| `text-caution` | amber-700 | "À confirmer", unverified data | Danger |
| `text-link` | = primary | Links, with the action underline | Blue, red |
| `surface-page` | cream-100 | Page | |
| `surface-card` | white | Cards, fields | |
| `surface-inset` | cream-50 | Tiles and quote cards | |
| `surface-sunken` | cream-200 | Footer, segmented track, hover wash | |
| `surface-brand-soft` | green-100 | Tips, info, "Fourni", success | |
| `surface-inverse` | forest-900 | Dark bands | Body background |
| `surface-danger` / `-caution` | red-100 / amber-100 | Alert / caution notes | |
| `border-default` / `-subtle` | cream-300 / cream-200 | Container borders and section rules / inner dividers, chip borders | Two lines stacked |
| `border-danger` / `-inverse` / `-strong` | | Alert outline / outlines on dark / outlined controls and focus | |
| `action-primary` | terracotta-600 | The booking/conversion fill (one per viewport), link underlines, bullets | Text on page |
| `action-neutral` | forest-900 | Neutral primary buttons, selected chips | Booking |
| `control-off` / `control-on` | cream-400 / forest-900 | Switch tracks | |
| `status-danger` | red-600 | "!" dots | |
| `operator-{slug}` / `-soft` | | That operator's header, kicker, badge | Generic UI |
| `overlay-*`, `gradient-hero-scrim` | | Scrims on photos and modals | |
| `social-*` | | Social platform badges only | |

Contrast floor: text 4.5:1 (3:1 for ≥ 24 px headings), non-text 3:1. Documented values in `tokens.css` are measured; recompute when a palette value changes.

### 3.2 Type primitives, space, shape, elevation, layout, motion
See `tokens.css`; usage in one line each:
- **Font steps 1–8:** 12 eyebrow · 13 legal · 14 caption · 16 body · 18 lead · 22→26 title/quote · 28→34 heading · 36→58 display. Only text styles consume them.
- **Weights:** 400 and 600 only.
- **Line heights:** display 1.05 · heading 1.15 · ui 1.4 · small 1.5 · text 1.6.
- **Space 1–8:** 4 8 12 16 24 32 40 56. Gaps with `gap`, never margins between siblings. Section = border-top + 40 above, 8 below.
- **Gutter:** `--page-gutter` 16 → 20 (sm) → 24 (md). Card padding 16 → 24 (md).
- **Radius:** control 8 · container 14 · full · tick 2.
- **Elevation:** overlap, bar, thumb. Photo text uses `text-shadow-on-photo`.
- **Layout:** containers page 1180 / content 820 / narrow 720 / sheet 600.
- **Breakpoints:** sm 600 / md 880 / lg 1180 (literals in `@media`).
- **Stacking:** raised 2 · dropdown 20 · header 20 · bar 80 · sheet 90 · lightbox 100.
- **Motion:** 150 ms for state changes, 250 ms for sheets/accordions, one easing; zero under reduced motion.

## 4. Text styles (UX reasons)

| Style | Spec | Job | Why it exists |
|---|---|---|---|
| `text-display` | Spectral 600 · 36→58 · 1.05 | The H1, once | Anchors page and brand voice |
| `text-heading` | Spectral 600 · 28→34 · 1.15 | Section titles (h2) | The scannable spine of long pages |
| `text-title` | Spectral 600 · 22→26 · 1.15 | Object titles (h3): card, tour, guide, price, wordmark, sheet | Marks "an object" rather than a section |
| `text-quote` | Spectral italic 400 · 22→26 · 1.4 | A person speaking | The only italic: separates voice from data |
| `text-lead` | Work Sans 400 · 18 · 1.6 | First paragraph after a title | Lets readers decide whether to read on |
| `text-body` | Work Sans 400 · 16 · 1.6 · 65ch | All running text | Reading baseline; 16 px avoids zoom |
| `text-body-strong` | Work Sans 600 · 16 · 1.4 | Values, questions, buttons, nav, field text | The scannable answer layer |
| `text-caption` | Work Sans 400 · 14 · 1.5 · secondary | Captions, credits, bylines, stat labels, breadcrumbs | One quiet support voice |
| `text-caption-strong` | Work Sans 600 · 14 · 1.4 | Chips, badges, tabs, segments, ratings | Dense rows without a third size |
| `text-legal` | Work Sans 400 · 13 · 1.6 · secondary | Disclaimers, folded | Smallest footprint for text few read but all may need |
| `text-eyebrow` | Work Sans 600 · 12 · caps · .1em · brand | Orientation labels | Says where you are without competing with the title |

Rules: one strong sans element per block; serif never in controls; colour only via modifiers; links inside text inherit and take the action underline; headings must be real `h1–h3` in order (one `h1` per page); prices use `text-title` + `text-caption` unit; pick numbers ("01") use `text-heading` in `text-secondary`.

## 5. Mobile-first layout rules

- Base = one column, 16 px gutter, full-bleed bands via wrappers (never `100vw`).
- Header: logo + wordmark + icon-only menu button (44×44, two bars → ×, native `<details>`); from sm the inline nav replaces it.
- Filter bar: below md, one line (search + "Filtres" button with count); all other filters in the bottom sheet whose CTA reads "Voir N mangroves". From md, the inline bar.
- Detail page: single column; fact grid 2 columns under the title (no overlap) → overlap hero from md; **guide card is a sticky column only from lg (1180)**; below lg a sticky bottom bar appears once the fact strip (and its guide button) has scrolled away.
- Grids use `repeat(auto-fit, minmax(min(100%, X), 1fr))` with X ≥ 140 (facts) / 300 (cards).
- Forms stack at every width (max 560); field 52 px; button 52 px full width.
- Text wraps; `white-space: nowrap` only on single-word pills and the wordmark.
- Hover effects exist only under `@media (hover: hover)`; nothing essential is hover-only.
- Test widths 360, 375, 600, 880, 1180, 1440. No horizontal scroll.

## 6. Iconography

SVG line icons, 24 viewBox, 1.75 stroke, round caps; sizes 15 (rows), 17 (controls), 24 (nav). Tone: `text-secondary`, `text-brand`, `text-inverse`. Always with visible text or `aria-label`. One icon per meaning; set: boat, waves, footprints, mountain, clock, users, user, pin, compass, anchor, signpost, access, shield, sun, bug, sunrise, calendar, undo, thermo, backpack, map, ban, bird, leaf, grad, info, fish, search, sliders, sort, star, droplet, hat, shoe, vest, car, bus, parking, mail, grid, list, play, ext. `↗` and `▶` stay as text glyphs.

## 7. States and motion

| State | Rule |
|---|---|
| Hover (pointer) | Link underline → `text-primary`; tile/button wash → `surface-sunken`; no transforms |
| Active | One step darker; no scale |
| Focus-visible | `--focus-ring` on every interactive element |
| Disabled | `text-secondary` on `surface-sunken`, `aria-disabled` |
| Selected | `action-neutral` fill + inverse text (chips), or `surface-card` + `elevation-thumb` (segments) |
| Expanded | `aria-expanded` / `<details open>`; chevron or icon morph over `duration-fast` |
| Loading | skeleton in `surface-sunken` |
| Empty | state the cause; offer "Tout effacer" |

## 8. Accessibility

`lang="fr"`; alt text on every photo (credits go in captions); one h1; landmarks (`header`, `nav` with `aria-label`, `main`, `footer`); `aria-expanded` on custom disclosures (native `<details>` is enough); inputs have visible labels, correct `type`, `inputmode`, `autocomplete`, `required`; contrast floor §3.1; `prefers-reduced-motion` honoured by tokens; touch ≥ 44.

## 9. Content rules

French; sentence case; no emoji; dates on prices ("Tarifs relevés en septembre 2026"); estimated or unverified figures carry `CautionNote` ("à confirmer"); operator links carry `utm_source=mangroves-gwada&utm_medium={placement}&utm_campaign={slug}`; never invent facts, reviews or ratings.

## 10. Decision tree for new work

1. **Need a colour/size/space/shape?** Use an existing token. Not found → nearest token → if truly new role: propose in the reply (name, role, value, contrast), don't add silently.
2. **Need a type size?** Use a text style. Not found → nearest. No new sizes.
3. **Need a component?** Search `docs/components.md`. Reuse with props → compose from existing molecules → only then create, at the lowest level that fits (atom if single-purpose; molecule if it groups atoms for one job; organism if it is a page region). Name by role. Register it in `docs/components.md` in the same change.
4. **Need a new page?** Pick a template; fill slots with organisms; add the route to `docs/project.md`.

## 11. Restyling safely (how the look can change without renames)

Change the look by editing tier-1 values, re-pointing tier-2 tokens, or editing text-style files. Names stay. Examples: new brand colour → edit `--palette-green-600`; rounder UI → change `--radius-control`/`-container`; new typefaces → change `--font-family-*` and the font files, then re-check line heights and measure; denser layout → change `--space-*` and `--card-padding`. A component's structure and prop API are stable; only its CSS body changes. Component-specific values use tier-3 local tokens (e.g. `--chip-radius`) defined from tier-2 tokens inside the component.

## 12. Change log

- v14 (6 Oct 2026): semantic naming, three token tiers, 11 text styles, component catalogue, mobile header/filter/disclaimer/lead specs, breakpoints aligned (guide card ≥ 1180). Supersedes v12/v13 documents (archived in `docs/archive/`).
