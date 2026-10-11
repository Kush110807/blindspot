# BlindSpot

**The road looks clear. What can’t you see?**

BlindSpot is a browser-based, three-scene road-visibility decision learning prototype for two-wheeler riders. A new bilingual welcome page introduces the problem, explains the learning principle with a **non-recorded** interactive preview, then starts the existing Scene 1 observation flow. No login, backend, remote AI, or personal details are required.

**Review status:** All scene guidance, candidate lesson alternatives and criterion feedback remain **provisional**, awaiting qualified road-safety instructor and Hindi-language review. No validated competence scores or claims of prevented crashes, improved road behaviour, or measured learning transfer are made.

## Get started

Use **Node.js 22.16.x** and **npm 10.x** with network access for the first installation:

```bash
npm ci
npm run test
npm run typecheck
npm run build
npm run verify:repo
npm run dev
```

Visit the Vite local address, normally <http://localhost:5173/>. `npm run preview` serves an already completed production build. `npm run check` runs tests plus the production build. For strict pixel verification (Python environment with Pillow and NumPy), also run:

```bash
python scripts/rebuild-van-layer.py
python scripts/verify-artwork.py
```

`npm ci` uses the committed genuine `package-lock.json` (Vite 6.4.4). `node_modules`, `dist`, browser data, credentials and any local records are excluded from Git. Nothing has been published, deployed, or submitted.

## Visitor experience

The **welcome page** contains a focused introduction, an explicit three-scene practice CTA, a two-ending bus demonstration, three short instructional steps, honest prototype scope, a current/planned/future development roadmap and a compact instructor-review warning. All text is authored in English and Hindi. The UI uses system fonts, a dark navy/teal theme, no stock photos or remote assets, and uncropped scene artwork.

The demo begins closed. After choosing **Explore the example**, visitors can switch between **Nobody emerges** and **A pedestrian emerges**. Both states use the **exact same frozen bus background**. Only the transparent pedestrian overlay appears in the second outcome. Demo exploration **never** advances the actual training endings, creates attempts, locks choices, saves records, or changes replay state.

**Start** is guarded against repeated activation, retains the selected language, scrolls to the top, and focuses the practice heading. It enters the **Scene 1 observation** phase, not answering, and does not create a saved record. The existing practice coordinator owns actual locale, attempts and persistence.

## Three-scene scope

1. **Parked-bus training:** identify a potentially screened roadside, choose a response and main reason, lock your answer, then review **both** sequential endings. A lucky outcome does not retrospectively justify a weak decision.
2. **Unfamiliar road-layout assessment:** handle partial visibility near a side-street junction screened by a van.
3. **Matched clear-view comparison:** decide whether the relevant obstruction is present; choosing **none** does not mean the whole road is safe.

The learning review provides a choice-specific takeaway and visible criterion-specific feedback for **recognition, response, and reasoning**, including supported, mistaken, mixed and conditional answers. Locked semantic IDs and marked regions are immutable; retry begins a new attempt instead of editing a submitted record. English/Hindi state survives navigation. In-browser local record storage degrades to in-memory handling if unavailable; corrupt data is preserved rather than overwritten.

## Engineering and ownership

- A/integration: `src/App.tsx`, `src/welcome/`, `src/integration/`, engine, shared contracts, storage, verification and packaging.
- B/content: `src/content/scenes/` and scene assets. This final artwork integration intentionally updates only the blocked image and its version; semantic IDs, assessment mappings and stored-record schema remain untouched.
- C/practice UI: `src/ui/`, `src/styles/practice.css`. Existing practice presentation and feedback are preserved.

`src/integration/slots.ts` connects the frozen B/C exports. No new third-party package was added.

## Assets and reproducibility

The accepted red-bus image, full-frame pedestrian overlay and clear-junction background have fixed decoded-pixel hashes enforced by `scripts/verify-artwork.py`. The blocked junction is reconstructed exactly from the **fixed clear view plus the masked van and its local contact shadow**. Pixels outside the mask are never changed. The donor for the most recent van correction and its cutout mask are preserved under `assets/source-artwork/` as non-public build provenance; only the final transparent layer and blocked composite are served to learners. See [asset credits](docs/ASSET_CREDITS.md) and [welcome integration handoff](docs/WELCOME_FINAL_HANDOFF.md).

The blocked scene version is `1.2.3-provisional`; the bus and clear scene versions remain `1.2.0-provisional`. All share scene schema v1 and stable answer IDs. Old snapshots must not be judged against changed image evidence.

## Limitations and verification

The prototype has **not** been evaluated with real riders or instructor-approved for safety advice. The welcome demo illustrates a possible outcome, not guaranteed collision avoidance. Its assessment scenes are authored examples rather than an exhaustive hazard test. The app does not prove learning transfer, retention or crash reduction. Local records are device/browser-specific; if storage is unavailable they may disappear after a refresh.

Tests and pixel invariants must be distinguished from the **actual Vite application**. In this execution environment, npm installation could not complete because registry packages were inaccessible. Consequently the full production build and actual desktop/375px browser UI screenshots remain unverified here. See `docs/WELCOME_FINAL_HANDOFF.md` for commands, the exact failed gates and the browser acceptance matrix. Previous Windows M1 screenshots are not evidence for this revision.

Source attribution, conceptual references and provisional-status restrictions are recorded in `docs/ASSET_CREDITS.md`. No repository license or permission to publish has been granted.
