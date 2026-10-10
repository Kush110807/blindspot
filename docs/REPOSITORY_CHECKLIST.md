# GitHub repository readiness checklist (not yet authorised to publish)

## Status / blockers

- [x] Canonical Git repository and exact baseline history retained.
- [x] GitHub-quality README documents commands, scope, limitations, review and asset credit.
- [x] Tracked-files exclusion rules cover dependencies/build outputs, credentials and local records.
- [x] Foundation status page and contract tests exist.
- [ ] **Genuine npm-generated `package-lock.json` committed.** npm registry not reachable from authoring sandbox (`EAI_AGAIN`).
- [ ] **Fresh `npm ci`, `npm run check`, `npm run verify:repo` passes on a network-capable machine.**
- [ ] Real browser confirmation of mounting, responsive layout and keyboard controls; screen evidence captured.
- [ ] Independent reviewer records accepted M1 SHA and authorises B/C handoffs.
- [ ] Future M2–M5 implementation, safety/content review and acceptance before event submission.
- [ ] Actual GitHub repository created and pushed **only when the owner authorises publication**.
- [ ] Actual coding-phase form reviewed; correct repository URL entered **only when submission is authorised**.

## On a connected Windows/macOS/Linux machine

Run from the extracted folder containing `.git` and `package.json`:

```bash
node --version
npm --version
npm install --package-lock-only
npm ci
npm run test
npm run typecheck
npm run build
npm run dev
```

Check `http://localhost:5173` in a real browser. For a phone check, use a reachable local-network address or remote debugging, not `localhost` on a different device. `npm run dev` binds to `0.0.0.0` to enable local-network testing; **do not expose the dev server to the public Internet**.

After reviewing `package-lock.json` and recording check results, commit the lockfile, then verify that the Git working tree is clean:

```bash
git status --short
git add package-lock.json
git commit -m "Lock verified npm dependencies"
git rev-parse HEAD
npm run verify:repo
```

Record the new exact commit ID in the handoff report. If `npm ci` or the build fails, **fix it and retest** before declaring M1 accepted. Do not construct `package-lock.json` by hand, copy another project's lock or claim installation succeeded because independent unit tests pass.

## Repository hygiene before any eventual GitHub push

```bash
git status --short
git ls-files
npm run verify:repo
```

Verify that `.env*`, API keys, passwords, user/learner records, real-world location/identity data, `node_modules/`, `dist/`, `.sqlite`, `.db`, local recordings and temporary ZIPs are absent from *the entire history*. `.gitignore` only affects untracked files; if a secret was ever committed, rewrite the history and rotate it before publishing.

GitHub steps **for later, after explicit user approval**: create repository with desired visibility; set `origin`; push the accepted branch; confirm the public/private visibility satisfies the event form; check README renders and source/lock/assets exist. No remote is configured and no push has been performed in this handoff. A repository link cannot be truthfully supplied before those steps.

## Later scene/asset checklist

Future scenes must ship their actual authored images and post-lock overlay assets under `public/scenes/`; verify natural dimensions, attribution/permission ledger, no early-leak imagery and replay alignment. The CSS illustration in M1 is only a placeholder. A three-scene functional application is *not* proven by this foundation alone.
