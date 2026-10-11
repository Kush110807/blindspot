/** Release-only static output gate: whitelist deployed files, remove source-only assets.
 * Run after Vite builds dist/. Does not change the UI or the source artwork.
 */
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { resolve, relative, join, sep } from 'node:path';

const dist = resolve(process.argv[2] || 'dist');
const required = new Set([
  'index.html', 'favicon.ico', 'favicon.svg',
  'scenes/bus-training-01/base.png',
  'scenes/bus-training-01/pedestrian-emerges.png',
  'scenes/unfamiliar-blocked-01/base.png',
  'scenes/matched-clear-01/base.png',
]);
const sourceOnly = [
  'scenes/README.md',
  'scenes/unfamiliar-blocked-01/van-shadow-layer.png',
];
if (!existsSync(join(dist, 'index.html'))) {
  console.error(`Missing built index.html in ${dist}; run the Vite build first.`);
  process.exit(1);
}
for (const item of sourceOnly) {
  const path = join(dist, item);
  if (existsSync(path)) rmSync(path);
}
function listFiles(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap(ent => {
    const child = join(path, ent.name);
    if (ent.isSymbolicLink()) throw new Error(`Unexpected symlink in public output: ${child}`);
    return ent.isDirectory() ? listFiles(child) : [child];
  });
}
let files;
try { files = listFiles(dist).map(f => relative(dist, f).split(sep).join('/')); }
catch (err) { console.error(err); process.exit(1); }
const allowBundle = p => /^assets\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p);
const unexpected = files.filter(p => !required.has(p) && !allowBundle(p));
const missing = [...required].filter(p => !files.includes(p));
const jsCount = files.filter(p => /^assets\/[^/]+\.js$/.test(p)).length;
const cssCount = files.filter(p => /^assets\/[^/]+\.css$/.test(p)).length;
if (unexpected.length || missing.length || jsCount === 0 || cssCount === 0) {
  for (const p of unexpected) console.error(`Unexpected public file: ${p}`);
  for (const p of missing) console.error(`Missing required public file: ${p}`);
  if (jsCount === 0 || cssCount === 0) console.error('Missing production JS or CSS bundle');
  process.exit(1);
}
console.log(`Static publish gate PASS: ${files.length} allowlisted files; review layer and README excluded; no local records or credentials.`);
