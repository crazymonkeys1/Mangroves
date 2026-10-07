# Open loops

Single tracker for deferred work, pending decisions and known limitations (maintained by the `step-review` skill). Each item stands on its own: read it with `CLAUDE.md` and act. Close an item by deleting it and citing its ID in the commit message.

Last review: e945ac4 (7 Oct 2026); handoff import, Astro build, step-review skill and its fix plan

## Decisions needed

- **OL-04 · Production domain** — Canonical URLs, Open Graph and JSON-LD use `SITE_URL` (`astro.config.mjs`), which falls back to `http://localhost:4321`. Next step: choose the domain, set `SITE_URL` in Cloudflare Pages, and make a production build fail without it.
- **OL-05 · Lead capture provider and consent** — The "top 5" form is intent only, and disabled (`LeadCaptureBand`). Before enabling it: pick a provider, write the consent wording, log consent, double opt-in, and a legal-reviewed privacy page (`docs/project.md` §6).

## To do

- **OL-02 · Get partner claims approved before launch** — Decided 7 Oct 2026: keep them visible, approval is a launch gate. To approve with Pascal and Jean-Eudes: "sans frais ajoutés par ce guide" (`GuideOfferCard` footnote, `src/lib/site-page.ts`), "prestataire autorisé du Parc national" (Blue Lagoon credential, `data/content/operators.json`), Yalodé's Parc national status, tips signed by them (`site-content.json` `tip`/`tipBy`), tour quotes and "Pourquoi y aller avec…" (`operators.json`), Jean-Eudes's full name, bio and "Depuis 2010". Next step: send them this list; correct or remove anything they don't confirm. Effort: S (plus waiting).
- **OL-10 · Routes not built yet** — `/idees`, `/idees/<slug>` (5), `/guides/pascal`, `/guides/jean-eudes`, `/ile/*`, `/commune/*`, `/activite/*`, `/comparatif`, `/confidentialite`. Links to them are hidden for now (`isBuilt` / `BUILT_ROUTES` in `src/lib/format.ts`: footer columns, header "Idées de sorties", explore links, profile tiles, privacy link and breadcrumb levels come back automatically when you add the prefix to `BUILT_ROUTES`). Also add each new route to `src/pages/sitemap.xml.ts` and `llms.txt.ts`. Templates are specified in `docs/components.md` (ArticleTemplate, IdeasTemplate, ListingTemplate, ProfileTemplate, CompareTemplate, ProseTemplate). Content for articles, compare rows, tips and privacy is still in the prototype's logic class (FILTER_PAGES, ARTICLE, TIPS, compareRows, PRIVACY) and must move to `data/content/` first. Next step: listings (cheapest: reuse SiteCard, Hero, FaqList), then guide profiles, then articles. Effort: L.
- **OL-14 · Content still to verify or approve before launch** — The estimated figures in `docs/project.md` §4 (drive times, parking, bus line, Taonaba name story, Blue Lagoon included/bring lists, risks and bag), and the `estimated` fields in `data/content/*.json`. Next step: send the list to Pascal and Jean-Eudes, then clear each `estimated` entry once confirmed. Effort: M (mostly waiting).
- **OL-15 · Images and portraits** — All photos are hotlinked from third-party sites (availability and licence risk; `docs/image-sources.md`; 29 Parc national images kept provisionally). Guide portraits are `randomuser.me` placeholders. Next step: get real portraits and Parc permissions, then download images at build time and serve them from our own storage. Effort: M.
- **OL-18 · Proposed design tokens** — Tier-3 local values used for now: icon sizes 15/17/24 (`--icon-size-row/-control/-nav`), avatar diameters 22–72 (`--avatar-size-*`), and a lighter photo scrim for the site hero (`--gradient-photo-scrim`; built today from `--color-overlay-modal` and `--color-overlay-chip`). Next step: approve or reject, then add them to `design-system/tokens.css`. Effort: S.
- **OL-19 · Conformance backlog from the design review** — `docs/review-final.md` §4. Done in the build: action-primary CTAs, 44 px targets, the fact strip under the title on phones, real headings, token colours, no JS layout. Still open: rebuilding the comparison page (part of OL-10). Next step: re-check the list when OL-10 is done.
- **OL-20 · Screens not yet reviewed visually** — Listing, profile, article, privacy and comparison exist only in the prototype; review them at 375 px when they are built (`docs/review-final.md` §6.5).
- **OL-21 · Airtable** — Phase 2: connect Airtable as the editing source (`airtable/README.md`), adding columns for the content moved into `data/content/`. Only `src/lib/data.ts` changes.

## Known limitations (accepted for now)

- **OL-33 · Six site titles are still over 65 characters** — After the "town only if it fits" rule (`src/lib/site-page.ts` `title`), long site names alone exceed 65 (worst: 72, "Chemins de mangrove, Anse-Bertrand → Port-Louis : accès, infos pratiques"). Search engines truncate them. Revisit if you want a shorter suffix than ", infos pratiques" or a short `seoName` per site in data.
- **OL-30 · English version and zone pages** — Not started (`docs/project.md` §4). Revisit after launch.
- **OL-31 · SEO monitoring** — Rankings and AI citations, after launch.
- **OL-32 · Social posts are platform searches** — `data/content/videos.json` holds search links with "compte à renseigner" as the account; real posts are missing. Revisit with OL-15.
