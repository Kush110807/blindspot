# BlindSpot artwork — PDF-source restoration and final layer integrity (candidate)

**Source of authority for this restoration:** `BlindSpot_Final_Artwork_Review.pdf` (6-page user-approved artwork review) and its exact scene source files `blindspot_pdf_work/bus-base.png`, `blindspot_pdf_work/pedestrian-transparent-overlay.png`, `blindspot_pdf_work/assessment-clear.png`, plus the earlier transparent van-and-shadow extraction, subsequently cleaned in the focused van-only matte repair. The source files are not placed in the repository twice; the actual learner assets below contain their exact decoded pixel arrays.

## Immutable sources and precomposition

| Role | Repository file | Decoded-RGBA SHA-256 | Source |
| --- | --- | --- | --- |
| Bus observation and Ending 1 base | `public/scenes/bus-training-01/base.png` | `fba39e86fe1ce441ac5bff1cde4131143f6dbff73307ab86d9cf20ee8922b59b` | PDF bus source |
| Ending 2 pedestrian/shadow overlay only | `public/scenes/bus-training-01/pedestrian-emerges.png` | `ae25856c16cad2f897e17f0b39ae28576669197f8b16842256ed3437e0cdc826` | PDF transparent overlay |
| Matched assessment clear background | `public/scenes/matched-clear-01/base.png` | `c01bd936e9671e5e36c25988dbe234b68673e497aeb148107818d84515e75a74` | PDF junction source |
| Van and its shadow only | `public/scenes/unfamiliar-blocked-01/van-shadow-layer.png` | `369857a4b4a778674dc156c37a1b439fb0eaaacd3cb156e863bb024e550b1ff7` | Repaired cutout; see `scripts/rebuild-van-layer.py` |
| Assessment blocked composite | `public/scenes/unfamiliar-blocked-01/base.png` | recomputed from source + overlay | Clear + van/shadow alpha |

All five raster assets are **1672 × 941**. The transparent layers have a full-frame canvas and non-opaque pixels. Ending 1 has zero layers, Ending 2 has only the pedestrian layer and shares the base file path. Neither overlay is present in pre-lock observation.

`scripts/verify-artwork.py` checks the three immutable approved-source decoded-pixel hashes and the separately versioned repaired-van decoded-pixel hash, exact RGB equality for the clear+van composite, exactly zero changed pixels outside van/shadow alpha, and zero changes outside pedestrian alpha. Its output is included in release verification logs. No background was regenerated.

**Matched assessment evidence:** The vehicle is a composited cutout from the approved image, not a new independent street render. The former wall and curb fragments around the extracted van were removed with a vehicle silhouette alpha mask and a new feathered contact shadow. Physical scene plausibility has not been independently validated. Layer identity verifies background fidelity only; it does not certify traffic safety or instructional correctness.

## Updated normalized tap-region rectangles

- Bus hidden roadside: `(0.438, 0.285, 0.115, 0.235)`; opposing SUV: `(0.602, 0.313, 0.142, 0.192)`.
- Blocked side street behind van: `(0.742, 0.248, 0.165, 0.279)`; overlaps the van-screened junction but excludes the far-right pavement.
- Clear-view exposed junction entrance: `(0.773, 0.270, 0.167, 0.247)`.

These are provisional rectangles based on the *actual approved raster geometry* and require running browser tap alignment review at desktop and 375px, including letterboxing. They are not pixel-segmentation masks.

## Contract and assessment constraints

Bus and clear scenes remain at `1.2.0-provisional`; only the blocked scene advances to `1.2.1-provisional`; their stored-record and scene schemas remain version 1. All semantic answer IDs, review-feedback logic, replay restrictions, retry semantics, provisional rubric, and `reviewedCriteria: null` behavior remain unchanged. Older scene-version snapshots should never be applied against these images.

**Not an application screenshot:** source-artwork thumbnails are image previews only. Until full npm installation, Vite build, and live Playwright/Chromium checks succeed, no running-app visual acceptance is claimed.

## Van-only matte repair verification

This focused revision starts from `28f1e7c94d224acc2feffba2c3e5eefdf54ec3b4`. `scripts/rebuild-van-layer.py` independently reconstructs the exact repaired layer from the ancestor commit (it does not regenerate a scene); it extracts just the visible vehicle, excludes the old tan-wall/curb patches, adds feathered wheel/undercarriage shadow, and recomposes the new blocked image over the unmodified clear background. Default invocation verifies; `--write` deliberately regenerates the two dependent files. `scripts/verify-artwork.py` verifies decoded pixel hashes and exact clear+van alpha compositing. The previous bus and clear decoded hashes are unchanged.

The highlighted hotspot preview `verification/van-repair/blocked-tap-375-QA-only.png` is a source-image alignment diagnostic, **not** a running-app screenshot. Browser tap QA and instructor review remain pending.
