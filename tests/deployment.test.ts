import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { scenes } from '../src/content/scenes/index.ts';

const publish = [
  'index.html', 'favicon.ico', 'favicon.svg',
  'scenes/bus-training-01/base.png',
  'scenes/bus-training-01/pedestrian-emerges.png',
  'scenes/unfamiliar-blocked-01/base.png',
  'scenes/matched-clear-01/base.png',
  'assets/index-test.js', 'assets/index-test.css',
];
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'blindspot-static-'));
  for (const file of [...publish, 'scenes/README.md', 'scenes/unfamiliar-blocked-01/van-shadow-layer.png']) {
    const target=join(root,file);
    mkdirSync(dirname(target), {recursive:true});
    writeFileSync(target, file==='index.html' ? '<html><body>test</body></html>' : 'dummy');
  }
  return root;
}
const gate = (root:string) => spawnSync(process.execPath, ['scripts/prepare-static.mjs', root], { encoding:'utf8' });

test('static deploy removes source-only layer and README but retains runtime scene files', () => {
  const root = fixture();
  try {
    const result = gate(root);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(!existsSync(join(root,'scenes/README.md')));
    assert.ok(!existsSync(join(root,'scenes/unfamiliar-blocked-01/van-shadow-layer.png')));
    for (const file of publish) assert.ok(existsSync(join(root,file)), file);
  } finally { rmSync(root, {recursive:true,force:true}); }
});

test('static deploy rejects unknown data and missing required runtime images', () => {
  const root = fixture();
  try {
    writeFileSync(join(root,'records.csv'), 'personal-data-placeholder');
    assert.equal(gate(root).status,1);
    rmSync(join(root,'records.csv'));
    rmSync(join(root,'scenes/bus-training-01/base.png'));
    assert.equal(gate(root).status,1);
  } finally { rmSync(root, {recursive:true,force:true}); }
});

test('all scene images and icons resolve to bundled public paths at domain root', () => {
  const filepaths = scenes.flatMap(s => [s.base.src, ...s.continuations.flatMap(c => c.layers.map(layer => layer.image.src))]);
  for (const url of filepaths) {
    assert.match(url,/^\/scenes\/[A-Za-z0-9/_-]+\.png$/);
    assert.ok(existsSync(join('public',url.slice(1))),url);
  }
  assert.ok(existsSync('public/favicon.ico'));
  assert.ok(existsSync('public/favicon.svg'));
  const html = readFileSync('index.html','utf8');
  assert.match(html,/href="\/favicon.svg"/);
});

test('host configuration publishes only dist at a domain root', () => {
  const config=readFileSync('netlify.toml','utf8');
  assert.match(config,/publish\s*=\s*"dist"/);
  assert.match(config,/NODE_VERSION\s*=\s*"22\.16\.0"/);
  assert.match(config,/from\s*=\s*"\/\*"/);
  assert.match(config,/status\s*=\s*200/);
});
