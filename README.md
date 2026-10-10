# BlindSpot

**Practice decisions when the road ahead is hidden.**

BlindSpot is a **three-scene, phone-friendly React + TypeScript prototype** for practising observation and decision reasoning when the view of the road is blocked. It is intended for adult novice two-wheeler riders. This is a fictional illustrated learning exercise, **not a riding simulator, validated safety intervention or replacement for qualified instruction**.

**Integration status:** This branch combines the accepted A runtime (`1d711b14f96eaea9e3b311c10b260abe9ac2d08f`), B original scene implementation plus accepted content repair (`e0c6a0f` → `bcd0b5d`), and C original interface implementation plus accepted repair (`ac5e803` → `42175db`). Both worker histories remain in Git. The integrated candidate awaits independent acceptance. Nothing has been published or submitted.

## Requirements

- Node.js **22.16.x**, npm **10.x** (`package.json` requires Node `>=22.16.0 <23`)
- A modern browser with JavaScript enabled
- Network access for **the first dependency installation only**; no runtime API, login or server-side service

## Clean installation and execution

```bash
node --version
npm --version
npm ci
npm run test
npm run typecheck
npm run build
npm run verify:repo
npm run dev
```

Visit Vite's local URL, normally `http://localhost:5173/`. For a production smoke test, stop the dev server and run `npm run preview` after a successful build.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install exact locked versions from committed `package-lock.json`. |
| `npm run dev` | Start development server. |
| `npm run test` | Run Node contract, runtime and accepted-scene integration tests. |
| `npm run typecheck` | Check full TypeScript app. |
| `npm run build` | Typecheck and produce a Vite bundle in `dist/`. |
| `npm run verify:repo` | Verify lockfile structure and tracked-file hygiene (must run on clean commit). |
| `npm run check` | Test plus production build. |
| `npm run preview` | Serve built application locally. |

### Actual verification scope

The integration environment independently passes Node's 34 integration+contract tests and validates the authored SVG files. It **cannot complete `npm ci`** because the registry is unreachable and required package tarballs are not cached (notably Vite 6.4.4). Consequently the integrated React full typecheck/build **cannot be verified in this environment**. The previous Windows evidence showed a passing build of the **M1 foundation**, not this combined application. Desktop and 375px browser rendering, including accessibility and localStorage cases, must be performed on a machine where `npm ci` succeeds before integration acceptance. See `docs/ACCEPTED_WORKER_INTEGRATION.md` for the actual command results and outstanding UI verification steps. Do not treat this source-only integration as a finished release.

## Included scenes and functionality

1. **Parked-bus training:** identify a region (or none), choose a response and a reason, lock, read provisional explanations based on the original evidence, then view **both** authored continuations and replay without resetting the recorded answer.
2. **Unfamiliar blocked-view example:** an assessment-style changed layout, with explanation withheld until the attempt is locked and review is opened.
3. **Matched clear-view control:** includes an explicit “no relevant blocked region” selection; caution is not automatically classified as wrong.

The interface supports English/Hindi scene and control text, 375px responsive layout authored by Chat C, scaled image tap rectangles plus selectable keyboard-accessible region controls, shuffle-safe response/reason IDs, immutable locked records, explicit restart/next navigation and client-side local record storage. Storage errors/corruption fall back to in-memory records without overwriting damaged storage. No personal information is requested or saved.

**All explanations, provisional rubric candidates and accepted-response alternatives remain UNREVIEWED by a qualified instructor.** The app never displays validated correctness scores, aggregate competence scores or claimed crash reduction. No backend, account, learner study, driving physics engine or live AI is included. The matched assessment examples are authored static illustrations rather than a prediction of actual road risks.

## Ownership and integration contracts

- **A:** `src/App.tsx`, `src/integration/`, `src/contracts/`, `src/engine/`, `src/records/`, build/dependencies, automated tests, release and repository documentation.
- **B:** `src/content/scenes/`, `src/content/i18n/`, `public/scenes/`, `docs/CONTENT_NOTES_B.md`.
- **C:** `src/ui/`, `src/styles/practice.css`, `docs/INTERFACE_NOTES_C.md`.

A's `src/integration/slots.ts` connects B's `scenes` named export to C's `PracticeScreen` named export. A alone owns locale state, progression, answer locking, persistence, review-gated feedback and navigation. See [contracts](docs/CONTRACTS.md), [ownership](docs/FILE_OWNERSHIP.md) and [integration evidence](docs/ACCEPTED_WORKER_INTEGRATION.md). The shared v1 schema and frozen B/C interfaces were not changed during integration.

## Assets, privacy and limitations

- Three vector base scenes and one pedestrian continuation overlay are bundled under `public/scenes/`, originally authored for this project. See `docs/CONTENT_NOTES_B.md` and `docs/ASSET_CREDITS.md` for creator/provenance and review status.
- Brand/favicon are original vector/CSS work; no external fonts, stock photos, soundtrack, personal data, or private credentials are included. React and Vite retain their own package licenses.
- All scene conditions and feedback are provisional; screenshots or programming tests do **not** constitute instructor validation or evidence of real-world safety benefit.
- Corrupt local storage is retained without automatic replacement; a failed save means in-memory attempts may be lost after refresh. The local browser cannot guarantee secure storage.
- Narrow-width browser emulation is not a physical phone test. Full browser, keyboard, storage, dev-console and responsive acceptance checks for this **combined** version are pending until dependencies can be installed.
- No GitHub remote, deployment or submission has been authorised. The final repository should exclude `node_modules/`, `dist/`, credentials, local records and personal identifiers.

The proposal (`BlindSpot_Hackoverflow_Submission_Ready(1).pdf`) guided this scope but is not distributed in the repository. Additional sources and their non-validation status are recorded in the asset ledger. **No open-source project license is granted by this repository; decide repository visibility/license before publication.**
