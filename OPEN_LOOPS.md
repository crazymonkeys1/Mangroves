# Open loops

Single tracker for deferred work, pending decisions and known limitations (maintained by the `step-review` skill). Each item stands on its own: read it with `CLAUDE.md` and act. Close an item by deleting it and citing its ID in the commit message.

Last review: 0158c1a (7 Oct 2026); lists, guide profiles, articles, comparison and their fix plan

## Decisions needed

- **OL-04 · Production domain** — Canonical URLs, Open Graph and JSON-LD use `SITE_URL` (`astro.config.mjs`), which falls back to `http://localhost:4321`. Next step: choose the domain, set `SITE_URL` in Cloudflare Pages, and make a production build fail without it.
- **OL-05 · Lead capture provider and consent** — The "top 5" form is intent only, and disabled (`LeadCaptureBand`). Before enabling it: pick a provider, write the consent wording, log consent, double opt-in, and a legal-reviewed privacy page (`docs/project.md` §6).

## To do

- **OL-02 · Get partner claims approved before launch** — Decided 7 Oct 2026: keep them visible, approval is a launch gate. To approve with Pascal and Jean-Eudes: "sans frais ajoutés par ce guide" (`GuideOfferCard` footnote, `src/lib/site-page.ts`), "prestataire autorisé du Parc national" (Blue Lagoon credential, `data/content/operators.json`), Yalodé's Parc national status, tips signed by them (`site-content.json` `tip`/`tipBy`), tour quotes and "Pourquoi y aller avec…" (`operators.json`), Jean-Eudes's full name, bio and "Depuis 2010"; Yalodé's rating "4,9 · +1 880 avis" (shown on `/guides/pascal`, the guide card and the home hero; needs its source and date); on `/comparatif` (`data/content/compare.json`): "Jusqu'à 32 personnes (4 groupes de 8)", "microclimat stable ~99% du temps", "Les deux se réservent en ligne, même la veille en basse saison". Next step: send them this list; correct or remove anything they don't confirm. Effort: S (plus waiting).
- **OL-10 · Privacy page not built** — `/confidentialite` is the last linked route without a page (the lead form shows "Politique de confidentialité" as plain text until it exists). The prototype's text (`PRIVACY` in the logic class) describes data collection that isn't live (the form is disabled) and says "Hébergeur : à préciser"; it needs a legal review (`docs/project.md` §6) and ties to OL-05. Next step: get the reviewed text, put it in `data/content/`, build it with a ProseTemplate, and add `/confidentialite` to `BUILT_ROUTES` and the sitemap. Effort: S once the text exists.
- **OL-14 · Content still to verify or approve before launch** — The estimated figures in `docs/project.md` §4 (drive times, parking, bus line, Taonaba name story, Blue Lagoon included/bring lists, risks and bag), and the `estimated` fields in `data/content/*.json`. Next step: send the list to Pascal and Jean-Eudes, then clear each `estimated` entry once confirmed. Effort: M (mostly waiting).
- **OL-15 · Images and portraits** — All photos are hotlinked from third-party sites (availability and licence risk; `docs/image-sources.md`; 29 Parc national images kept provisionally). Guide portraits are `randomuser.me` placeholders. Next step: get real portraits and Parc permissions, then download images at build time and serve them from our own storage. Effort: M.
- **OL-18 · Proposed design tokens** — Tier-3 local values used for now: icon sizes 15/17/24 (`--icon-size-row/-control/-nav`), avatar diameters 22–72 (`--avatar-size-*`), and a lighter photo scrim for the site hero (`--gradient-photo-scrim`; built today from `--color-overlay-modal` and `--color-overlay-chip`). Next step: approve or reject, then add them to `design-system/tokens.css`. Effort: S.
- **OL-21 · Airtable** — Phase 2: connect Airtable as the editing source (`airtable/README.md`), adding columns for the content moved into `data/content/`. Only `src/lib/data.ts` changes.


## Known limitations (accepted for now)

- **OL-33 · Six site titles are still over 65 characters** — After the "town only if it fits" rule (`src/lib/site-page.ts` `title`), long site names alone exceed 65 (worst: 72, "Chemins de mangrove, Anse-Bertrand → Port-Louis : accès, infos pratiques"). Search engines truncate them. Revisit if you want a shorter suffix than ", infos pratiques" or a short `seoName` per site in data.
- **OL-30 · English version and zone pages** — Not started (`docs/project.md` §4). Revisit after launch.
- **OL-31 · SEO monitoring** — Rankings and AI citations, after launch.
- **OL-32 · Social posts are platform searches** — `data/content/videos.json` holds search links with "compte à renseigner" as the account; real posts are missing. Revisit with OL-15.
