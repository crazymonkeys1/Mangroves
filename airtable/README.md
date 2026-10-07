# Mangroves Gwada: Airtable base

17 CSV files, one per table. All the content from the site as of 29/09/2026: sites, photos, sources, operators, SEO guides and all interface text (hero, lead banner, comparison, footer).

## Import order

1. Create an empty base called "Mangroves Gwada".
2. Import each CSV as a new table (**Add or import → CSV**), in numeric order. Name the table after the file (e.g. `Sites`, `Images`).
3. After importing, set the field types listed below. Import everything as text first, then convert.
4. Convert the **link** fields last. Airtable matches the values (slugs / keys) against the primary field of the target table.

## Tables and fields

Legend: 🔑 primary field · 🔗 link · ☑ checkbox · ⬇ single select · ⬇⬇ multiple select · 📎 attachment · # number · ¶ long text · 🌐 URL

### 01 Sites (main table)
🔑 Slug · Name · ⬇ Status (Publié / Masqué) · ⬇ Confidence (vérifié / partiel / à vérifier) · ⬇ Island · Commune · ⬇ Zone · ⬇⬇ Activities · ⬇ Difficulty · Duration · # Distance (km) · ⬇ Access · ☑ Kid friendly · ☑ Birdwatching · ☑ Photogenic · ☑ PMR accessible · ⬇⬇ Protection · 🔗 Operators → Operators · # Latitude · # Longitude · ¶ Blurb · ¶ Description (paragraphs separated by a blank line) · ¶ Key facts (one per line) · Photo status · ¶ Internal note · SEO title · ¶ SEO description · URL path

Suggested fields to add after import: **Images** (reverse link, created automatically), **Cover** (lookup of Images where Cover = ☑), **Nb photos** (count).

### 02 Images
🔑 Image ID · 🔗 Site → Sites · # Order · ☑ Cover · 📎 Attachment (Airtable downloads the image from the URL) · 🌐 Image URL · 🌐 Thumbnail URL · Caption · Credit · License · ⬇ Rights status (libre (CC) / autorisation requise / opérateur partenaire) · ⬇ Source name · 🌐 Source page · ⬇ Relevance (mangrove / contexte) · Note

### 03 Sources
🔑 Source ID · 🔗 Site → Sites · Label · 🌐 URL · ⬇ Type (officiel / office-tourisme / operateur / media)

### 04 Operators
🔑 Key · Name · Guide name · 📎 Guide photo · 🌐 Guide photo URL · Mode · Since · Brand color · Card background · Accent on dark · Credential · Tagline · Price · Price note · Meta line · Tour name · ¶ Tour summary · ¶ Guide blurb · ¶ Home intro (1st person) · Home label · ¶ Compare text · Compare ideal for · Rating · Rating (header) · ¶ Programme (one step per line) · ¶ Included · ¶ To bring · 🌐 Booking URL · 🌐 Website URL · 🌐 Contact URL · 🔗 Featured site → Sites · Emoji

### 05 Operator Features (the 3 cards in the "Le guide" tab)
🔑 Feature ID · 🔗 Operator · # Order · Icon · Title · Text

### 06 Operator Practical ("Pratique" tab)
🔑 Info ID · 🔗 Operator · # Order · Label · Value (empty = "Non renseigné")

### 07 Reviews
🔑 Review ID · 🔗 Operator · # Order · ¶ Quote · Author · ⬇ Source

### 08 Articles (SEO pages; renamed from "Guides" because an article is not linked to a guide)
🔑 Slug · # Order · Nav label · Footer label · Breadcrumb · SEO title · ¶ SEO description · H1 · ¶ Intro · ¶ Quick answers (one per line) · 🔗 Operators → Operators · Operator block title · Results title · Filter rule · 🔗 Related articles → Articles · URL path

### 09 Article Sections
🔑 Section ID · 🔗 Article → Articles · # Order · H2 · ¶ Paragraphs

### 10 Article FAQ
🔑 FAQ ID · 🔗 Article → Articles · # Order · Question · ¶ Answer

### 11 Compare Rows (Bateau ou kayak page)
🔑 Criterion · # Order · Boat · Blue Lagoon · Kayak · Yalodé

### 12 Tips ("Conseils" tab on detail pages)
🔑 Tip ID · # Order · Icon · ¶ Text

### 13 Hero Palettes
🔑 Key · Name · Overlay (CSS) · Accent · Accent text · ☑ Default

### 14 Islands
🔑 Name · Emoji · Color · ☑ Published

### 15 Site Copy (all interface text)
🔑 Key · ⬇ Page · ⬇ Section · ¶ Value · Notes. Change the text in Value without touching Key, which the site uses to find the text.

### 16 Reference Sources
🔑 Name · ⬇ Kind (Données / Photos) · # Rank · 🌐 URL · ¶ Use

### 17 Rejected Sites
🔑 Name · ¶ Reason

## Suggested views
- **Sites › Publiés**: Status = Publié, grouped by Island.
- **Sites › À compléter**: Confidence ≠ vérifié OR Photo status ≠ OK.
- **Images › Droits à obtenir**: Rights status = autorisation requise, grouped by Source name.
- **Images › Galerie**: Gallery view on Attachment.
- **Articles › SEO**: Grid view with SEO title, SEO description, H1.

## Editing rules
- **Slug / Key / ID**: never rename once published. They are used in URLs and links between tables.
- **Publishing**: only sites with Status = Publié appear on the site. Leaving Confidence = "à vérifier" hides the site.
- **Photos**: the first photo (Cover = ☑) is used on cards. On sites served by an operator, the operator's photos come first.
- **Placeholder photos**: the guide photos (Guide photo) are placeholder portraits and must be replaced.
