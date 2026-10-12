# BlindSpot

**The road looks clear. What can’t you see?**

**Live demonstration:** https://err404-blindspot.netlify.app/ (existing site link supplied by the project owner; this release-candidate commit has not been pushed or deployed).

BlindSpot is a three-scene, browser-based road-visibility practice prototype for two-wheeler riders. It asks learners to identify what a vehicle blocks from view, choose a response and reason **before** seeing an outcome, then reconsider the decision independently of whether that particular ending happened to be fortunate. A bilingual (English/हिन्दी) welcome page includes a non-recorded demonstration.

**Learning and safety limitation:** All scenarios, alternative responses and criterion-level feedback are **provisional**, not approved by a qualified road-safety instructor or Hindi-language reviewer. This is not an on-road safety certification, a validated test of riding skill, or evidence of fewer crashes or changed riding behaviour. No validated correctness score is displayed.

## Current scope

- Welcome page: introduction, shared bilingual language selection, a bus demonstration with two illustrative endings, prototype scope and future roadmap, and **Begin / Resume practice** controls.
- Scene 1: parked-bus training, a locked decision, and **both sequential endings**. A lucky ending is not evidence that the earlier response was justified.
- Scene 2: unfamiliar delivery-van side-road obstruction.
- Scene 3: matched clear view; the learner can explicitly choose **no relevant blocked area**, without implying the whole road is hazard-free.
- Scene progress is shown as Scene 1/2/3 of 3 (English and Hindi); essential scene images preserve their dimensions while loading and disable answering if unavailable. Asset failures are announced on screen.
- Result review: choice-specific takeaway plus separate recognition, response and reasoning feedback, supported/conditional/reconsideration guidance, and an immutable locked snapshot. Retry makes a new attempt rather than rewriting a saved decision.
- Browser-local records only; there is **no backend, account, live AI, tracking service, external font or remote scene image**. A storage error keeps in-memory practice available but can prevent persistence. Preview toggles do not write learner records or advance the actual endings.

## Install, test and run

Use **Node 22.16.x and npm 10.x** (Windows: use `npm.cmd` in PowerShell if execution policy prevents `npm`). The repository includes a genuine npm v3 lockfile; do not replace it by installing arbitrary newer versions.

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

Open the local Vite URL, normally <http://localhost:5173/>. `npm run preview` serves an already successful production build locally. `npm run check` runs the tests and production build. The repository checker requires a **clean Git working tree** and a committed `package-lock.json`, so commit approved documentation/deployment changes before invoking `npm run verify:repo`.

The transparent source layers can be reconstructed and compared separately if Python has Pillow and NumPy:

```bash
python scripts/rebuild-van-layer.py
python scripts/verify-artwork.py
```

**Only publish after `npm ci`, all tests, full typecheck and the production build pass on the exact final commit, followed by desktop and 375px browser QA.** Earlier Windows M1 build screenshots belong to the older foundation commit, not this version.

## Static deployment

This is a standard **Vite static app**. After a successful `npm run build`, publish **only the contents of `dist/`**, not the source ZIP, `.git`, `node_modules`, private records or source artwork. The build includes a post-build allowlist gate that removes an unused transparent van layer and the scene README from `dist`, confirms the four learner-facing scene images, favicons and hashed JS/CSS assets, and refuses unknown files.

Root-domain URLs are a hard constraint in this frozen version: scene paths use `/scenes/...` and icons use `/favicon.*`. Deploy at a domain root such as `https://example.netlify.app/`, **not** `https://example.com/blindspot/` without a separately reviewed asset-base change.

`netlify.toml` provides build command, `dist` publish directory, Node 22.16.0, a static fallback and basic headers. For Netlify, connect the repository or manually deploy the **completed** `dist/` directory. For another static host (such as Cloudflare Pages), select **Vite**, build command `npm run build`, output directory `dist`, and Node 22.16.x; ensure any SPA fallback points to `index.html` and does not override actual image files. No environment secrets are required. Full checks and manual verification are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Suggested final local verification after a fresh build:

```bash
npm run verify:static
npm run preview
```

Open the preview in a real browser and verify welcome → Scene 1 → both endings → Scene 2 → Scene 3 → completion, English/Hindi, Back/Resume from answering and review, taps/keyboard focus, immutable locked answers, and narrow-width layout. **No deployment or publication is performed by these commands.**

## Records, privacy and public artifact boundaries

Records are generated **at runtime in each visitor’s browser**. They are not part of `dist` and do not travel with the repo or static-host upload. Do not add exported learner records, local screenshots, credentials, `.env`, `node_modules` or raw evaluation notes to a release. The Git source archive includes reproducibility inputs under `assets/source-artwork/` and history; these are *not* published by Vite. `.gitignore` protects common local record and credential paths, but does not replace a secret-history review before making a GitHub repository public. Static hosts will expose the learner-facing scene artwork by design.

## Source and artwork credits; AI-assistance disclosure

BlindSpot’s authored scene data, English/Hindi copy, interaction code, UI and tests were developed **with AI assistance** under the project's human-directed requirements and review. OpenAI image generation contributed the semi-realistic raster road scenes, pedestrian element and delivery-van source. Subsequent compositing, masks and shadow cleanup were performed with image-processing scripts. The frozen bus, pedestrian and clear-view image pixel hashes are recorded and checked in `scripts/verify-artwork.py`; the blocked scene is reconstructed by compositing the clear background with a separate van/shadow alpha layer. A changed blocked visual has its own provisional scene version. These are illustrative synthetic images, not field-verified photographs.

React, ReactDOM, Vite and TypeScript retain their own upstream license terms. Fonts are system fonts with Hindi fallback; no redistributed fonts, stock crash photos, music, external APIs, institutional logos or partner endorsements are included. References in the original proposal provide context, **not** an instructor endorsement or evidence that this prototype works. Detailed artwork provenance and intellectual-source notes: [docs/ASSET_CREDITS.md](docs/ASSET_CREDITS.md). No project-wide open-source license has been granted; review ownership/permission before publishing the source publicly.

## Project limits and handoff

The accepted visual and learning scope descends from frozen product baseline `541e50e01f056297feaaef7e7f59c8d0fe08f172`. This focused follow-up adds only scene numbering, asset loading/error accessibility and neutral pre-answer scene descriptions; it does not change answer IDs, scene versions, stored records, feedback mapping or imagery. Planned instructor/Hindi review, matched unfamiliar assessment research, controlled comparisons, transfer/retention evaluation and broader scenario coverage are **future work**, not existing capabilities.

The source package may be release-prepared without `dist` when dependency installation is unavailable. Check the release report for the actual commit-level verification evidence; do not mistake passing contract tests, older Windows screenshots, or source-image previews for a final React/Vite browser pass.

## GitHub source repository — only after approval

The included ZIP contains the existing `.git` directory and full history. **Do not initialise a new Git repository** inside the extracted project, replace the lockfile, or commit `node_modules`, `dist`, `.env`, personal records or logs. Check `docs/REPOSITORY_CHECKLIST.md` before sharing the source publicly. The static website at the link above is separate from the **GitHub source repository**, which has not been created or pushed by this handoff.

When the owner authorises publication to a new empty GitHub repository, use the instructions in [docs/GITHUB_PUBLISHING.md](docs/GITHUB_PUBLISHING.md). If the destination already has Git commits, reconcile it without a force push. A project-wide source license and artwork use rights should be reviewed before choosing public visibility.
