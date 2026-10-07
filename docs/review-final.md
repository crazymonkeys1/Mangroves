# Final review and handoff status (6 Oct 2026)

Scope: the v12 design file (after the mobile pass), `Guide Offer Card`, all documentation, the design system, the data and Airtable docs. Result: documents consolidated, design system rebuilt as v14 (semantic names, three tiers), Claude Code entry point written (`CLAUDE.md`). This file records what was found, the decisions adopted by default, what the design still owes the system, and what I need from you.

## 1. State of the document set

| Before | After |
|---|---|
| 12 docs in `docs/` from v6 to v13, several describing different "current" versions (v7, v11, v12) | `docs/` holds 5 live files (`design-system.md`, `components.md`, `project.md`, `review-final.md`, `seo-audit-detail-page.md`) + `archive/` (11 superseded files, history only) |
| Tokens in 3 places (`design-tokens.md`, `tokens.css`, `typography.css`), two colour namespaces (`--color-*`, `--text-*`) | One tokens file (3 tiers) + one text-style file; one colour namespace |
| No Claude Code entry point | `CLAUDE.md` at the project root |

## 2. Contradictions, outdated and duplicated content found (all resolved in v14)

| # | Finding | Resolution |
|---|---|---|
| 1 | Sticky guide card breakpoint: 880 (design-system v13), 1200 (`detail-page.md`, the design's `isWide` JS) | **1180 (`--breakpoint-lg`)**, matching the actual build; below it a sticky bottom bar |
| 2 | `subtle` documented 4.6:1, measured 4.15:1 on the page colour; `accent` documented 4.2 as if usable for text | `subtle` retired (secondary text 6.2:1); accent forbidden as body text |
| 3 | `design-tokens.md` v12 (15 px UI, 13 px fine, weights 500/700, 9 styles) vs `typography-system.md` v13 (14/16, 2 weights, 10 styles) vs `design-system.md` §2 | Single set: 8 sizes, 2 weights, 11 styles (`text-legal` 13 px kept for folded disclaimers on your request) |
| 4 | Two colour naming sets for the same colours (`--color-ink` and `--text-ink`) | Merged into semantic `--color-text-*` etc. |
| 5 | `detail-page.md` still described v7 (20 px radius, 11 px caps labels `#8A7A5C`, emoji in header) | Archived; replaced by `project.md` §2 |
| 6 | `alignment-review-and-plan.md` described v11 as current and listed finished phases as open | Archived; open items moved to `project.md` §9 |
| 7 | Component names mixed kebab pattern names (`icon-action`, `fact-cell`, `hero-scrim`, `list-divided`), DC file names with spaces (`Guide Offer Card`), prose names | PascalCase role names in `components.md` with a rename map |
| 8 | "Guide" meant three things: a person (UI "Les guides"), an SEO article (`/guide/<slug>`, Airtable "Guides" table), a section title | Glossary (`project.md` §7); renames proposed in R3 and R4 below |
| 9 | Design system said "accent = actions only" while the design uses coral `#FF6B5B` from a dev palette switcher for every CTA | System keeps `action-primary`; the design's coral is listed in the backlog (§4) |
| 10 | System said "legal text subtle 13 px" while v13 proposed 14 px muted | 13 px `text-legal`, `text-secondary` colour, always folded |
| 11 | Airtable has `Hero Palettes`, `Islands.Color/Emoji`, `Operators.Brand color / Card background / Accent on dark` | Palette table is a dev tool: delete. Operator colour columns must hold the `--color-operator-*` values; emoji columns unused in UI |
| 12 | Content estimates embedded in the design's logic class | Flagged in `project.md` §3–4 as the first data migration |

## 3. Judgment calls

Defaults are what the documents currently say. Say the word to change any of them.

**R1. Rename everything now (default) vs keep old names.** Nothing in code consumes the old token or style names yet (the prototype uses inline literals), so renaming costs nothing today and avoids a repo-wide rename later. The rename map is in `components.md`. Option: keep the old names (`--color-ink`, `.t-h2`) and add a naming rule only for new items.

**R2. Operator colour tokens by slug (default)** (`--color-operator-yalode`). Adding an operator = two tokens. Option: generic roles (`--color-partner-a`), which survive operator changes but obscure which is which.

**R3. URL scheme: DECIDED (6 Oct).** Articles are not linked to a guide, so they leave the `guide` namespace: articles at `/idees/<slug>` (index `/idees`), guide profiles at `/guides/<slug>`.

**R4. Airtable: DECIDED and applied.** `Guides` → `Articles`, `Guide Sections` → `Article Sections`, `Guide FAQ` → `Article FAQ` (CSV files and README renamed).

**R5. Pill shape for filter controls.** The system says controls are 8 px; the filter bar uses pills for chips, search and the Filtres button. Default: allowed through the local token `--chip-radius` set to `--radius-full` inside `FilterBar`/`FilterSheet` only. Option: move filters to 8 px for strict consistency.

**R6. Adopted defaults from earlier passes** (listed so you can see them in one place):
- J1 operators use the dark values only (`#1F4A63`, `#6E4A14`); `#2C5F7C` and `#C88A2E` retired.
- J2 4-pt spacing scale (4/8/12/16/24/32/40/56); old 5/6/10/14/18/20/22 map to the nearest step.
- J3 sans sizes 14 and 16, 15 retired.
- J4 booking CTA fill = `action-primary` (terracotta); neutral buttons = `action-neutral`.
- J5 hero palette switcher removed.
- J6 island fallback covers use one neutral cover.
- J7 success = brand; caution = amber pair.
- J8 sub-labels inside cards are sentence case (`text-caption-strong`) with an icon; caps only for eyebrows.
- T1–T8 (typography): body colour merged into primary; legal 13 px; quote at the title step (hero subtitle slightly larger); weight 700 dropped; wordmark at title size (fluid clamp in header); display 36 px on mobile.

## 4. Conformance backlog: where the design file still departs from the system

Mobile pass already done in the design: header menu, one-line filter bar + sheet, folded alert and disclaimers, stacked lead capture with subtle channel toggle, tight title→location spacing on cards. Remaining (P1 = fix first in the build):

| Pri | Item | System rule |
|---|---|---|
| P1 | Coral `#FF6B5B` booking CTAs (hero, sticky bar, side card, tour footer, compare) via `heroAccent`; remove `HERO_PALETTES`, `paletteOpen`, swatches | `action-primary`, 4.7:1 |
| P1 | Global link colour `#2C5F7C` | `text-link` + action underline |
| P1 | 52 of 87 interactive elements < 44 px on the detail page (breadcrumb pill 35, carousel arrows 28, Maps icon 28, ActionTiles 34, rows 40–41, inline links 15–18, "Sources et crédits" 26) | `--tap-size-min` |
| P1 | Fact strip overlaps the hero and tour header is a row on small screens | 2×2 under title; stack header |
| P2 | Font loading: no italic file, requests 500/700 | Spectral 600 + 400 italic, Work Sans 400 + 600 |
| P2 | Off-scale sizes (15, 17, 19, 20, 22 compare, 24 sheet, 28, 32, 56), weights 500/700, 40 % `line-height: normal` | text styles |
| P2 | Colours: `#F1EBDD` (38) → `border-subtle`; `#6B776F`/`#6B7A70` → `text-secondary`; `#BFD8C8` → `text-inverse-secondary`; `#33413A` → `text-primary`; `#9A6512` → `text-caution`; `#2F7A4B/#E3EFE6`, `#3F8F5A` → brand; `ISLAND_COLOR`; text `opacity` on the compare page | tokens |
| P2 | Headings built as `<span>` (listing-card titles, "Nous, c'est…", profile name) | real h2/h3 |
| P2 | States: 3 hover styles, no active/transition; no `lang` | §7–8 of the design system |
| P2 | Footer (5 columns on small screens), `100vw` full-bleed trick, `isWide` JS layout, 11 max-widths, z-index values | containers, CSS breakpoints, z scale |
| P3 | Comparison page on v8 styles; dead v8 code (`TABS`, `OT`, `layout` prop, emoji constants); dev `viewportLabel` | rebuild / delete |
| P3 | Card shadow `.12` vs `.14`; `0 1px 2px rgba(0,0,0,.2)` | `elevation-*`, `text-shadow-on-photo` |

## 5. Captured in the design, now captured in the system
Mobile header menu (`NavMenu`), one-line `FilterBar` + `FilterSheet`, folded `AlertNote` and `DisclaimerFold`, `LeadCaptureBand` with `TabToggle`, `Disclosure` section variant ("Ils en parlent"), `ActionTile`, `OperatorChip`, `PhotoCredit`, `StickyBookingBar`, `CautionNote`, detail section anchors, breakpoint behaviour of the guide card, decisions log (`project.md` §5).

## 6. What I need from you before the build starts

1. **Stack and rendering: deferred to Claude Code.** Constraint: real URLs and HTML without JavaScript (SEO audit). Data stays as is (`data/mangroves-db.json`); Airtable comes later. See `project.md` §6.
2. **Confirm or change** R1–R5 and the adopted defaults in R6.
3. **Lead capture: intent documented, not implemented** (`project.md` §6). Provider, consent wording and legal review still to decide before launch.
4. **Fonts: DECIDED**, Google Fonts.
5. **Screens I could only read from code**, not review visually at 375 px: home below the fold, listing, profile, article, privacy, comparison. Send screenshots or confirm the system rules should be applied blind.
6. **Content gates** listed in `project.md` §4 (guide approvals, estimated figures, photos, permissions).
