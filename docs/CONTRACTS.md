# BlindSpot M1 contracts — candidate v1

**Status:** proposed contract for independent M1 review, **not accepted/frozen** until reviewer signs off. Exact source of truth is `src/contracts/scene.ts`, `src/engine/attempt.ts`, `src/engine/feedback.ts`, `src/engine/geometry.ts` and `src/records/localRecords.ts`. No scene content has been approved.

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

`validateScene(scene)` reports missing translations, malformed geometry, invalid rubric IDs, missing explanations and incorrect ending counts. It does not assess the educational accuracy of artwork or traffic guidance; that needs content and instructor review.

## 2. State flow and invariants

`createAttempt(scene)` records freshly shuffled `displayedOrder`; `beginAnswering` changes `observe` to `answering`. The learner must choose **a region or explicit none**, then one response and one main reason. `lockAttempt` refuses incomplete attempts. Once locked, all `choose*` operations and a second lock are no-ops (same state reference). `startReview` moves to review after lock; `currentEndingId`/`nextEnding` expose training endings sequentially; `replayEndings` restarts only the continuations, without unlocking the submitted answer. Assessment has no endings. A UI's back button may navigate visually, but must not call `createAttempt` on a submitted attempt except via an explicitly labeled **new attempt/restart** action.

Current `AttemptPhase` values: `observe`, `answering`, `locked`, `review`. The **next-scene progression** is reserved for integration M2/M3; it will create a new attempt for the next `scene.id`, never rewrite a locked record.

`LockedAttempt` stores: record/schema versions, scene ID/version, `purpose`, `regionSelection`, `responseId`, `reasonId`, both displayed option orders and ISO lock time. Never store name, email, GPS, IP, original taps or other personal identifiers. `lockedAt` is a timestamp, not a personal identifier.

## 3. Feedback and scoring

`getFeedback(scene, locked, locale)` returns the scene-level observation, the response-specific explanation and the reason-specific explanation **only after a valid lock**. UI must additionally gate any pre-lock hints; `getFeedback(..., null, ...)` returns `null`.

`getReviewedCriteria` returns **null for all provisional content**; the field-level classification can be enabled only once `contentReview.status==='instructor-reviewed'` reflects real review. It compares recorded IDs with the rubric; it does **not** reference the continuation/ending and does not produce an aggregate riding-safety score. Accepted alternatives remain condition-dependent. C must not introduce scoring visuals until that review gate.

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
