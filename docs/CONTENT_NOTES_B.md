# BlindSpot — Chat B authored-content handoff

**Status:** B-authored candidate, **provisional / not instructor reviewed**. This document does not grant approval to integrate, publish, score learners or offer riding instruction. The illustration and decision rubric require a qualified, documented human review. No reviewer metadata exists, and all three entries explicitly use `contentReview: { status: 'provisional' }`.

## Provenance and contract

- **Base Git commit:** `3bb4fff2c6ba5abcb0d16ae22766f3de91c3b47e`; B branch `chat-b/scenes-bilingual-3bb4fff`.
- **Contract:** unchanged scene schema v1, named `scenes: SceneCatalogue` in `src/content/scenes/index.ts` in required order. A owns locale, state/lock, review gating and integration; C owns UI and adaptive image renderer. No new shared exported UI-copy contract.
- **Proposal basis:** *BlindSpot_Hackoverflow_Submission_Final(1).pdf*, pp. 3–5 (bus decision, two endings and draft accepted alternatives), pp. 7–8 (static SVG and three-scene scope), p. 10 (proposal-only sources and caveats). The following assets and Hindi wording are **new B-authored interpretations**, not copied artwork from that document.
- **Current candidate version:** `1.0.1-provisional` for all three scenes. Parent B candidate `e0c6a0f67800b3ccfd8fdd7c1874d591fec4822a` authored `1.0.0-provisional`; this targeted review revision changes bilingual feedback, assessment options, draft rubrics and pre-lock clear-scene wording. Asset artwork and tap geometry are unchanged. Bump `sceneVersion` for any later content or rubric change.

## Content matrix

| Scene (purpose/condition) | Initial visible evidence | Neutral region alternative and draft recognition criterion | Draft response/reason IDs accepted | Post-lock content |
| --- | --- | --- | --- | --- |
| `bus-training-01` (training / blocked-view) | Parked bus at left hides part of the far roadside; visible opposing-lane vehicle; ability to ease off progressively | 4 named region buttons + explicit `none`; `space-beyond-bus`, **not** `none` | `ease-prepare-to-stop`, `stay-back-reassess`; reason `bus-hides-conflict` | **Two** endings: `no-one-emerges` (no overlays), then `pedestrian-emerges` (one transparent non-graphic actor). Feedback by locked response/reason IDs, independent of ending |
| `unfamiliar-blocked-01` (assessment / blocked-view) | Side-street entrance right; parked delivery van near entrance; distant left vehicle | 4 neutral region buttons + `none`; `beside-delivery-van`, **not** `none` | `ease-monitor-side-entry`, `wait-for-better-view`; reason `van-limits-side-view` | **Zero** continuations; post-lock-only provisional fragments |
| `matched-clear-01` (assessment / clear-view-control) | **Same street composition** as unfamiliar scene, but no van covering the right-hand entry; distant left vehicle remains | 4 neutral region buttons + explicit `none`; `acceptsNone: true`, empty acceptedRegionIds | `scan-controllable-pace`, `ease-and-check`; reasons `open-view-still-scan`, `side-street-still-needs-checking` | **Zero** continuations; provisional explanations distinguish absent *target obstruction* from absent road hazards |

The bus scene uses **four** draft main-reason options, including the separate “nobody currently visible” misconception requested by the verified B handoff. The proposal slide listed three. The surviving rationale is the proposal's reason “bus hides a possible conflict,” represented as a semantic ID rather than its slide index. The draft acceptance of responses 2 and 4 is likewise ID-based, *not* an instructor-validated result. Both assessment rubrics are additional provisional authored hypotheses, not proposal-validated answers.

## Independent-review repair — candidate `1.0.1-provisional`

All three scenes changed, with **no contract, schema, runtime, artwork or tap-box changes**. Proposed acceptance continues to be provisional and must not be displayed as validated learner correctness before a qualified and documented instructor review.

1. **Bus training: response-level feedback explicitly compares both outcomes.** Each of the four `feedback.responses[responseId]` pairs (`en` and `hi`) now discusses (a) **nobody emerges** and (b) **a pedestrian emerges**, then returns to the **unchanged starting evidence**. This applies to both draft-accepted options (`ease-prepare-to-stop`, `stay-back-reassess`) and both draft-unaccepted options (`horn-hold-speed`, `brief-slow-then-resume`). The first ending does not retrospectively vindicate a risky response; the second does not prove that a cautious response prevents a collision. A horn may draw attention but does not restore a blocked sightline. Existing `recognition`, `reasons`, continuation IDs and the draft bus rubric remain unchanged; no ending-specific schema field or classification was added.
2. **Blocked-view assessment: more believable near-misses.** Continuing at current pace is now presented as a response to an apparently open *forward lane* rather than the claim that a parked van makes all traffic safe. A modest lateral shift to improve sightlines replaces an immediate move toward the road centre; feedback explains the trade-off without calling all shifts unsafe. The two weak reason absolutes were replaced with plausible but incomplete evidence: focus on the forward lane because the van is stationary, and assume a quiet side entrance because no cross-traffic was spotted. `centre-improves-sightline` (formerly `centre-always-gives-room`) and `stationary-van-focus-ahead` (formerly `stationary-means-no-movement`) are **new IDs**, because the propositions changed. Other response/reason IDs, the rubric's accepted IDs and scene condition remain stable.
3. **Clear-view control: no answer-announcing title or strawman stop.** Title is now the neutral *Near the side-street entrance* / *बगल वाली सड़क के प्रवेश के पास*; pre-lock visual conditions and base alt describe what is depicted without referring to the assessment comparison or telling the learner which region to choose. “Stop indefinitely because every side street must be blocked” was replaced by a believable horn-and-pace response. The more plausible speed-up distractor claims that passing sooner reduces exposure. For reasons, current quietness is no substitute for continued observation; faster passing does not guarantee less risk. A second legitimate rationale, `side-street-still-needs-checking`, was added to the **draft accepted reasons** alongside `open-view-still-scan`, to avoid penalising another defensible evidence-based explanation. The clear-scene rubric still explicitly accepts **none** for region recognition and both cautious responses, and does **not** imply that caution is wrong or that a visible entrance is hazard-free.

### Semantic-ID change log (only where meaning changed)

| Scene | Retired ID | Current ID | Content shift |
| --- | --- | --- | --- |
| Unfamiliar reason | `stationary-means-no-movement` | `stationary-van-focus-ahead` | Stationary-van distraction, not absolute impossibility of movement |
| Unfamiliar reason | `centre-always-gives-room` | `centre-improves-sightline` | Conditional sightline benefit, with lane-space trade-off |
| Clear response | `accelerate-because-clear` | `speed-up-to-pass-sooner` | Shorter exposure argument rather than obvious acceleration claim |
| Clear response | `stop-because-any-side-street` | `horn-and-maintain-pace` | Replace implausible indefinite stop with horn-led approach |
| Clear reason | `visible-means-no-risk` | `quiet-entrance-less-attention` | Current quietness used to deprioritise later observation |
| Clear reason | `every-side-street-blocked` | `side-street-still-needs-checking` | A defensible reason; **added to provisional accepted IDs** |
| Clear reason | `faster-is-easier` | `passing-faster-reduces-exposure` | Reduced-exposure assumption rather than faster-is-easier cliché |

No historical attempts are migrated by B. **A must check old local records** (sceneVersion is now `1.0.1-provisional`) and ensure its existing review/replay guards reject or handle historical scenes correctly. Old option IDs that changed should not be silently reinterpreted as new claims.

### Why the draft distinctions matter

- **Blocked view:** the moving hazard is not known to exist, but a stationary van can screen an entrance; an apparently clear forward lane does not settle the side-entry sightline. A slight lateral change may improve visibility yet requires independent space/traffic judgement.
- **Matched clear view:** no van obstructs the target entrance, so selecting **no relevant blocked region** is defensible, but a visible side street can still acquire cross-traffic. Both observing at a controllable pace and easing slightly remain draft-accepted. A horn is not a substitute for ongoing scanning. Two independent evidence-based reasons are accepted; simply increasing speed to “get through” is not supported by the drawing.
- **Bus outcomes:** both endings appear **after locking** only. The response feedback references each outcome while deliberately using the same original evidence and rubric. No language guarantees crash avoidance or predicts an incident.

### Review still needed

A qualified India-context riding instructor must adjudicate all assessment alternatives, draft acceptance/rejection criteria and scene geometry; a Hindi-speaking reviewer must assess idiom and comprehension. In particular, review the lateral-position trade-off and whether a brief horn alongside scanning could be reasonable under some real conditions. These are condition-specific hypotheses, **not validated safety instructions**.

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
