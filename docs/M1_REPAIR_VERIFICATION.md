# BlindSpot M1 repair — verification and completion record

**Candidate only: M1 REPAIR REQUIRED until independent reviewer accepts a new SHA.** No M2 work, publication, learner scenes or submitted GitHub repo.

## Starting point and repairs

Starting commit (verified): `78062ec497303a0dcf764775febe9f20fb8c6406`.

- **BS-M1-01:** `currentEndingId`, `nextEnding`, `replayEndings` require matching `state.sceneId`, locked `sceneId`, `sceneVersion`, `schemaVersion`, training `purpose`. Invalid input returns `null` or the unchanged state.
- **BS-M1-02:** strict, nonempty `reviewerRef` and an actual valid `YYYY-MM-DD` reviewed date required before reviewed correctness classification. Otherwise explanations remain provisional, without a correctness verdict. Metadata is not proof of human review.
- **BS-M1-03:** base and layer assets share validation of both nonblank English and Hindi alt text, `Number.isFinite(width/height)`, and positive natural dimensions.
- **BS-M1-04:** supported Node/npm present but npm registry DNS unavailable (`EAI_AGAIN`). No genuine npm lockfile or installed React/Vite packages, so dependent acceptance checks are blocked.
- **B/C integration:** exact proposed imports, `PracticeScreenProps` callbacks and ownership frozen in `src/contracts/integration.ts` and `docs/CONTRACTS.md` §8. No screen/scenes implemented.

Scene schema remains v1; local record format remains v1, and no migration is required. Added exported helpers: `hasValidInstructorReview`, `isValidSceneAsset`; no breaking API changes.

## Actual commands attempted in the repair sandbox

System: Node **v22.16.0**, npm **10.9.2**, global TypeScript **5.8.3**; Chromium binary **144.0.7559.96** installed but browser mount was not possible.

| Command | Result | Evidence |
|---|---|---|
| `npm run test` | **PASS**: 20 tests, 0 failed | Captured full stdout in separate evidence bundle |
| `tsc --noEmit --project tsconfig.contracts.json` | **PASS** exit 0 | Separate evidence bundle |
| `npm install --package-lock-only --fetch-retries=0 --fetch-timeout=7000` | **FAIL** exit 1: DNS `EAI_AGAIN registry.npmjs.org` | Separate evidence bundle |
| `npm ci --offline` | **FAIL** exit 1: no `package-lock.json` | Separate evidence bundle |
| `npm run typecheck` | **FAIL** exit 2: `TS2688` missing `vite/client` without installed packages | Separate evidence bundle |
| `npm run build` | **FAIL** exit 2: same unresolved `vite/client` before Vite executes | Separate evidence bundle |
| `npm run verify:repo` | **FAIL** until genuine committed lockfile exists | Separate evidence bundle |
| Desktop/390px browser screenshots | **NOT EXECUTED**: no build/runtime packages | No browser evidence supplied or claimed |
| Physical mobile/device checks | **NOT EXECUTED**; reserved for later QA | Not claimed |

The tests run on source TypeScript with Node's built-in experimental type stripping; they are not a replacement for full app typecheck/build/browser checks. Do not forge a lockfile or infer a browser PASS from these tests.

## Exact PowerShell completion commands (on Windows with npm registry access)

Extract the candidate ZIP and **enter the folder containing `package.json` and `.git`**. Install/activate Node **22.16.x** and npm **10.x** first. Check versions before proceeding:

```powershell
node --version
npm --version
git rev-parse HEAD
npm config get registry
npm install --package-lock-only
npm ci
npm run test
npm run typecheck
npm run build
# Optional one-command combined check:
npm run check
# Add only the genuine generated lockfile, then commit and verify repository gate:
git add package-lock.json
git commit -m "Lock npm dependencies after supported-version verification"
npm run verify:repo
git status --short
git rev-parse HEAD
```

`npm ci` must run **after** npm generates the real lockfile. If npm engine or connectivity errors arise, stop and report them; do not remove `engine-strict` or fabricate the dependency graph. If your ZIP extraction does not contain `.git`, request a full Git archive of this candidate.

To capture the real browser rendering:

```powershell
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173/`) in Chrome/Edge. Save one **desktop** full-window screenshot showing the BlindSpot heading and status, then open DevTools (F12), toggle Device Toolbar (`Ctrl+Shift+M`), set viewport width **390 CSS pixels**, and save another screenshot with the viewport size shown. Label the 390px view as **browser emulation**, not physical-device testing. Optional: inspect DevTools Console and note any errors. Do not include learner personal records. Screenshots go into reviewer evidence, not an invented `public/scenes` asset.

Return to Chat A for integration/review: `package-lock.json`, command stdout/stderr including versions, desktop/390px screenshots, `git rev-parse HEAD` result, `git status --short`, and confirmation that no GitHub remote or push was performed. The new lockfile commit must be incorporated into the final candidate reviewed by the independent reviewer; **do not call M1 accepted yourself.**
