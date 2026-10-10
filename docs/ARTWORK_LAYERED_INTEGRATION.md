# Scene artwork: layered revision 1.1.0-provisional

## Asset provenance and control

- The frozen bus base (`public/scenes/bus-training-01/base.png`) is a pixel-identical export of the previously approved bus base in BlindSpot's artwork-review PDF. The walker is the already approved transparent full-frame post-lock overlay (`pedestrian-emerges.png`), and is not visible at observation time. The first ending has no layer; the second ending uses the same base plus the walker. No bus/background regeneration in this integration.
- The matched clear assessment background (`public/scenes/matched-clear-01/base.png`) is the fixed earlier clear-view artwork, with no regeneration. The white van was extracted from the earlier review's blocked-van artwork into a transparent van/shadow PNG; its whole layer was translated slightly toward the junction. The new blocked assessment base is a *mathematical alpha composite* of the unmodified clear background and that van/shadow layer. Its exterior is pixel-identical. The extracted cutout can show small matte edges at high zoom; this is a provisional artistic layer, not an independently generated physically validated scene.
- All raster artworks are AI-generated material created during the BlindSpot visual-review process. No third-party stock images, external logo packs or independent instructor endorsement were used in this revision. Images are illustrative and do not establish real-world vehicle behavior.

## Geometry and scope

- Source dimensions: 1672 × 941 pixels for all full-frame assets, approximately 16:9, preserving original aspect ratio; displayed with `object-fit:contain` rather than cropping. Normalised region coordinates in the scene catalogue were retargeted to this evidence; the tap areas must be checked on a real running 375px browser view before acceptance.
- `schemaVersion` stays `1`; `sceneVersion` changes to `1.1.0-provisional` for all three scenes. Semantic IDs, accepted response/reason IDs, provisional lesson guidance, immutable records, locked-answer gating and both training endings are unchanged.
- The `van-shadow-layer.png` is kept as a separately auditable source layer. For existing renderer compatibility, the blocked assessment consumes a precomposed PNG rather than using a new scene schema field. It still contains exactly the pixels resulting from the layer on the fixed clear base, verifiable through `scripts/verify-artwork.py`.
- English and Hindi base-image descriptions were updated. The review rubric remains **provisional**, and `reviewedCriteria` remains `null`.

## Actual checks

- The pixel mask is zero outside van and shadow alpha for the blocked/clear comparison. Run `python scripts/verify-artwork.py` for strict complete composite equality. The bus actor shows only after answer lock.
- This document does not assert professional traffic-geometry validation or physical-device QA; see verification report for executed checks.
