# SEO and LLM SEO audit: destination detail page

- **Page audited:** `Mangroves Guadeloupe (Detail landing v5).dc.html`, route `#/mangrove/<slug>`
- **Reference sites:** Mangrove de Vieux-Bourg (Yalodé, kayak), Rivière Salée (Blue Lagoon, boat), Beautiran (no partner)
- **Date:** 30 Sept 2026. Nothing has been implemented.

## 0. Assumptions (not confirmed, stated so the audit could be finished in one pass)
- **Main target queries** are site + activity + place, e.g. "mangrove Vieux-Bourg", "kayak mangrove Morne-à-l'Eau", "Grand Cul-de-Sac Marin en kayak". I had no search-volume data. The volumes below are relative estimates, not measured.
- **Operator priorities:** Yalodé's priority is the kayak tour. Blue Lagoon's priority is the boat tour in the Grand Cul-de-Sac Marin. Both prefer direct bookings over resellers.
- **Production:** the site will go live on real URLs. Today it uses hash routes (see B1).
- **English:** there is no English version today. English is treated as a planned second layer.

---

## 1. Summary
The page offers good information for a visitor and has clean structure (1 H1, H2s that include the site name, visible FAQ, facts laid out as labelled data). Three problems block rankings and AI citations before content quality even matters:

1. **Search engines can't see it.**
   - Hash URLs (`#/mangrove/…`) mean all 21 sites share one URL.
   - The title, meta description and JSON-LD are added by JavaScript. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) mostly do not run JavaScript, so they see an empty shell.
2. **Content is thin and generic.**
   - 2 to 3 sentences per site.
   - FAQ answers are built from templates, so the same sentences appear on all 21 pages.
   - There are no "quand y aller", "que voir" or "peut-on y aller seul" answers, which is exactly what blogs and AI answers cover.
3. **The operator is presented without proof.** There's no explanation of why this guide is recommended, no mention of Parc national authorization, and no date on the prices. That weakens both trust and citability.

Where the page can realistically win: **site-level long-tail searches in French** (a specific mangrove + activity + commune), with **short factual answers that are dated and sourced**. Official sites win on authority. Resellers and blogs win on long general articles. None of them has an up-to-date, fact-dense page per mangrove site.

---

## 2. Competitive landscape (researched 30 Sept 2026)

**French searches: "kayak mangrove Vieux-Bourg / Grand Cul-de-Sac Marin"**
- **Operator sites:**
  - Yalodé: 4.9 rating from 1,880+ reviews (self-reported). Departures at 8:45 and 14:30 (sunset). Open to ages 3 and up.
  - Ti-Evasion (same port): 3 h, meeting at 8:45 / 13:45. The price quoted is old (page about 8 years old).
  - Tonic Kayak Club (same port).
- **Resellers:**
  - Ceetiz: 3 h 30, starts 9:00.
  - France-Voyage: 43 €, tour in FR/EN.
  - icigo, airvacances.
- **Blogs:**
  - piedsdanslesable (≈19 months old)
  - chouetteworld (≈7 months)
  - generationvoyage (≈10 months)
  - voyage-france-guadeloupe (≈1 month)
  - geedme (≈1.5 months)
  - cr-guadeloupe (≈3 months; best season Dec–May, go early in the morning)
- **Official and institutional:**
  - **Parc national:** rules for the Grand Cul-de-Sac Marin and the list of authorized operators. **Blue Lagoon is on the boat-tour list.** I could not confirm whether Yalodé is on the kayak list; the list was cut off.
  - Les Îles de Guadeloupe: the lagoon covers 15,000+ ha; lists islets closed to visitors.
  - Conservatoire du littoral.

**English searches: "Guadeloupe mangrove kayak tour"**
- Tripadvisor (Yalodé is listed), Ceetiz EN, travel blogs such as traveldifferently.org (tide matters; low tide can mean scraping on roots).
- Coverage in English is thinner and more generic, so it's a real opening for an English page per site.

**What they are ranked and cited for:**
- **Operators and resellers:** price, duration, departure time, what's included. This is the "ready to book" stage.
- **Blogs:** "how to visit", islets, wildlife, family-friendliness, comparison tables.
- **Official sites:** rules (landing on Îlet Blanc banned 15 Apr–30 Sept; Caret and Tête à l'Anglais closed; no anchoring), authorized operators, surface area.

**Where we can win**
- ✅ **"Mangrove de Vieux-Bourg" as a place** (commune + zone + how to visit + practical info + rules) in one factual page. Today this is spread across operator pages and blog posts.
- ✅ **"Kayak ou bateau" for a given site:** a neutral comparison. Operators can't make it credibly.
- ✅ **Up-to-date facts** (prices, departure times, rules) with a "vérifié le" date. Many competing pages are 2 to 8 years old.
- ❌ **"Grand Cul-de-Sac Marin"** as a head term: the Parc national, Îles de Guadeloupe and Wikipedia are unbeatable. Cite and link them instead.
- ❌ **Generic "mangrove Guadeloupe" or "kayak Guadeloupe":** long listicles and OTAs dominate. Leave these to the SEO guide pages.

---

## 3. Audit of what's there

### A. Search intent coverage
| Stage | Question | Covered? |
|---|---|---|
| Planning | What is it and where is it? | ✅ L'essentiel, hero, Accès |
| Planning | How do I visit (guided or not)? | ✅ Comment la visiter |
| Planning | How long? | ⚠️ "Demi-journée" is vague; the operator gives "≈ 3 h" |
| Planning | When to go (time of day, season, tide)? | ❌ One generic FAQ answer only |
| Planning | What will I see (wildlife, palétuviers)? | ❌ Missing. The "oiseaux" flag isn't explained. |
| Planning | With kids? Minimum age? | ⚠️ "Adapté" without an age; Yalodé says 3+ |
| Planning | Can I go without a guide? Rules? | ⚠️ Generic protection text, no Parc rules |
| Planning | What else nearby (plage de Babin, trail)? | ⚠️ Nearby mangroves only |
| Booking | Price | ✅ (but not dated) |
| Booking | Times, departure point | ⚠️ Inside a closed accordion |
| Booking | Weather, cancellation, languages | ❌ |
| Booking | What to bring / what's included | ✅ In an accordion |
| Booking | Why this guide? | ❌ |

- **Locals** (people living in Guadeloupe exploring their own mangroves): partly served (free access, trail), but nothing is aimed at them (weekend outing, school groups, off-season).
- **International visitors:** not served at all (French only).

### B. Technical SEO (blocking)
1. **Hash routes:** Google ignores the part after `#`, so all detail pages count as a single URL. → Use real URLs, e.g. `/mangroves/vieux-bourg-morne-a-l-eau/` (FR) and `/en/mangroves/vieux-bourg/` (EN).
2. **Content rendered only in the browser:** the title, meta, JSON-LD and text are all built by JavaScript. Google renders JavaScript late; most AI crawlers don't render it at all. → Pre-render or server-render every detail page.
3. **Missing:** `<link rel="canonical">`, `hreflang` fr/en/x-default, Open Graph / Twitter cards, `dateModified`. `<html lang="fr">` couldn't be confirmed.
4. **Hero images** render through `<image-slot>`, not a plain `<img>`, so they are probably invisible to image search. The grid does use `<img alt>`.

### C. Metadata
- **Title** (`{name} ({commune}) : visiter la mangrove en Guadeloupe`): it has the entity but not the activity people search for (kayak / bateau). "Mangrove" appears twice for sites whose name already contains it, and many titles run past 60 characters.
- **Meta description** = the site blurb, e.g. "Le point de départ des sorties kayak dans la mangrove de Morne-à-l'Eau." (≈70 characters). Too short: no duration, price or reason to click.

### D. Headings and semantics
- ✅ One H1 (site name). The H2s include the name. The operator heading is an H3.
- ⚠️ The H2s are labels ("en bref", "en images"), not questions. AI answers and "People also ask" favour headings that match the question ("Comment visiter… ?", "Quand y aller ?").
- ⚠️ There's no `<time>` element and no author or byline.

### E. Structured data
- **Current:** TouristAttraction, FAQPage, BreadcrumbList. What to fix:
  - `geo` is missing for most sites (`gps: null`, including Vieux-Bourg).
  - `touristType` holds visit modes ("en kayak"). It should describe audiences ("Familles", "Amateurs de nature").
  - `url`, `sameAs` (Wikipedia/Wikidata, Conservatoire page) and `containedInPlace` (Grand Cul-de-Sac Marin) are missing.
  - The breadcrumb `item` uses a hash URL.
  - `ImageObject` isn't used, even though `credit` and `license` are already in the data.
- **Missing:**
  - the operator as `LocalBusiness` / `TouristInformationCenter`
  - the tour as `TouristTrip` or `Product` + `Offer` (price, currency, `validFrom`)
  - `dateModified` on the page
- **Caution:**
  - Don't mark up the operator's rating as our own review. Google doesn't show star ratings for "self-serving" reviews, and this is effectively a partner page. Quote the reviews in plain text instead.
  - FAQ rich results have been limited to government and health sites since 2023. FAQPage markup is still worth keeping for AI engines, but don't expect stars or dropdowns in Google.

### F. Entity clarity
- **Three names, no clear relationship:** "Mangrove de Vieux-Bourg" (site), "Grand Cul-de-Sac Marin" (the lagoon/reserve) and "Morne-à-l'Eau" (commune) are never linked in one sentence. The official Conservatoire name "Mangrove de Vieux-Bourg à Petit-Canal" is buried in a fact.
- **Protection labels are unclear:** "Réserve naturelle" and "Parc national" appear as tags without saying which area has which status. The Parc national itself explains that its rules differ between core areas and adjacent areas.

### G. Depth and duplication
- Paragraphs: Vieux-Bourg ≈3 sentences, Rivière Salée 2.
- FAQ answers such as "Tôt le matin : il fait moins chaud…" and the "Faut-il un guide ?" text are the same on every site that shares an access type. That is duplicate content across 21 pages, and there's nothing an AI engine would pick as a distinctive quote.

### H. Extractability (quotable by AI engines)
- ✅ Facts laid out as label/value pairs, and the ✓ list.
- ❌ No **opening answer sentence** (one sentence that defines the site, locates it and says how to visit, with numbers).
- ❌ Numbers without units or sources (e.g. "Demi-journée" vs "3 h", "Adapté" vs "dès 3 ans").
- ❌ No "vérifié le" date. AI engines favour recent, dated facts.

### I. Internal linking
- ✅ Nearby mangroves and SEO guide links exist.
- ❌ No hub page for the zone (Grand Cul-de-Sac Marin) or the commune. The breadcrumb skips that level.
- ❌ SEO guide pages link to sites, but anchor text is the site name only, not "kayak à Vieux-Bourg".

### J. Trust (E-E-A-T)
- The sources section is a strength. Keep it.
- Missing:
  - who writes the page
  - why this guide is recommended (selection criteria)
  - whether he is authorized by the Parc national
  - a disclosure of the commercial relationship

  All of these affect trust for both Google and AI engines.

---

## 4. Menu of possible additions (pick what you want)
*Data column: **Existing** = built from data already shown; **New** = needs new information to be sourced. Effort: S = under half a day, M = 1–2 days, L = more.*

1. **Opening answer sentence at the top of L'essentiel.** One or two sentences: what the site is, where it is, how to visit, duration, price from, age from.
   - *Why:* the passage AI engines quote most often, and the direct answer for featured snippets.
   - *Effort:* S. *Data:* Existing.
2. **"Le site en chiffres"** (surface area, zone, protection status, distance from the departure point, tour duration, minimum age), each with a unit and its source.
   - *Why:* quotable figures; entity clarity.
   - *Effort:* S. *Data:* mostly Existing; the zone surface area is New (official sources).
3. **"Quand y aller ?"** Best time of day, dry season (Dec–May), hurricane season, the sunset departure, whether tides matter at this site.
   - *Why:* a heavily searched planning question, missing today.
   - *Effort:* M. *Data:* departure times Existing; season and tide New.
4. **"Que voir ?" Wildlife and plants specific to the site** (palétuviers rouges, pélicans, hérons, crabes, fish nurseries…).
   - *Why:* makes each page unique, and it's the heart of what blogs publish.
   - *Effort:* M. *Data:* New (Parc national / Conservatoire, or the guide).
5. **"Peut-on y aller sans guide ?"** An honest answer plus the Parc rules (no landing, no anchoring, dated islet closures) and a link to the official list of authorized operators.
   - *Why:* real value, trust, and a natural lead-in to the guide.
   - *Effort:* S–M. *Data:* New (official, dated 2025–2026).
6. **"Kayak ou bateau ?" on the site page** (sites with both operators, or kayak vs boat in the same zone): rhythm, what you see, group size, swimming, price.
   - *Why:* a strong comparison search; neutral angle.
   - *Effort:* S–M. *Data:* Existing (comparison page).
7. **"Prix et horaires" block with "vérifié le {date}"**: price per adult and child, departure times, duration, meeting point, what happens if the weather is bad.
   - *Why:* a complete answer for visitors ready to book; freshness signal.
   - *Effort:* S. *Data:* Existing (operator practical info) + New for cancellation and languages.
8. **"Pourquoi on recommande {guide}"**: 3 criteria (e.g. state-certified, Parc authorization, small groups), plus a transparent disclosure line.
   - *Why:* trust; the recommendation reads as earned.
   - *Effort:* S. *Data:* partly Existing; Parc authorization New (to verify).
9. **Guide portrait**: real photo, years active, a 1–2 sentence quote in the first person ("Ce que je préfère montrer…").
   - *Why:* puts a person behind the offer; the most persuasive element for leads.
   - *Effort:* M. *Data:* New (a short interview).
10. **Precise departure point and map**: address, GPS, parking, a static map image.
    - *Why:* local intent, `geo` in the structured data, practical value.
    - *Effort:* M. *Data:* New (GPS is null for most sites).
11. **"À combiner sur place"**: plage de Babin, littoral trail, crab festival (March/April)…
    - *Why:* planning value; more place names Google recognises.
    - *Effort:* M. *Data:* partly Existing (Rando Guadeloupe source); the rest New.
12. **Site-specific FAQ** replacing the template: price, age, swimming, beginners, rain, languages, what to bring.
    - *Why:* removes the cross-page duplication; matches real searches.
    - *Effort:* S–M. *Data:* mostly Existing (operator data).
13. **Summary of reviews** (2–3 quotes + source + date, linking to Tripadvisor/Google).
    - *Why:* social proof without self-serving markup.
    - *Effort:* S. *Data:* Existing (quotes) + source links New.
14. **English version per site** (full translation, not machine-literal; see §6).
    - *Why:* a clear gap in the English results.
    - *Effort:* L. *Data:* New (translation).
15. **Zone hub pages** (Grand Cul-de-Sac Marin, Petit Cul-de-Sac Marin) and commune pages.
    - *Why:* internal links, a breadcrumb level, a stronger topic cluster.
    - *Effort:* M–L. *Data:* Existing (site grouping).
16. **Signature + "Mis à jour le" + methodology page.**
    - *Why:* trust and freshness.
    - *Effort:* S. *Data:* New (small).
17. **Our own photos with credits and `ImageObject`.**
    - *Why:* image search, AI engines, and the Parc photo permission issue.
    - *Effort:* M. *Data:* New.
18. **Detailed accessibility**: minimum age, whether you need to swim, reduced mobility, sitting position in the kayak.
    - *Why:* family and senior visitors, and it helps visitors qualify themselves before booking.
    - *Effort:* S. *Data:* partly Existing.

---

## 5. Key recommendations

### (a) Value for the visitor
1. **Answer first:** start L'essentiel with the opening answer (menu 1). Example for Vieux-Bourg:
   > FR : « La mangrove de Vieux-Bourg borde le Grand Cul-de-Sac Marin, à Morne-à-l'Eau (Grande-Terre). Elle se visite surtout en kayak guidé, environ 3 h au départ du port de Vieux-Bourg, dès 38 € par adulte et dès 3 ans. »
   > EN: "The Vieux-Bourg mangrove lines the Grand Cul-de-Sac Marin lagoon in Morne-à-l'Eau, Grande-Terre. Most visitors explore it on a guided kayak tour of about 3 hours from Vieux-Bourg harbour, from €38 per adult, ages 3+."
2. **Replace vague values** with precise ones: "Demi-journée" → "≈ 3 h sur l'eau" / "about 3 hrs on the water"; "Adapté" → "Dès 3 ans" / "Ages 3+".
3. **Add "Quand y aller"** (menu 3) and **"Que voir"** (menu 4). These are the two biggest planning gaps.
4. **Answer "sans guide ?" honestly** (menu 5). This helps visitors even when they don't book, and earns trust.
5. **Date prices and rules** ("Tarifs vérifiés le 30/09/2026" / "Prices checked 30 Sept 2026").

### (b) SEO and LLM SEO
1. **Real URLs + pre-rendering + canonical + hreflang** (B1–B3). Nothing else will show results until this is done.
2. **Title and meta templates:**
   - FR title: `{Site} ({Commune}) : kayak, accès et infos pratiques` → e.g. "Mangrove de Vieux-Bourg (Morne-à-l'Eau) : kayak, accès, infos" (≤ 60 characters; adapt "kayak / bateau / à pied" to each site's activities).
   - FR meta: `Visiter {site}, {zone} : {mode} guidé ≈ {durée} dès {prix}, départ {lieu}. Accès, meilleure période, règles du Parc national.` (≤ 155 characters)
   - EN title: `{Site}, Guadeloupe: {kayak/boat} tours, access & tips`
   - EN meta: `How to visit {site} in {zone}: guided {kayak} tour ≈ {duration} from €{price}, departing {place}. Access, best time, park rules.`
3. **H2s phrased as questions, kept short on mobile:**
   - FR: « Comment visiter la mangrove de Vieux-Bourg ? », « Quand y aller ? », « Que voir ? », « Peut-on y aller sans guide ? », « Prix et horaires »
   - EN: "How to visit", "Best time to go", "What you'll see", "Can you go without a guide?", "Prices & times"
4. **Structured data:**
   - fill in `geo`, `url`, `sameAs`, `containedInPlace`, `dateModified`
   - use `ImageObject` with `creditText` and `license`
   - add `TouristTrip` + `Offer` for the tour and `LocalBusiness` for the operator
   - `touristType` → audiences
   - no star-rating markup
5. **Site-specific FAQ** (menu 12) to remove the duplication across the 21 pages.
6. **Keywords per site, French first:** site name + commune + activity + "mangrove"/"palétuviers"/"lagon"; the zone name as a supporting term. Variants actually used by competitors: "balade en kayak", "randonnée kayak", "sortie kayak", "excursion mangrove", "kayak de mer", "bateau à fond plat". In English: "mangrove kayak tour", "boat tour", "Grand Cul-de-Sac Marin lagoon", "Guadeloupe mangroves".
7. **Internal links:** zone hub pages (menu 15); descriptive anchor text from the guides ("kayak dans la mangrove de Vieux-Bourg"); breadcrumb `Mangroves › Grand Cul-de-Sac Marin › Vieux-Bourg`.
8. **Cite official sources in the text** (Parc national, Conservatoire, dated), not only in the sources section. AI engines give more weight to claims that sit next to a source.

### (c) Qualified leads for the guided boat and kayak tours
1. **Earn the call to action:** keep the guide after L'essentiel and "Quand/Que voir". The first booking link comes right after "Peut-on y aller sans guide ?" (the natural transition).
2. **Put a person forward** (menu 9): real photo, first name, years active, and a quote in the guide's own words in italics.
   - FR, to collect from the guide, e.g. « Ce que je préfère, c'est le moment où l'on passe sous les arches de palétuviers et où tout le monde se tait. »
   - EN: "My favourite moment is gliding under the mangrove arches, when everyone goes quiet."
3. **Let visitors qualify themselves:** "Pour qui / Pas pour vous si…" (FR) / "Great for / Not ideal if…" (EN): minimum age, effort level, need to swim, sun exposure, group size. This produces fewer but better leads, which suits a small operator.
4. **Transparency** (menu 8): « Nous recommandons {guide} parce que… Nous ne prenons pas de commission / Lien partenaire. » Adapt to the real commercial relationship.
5. **Low-effort next steps** besides "Réserver":
   - « Voir les créneaux » / "See available times"
   - « Poser une question à Pascal » (WhatsApp / e-mail) / "Ask Pascal a question"
   - « Sortie coucher de soleil » as a specific hook / "Sunset tour"
6. **Button wording:** "Réserver avec Pascal · dès 38 €" (FR) / "Book with Pascal · from €38" (EN). Avoid "Réservez maintenant !".
7. **Measure it:** UTM tags on every outgoing link (`utm_source=mangroves-gwada&utm_medium=detail&utm_campaign={slug}`) so the operator can see which bookings came from us.

---

## 6. Where SEO and visitor value conflict (which should win)
| Conflict | Winner | Why |
|---|---|---|
| Long, keyword-heavy H2s vs short mobile headings | **Visitor value** | Short question H2s with the site name once are enough. |
| Generic FAQ on every page for coverage vs site-specific answers only | **Visitor value** | Duplicated answers don't help rankings, and AI engines ignore them. |
| Chasing the head term "Grand Cul-de-Sac Marin" vs a clear site page | **Visitor value / focus** | Unrealistic against official sites; link to them instead. |
| Presenting the partner as "le meilleur" vs a neutral tone | **Neutral** | Neutrality gets us cited and trusted. Keep the Yalodé "meilleur endroit" claim as a quote from them. |
| Mentioning other authorized operators (e.g. Ti-Evasion at the same port) vs pushing only the partner | **Visitor value, with a minimal mention** | One neutral line plus a link to the official Parc list. Leaving them out makes the page look incomplete to visitors and AI engines. **This goes against the lead goal; please decide.** |
| Everything expanded for indexing vs accordions on mobile | **Both** | Keep accordions with the content always on the page (already done). |
| English machine translation for speed vs a real translation | **Real translation** | International visitors use different words ("mangrove kayak tour", "lagoon") and ask different questions (transport from Pointe-à-Pitre, tour language). |

---

## 7. Not verified and source dates
- **Search volumes and difficulty:** not measured (no keyword tool). Estimates only.
- **Yalodé on the Parc national kayak list:** not visible; the published list was cut off. Must be checked before claiming "prestataire autorisé". Blue Lagoon is on the boat list. Page consulted 30 Sept 2026; decrees dated 2025.
- **Yalodé figures:**
  - 4.9 / 1,880+ reviews, 8:45 / 14:30 departures, from age 3: all self-reported on its own site (current).
  - 38 € / 22 €: Petit Futé, a listing about 4 years old; this matches our data.
  - 43 €: a reseller price, which differs.
- **Ti-Evasion price:** from a page about 8 years old. Not reliable.
- **Best season Dec–May, early morning:** one blog (≈3 months old). Needs a second source before we publish it.
- **Tides:** one English blog about north-coast launches. Not confirmed for Vieux-Bourg.
- **Not checked in the build:** whether `<html lang>` is set, and whether `<image-slot>` hero images are indexable.
- **Parc national photos:** still need written permission (already noted in the database).
