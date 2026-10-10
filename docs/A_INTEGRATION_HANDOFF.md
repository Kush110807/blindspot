# BlindSpot — Chat A runtime candidate / integration handoff

**Accepted immutable starting baseline:** `3bb4fff2c6ba5abcb0d16ae22766f3de91c3b47e` (`main`).
**A isolated work branch:** `integration/a-m2-runtime`; **not accepted**, no GitHub remote/push, no competition submission.

## Deliverable and constraints

A owns `src/integration/**`, `src/App.tsx`, `index.html`, `public/favicon.ico`, `public/favicon.svg`, test harness, docs and Git/release packaging. No tracked files under `src/content/**`, `src/ui/**`, `src/styles/practice.css`, or `public/scenes/**` have been edited by A. B/C start separately from the unchanged M1 SHA.

A provides pure `createSession`/`reduceSession` state transitions, guarded scene navigation, shuffled stable answer orders and explicit lock/review/replay/restart. `selectPracticeView` prevents feedback before review and always returns `reviewedCriteria: null`, even with a synthetic test-only instructor flag. Catalogue rejects non-provisional review status; no validated correctness classifications are displayed in the prototype.

A's React hook loads local records with unavailable/corrupt fallback, tracks each new lock with monotonically increasing `saveRevision`, and writes only after a completed lock using a handled revision ref (including strict-mode effect replay). No draft persistence, personal identifiers, accounts, backend or analytics. Corrupt stored bytes are left intact; practice continues in memory. Users must explicitly restart to discard the current screen's answer. The clear-view explicit `none` selection is supported.

**Frozen imports:** B supplies `src/content/scenes/index.ts` named `scenes: SceneCatalogue`. C supplies `src/ui/PracticeScreen.tsx` named `PracticeScreen(props: PracticeScreenProps)`. Their schemas and props remain exactly as in `src/contracts/integration.ts` and `docs/CONTRACTS.md`. A alone changes `src/integration/slots.ts` to the following after their code passes independent review:

```ts
import { scenes as authoredScenes } from '../content/scenes/index.ts';
import { PracticeScreen as AuthoredPracticeScreen } from '../ui/PracticeScreen.tsx';
export const scenes: SceneCatalogue = authoredScenes;
export const PracticeScreen: ComponentType<PracticeScreenProps> | null = AuthoredPracticeScreen;
```

**Do not change the shared contract to make a worker patch pass without integration-owner review.** Do not merge overlapping whole-project ZIPs. With each worker's independently based branch/patch, inspect `git diff --name-only 3bb4fff..<worker-sha>`; require owned-only paths, then merge/cherry-pick and run tests, build and browser checks.

## Pre-integration vs post-integration checks

- Current independent foundation/contract/coordinator suite runs without npm packages using `npm run test`.
- Coordinator standalone TypeScript check is possible using global TypeScript and empty ambient `typeRoots` when the npm cache is unavailable; this is **not** the full React typecheck.
- `npm ci` needs real Vite tarballs; if unavailable locally, rerun with connectivity under Node 22.16.0/npm 10.x on Windows. The genuine npm lockfile is already in Git and must not be recreated by hand.
- After both B/C imports connect, require `npm ci`, `npm run test`, `npm run typecheck`, `npm run build`, `npm run verify:repo`, desktop and 375px emulator, keyboard/touch geometry, both training endings and replay, all three scenes, English/Hindi, corrupted/unavailable storage. Physical device QA remains M4.

## Minor visual follow-up

`public/favicon.ico` and `public/favicon.svg` are authored and linked in `index.html` by A to resolve the earlier foundation 404. Browser favicon network request is **not independently tested in this sandbox**, since full Vite dependencies are unavailable. B/C assets remain untouched.

## Publication gate

M1 is accepted; A runtime candidate and future B/C integrations are not yet accepted. Documentation-only corrections must remain a separate Git commit from runtime code. Never claim learner safety benefit, instructor review, browser completion or submission without corresponding independent evidence.
