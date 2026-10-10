# Chat C — practice interface handoff

**Branch:** `chat-c/practice-interface` · **base:** `3bb4fff2c6ba5abcb0d16ae22766f3de91c3b47e`

## Export and ownership

- Named `PracticeScreen(props: PracticeScreenProps)` in `src/ui/PracticeScreen.tsx`.
- Supporting presentation-only `src/ui/SceneViewport.tsx`.
- Isolated CSS: `src/styles/practice.css`, imported by `PracticeScreen` (no changes to `foundation.css`).
- No changes to frozen contracts, content, engines, records, `App.tsx`, `main.tsx`, package manifest, lockfile or integration tests.
- C does not own phase/answer/locale/navigation/storage state. All actions are intent callbacks handled by A. No saved identifiers, side effects or scoring logic.

## Interaction semantics

- **Observe:** natural-ratio un-cropped base artwork and visible conditions; no choices, feedback, actors or rubrics revealed.
- **Answer:** image hit testing uses frozen `clientToNormalized`/`hitRegion`; targets have equally neutral dashed bounds. Explicit region list is available to keyboard and assistive technology. Background click does *not* mean “none”; the `noneLabel` choice is explicit. Response/reason order is exactly `attempt.displayedOrder`.
- **Lock:** button is disabled until all three answers exist, guarded by the frozen `canLock` function. C never changes the record.
- **Locked:** choices are immutable; only `onStartReview` may proceed.
- **Review:** feedback is rendered only when phase is `review`, the locked scene id/version/schema matches, and A provided feedback. No pass/fail or correctness scores; provisional content is conspicuously flagged. For training only, show `continuations[endingIndex]`, with the image layer at normalized base-image coordinates, then call `onNextEnding` or `onReplayEndings` without unlocking. Assessment has no ending or early hints.
- **Progression:** only A-provided `canNextScene` enables the next button, and both training endings must have been visited. Restart is an explicit separate action. English/Hindi is chosen via callback, preserving selected semantic IDs.
- **Storage:** status text describes availability, not a false confirmation of save. Storage errors do not block practice.

## Handoff/integration constraints

A imports C's named export and wires all eleven frozen callbacks to the engines. A must derive `feedback` and `reviewedCriteria` from a *valid locked* attempt. Every C rule is `.bs-` scoped. Root `overflow: clip` avoids a Chromium focus-induced horizontal scroll regression while still clipping decorative ambient effects. The render contract accepts every `PracticeScreenProps` field, though `reviewedCriteria` is intentionally not visualized until authentic instructor review is confirmed; do not invent correctness indicators. The exact authored base image/overlays are owned by B and will be displayed from `scene.base` and `scene.continuations` as provided. No full application integration or publication has been performed.

## Verification and imagery

Screenshots (where feasible) use a separate, **untracked** harness with the repository's test fixture, not B-authored scenes or approved teaching material. They demonstrate layout and transitions only; do not treat them as instructional validation. See the review report for checks that were actually run and any environment limitations.

## Checks performed in this isolated handoff

- Baseline native Node contracts: 20/20 pass (`npm run test`).
- Self-contained browser harness (local only, outside the repository): Chromium 144, 1440px desktop and 390px phone, six phase screenshots, E2E observe/answer/lock/review/second ending/replay/restart/language. Additional 430px scenarios cover image hit-testing, click outside regions, clear-view `none` via keyboard Enter, assessment hint/ending suppression, choice IDs across language toggle, next-scene gate and root horizontal scroll. No browser exceptions observed. The harness uses a **test-only illustration**, test-derived state engine and offline React 16-compatible adapter; it is not an app integration or approved B artwork.
- UI TSX transpilation syntax diagnostics: run using available global TypeScript; these do not replace the real React/Vite typecheck.
- Full `npm ci`, `npm run typecheck` and `npm run build` require locked dependencies, not available in the offline sandbox; these remain **unverified**. A must rerun these on the integrated branch with the project's real pinned dependencies.
