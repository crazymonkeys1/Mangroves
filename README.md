# Mangroves Gwada

French-language directory of Guadeloupe's mangroves. Static site built with [Astro](https://astro.build), hosted on Cloudflare Pages.

Read `CLAUDE.md` first (rules), then `docs/`.

## Run it

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static HTML in dist/
npm run check     # type check
```

## Deploy (Cloudflare Pages)

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 22 (from `.node-version`) |

Pages are indexed by default. The site is built by Cloudflare Workers Builds and served at `https://mangroves.app-e5e.workers.dev`. Canonical URLs, the sitemap and JSON-LD use `SITE_URL`; on Workers Builds without it, that address is used (`astro.config.mjs`); a Cloudflare Pages build without it fails. When the domain arrives, set `SITE_URL` to it. To hide a deployment from crawlers, set `INDEXABLE=false` (pages get `noindex`, `robots.txt` disallows all).

## Layout

| Path | What |
|---|---|
| `design-system/` | Tokens and text styles (source of truth, imported as is) |
| `data/mangroves-db.json` | Sites (unchanged) |
| `data/content/` | Operators, per-site editorial content, vocabularies, social, articles, comparison |
| `src/lib/` | Data layer (`data.ts`, the only reader of `data/`) and page models |
| `src/components/` | Atoms, molecules, organisms (`docs/components.md`) |
| `src/templates/` | Page skeletons |
| `src/pages/` | Routes: `/`, `/mangrove/<slug>`, `/ile/`, `/commune/`, `/activite/<slug>`, `/guides/<slug>`, `/idees`, `/idees/<slug>`, `/comparatif`, `robots.txt`, `sitemap.xml`, `llms.txt`, 404 |
| `*.dc.html`, `support.js`, `image-slot.js` | Design reference from Claude Design (not shipped) |
