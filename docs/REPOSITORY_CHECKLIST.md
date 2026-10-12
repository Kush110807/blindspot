# GitHub repository readiness checklist

**Current release:** 2026-10-12 focused scene-progress, image-loading accessibility and neutral alt-text improvements on `7246c71`. The live demo URL is documented, not redeployed or verified by this source-only task. This project has **not** been published to GitHub through this handoff.

The original M1 integration workflow described later in this file is historical and must not be used as a fresh verification result.

# GitHub repository readiness checklist (not yet authorised to publish)

## Status / blockers

**Update 2026-10-10:** M1 accepted at `3bb4fff2c6ba5abcb0d16ae22766f3de91c3b47e`. Genuine npm lockfile is committed and Windows clean-install/build/desktop/375px browser-emulation evidence was independently reviewed. The checklist retains future integration/release work. This A-owned branch still requires independent runtime review and later B/C merges.

- [x] Canonical Git repository and exact baseline history retained.
- [x] GitHub-quality README documents commands, scope, limitations, review and asset credit.
- [x] Tracked-files exclusion rules cover dependencies/build outputs, credentials and local records.
- [x] Foundation status page and contract tests exist.
- [x] **Genuine npm-generated `package-lock.json` committed** in accepted M1 baseline; Vite pinned to `6.4.4`.
- [x] **Windows M1 `npm ci`, `npm run check`, `npm run verify:repo`** PASS per supplied evidence; must be repeated after A/B/C integration.
- [x] **M1 foundation desktop and 375px browser-emulated views** reviewed from Windows screenshots; new A/B/C application views and physical phone QA remain pending.
- [x] Independent reviewer accepted M1 SHA; A now explicitly releases B/C implementation.
- [ ] Future M2–M5 implementation, safety/content review and acceptance before event submission.
- [ ] Actual GitHub repository created and pushed **only when the owner authorises publication**.
- [ ] Actual coding-phase form reviewed; correct repository URL entered **only when submission is authorised**.

## On a connected Windows/macOS/Linux machine

See `docs/M1_REPAIR_VERIFICATION.md` for the ordered Windows-specific follow-up commands and handoff outputs.

Run from the extracted folder containing `.git` and `package.json`:

```bash
node --version
npm --version
npm ci
npm run test
npm run typecheck
npm run build
npm run dev
```

Check `http://localhost:5173` in a real browser. For a phone check, use a reachable local-network address or remote debugging, not `localhost` on a different device. `npm run dev` binds to `0.0.0.0` to enable local-network testing; **do not expose the dev server to the public Internet**.

After recording results, confirm the existing committed lockfile and Git tree remain clean (do not generate or commit a replacement unless dependencies are deliberately approved to change):

```bash
git status --short
git rev-parse HEAD
npm run verify:repo
```

Record the exact integration commit ID in the handoff report. If `npm ci` or the build fails after integration, **fix it and retest** before release. Do not construct `package-lock.json` by hand, copy another project's lock or claim installation succeeded because independent unit tests pass.

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
