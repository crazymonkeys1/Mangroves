---
name: step-review
description: Audit and clean up after a big build step on the Mangroves Gwada site (a new page type, template, data migration, or any multi-file feature). Runs the build and mechanical checks, reviews SEO/LLM-SEO, atomic design, rendering, accessibility, performance, data integrity and docs drift, fixes clear-cut errors, updates OPEN_LOOPS.md and the lessons in CLAUDE.md, then delivers a prioritized audit plus a phased fix plan and STOPS for approval. Use when the user says "review the step", "audit what we built", "clean up after this", or types /step-review.
argument-hint: "[git range, e.g. abc123..HEAD, or an area to focus on]"
---

# Step review

You are reviewing work that was just built, to catch what was missed. You are not continuing the build.
Two stances apply throughout:

- **Evidence, not opinion.** Every finding cites a file and line, a built page in `dist/`, or a command output, and says how you verified it. If you can't verify a finding, drop it or label it "unverified".
- **Minimal.** Recommend the smallest change that fixes the problem. Never propose a new framework, dependency, abstraction or process unless a concrete finding requires it, and say what it costs. Five findings that matter beat thirty nits.

The project's own rules are the yardstick: `CLAUDE.md` first, then `docs/design-system.md`, `docs/components.md`, `docs/project.md` (§6 lists the SEO requirements) and `docs/seo-audit-detail-page.md`. Judge against these before generic best practice. Where they are silent, use current standards and say that you did.

## 1. Scope

1. Read `CLAUDE.md` and `OPEN_LOOPS.md` (if it exists). The line `Last review: <commit>` in `OPEN_LOOPS.md` marks where the previous review stopped.
2. Scope = the argument if one was given; otherwise `git log --oneline <last-review>..HEAD` plus uncommitted changes (`git status`). With no marker, the scope is the whole repo.
3. Read the diff (`git diff --stat`, then the files that matter). Also review the code around the change that the diff depends on, but don't audit unrelated areas in depth.

## 2. Mechanical checks (run them all; paste only the findings)

```sh
npm run build                                              # must pass
npx astro check                                            # 0 errors
node .claude/skills/step-review/scripts/check-dist.mjs     # built HTML: titles, descriptions, canonical, one h1, heading order, JSON-LD validity, alt, broken internal links/anchors, robots/sitemap/llms.txt/404/favicon, JS+CSS weight
sh .claude/skills/step-review/scripts/check-source.sh      # design-system rules in src/: raw colours, palette tokens, hand-set type, raw z/shadows, max-width queries, raw px, emoji, data read outside src/lib/data.ts
```

Then look at the pages. Run `npx astro preview`, take screenshots of each changed page type at **360, 880 and 1440 px** (use the `run` skill or Playwright with `/opt/pw-browsers/chromium`; set the proxy from `HTTPS_PROXY` so external images load), and check for horizontal overflow. Capture sections one at a time: full-page shots of long pages are unreadable.
Look at the rendered result as a visitor would, and compare it with the design reference (`Mangroves Guadeloupe (Detail landing v12).dc.html`) for the page types you touched.

If a check script misreports something (a false positive, or noise), fix the script in the same step. These checks are part of the project.

## 3. Review checklist (the same every time; skip items the step didn't touch)

**A. SEO and LLM-SEO** (judge the built HTML, not the source)
- Every route is a real URL with complete HTML: title (≤ 65 characters, pattern from `project.md` §6), meta description (≤ 155, the page's opening answer), canonical, Open Graph, `lang="fr"`.
- One `h1`; `h2` per section with a stable `id` (the anchors in `components.md`); semantic `dl`/`details`/`nav`/`figure`.
- JSON-LD parses, matches the visible content, and follows `project.md` §6 (no self-serving ratings).
- The first paragraph of a page answers the query in one self-contained sentence (who, where, how, price with its date), so an AI assistant can quote it alone.
- Internal linking: no links to unbuilt routes (or they are a tracked open loop); breadcrumbs; links between related pages.
- Crawl surface: `robots.txt`, sitemap, `llms.txt`, 404 page, and a canonical origin set through `SITE_URL`.

**B. Design system and atomic design**
- Tokens and text styles only (`check-source.sh` clean, or every exception documented as a tier-3 local or a proposed token).
- Levels respected: atoms don't contain atoms, a level imports only from the levels below it, only pages and `src/lib` read data.
- Reuse: no near-duplicate components or CSS blocks. Every new component is registered in `docs/components.md`.
- Mobile first: base CSS at 360 px, only `min-width` queries at 600/880/1180, no layout decided in JavaScript.

**C. Rendering and performance**
- Static output; JavaScript only for interactions; the page still works and reads correctly with JS disabled (check the key flows).
- Budget per page: JS+CSS ≤ 60 kB; the LCP image loads eagerly and every other image lazily; no layout shift from images (set width/height or aspect-ratio); fonts limited to the weights `CLAUDE.md` lists.
- Images: hotlinked third-party images are a known risk (availability, licences) and are tracked, not ignored.

**D. Accessibility**: 44 px targets, visible focus, keyboard path through menus, sheets, dialogs and carousels, labels on every control, alt text (empty for decorative images), contrast (`CLAUDE.md` definition of done), `prefers-reduced-motion`.

**E. Content and data integrity** (this project's biggest risk)
- Nothing invented: every fact, price, rating, review and partner claim traces to `data/`. Prices carry their date.
- Estimated or unverified values show `CautionNote`; the publish rule (`confidence ≠ "à vérifier"`) holds.
- Copy is French, in sentence case, uses the glossary terms (`project.md` §7), and keeps user-provided text verbatim.
- Photo credits and licences are shown; disclaimers are folded; the lead form doesn't claim to send anything.

**F. Code hygiene and security**: dead code or unused files, duplicated logic in `src/lib`, type errors, external links with `rel="noopener"`, no secrets, no stray debug output, dependencies justified.

**G. Docs drift**: `CLAUDE.md`, `README.md`, `docs/project.md` (routes, file map, open items) and `docs/components.md` describe what actually exists. A future session reading only these files must not be misled.

Add other areas only when the step actually touched them (for example, forms gain privacy and consent checks, deploy steps gain headers and redirects).

## 4. What you may fix directly, and what waits for the plan

**Fix now, and list each fix in the report:** a doc that contradicts the code, typos, a broken anchor or link to a page that exists, an obvious bug with a one-place fix and no design choice, a false positive in a check script, a missing entry in `docs/components.md`.

**Never fix silently; put these in the plan:** new tokens, sizes or colours; renames; URL changes; copy rewrites; partner claims (prices, ratings, authorisations); legal text; new dependencies; anything listed in `CLAUDE.md` under "Things to ask the user"; anything bigger than a few lines or touching several components.

When the fix is subjective, write 2–3 options, each with a one-line rationale, and recommend one.

## 5. Keep the memory files current

**`OPEN_LOOPS.md` (repo root) is the single tracker** for deferred work, pending decisions and known limitations. Create it if missing. On the first run, move the open items from `docs/project.md` §9 and `docs/review-final.md` §6 into it and leave a one-line pointer in their place. Don't duplicate items: update the existing one. Close an item by deleting it, with its ID mentioned in the commit message.

Format (keep it scannable):

```markdown
# Open loops
Last review: <short commit> (<date>)

## Decisions needed
- **OL-12 · Title in a few words** — Context: what and where (files, routes). Options: A / B (recommended: A, why). Blocks: what waits on it.

## To do
- **OL-07 · Title** — Context. Next step: concrete first action. Effort: S/M/L.

## Known limitations (accepted for now)
- **OL-03 · Title** — Why it's accepted, and when to revisit.
```

Each item must be self-contained: a session that starts cold, reading only this file and `CLAUDE.md`, can act on it.

**Lessons go in `CLAUDE.md` under "Lessons from previous steps".** Add only lessons that would change how the next step is done: a mistake to avoid, a pattern to repeat, or something the build prompt should have specified. Write each one as a rule, in one line. Keep at most 10: merge or delete old ones rather than appending.

## 6. Report (then stop)

Reply in this order, briefly:

1. **Verdict** in 2–3 lines: is the step sound, and what matters most.
2. **Fixed directly**: a list of each change, with its file.
3. **Audit**: one table, ordered P0 → P2, with no more than ~15 rows. Severity: **P0** = broken, wrong or invented content, or blocks indexing; **P1** = hurts users or SEO now, or breaks a `CLAUDE.md` rule; **P2** = polish. Columns: severity · area (A–G) · finding · evidence (file:line / page / command) · proposed fix.
4. **Phased fix plan**: as few phases as the findings need (usually 2–3), ordered by impact and dependency. For each phase: what it contains, why it comes at that point, and the effort (S < 1 h, M ≈ half a day, L > half a day).
5. **Decisions for the user**: the options from §4, each tied to a phase. Ask with the question tool when several are independent.
6. What changed in `OPEN_LOOPS.md` and `CLAUDE.md`.

Commit the direct fixes and the memory-file updates together ("Step review: …"). **Do not implement the plan until the user approves it.** After approval, work one phase at a time. At the end of each phase, re-run §2, update `OPEN_LOOPS.md`, and set `Last review:` to the new commit when the plan is done.
