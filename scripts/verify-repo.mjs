import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const errors = [];
const warnings = [];
const required = [
  'README.md', 'package.json', 'package-lock.json', 'index.html',
  'src/main.tsx', 'src/App.tsx', 'src/contracts/scene.ts',
  'docs/CONTRACTS.md', 'docs/FILE_OWNERSHIP.md',
  'docs/ASSET_CREDITS.md', 'docs/REPOSITORY_CHECKLIST.md'
];
for (const item of required) if (!existsSync(item)) errors.push(`Missing required repository item: ${item}`);

let manifest = null;
try { manifest = JSON.parse(readFileSync('package.json', 'utf8')); }
catch { errors.push('package.json is not valid JSON'); }

if (existsSync('package-lock.json') && manifest) {
  try {
    const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
    if (lock.lockfileVersion !== 3) errors.push('Expected npm lockfile v3');
    const root = lock.packages?.[''];
    if (!root) errors.push('Lockfile root package entry missing');
    for (const kind of ['dependencies', 'devDependencies']) {
      const a = manifest[kind] ?? {};
      const b = root?.[kind] ?? {};
      if (JSON.stringify(a, Object.keys(a).sort()) !== JSON.stringify(b, Object.keys(b).sort())) {
        errors.push(`Lockfile root ${kind} differs from package.json`);
      }
      for (const dep of Object.keys(a)) {
        if (!lock.packages?.[`node_modules/${dep}`]) errors.push(`Lockfile missing entry for ${dep}`);
      }
    }
  } catch { errors.push('package-lock.json is not valid JSON'); }
}

const git = spawnSync('git', ['ls-files', '-z'], { encoding: 'utf8' });
if (git.status !== 0) warnings.push('Git list unavailable — tracked-file review not executed');
else {
  const tracked = git.stdout.split('\0').filter(Boolean);
  const banned = /(^|\/)(node_modules|dist|coverage|\.cache)(\/|$)|^(records|local-records|private|user-data)\/|(^|\/)\.env(?:\.|$)|\.(?:pem|p12|pfx|key|secret|sqlite|sqlite3|db)$/i;
  for (const path of tracked) if (banned.test(path)) errors.push(`Unsafe tracked path: ${path}`);
  if (existsSync('package-lock.json') && !tracked.includes('package-lock.json')) {
    errors.push('package-lock.json exists but is not Git-tracked');
  }
  if (existsSync('package-lock.json')) {
    const committedLock = spawnSync('git', ['cat-file', '-e', 'HEAD:package-lock.json']);
    if (committedLock.status !== 0) errors.push('package-lock.json has not been committed to HEAD');
  }
  const dirty = spawnSync('git', ['status', '--porcelain'], { encoding: 'utf8' });
  if (dirty.status === 0 && dirty.stdout.trim()) errors.push('Git working tree is not clean');
}

for (const line of errors) console.error(`FAIL ${line}`);
for (const line of warnings) console.warn(`WARN ${line}`);
if (errors.length) {
  console.error(`Repository gate FAIL (${errors.length} issue(s)); do not publish/submit.`);
  process.exitCode = 1;
} else {
  console.log('Repository structural gate PASS (does not replace npm ci, build, browser or secret-history reviews).');
}
