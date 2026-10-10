# BlindSpot — Chat B authored-content handoff

**Status:** B-authored candidate, **provisional / not instructor reviewed**. This document does not grant approval to integrate, publish, score learners or offer riding instruction. The illustration and decision rubric require a qualified, documented human review. No reviewer metadata exists, and all three entries explicitly use `contentReview: { status: 'provisional' }`.

## Provenance and contract

- **Base Git commit:** `3bb4fff2c6ba5abcb0d16ae22766f3de91c3b47e`; B branch `chat-b/scenes-bilingual-3bb4fff`.
- **Contract:** unchanged scene schema v1, named `scenes: SceneCatalogue` in `src/content/scenes/index.ts` in required order. A owns locale, state/lock, review gating and integration; C owns UI and adaptive image renderer. No new shared exported UI-copy contract.
- **Proposal basis:** *BlindSpot_Hackoverflow_Submission_Final(1).pdf*, pp. 3–5 (bus decision, two endings and draft accepted alternatives), pp. 7–8 (static SVG and three-scene scope), p. 10 (proposal-only sources and caveats). The following assets and Hindi wording are **new B-authored interpretations**, not copied artwork from that document.
- **Version:** `1.0.0-provisional` for all scenes; bump each `sceneVersion` whenever its artwork, tap geometry, translations, answer mapping or rubric changes.

## Content matrix

| Scene (purpose/condition) | Initial visible evidence | Neutral region alternative and draft recognition criterion | Draft response/reason IDs accepted | Post-lock content |
| --- | --- | --- | --- | --- |
| `bus-training-01` (training / blocked-view) | Parked bus at left hides part of the far roadside; visible opposing-lane vehicle; ability to ease off progressively | 4 named region buttons + explicit `none`; `space-beyond-bus`, **not** `none` | `ease-prepare-to-stop`, `stay-back-reassess`; reason `bus-hides-conflict` | **Two** endings: `no-one-emerges` (no overlays), then `pedestrian-emerges` (one transparent non-graphic actor). Feedback by locked response/reason IDs, independent of ending |
| `unfamiliar-blocked-01` (assessment / blocked-view) | Side-street entrance right; parked delivery van near entrance; distant left vehicle | 4 neutral region buttons + `none`; `beside-delivery-van`, **not** `none` | `ease-monitor-side-entry`, `wait-for-better-view`; reason `van-limits-side-view` | **Zero** continuations; post-lock-only provisional fragments |
| `matched-clear-01` (assessment / clear-view-control) | **Same street composition** as unfamiliar scene, but no van covering the right-hand entry; distant left vehicle remains | 4 neutral region buttons + explicit `none`; `acceptsNone: true`, empty acceptedRegionIds | `scan-controllable-pace`, `ease-and-check`; reason `open-view-still-scan` | **Zero** continuations; provisional explanations distinguish absent *target obstruction* from absent road hazards |

The bus scene uses **four** draft main-reason options, including the separate “nobody currently visible” misconception requested by the verified B handoff. The proposal slide listed three. The surviving rationale is the proposal's reason “bus hides a possible conflict,” represented as a semantic ID rather than its slide index. The draft acceptance of responses 2 and 4 is likewise ID-based, *not* an instructor-validated result. Both assessment rubrics are additional provisional authored hypotheses, not proposal-validated answers.

## Asset provenance, rights and dimensions

Every SVG listed here was drawn from scratch for this Chat B patch using original XML shapes, with no external raster/vector imports, web fonts, logos, stock photography, copied code artwork, or copyrighted brand designs. B can provide the SVG source for project use; no third-party asset license is needed for these created files. All base illustrations are stylised front-facing rider-perspective diagrams, not simulations or scaled representations of actual roads.

| SVG web path | Intrinsic `width × height` / `viewBox` | Use / rights | Appearance timing |
| --- | --- | --- | --- |
| `/scenes/bus-training-01/base.svg` | `1280 × 720` / `0 0 1280 720` | Original B SVG: parked bus, road, vehicle, handlebar foreground | Initial view and both endings, unchanged |
| `/scenes/bus-training-01/pedestrian-emerges.svg` | `180 × 270` / `0 0 180 270` | Original B transparent, non-graphic pedestrian cutout | Only second continuation after answer lock |
| `/scenes/unfamiliar-blocked-01/base.svg` | `1280 × 720` / `0 0 1280 720` | Original B SVG: side-street scene with added delivery-van group | Initial unfamiliar assessment |
| `/scenes/matched-clear-01/base.svg` | `1280 × 720` / `0 0 1280 720` | Original B SVG: **identical underlying street drawing** without delivery-van group | Initial matched clear assessment |

All asset references use bundled absolute-web URLs and every `SceneAsset.alt` has authored English and Hindi descriptions. A/C must not treat `aria-hidden` on the SVG's internal drawing as replacing the `<img alt={scene.base.alt[locale]}>` description provided by the data contract.

## Region mapping (relative to **uncropped** 1280 × 720 base)

Approximate pixel rectangles below were computed from `x,y,width,height` fractions. A/C must render the entire artwork with `object-fit: contain`, use the frozen geometry helpers for taps, and provide neutral region buttons so users need not tap small boxes on narrow devices. The SVGs have no bounding boxes or answer highlights burned into them.

| Scene | Region ID | Normalised `[x, y, w, h]` | Approximate pixel `[left, top, right, bottom]` |
| --- | --- | --- | --- |
| bus | `space-beyond-bus` | `.480, .390, .130, .290` | `614, 281, 781, 490` |
| bus | `lane-directly-ahead` | `.430, .710, .160, .130` | `550, 511, 755, 605` |
| bus | `opposite-lane-vehicle` | `.720, .490, .140, .230` | `922, 353, 1101, 518` |
| bus | `near-left-pavement` | `.030, .540, .150, .270` | `38, 389, 230, 583` |
| unfamiliar and clear | `beside-delivery-van` / `open-right-entry` | `.555, .400, .160, .270` | `710, 288, 915, 482` |
| unfamiliar and clear | `far-left-vehicle` | `.260, .530, .150, .170` | `333, 382, 525, 504` |
| unfamiliar and clear | `near-lane-surface` | `.400, .730, .170, .120` | `512, 526, 730, 612` |
| unfamiliar and clear | `right-side-pavement` | `.870, .600, .120, .230` | `1114, 432, 1267, 598` |

The bus second-ending layer is placed at `{x:.495,y:.425,w:.14,h:.375}` = ~`634,306` size `179×270`, preserving the cutout's 2:3 aspect ratio. It is deliberately **not** in the base asset. With an image displayed at width `375px` and its natural 16:9 ratio, the scene image is ~`375×211px` before any surrounding letterboxing; the bus's target box is ~`49×61px`. That is a calculation and asset-render check, **not** a mobile-browser interaction test. The accessible region-list alternative is essential.

## Source/reference boundary

1. **Project's own submitted proposal**, pp. 3–5, 7–8: product scope and the paired-outcome, initial-evidence principle. The proposal is not evidence of validated instructional safety.
2. **Motorcycle Safety Foundation, SEE approach:** https://msf-usa.org/see/ — background for *search, evaluate, execute* as a general perception/decision process. This source did **not** review or approve these illustrations, rubrics or translations.
3. **Motorcycle Safety Foundation, If You Ride a Motorcycle:** https://msf-usa.org/documents/library/if-you-ride-a-motorcycle/ — general scanning, road-space and training considerations, not scenario-specific endorsement.

No source establishes that a selected response always avoids a collision, or that an unreviewed rubric is suitable for learner scoring. No external source was used as an asset.

## Independent-review questions and non-claims

- **Riding safety:** Have a qualified India-context instructor check left-hand traffic interpretation, the bus-side pedestrian movement, side-street approach, opposing-lane constraint, alternatives, any appropriate braking distance assumptions, and whether the region boxes visually match the intended obstruction. The current artwork is intentionally simplified and has no speed/distance measurements.
- **Potential content ambiguity:** The side-street opening and its edges are schematic; assess whether adult novices can tell what is and is not hidden. Clear-view control matches the blocked background exactly except for the van, but the large unobstructed entrance is a stylised concept. The base bus artwork presents a rear view, not a real driving panorama.
- **Hindi:** Native-speaker / instructor review required for clarity of riding terms, length, and meaning parity. Author supplied English/Hindi strings; **no independent bilingual reviewer** has signed them off.
- **UI:** C/A must verify `375px` touch layout and actual browser screen-reader order; B only authored static content and performed image-raster/geometry checks. No C-produced or integrated runtime screens exist on B's branch.
- **Feedback gating:** Assessment explanations exist in the scene data for post-lock lookup. Preventing premature rendering, instructor-reviewed scoring and persistence is **A/C-owned behavior**; B has not claimed to test that behavior in the final learner app.
- **Outcome bias:** Training offers the same starting image for both post-lock endings; success/failure outcome is not used for initial-response assessment. The second illustration is not a crash prediction; the first is not proof of an empty roadside.
- **No tested effect:** There are no learner scores, usability results, claimed injury reductions or instructor approvals here. All accepted IDs and explanatory text are **provisional proposals**.

## Verification commands for B files

```bash
# Dependency-free runtime schema + bilingual/content assertions in a temporary check file:
node --experimental-strip-types /tmp/verify-blindspot-b.mjs  # if that scratch file is supplied
# Main project checks are subject to installed dependencies:
npm test
npm run typecheck
npm run build
```

The complete, executed outcome and any blocked checks are reported separately in the B handoff. There are no new files under `tests/`; A can later add formal content regression tests during integration.
