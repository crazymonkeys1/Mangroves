# docs/ index

| File | Purpose | Read when |
|---|---|---|
| `../CLAUDE.md` | Entry point for Claude Code: rules, naming, definition of done | start of every session |
| `design-system.md` | Rules, tokens (what for / when), text styles, mobile-first layout, naming, decision tree | building any UI |
| `components.md` | Atomic catalogue: atoms → pages, composition, props, rename map | creating or changing a component |
| `project.md` | Product, routes, data, content status, SEO requirements, glossary, file map, open items | needing context |
| `review-final.md` | Review findings, judgment calls, conformance backlog, open questions | planning work, before asking the user |
| `seo-audit-detail-page.md` | SEO and AI-search audit (findings still open) | implementing metadata, JSON-LD, URLs |
| `archive/` | Superseded documents kept for history. Do not follow them | never, unless researching why a decision was taken |

Tokens: `../design-system/tokens.css` (palette, semantic tokens, layout, motion, base styles) and `../design-system/typography.css` (11 text styles, font files). Content docs: `../airtable/README.md`, `../data/mangroves-db.json`.

One source per topic: if two files disagree, the order of precedence is `design-system.md` > `components.md` > `project.md` > prototype file > archive.
