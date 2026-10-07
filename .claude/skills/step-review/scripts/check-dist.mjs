// Mechanical checks on the BUILT site (what crawlers and AI assistants actually read).
// Usage: node .claude/skills/step-review/scripts/check-dist.mjs [distDir=dist]
// No dependencies: regex-level parsing is enough for our own generated HTML.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const dist = path.resolve(process.argv[2] || 'dist');
if (!fs.existsSync(dist)) { console.error(`No ${dist}: run the build first.`); process.exit(2); }

const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p); else files.push(p);
  }
})(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const exists = (urlPath) => {
  const clean = decodeURI(urlPath.split(/[?#]/)[0]).replace(/\/$/, '');
  const candidates = [clean || '/index', `${clean}.html`, `${clean}/index.html`].map((c) => path.join(dist, c === '/index' ? 'index.html' : c));
  return candidates.some((c) => fs.existsSync(c) && fs.statSync(c).isFile());
};

const issues = [];
const add = (file, level, msg) => issues.push({ file: path.relative(dist, file), level, msg });
const titles = new Map(), descs = new Map();
const brokenTargets = new Map();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const decode = (v) => v && v.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const get = (re) => decode((html.match(re) || [])[1]);
  const title = get(/<title>([^<]*)<\/title>/);
  const desc = get(/<meta name="description" content="([^"]*)"/);
  const canonical = get(/<link rel="canonical" href="([^"]*)"/);
  if (!/<html[^>]*lang="fr"/.test(html)) add(file, 'P1', 'missing lang="fr"');
  if (!title) add(file, 'P0', 'missing <title>'); else {
    if (title.length > 65) add(file, 'P2', `title ${title.length} chars (> 65): "${title}"`);
    titles.set(title, [...(titles.get(title) || []), file]);
  }
  if (!desc) add(file, 'P0', 'missing meta description'); else {
    if (desc.length > 160) add(file, 'P2', `description ${desc.length} chars (> 160)`);
    descs.set(desc, [...(descs.get(desc) || []), file]);
  }
  if (!canonical) add(file, 'P1', 'missing canonical');
  else if (/localhost/.test(canonical)) add(file, 'P1', 'canonical/JSON-LD URLs point to localhost (build with SITE_URL)');
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) add(file, 'info', 'noindex');

  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) add(file, 'P0', `${h1} <h1> (expected 1)`);
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  levels.forEach((l, i) => { if (i && l > levels[i - 1] + 1) add(file, 'P2', `heading jumps h${levels[i - 1]} → h${l}`); });

  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { add(file, 'P0', 'invalid JSON-LD block'); }
  }
  if (!/application\/ld\+json/.test(html)) add(file, 'P2', 'no JSON-LD');

  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt(=|[\s>\/])/.test(m[0])) add(file, 'P1', `<img> without alt: ${m[0].slice(0, 90)}`);
  for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) if (!/rel="[^"]*noopener/.test(m[0])) add(file, 'P2', `target=_blank without rel=noopener: ${m[0].slice(0, 90)}`);

  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith('#')) { if (href.length > 1 && !ids.has(decodeURIComponent(href.slice(1)))) add(file, 'P1', `anchor ${href} has no target`); continue; }
    if (/^(https?:|mailto:|tel:|\/\/)/.test(href)) continue;
    if (href.startsWith('/') && !exists(href)) brokenTargets.set(href, (brokenTargets.get(href) || 0) + 1);
  }
}

for (const [t, f] of titles) if (f.length > 1) add(f[0], 'P1', `duplicate title on ${f.length} pages: "${t}"`);
for (const [d, f] of descs) if (f.length > 1) add(f[0], 'P1', `duplicate description on ${f.length} pages`);
if (brokenTargets.size) {
  // One line per section (/idees, /commune…) so a missing route family reads as one finding.
  const bySection = new Map();
  for (const [href] of brokenTargets) { const s = '/' + (href.split('/')[1] || ''); bySection.set(s, [...(bySection.get(s) || []), href]); }
  for (const [s, hrefs] of bySection) issues.push({ file: '(site)', level: 'P1', msg: `internal links to missing pages under ${s}: ${hrefs.length} target(s), e.g. ${hrefs[0]}` });
}
for (const need of ['robots.txt', 'sitemap-index.xml|sitemap.xml', '404.html', 'llms.txt', 'favicon.svg|favicon.ico']) {
  if (!need.split('|').some((n) => fs.existsSync(path.join(dist, n)))) issues.push({ file: '(site)', level: 'P2', msg: `missing ${need}` });
}

// Page weight: JavaScript and CSS shipped per page (inline + linked), gzipped = what is transferred.
const gz = (buf) => zlib.gzipSync(buf).length;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const inlineJs = [...html.matchAll(/<script(?![^>]*application\/(ld\+)?json)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[2]).join('');
  const linked = [...html.matchAll(/(?:src|href)="(\/_astro\/[^"]+\.(?:js|css))"/g)].map((m) => path.join(dist, m[1])).filter((f) => fs.existsSync(f));
  const total = gz(Buffer.from(inlineJs)) + linked.reduce((n, f) => n + gz(fs.readFileSync(f)), 0);
  if (total > 50_000) add(file, 'P2', `JS+CSS ${total / 1000 | 0} kB gzipped (budget 50 kB)`);
}

const order = { P0: 0, P1: 1, P2: 2, info: 3 };
issues.sort((a, b) => order[a.level] - order[b.level] || a.file.localeCompare(b.file));
// Collapse identical messages across pages so the report stays short.
const grouped = new Map();
for (const i of issues) { const k = `${i.level}|${i.msg}`; grouped.set(k, [...(grouped.get(k) || []), i.file]); }
console.log(`Checked ${htmlFiles.length} HTML files in ${path.relative(process.cwd(), dist) || dist}`);
for (const [k, fs_] of grouped) { const [level, msg] = k.split('|'); console.log(`${level}  ${msg}${fs_.length > 1 ? `  [${fs_.length} pages, e.g. ${fs_[0]}]` : `  [${fs_[0]}]`}`); }
if (!issues.length) console.log('No issues found.');
process.exit(issues.some((i) => i.level === 'P0') ? 1 : 0);
