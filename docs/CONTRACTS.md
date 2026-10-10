# BlindSpot M1 repair contracts — candidate v1

**Status:** proposed contract for independent M1 review, **not accepted/frozen** until reviewer signs off. Exact source of truth is `src/contracts/scene.ts`, `src/engine/attempt.ts`, `src/engine/feedback.ts`, `src/engine/geometry.ts` and `src/records/localRecords.ts`, and `src/contracts/integration.ts`. No scene content has been approved.

## 1. Authoring a scene

`SceneDefinition.schemaVersion` is exactly `1`; `sceneVersion` is an independent authored-content revision string (change when artwork, rubric, tap regions or accepted choices change). Use stable semantic `scene.id`, `tapRegions[].id`, `responseOptions[].id`, `reasonOptions[].id`, `continuations[].id` strings, e.g. `bus-training-01`, `hidden-left-edge`, `ease-off`, `view-obstructed`, `no-actor`. Never embed correctness in the display index or labels.

A scene contains:

- `purpose`: `training` or `assessment`; `condition`: `blocked-view` or `clear-view-control`.
- `base`: `/scenes/...` image with **natural width/height** and English/Hindi alt text. Keep the same base and visible conditions before either training ending.
- `visibleConditions`: observable facts or neutral conditions provided *before* answer, in both locales. Never reveal hidden actors before lock.
- `tapRegions`: fixed normalized rectangles (0–1 fractions of the **actual uncropped image**), with **neutral** location names for keyboard alternatives. The explicit `none` answer is **not** a tap region. For a clear-view control the rubric must accept `none`.
- `responseOptions`, `reasonOptions`: English/Hindi labels keyed by stable IDs. IDs are shuffled for display by `createAttempt`, and displayed order goes into the locked record.
- `continuations`: **exactly 2** for training, **none** for assessment; each ending is a title, explanatory narrative and optional positioned overlay layers. Actors are *only* layers visible after lock; no live simulator.
- `feedback.recognition`, `feedback.responses[id]`, `feedback.reasons[id]` give reusable fragments. Response/reason feedback is selected from the locked **IDs**. `feedback.shared` is optional. **No feedback before lock in assessment**.
- `rubric` defines acceptable region/none, response and reason IDs for the **initial conditions**; `contentReview` defaults to `{status:'provisional'}`. No scored evaluation without authentic instructor-review metadata.

`validateScene(scene)` rejects missing English/Hindi image descriptions, non-finite or non-positive base/overlay dimensions, malformed geometry, invalid rubric IDs, missing explanations, invalid instructor-review metadata and incorrect ending counts. It does not assess the educational accuracy of artwork or traffic guidance; that needs content and instructor review.

## 2. State flow and invariants

`createAttempt(scene)` records freshly shuffled `displayedOrder`; `beginAnswering` changes `observe` to `answering`. The learner must choose **a region or explicit none**, then one response and one main reason. `lockAttempt` refuses incomplete attempts. Once locked, all `choose*` operations and a second lock are no-ops (same state reference). `startReview` moves to review after lock; `currentEndingId`/`nextEnding` expose training endings sequentially; `replayEndings` restarts only the continuations, without unlocking the submitted answer. **All three replay helpers** (`currentEndingId`, `nextEnding`, `replayEndings`) require the supplied scene ID, sceneVersion, schemaVersion and purpose to match the locked attempt, and require `state.sceneId` to match; otherwise ending ID is `null` and transitions return the same state object. Assessment has no endings. A UI's back button may navigate visually, but must not call `createAttempt` on a submitted attempt except via an explicitly labeled **new attempt/restart** action.

Current `AttemptPhase` values: `observe`, `answering`, `locked`, `review`. The **next-scene progression** is reserved for integration M2/M3; it will create a new attempt for the next `scene.id`, never rewrite a locked record.

`LockedAttempt` stores: record/schema versions, scene ID/version, `purpose`, `regionSelection`, `responseId`, `reasonId`, both displayed option orders and ISO lock time. Never store name, email, GPS, IP, original taps or other personal identifiers. `lockedAt` is a timestamp, not a personal identifier.

## 3. Feedback and scoring

`getFeedback(scene, locked, locale)` returns the scene-level observation, the response-specific explanation and the reason-specific explanation **only after a valid lock**. UI must additionally gate any pre-lock hints; `getFeedback(..., null, ...)` returns `null`.

`getReviewedCriteria` returns **null for provisional or invalidly reviewed content**. `hasValidInstructorReview` requires `status==='instructor-reviewed'`, a nonblank `reviewerRef` and a real calendar `reviewedOn` date in strict `YYYY-MM-DD` format. This is a structural metadata gate, **not verification** of an instructor's qualifications, authorisation or actual review; real documented human review is required before learner scoring. `getFeedback` still returns provisional explanations (provisional=true) when review metadata is invalid. It compares recorded IDs with the rubric; it does **not** reference the continuation/ending and does not produce an aggregate riding-safety score. Accepted alternatives remain condition-dependent. C must not introduce scoring visuals until that review gate.

## 4. Geometry and accessibility

Use `object-fit:contain`, not `cover`. `clientToNormalized(clientX, clientY, getBoundingClientRect(), scene.base.width, scene.base.height)` returns a point only *inside* the letterboxed image; taps in padding return null. `hitRegion(point,scene.tapRegions)` resolves the first containing rectangle. `regionToClientRect` places review overlays correctly in the same image coordinates.

Provide explicit neutral-region buttons plus a `none` button as keyboard and screen-reader alternatives. Region labels **must not** state “correct,” “hazard,” or reveal expected answers until a reviewed state. Recorded selection must remain visible in review separately from highlighted accepted regions.

## 5. Local record handling

`loadRecords(readBrowserStorage())` returns `{records,status}` with `status` in `available | unavailable | corrupt`; invalid JSON or invalid version falls back to empty records. `saveRecords` returns a status, never throws on blocked writes. If storage fails, the live in-memory attempt flow must still work; UI may show a neutral warning. Never assume browser storage is guaranteed, and never overwrite a corrupt store silently during startup.

Persist `LockedAttempt` **once** immediately after locking (implementation M2), not every answer change. Do not persist draft/pre-lock responses. Preserve stable IDs and versions to make future authored content changes traceable.

## 6. Read-only sample for later implementation

The sample in `tests/fixture.ts` exists only to exercise the contract. It is **not** usable learner scene content, artwork, medical/safety guidance, evidence of review or authorization to expand scope.

## 7. Contract changes

Any proposed v1 schema, exported API or locked-record change requires A (integration) to propose migration and this review chat to approve **before** B or C implement dependent changes. Record subsequent accepted SHA in the integration ledger. Do not fork contracts across chats.


## 8. Exact B/C integration interface (reserved until M1 acceptance)

These imports/exports are **agreed targets, not implemented learner functionality**. Source type contract: [`src/contracts/integration.ts`](../src/contracts/integration.ts). A owns that file; B/C may not edit it. React's JSX, callback implementation and route wiring remain M2/M3.

### B: authored scenes and language

- **Module path:** `src/content/scenes/index.ts` (owned/created by B in M2/M3).
- **Named export:** `export const scenes: SceneCatalogue = [...]` using `import type { SceneCatalogue } from '../../contracts/integration.ts';`.
- `scenes` is a readonly `SceneDefinition[]`, ordered training bus scene first, unfamiliar blocked-view assessment second, matched clear-view assessment third. No test-only fixture export. `SceneDefinition.schemaVersion = 1`. IDs are stable; no class, backend, renderer or scoring implementation in B.
- Localisation belongs within B-owned `SceneDefinition` translations (`en`, `hi`) and any B-owned text module under `src/content/i18n/**`. B does not hold the current locale state or change the locale through side effects. The B entrypoint is an agreed future export, deliberately absent in M1.

### C: practice presentation

- **Module path:** `src/ui/PracticeScreen.tsx` (owned/created by C in M2/M3).
- **Named export:** `export function PracticeScreen(props: PracticeScreenProps): JSX.Element` or an equivalent React element return. Type-only import: `import type { PracticeScreenProps } from '../contracts/integration.ts';`.
- **Inputs from A:** `scene: SceneDefinition`, `attempt: AttemptState`, `locale: Locale`, `feedback: FeedbackParts | null`, `reviewedCriteria: ReviewedCriteria | null`, `storageStatus: StorageStatus`, `canNextScene: boolean`.
- **Intent callbacks to A:** `onBegin(): void`, `onSelectRegion(selection: RegionSelection): void`, `onSelectResponse(responseId: ResponseId): void`, `onSelectReason(reasonId: ReasonId): void`, `onLock(): void`, `onStartReview(): void`, `onNextEnding(): void`, `onReplayEndings(): void`, `onRestart(): void`, `onNextScene(): void`, `onLocaleChange(locale: Locale): void`. The exact definitions are exported in `PracticeScreenProps`; **do not** add side effects, persistent state, or extra mandatory props independently.
- C may own **presentation-only** temporary state (focus, expanded panel, responsive layout), not attempt answers, phase, selected IDs, locale, saved records or current scene index. C renders visible conditions first, uses `attempt.displayedOrder` for choice order, and renders only A-supplied feedback/criteria. Use neutral accessible region buttons plus `none`, keyboard handling, `object-fit: contain` and geometry helpers.

### A: application coordinator

- **Module path:** `src/App.tsx` (owned by A; existing M1 screen remains until integration).
- A imports B's named `scenes` and C's named `PracticeScreen` **only after independent M1 approval**. A owns `locale`, `attempt`, current scene index, effects, once-per-lock persistence, storage diagnostics and all navigation/restart/next-scene gating. A constructs `feedback` with `getFeedback(scene, locked, locale)` **only after lock**, constructs `reviewedCriteria` via `getReviewedCriteria` **only after lock**, and never uses `continuations` or a displayed ending to classify an answer.
- `onLock` must refuse incomplete attempts and save the locked record only once after transition; persistence failure must not stop the practice. `onNextScene` only works when `canNextScene` is true; a restart is explicit and produces a new attempt; back navigation never silently discards a locked attempt. Language changes must retain selected IDs. No personal identifiers in records.
- B/C are not authorised to start until independent reviewer freezes a **new** M1 SHA. If any component prop or scene schema change is needed, request approval from A/review first.

**Storage/schema migration:** None in this repair. `SceneDefinition.schemaVersion` and `LockedAttempt.recordVersion` remain 1, and no saved-data fields change.
