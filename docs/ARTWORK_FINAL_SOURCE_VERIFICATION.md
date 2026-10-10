# BlindSpot artwork — PDF-source restoration and final layer integrity (candidate)

**Source of authority for this restoration:** `BlindSpot_Final_Artwork_Review.pdf` (6-page user-approved artwork review) and its exact scene source files `blindspot_pdf_work/bus-base.png`, `blindspot_pdf_work/pedestrian-transparent-overlay.png`, `blindspot_pdf_work/assessment-clear.png`, plus the previously accepted transparent van-and-shadow extraction `blindspot_artwork_approved/assessment-van-shadow-layer.png`. The source files are not placed in the repository twice; the actual learner assets below contain their exact decoded pixel arrays.

## Immutable sources and precomposition

| Role | Repository file | Decoded-RGBA SHA-256 | Source |
| --- | --- | --- | --- |
| Bus observation and Ending 1 base | `public/scenes/bus-training-01/base.png` | `fba39e86fe1ce441ac5bff1cde4131143f6dbff73307ab86d9cf20ee8922b59b` | PDF bus source |
| Ending 2 pedestrian/shadow overlay only | `public/scenes/bus-training-01/pedestrian-emerges.png` | `ae25856c16cad2f897e17f0b39ae28576669197f8b16842256ed3437e0cdc826` | PDF transparent overlay |
| Matched assessment clear background | `public/scenes/matched-clear-01/base.png` | `c01bd936e9671e5e36c25988dbe234b68673e497aeb148107818d84515e75a74` | PDF junction source |
| Van and its shadow only | `public/scenes/unfamiliar-blocked-01/van-shadow-layer.png` | `9da420ab0f3db80ca62b5ffc9f2f1f4f858b95c3cd0e0234354e63e641bcacb7` | Approved cutout |
| Assessment blocked composite | `public/scenes/unfamiliar-blocked-01/base.png` | recomputed from source + overlay | Clear + van/shadow alpha |

All five raster assets are **1672 × 941**. The transparent layers have a full-frame canvas and non-opaque pixels. Ending 1 has zero layers, Ending 2 has only the pedestrian layer and shares the base file path. Neither overlay is present in pre-lock observation.

`scripts/verify-artwork.py` checks all four approved decoded-pixel hashes, exact RGB equality for the clear+van composite, exactly zero changed pixels outside van/shadow alpha, and zero changes outside pedestrian alpha. Its output is included in release verification logs. No background was regenerated.

**Matched assessment evidence:** The vehicle is a composited cutout from the approved image, not a new independent street render. Some edge/shadow matte artifacts remain visible around the extracted van, and final physical scene plausibility has not been independently validated. Layer identity verifies background fidelity only; it does not certify traffic safety or instructional correctness.

## Updated normalized tap-region rectangles

- Bus hidden roadside: `(0.438, 0.285, 0.115, 0.235)`; opposing SUV: `(0.602, 0.313, 0.142, 0.192)`.
- Blocked side street beside van: `(0.638, 0.300, 0.133, 0.232)`.
- Clear-view exposed junction entrance: `(0.773, 0.270, 0.167, 0.247)`.

These are provisional rectangles based on the *actual approved raster geometry* and require running browser tap alignment review at desktop and 375px, including letterboxing. They are not pixel-segmentation masks.

## Contract and assessment constraints

The three scenes now have `sceneVersion: '1.2.0-provisional'`; their stored-record and scene schemas remain version 1. All semantic answer IDs, review-feedback logic, replay restrictions, retry semantics, provisional rubric, and `reviewedCriteria: null` behavior remain unchanged. Older scene-version snapshots should never be applied against these images.

**Not an application screenshot:** source-artwork thumbnails are image previews only. Until full npm installation, Vite build, and live Playwright/Chromium checks succeed, no running-app visual acceptance is claimed.
