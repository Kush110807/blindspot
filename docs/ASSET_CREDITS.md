# BlindSpot — asset and source credit ledger

**Covers accepted M1, A runtime and accepted B/C integration assets.** Do not interpret this document as a license grant or a claim of reviewed rider training.

| Item | Used where | Origin and rights/status |
| --- | --- | --- |
| Decorative road/sky illustration | `src/styles/foundation.css` | Authored as CSS shapes in the foundation implementation; no third-party artwork. Not actual scene geometry. |
| Brand mark | `src/App.tsx` + foundation CSS | Authored CSS shapes; not an external logo asset. |
| Text and headings | `src/App.tsx`, `index.html` | Authored foundation status copy and name/tagline from the submitted proposal. |
| Fonts | foundation CSS | System/UI font stack; no downloaded or redistributed font files. |
| Favicon SVG/ICO | `public/favicon.svg` / `public/favicon.ico`, referenced in `index.html` | Original vector markup and programmatically drawn raster icon prepared in this integration branch. No external logo, font, image or third-party asset used. Independent license/brand review pending. |
| Scene images and post-lock overlay | `public/scenes/bus-training-01/`, `public/scenes/unfamiliar-blocked-01/`, `public/scenes/matched-clear-01/` | Originally project-authored SVGs during accepted B content phase; replaced for this artwork candidate by AI-generated raster bus base, transparent pedestrian overlay, fixed clear assessment background, derived white-van cutout and shadow, and exact blocked-view composite. See `docs/ARTWORK_FINAL_SOURCE_VERIFICATION.md` for final PDF-source hashes and pixel-level provenance, alpha-composite verification, scene versions and provisional review status. |
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
