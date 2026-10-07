#!/usr/bin/env sh
# Design-system rule checks on the source (CLAUDE.md rules 1, 2, 5, 9). Prints offending lines; empty = clean.
# Usage: sh .claude/skills/step-review/scripts/check-source.sh [srcDir=src]
SRC="${1:-src}"
section() { printf '\n== %s\n' "$1"; }
section "Raw colours (hex/rgb) outside design-system/"
grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(" "$SRC" --include=*.astro --include=*.css | grep -vE "href=\"#|'#|\"#[a-z]" 
section "Palette tokens used in components"
grep -rn "\-\-palette-" "$SRC"
section "Hand-set type (font-size/family/weight/line-height/letter-spacing)"
grep -rnE "font-(size|family|weight)\s*:|line-height\s*:|letter-spacing\s*:" "$SRC" --include=*.astro --include=*.css
section "Raw z-index / shadows"
grep -rnE "z-index:\s*[0-9]|box-shadow:\s*[0-9]" "$SRC"
section "max-width media queries / off-scale breakpoints"
grep -rnP "@media[^{]*(max-width|min-width:\s*(?!600px|880px|1180px)\d+px)" "$SRC"
section "Raw px values (review: allowed only as documented tier-3 locals)"
grep -rnE "[^-a-z(][0-9]{2,3}px" "$SRC" --include=*.astro | grep -vE "@media|minmax|--[a-z-]+: [0-9]+px" | grep -oE "^[^:]+:[0-9]+:|[0-9]{2,3}px" | paste -sd" " | sed "s/ \([^ ]*:[0-9]*:\)/\n\1/g" | sort | uniq -c | sort -rn | head -20
section "Emoji in source"
LC_ALL=C.UTF-8 grep -rnP "[\x{1F300}-\x{1FAFF}]" "$SRC" | head
section "Data read outside the data layer (only src/lib/data.ts may import data/)"
grep -rn "data/" "$SRC" --include=*.astro --include=*.ts | grep -E "import .*['\"].*data/" | grep -v "src/lib/data.ts"
