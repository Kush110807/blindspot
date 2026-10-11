# BlindSpot — asset and source credit ledger

**Covers accepted M1, A runtime and accepted B/C integration assets.** Do not interpret this document as a license grant or a claim of reviewed rider training.

| Item | Used where | Origin and rights/status |
| --- | --- | --- |
| Decorative road/sky illustration | `src/styles/foundation.css` | Authored as CSS shapes in the foundation implementation; no third-party artwork. Not actual scene geometry. |
| Brand mark | `src/App.tsx` + foundation CSS | Authored CSS shapes; not an external logo asset. |
| Text and headings | `src/App.tsx`, `index.html` | Authored foundation status copy and name/tagline from the submitted proposal. |
| Fonts | foundation CSS | System/UI font stack; no downloaded or redistributed font files. |
| Favicon SVG/ICO | `public/favicon.svg` / `public/favicon.ico`, referenced in `index.html` | Original vector markup and programmatically drawn raster icon prepared in this integration branch. No external logo, font, image or third-party asset used. Independent license/brand review pending. |
| Scene images and post-lock overlay | `public/scenes/bus-training-01/`, `public/scenes/unfamiliar-blocked-01/`, `public/scenes/matched-clear-01/` | Originally project-authored SVGs during accepted B content phase; replaced for this artwork candidate by AI-generated raster bus base, transparent pedestrian overlay, fixed clear assessment background, derived white-van cutout and shadow, and exact blocked-view composite. See `docs/ARTWORK_FINAL_SOURCE_VERIFICATION.md` for frozen source hashes, deterministic van matte-cleanup provenance, composite checks, scene versions and provisional status. |
| Automated fixtures | `tests/fixture.ts` | Synthetic authored data for contract testing only, not instructor-reviewed scene content. |
| Music, sound, datasets, video | — | None included. |

## Scope and intellectual sources

- **Project brief:** `BlindSpot_Hackoverflow_Submission_Ready(1).pdf`, the user's submitted concept file, consulted for implementation scope but **not included/distributed** in this repository.
- **Implementation constraints:** `docs/CODING_ROADMAP_REFERENCE.md`, supplied coding roadmap.
- **Contextual work acknowledged in the proposal:** Ministry of Road Transport & Highways statistics; Honda Motorcycle & Scooter India training announcement; Drive Focus; RAPT novice-driver hidden-hazard research; Vidotto, Tagliabue & Tira (2015) on moped riders; Motorcycle Safety Foundation SEE guidance. See proposal for referenced works; these sources do not validate BlindSpot or approve its draft answers.
- **Libraries/tooling:** React, ReactDOM, Vite and TypeScript per `package.json`; third-party package licenses remain their respective owners' licenses. A genuine npm lockfile is committed in the accepted M1 baseline (Vite 6.4.4).

## Required record for new M2/M3 assets

Content Chat B must document **every new file** in `docs/CONTENT_NOTES_B.md` with: relative path, asset type, creator, date, original source URL/reference if external, license or usage permission, attribution obligations, native image dimensions, scene ID/version, region-overlay consistency, and whether the asset is a pre-lock image or a post-lock overlay. Do not use unlicensed external pictures or decorative proposal covers as verified road-scene maps.

No qualified instructor approval, learner measurement or safety-effectiveness evidence is present at integration.

## October 2026 final welcome/van integration

- **Welcome page:** `src/welcome/WelcomePage.tsx`, `src/welcome/content.ts`, and `src/styles/welcome.css` were authored for BlindSpot. All English/Hindi copy is original prototype text. No remote fonts, third-party logos, stock road imagery or external illustration packages were introduced.
- **Frozen bus/clear artwork:** The existing approved images and bus pedestrian overlay are reused unchanged; the decoded-pixel SHA-256 values remain enforced by `scripts/verify-artwork.py`.
- **Latest van correction:** `assets/source-artwork/latest-van-correction-donor.png` is the AI-generated full-scene preview from the prior user-approved visual direction, stored only as **source provenance**, not served to learners as a replacement scene. `assets/source-artwork/final-van-foreground-mask.png` is a cutout mask derived from it. `scripts/rebuild-van-layer.py` reconstructs the transparent vehicle and localized wheel/contact shadow, then composites it onto the **unchanged** approved clear background. The public files are `public/scenes/unfamiliar-blocked-01/van-shadow-layer.png` and `base.png`. The final rendered image has zero changed pixels outside that alpha layer. The slight edge/matte differences at high zoom remain a visual-review consideration and do not imply instructor validation.
- **Version:** Only `unfamiliar-blocked-01.sceneVersion` advances to `1.2.3-provisional` for changed visible evidence. No semantic IDs, locked-record schema, pre-existing lesson claims, or other scenes change.

## Public-release credit and AI assistance (deployment preparation)

BlindSpot's source code, responsive interface, authored scenario prose, English/Hindi drafts, lesson comparisons and tests were developed with **AI assistance** and iterative human direction. The street scenes, white delivery van and pedestrian imagery are **synthetic, AI-generated illustrative art**, with deterministic compositing and manually corrected alpha masks. These images are not documentary photographs, real traffic studies, validated rider-training images or instructor-approved evidence. Pixel hashes verify file consistency, not the physical accuracy of a depicted traffic situation.

`assets/source-artwork/` contains donor and mask provenance kept in the Git **source** package, but omitted from Vite's **public static build**. The public site receives only the final scene images actually referenced by the UI; `scripts/prepare-static.mjs` also excludes the unused van/shadow reconstruction layer and scene README from the generated `dist`. Original concept citations do not grant endorsement or validate safety outcomes. Third-party dependencies retain their original license terms. A project-wide open-source license/permission to publish the repository must be decided by the owner before source publication.
