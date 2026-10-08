// UX rules measured in a real browser on the built site (CLAUDE.md "Non-negotiable rules", docs/design-system.md §0, §5, §7, §8, §9).
// Usage: node ux-check.mjs [baseUrl] [widths] [paths...]
//   node ux-check.mjs http://localhost:4321 360,880,1440 / /mangrove/riviere-salee
// Prints findings grouped by page and width; exit code 0 always (it informs a review, it doesn't gate a build).
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

// Playwright is not a project dependency (it would slow Cloudflare builds): use the project's copy if any, else the global one.
const { chromium } = await import('playwright').catch(() =>
  createRequire(execSync('npm root -g').toString().trim() + '/').call(null, 'playwright'));

const [, , base = 'http://localhost:4321', widthArg = '360,880,1440', ...pathArgs] = process.argv;
const widths = widthArg.split(',').map(Number);
const paths = pathArgs.length ? pathArgs : ['/', '/mangrove/riviere-salee', '/ile/basse-terre', '/idees', '/guides/pascal', '/comparatif', '/404'];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  // A local preview must not go through the sandbox proxy; a remote site needs it. Photos may not load locally: the checks don't need them.
  ...(process.env.HTTPS_PROXY && !/localhost|127\.0\.0\.1/.test(base) ? { proxy: { server: process.env.HTTPS_PROXY } } : {}),
});

// Runs in the page. Returns { rule: [detail, …] }.
function audit() {
  const out = {};
  const add = (rule, detail) => (out[rule] ||= []).push(detail);
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 1 && r.height > 1 && cs.clip !== 'rect(0px, 0px, 0px, 0px)' && !el.closest('.sr-only, .visually-hidden') && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden], details:not([open]) > :not(summary)'); };
  const label = (el) => {
    const t = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || el.name || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    const cls = typeof el.className === 'string' ? el.className.split(' ').find((c) => c.includes('__') || c.includes('-')) : '';
    return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''} "${t}"`;
  };
  const rgb = (s) => { const m = s.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; };
  const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  // Effective background: first ancestor with an opaque fill; null when a photo is behind (can't judge).
  const bgOf = (el) => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== 'none' && !cs.backgroundImage.startsWith('linear')) return null;
      const c = rgb(cs.backgroundColor);
      if ((c[3] ?? 1) >= 0.95) return c;
      if ((c[3] ?? 1) > 0.05) return null; // translucent chip over something: can't judge
      if (n.parentElement && [...n.parentElement.children].some((s) => s !== n && (s.matches('img, picture') || s.querySelector?.('img, picture')) && getComputedStyle(s).position === 'absolute')) return null;
    }
    return rgb(getComputedStyle(document.body).backgroundColor);
  };
  const pageBg = rgb(getComputedStyle(document.body).backgroundColor);

  // Horizontal scroll (§5).
  if (document.documentElement.scrollWidth > innerWidth + 1) add('horizontal-scroll', `page is ${document.documentElement.scrollWidth}px wide at ${innerWidth}px`);

  // Tap targets ≥ 44 px (rule 5). Links inside running text are exempt (WCAG 2.5.8 inline exception).
  const interactive = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [tabindex]:not([tabindex="-1"])')].filter(visible);
  for (const el of interactive) {
    if (el.tagName === 'A' && el.closest('p, li, dd, td, figcaption, .text-legal, .text-caption') && getComputedStyle(el).display === 'inline') continue;
    if (el.matches('input[type=radio], input[type=checkbox]') && el.closest('label')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 44 || r.height < 44) add('target-under-44px', `${label(el)} ${Math.round(r.width)}×${Math.round(r.height)}`);
  }

  // Inputs ≥ 16 px (no iOS zoom).
  for (const el of document.querySelectorAll('input:not([type=hidden]):not([type=radio]):not([type=checkbox]), select, textarea')) {
    if (visible(el) && parseFloat(getComputedStyle(el).fontSize) < 16) add('input-under-16px', label(el));
  }

  // One filled (loud) button per viewport (rule 4). "Filled" = an action whose fill stands out from the page (≥ 3:1).
  const actions = [...document.querySelectorAll('a[href], button, a[href] span')].filter(visible).filter((el) => {
    const cs = getComputedStyle(el); const c = rgb(cs.backgroundColor);
    return (c[3] ?? 1) >= 0.95 && ratio(c, pageBg) >= 3 && !el.closest('[aria-hidden="true"]') && (el.textContent || '').trim().length > 1 && (el.textContent || '').trim().length <= 40 && !el.querySelector('img');
  }).filter((el, _, all) => !all.some((o) => o !== el && o.contains(el)));
  const H = innerHeight;
  const byScreen = {};
  for (const el of actions) { if (getComputedStyle(el).position === 'fixed' || getComputedStyle(el).position === 'sticky') continue; const y = el.getBoundingClientRect().top + scrollY; (byScreen[Math.floor(y / H)] ||= []).push((el.textContent || '').replace(/\s+/g, ' ').trim()); }
  for (const [i, xs] of Object.entries(byScreen)) if (xs.length > 1) add('several-filled-actions-per-screen', `screen ${+i + 1}: ${xs.length} (${[...new Set(xs)].slice(0, 4).join(' | ')})`);

  // Text contrast 4.5:1, or 3:1 for large text (CLAUDE.md definition of done).
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t; (t = walker.nextNode());) {
    const el = t.parentElement; if (!el || !t.textContent.trim() || seen.has(el) || !visible(el) || el.closest('svg, script, style')) continue;
    seen.add(el);
    const cs = getComputedStyle(el); const bg = bgOf(el); if (!bg) continue;
    const fg = rgb(cs.color); if ((fg[3] ?? 1) < 1) { add('text-uses-opacity', label(el)); continue; }
    const size = parseFloat(cs.fontSize); const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 600);
    const r = ratio(fg, bg); if (r < (large ? 3 : 4.5)) add('contrast', `${label(el)} ${r.toFixed(2)}:1`);
  }

  // Focus ring present on the first 40 focusable elements (§7). Checked by the caller through keyboard; here: outline removed without replacement.
  // (see focusCheck below)

  // Fonts: two weights only, italic only for text-quote (rule 6).
  for (const el of seen) {
    const cs = getComputedStyle(el);
    if (!['400', '600'].includes(cs.fontWeight)) add('font-weight-not-400-600', `${label(el)} ${cs.fontWeight}`);
    if (cs.fontStyle === 'italic' && !el.closest('.text-quote')) add('italic-outside-quote', label(el));
  }

  // Emoji (rule 9).
  // ↗ and ▶ are allowed text glyphs (design-system §6); © ® ™ and arrows are typography, not emoji.
  const emoji = document.body.innerText.match(/\p{Extended_Pictographic}/gu)?.filter((c) => !'↗▶©®™↔↕→←'.includes(c));
  if (emoji?.length) add('emoji', [...new Set(emoji)].join(' '));

  // Photos have alt (rule 7); decorative ones use alt="".
  for (const img of document.querySelectorAll('img')) if (!img.hasAttribute('alt')) add('img-without-alt', img.src.slice(0, 80));

  // Prices carry their date (rule 10): a page that shows "€" must also say when prices were checked.
  const text = document.body.innerText;
  const prices = text.match(/\d[\d\s ]*€/g) || [];
  if (prices.length && !/(relevé|relevés)\s+en\s+\p{L}+\s+\d{4}/iu.test(text)) add('price-without-visible-date', `${prices.length} visible price(s), no visible "relevé(s) en <mois> <année>" (a date inside a closed fold doesn't count)`);

  // Disclaimers and alerts folded by default (rule 8).
  // The FAQ may open its first answer; the rule covers disclaimers and alerts.
  for (const d of document.querySelectorAll('details[open]:not([class*=faq])')) add('details-open-on-load', label(d.querySelector('summary') || d));

  // Labels never bold (rule 6): form labels and fact/stat labels.
  for (const el of document.querySelectorAll('label, dt')) if (visible(el) && +getComputedStyle(el).fontWeight >= 600 && !el.querySelector('input, select, textarea')) add('bold-label', label(el));

  // One h1 and lang="fr" (rule 7).
  if (document.documentElement.lang !== 'fr') add('lang', `lang="${document.documentElement.lang}"`);
  const h1 = document.querySelectorAll('h1').length; if (h1 !== 1) add('h1-count', String(h1));
  return out;
}

async function focusCheck(page) {
  const misses = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const el = document.activeElement; if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const has = (n) => { const c = getComputedStyle(n); return (c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0) || c.boxShadow !== 'none'; };
      // The ring may sit on a wrapper (:focus-within), e.g. the search field.
      const ring = has(el) || (el.parentElement && has(el.parentElement)) || (el.parentElement?.parentElement && has(el.parentElement.parentElement));
      return ring ? 'ok' : `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40)}"`;
    });
    if (r === null) break;
    if (r !== 'ok') misses.push(r);
  }
  return misses;
}

let total = 0;
for (const path of paths) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    const res = await page.goto(base + path, { waitUntil: 'networkidle', timeout: 45000 }).catch((e) => ({ status: () => e.message }));
    const status = typeof res?.status === 'function' ? res.status() : 0;
    if (status !== 200 && !(path === '/404' && status === 404)) {
      console.log(`\n== ${path} @ ${width}px  NOT LOADED (status ${status}): is \`npx astro preview\` running on ${base}?`);
      await page.close(); continue;
    }
    const found = await page.evaluate(audit);
    const focus = await focusCheck(page);
    if (focus.length) found['no-visible-focus'] = focus;
    const rules = Object.keys(found);
    console.log(`\n== ${path} @ ${width}px${rules.length ? '' : '  clean'}`);
    for (const rule of rules) {
      const xs = [...new Set(found[rule])];
      total += xs.length;
      console.log(`  ${rule} (${xs.length})`);
      for (const x of xs.slice(0, 6)) console.log(`    - ${x}`);
      if (xs.length > 6) console.log(`    … ${xs.length - 6} more`);
    }
    await page.close();
  }
}
await browser.close();
console.log(`\n${total} finding(s). Each is a lead to verify on the page, not a verdict.`);
