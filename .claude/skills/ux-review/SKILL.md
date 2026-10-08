---
name: ux-review
description: Review the Mangroves Gwada site as a visitor uses it, against the project's own UX rules (CLAUDE.md, docs/design-system.md). Measures the rules a browser can check on the built pages (tap targets, one filled action per screen, contrast, focus, input size, font weights, emoji, folded disclaimers, prices with a visible date, horizontal scroll), then walks the key visitor tasks on a phone and on desktop, and delivers a prioritized list of findings with a fix plan, then STOPS for approval. Use when the user says "UX review", "check the UX", "is this page usable", after a UI change, or types /ux-review.
argument-hint: "[pages, e.g. / /mangrove/riviere-salee] [widths, e.g. 360,1440]"
---

# UX review

You look at the built site the way a visitor does, mostly on a phone, and judge it against this project's rules. You are not redesigning it.

- **The project's rules are the yardstick**, in this order: `CLAUDE.md` ("Non-negotiable rules", "Decided", "Definition of done"), `docs/design-system.md` (§0 ten rules, §5 layout, §7 states, §8 accessibility, §9 content), `docs/components.md`. Generic UX advice comes last, and you say when you use it.
- **Evidence, not taste.** Every finding names the page, the width, the element, and how you saw it (script output, screenshot, keyboard test). A finding you can't show is dropped.
- **Few and sharp.** Ten findings that change what a visitor does beat forty nits. Never propose a new token, colour, size or component as a fix without flagging it as a "Proposed addition" for the user (CLAUDE.md rule 3).

## 1. Scope

The pages given as arguments; otherwise one page per type: `/`, `/mangrove/riviere-salee`, `/ile/basse-terre`, `/idees`, one article under `/idees/`, `/guides/pascal`, `/comparatif`, `/404`. Widths: 360 and 1440 always; add 600, 880 or 1180 when a layout changes there.

## 2. Measure

```sh
npm run build
npx astro preview --port 4321 &                    # wait until curl -s localhost:4321 returns 200
node .claude/skills/ux-review/scripts/ux-check.mjs http://localhost:4321 360,880,1440 [paths…]
```

The script prints leads per page and width. Verify each lead on the page before reporting it, and fix the script in the same change when a lead is a false positive. A script that cries wolf stops being read.

| Lead | Rule | Usual verdict |
|---|---|---|
| `horizontal-scroll` | §5, definition of done | always a bug |
| `target-under-44px` | rule 5 | bug, unless a link inside running text |
| `input-under-16px` | rule 7 | bug (iOS zooms the page) |
| `several-filled-actions-per-screen` | rule 4: one loud thing per screen | design question: which one action should win |
| `contrast` / `text-uses-opacity` | definition of done, §3.1 | bug |
| `no-visible-focus` | §7 | bug |
| `font-weight-not-400-600` / `italic-outside-quote` / `bold-label` | rule 6 | bug |
| `emoji` | rule 9 | bug, unless an allowed glyph (§6: ↗ ▶) |
| `details-open-on-load` | rule 8 | bug for disclaimers and alerts |
| `price-without-visible-date` | rule 10, §9 | bug: the date must be readable next to the price, not only in a fold |
| `img-without-alt`, `lang`, `h1-count` | rule 7 | bug |

## 3. Look and use

Screenshots with Playwright (`/opt/pw-browsers/chromium`; no proxy for localhost, `HTTPS_PROXY` for the live site). Scroll with `behavior: 'instant'`: smooth scrolling captures mid-scroll frames that look like layout bugs. Capture one screen at a time, never a full page.

1. **First screen, 360 × 800, every page type.** Without scrolling, can the visitor tell: what this page is, that the mangrove is free to visit, how to get there (on foot or from the water), and what to do next? Is there exactly one obvious next step?
2. **The visitor tasks**, each on a phone first, then at 1440. Count taps and note every hesitation:
   - *Find a mangrove*: home → search or filters → a result → its page. Do filter counts, the empty state ("Tout effacer") and the back path work?
   - *Decide free or guided*: on a site page, is the free option as clear as the guided one (access framing, `CLAUDE.md` "Decided")? Is the guided price dated and the guide named once, without repetition?
   - *Book a guide*: from a site page to the operator's site. Is the booking action the single loud element, does it say where it goes, does the link carry UTM tags?
   - *Read and trust*: are unverified facts marked "à confirmer", sources reachable, disclaimers folded but findable?
   - *Keyboard only*: Tab through the header menu, filters sheet, carousel, lightbox and FAQ. Is focus always visible, does Escape close what opened, does focus return where it was?
3. **States**: hover only with a pointer, active, disabled, selected, expanded, empty, and the page with JavaScript off (the key content must still read).
4. **Consistency**: the same thing looks and is named the same everywhere (site card, guide names, "Gratuit", price wording, button labels in French sentence case, domain words from `docs/project.md` §7).

## 4. What you may fix directly

**Fix now and list each fix:** a false positive in `ux-check.mjs`; a missing `aria-label`, `alt` or label; a focus ring that a rule removed; a tap target made too small by padding, when the fix uses existing tokens; a doc in `docs/components.md` that contradicts the component.

**Plan only, never silently:** anything that changes the layout, the visual hierarchy, a component's API, copy, prices or partner claims, or needs a new token or style; anything under "Things to ask the user" in `CLAUDE.md`. When a fix is a design choice, give 2–3 options with a one-line reason each, and recommend one.

## 5. Report, then stop

1. **Verdict** (2–3 lines): can a visitor on a phone do the four tasks without help, and what hurts most.
2. **Fixed directly**: each change with its file.
3. **Findings**: one table, ordered P0 → P2, at most ~15 rows. **P0** blocks a task or misleads (wrong price, broken flow, unreachable by keyboard); **P1** breaks a `CLAUDE.md` rule or slows a task; **P2** polish. Columns: severity · page @ width · finding · evidence · proposed fix.
4. **Fix plan**: as few phases as needed, by impact; effort S/M/L each.
5. **Decisions for the user**: the design questions, with options; ask with the question tool when there are several.
6. Add deferred items to `OPEN_LOOPS.md` (the single tracker; update an existing item rather than adding a duplicate).

Commit the direct fixes ("UX review: …"). **Do not implement the plan until the user approves it.** After each approved phase, re-run §2 and re-check the screens the phase touched.
