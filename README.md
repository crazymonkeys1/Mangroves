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

Set `SITE_URL` (for example `https://www.example.fr`) at build time so canonical URLs and JSON-LD use the production origin.

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
