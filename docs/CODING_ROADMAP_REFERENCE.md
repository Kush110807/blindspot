# BlindSpot — Coding Roadmap and Chat Handoff
Prepared 10 October 2026. Planning document only: no prototype code implemented or accepted.

## Decision
Use one canonical project, one integration owner, and at most three implementation chats. This chat remains the independent review and scope owner. Do not develop unrelated standalone projects and merge them at the deadline. Separate chats do not automatically share files, conversation state, or accepted decisions.

Screenshot shows the coding window ending 11 October 2026, 6:00 PM IST. Target submission by 4:00 PM IST, with two hours for portal/upload trouble. Check the live submission fields immediately; the screenshot establishes timing, not the required upload fields.

Official event FAQ: functional application, source code and run instructions in ZIP/TAR. A presentation/video is optional. Follow the live portal if its fields add requirements.
Source: https://hackoverflow.arhn.in/

## Frozen product scope
Phone-friendly React + TypeScript browser practice with three authored scenes:
1. Parked-bus training: recognise hidden roadside, record response and main reason, lock answers, show both continuations sequentially, provide choice-specific provisional explanation.
2. An unfamiliar blocked-view example: same interaction, changed layout, no assessment hints before answer lock.
3. Matched clear-view example: explicit "no relevant blocked region" choice, condition-specific responses and reasons. Caution alone is not an error.

Use authored static forward-facing illustrations, actor overlays and fixed tap regions. Same base scene and visible state before either training continuation. No general physics/visibility engine.
English/Hindi interface and scene text, local records, no live AI service.
No accounts, backend, full driving simulator, extra hazard catalogue or six-scene research pilot during the competition build.
Do not show aggregate riding-competence/safety scores or claim crash reduction.
The post-hackathon pilot remains future work.

## Ownership
| Chat | Responsibility | Owns | Must not independently change |
| --- | --- | --- | --- |
| A — Foundation and integration | Canonical repository, build tooling, shared contracts, state flow, record handling, integration, release package | Shared types, state logic, app composition, dependency manifest/lockfile, build configuration, records and integration tests | Submitted product scope without review |
| B — Scenes and language | Scene conditions, authored assets, tap regions, choices, reasons, continuation layers, explanations, Hindi/English content | Scene data, assets, scene text/localisation files, content notes | Shared schema, app state flow, build tooling |
| C — Interface | Responsive learner screens, controls, scene display, accessible input, visual feedback/replay | Agreed UI components and styles | Shared schema, scoring/content rules, dependency manifest |
| This chat — Review | Scope control, handoff audits, defect triage, acceptance record | Review findings and accepted baseline ledger | No concurrent production-code edits |

A implements the minimal UI first if needed to prove the core flow. C then improves that same UI using an agreed file list. Do not let A and C edit the same UI files concurrently.

## Foundation contract — freeze before B/C code
A must deliver a short readable contract and runnable skeleton:
- Versioned scene schema: scene ID, purpose, visible conditions, base asset/view dimensions, tap regions, response/reason IDs, translations, continuation layers and feedback keys.
- Stable IDs for scene/response/reason/ending. Assessment refers to IDs, never display positions.
- Region coordinates normalised to the scene's actual image bounds. Renderer correctly maps taps through scaling and letterboxing. Keyboard/selectable alternatives describe locations without naming the correct one.
- Separate training and assessment modes. Assessment scenes reveal no answer hint or explanatory feedback until the attempt locks.
- State sequence: observe → select region or none → response + main reason → lock → review/continuations → next. Back navigation must not silently unlock a submitted answer.
- Locked attempt includes schema/scene version, selected IDs, region selection and displayed option order. No name, email, location or unnecessary personal data.
- Assessment is based on initial conditions and reviewed content, never on which ending appears.
- Content status: provisional / instructor reviewed. No invented reviewer or endorsement.
- Local record handling with graceful storage-unavailable/corrupt-record fallback. Prototype still works if saving fails.
- Exact command names, Node version requirements and package lockfile. A alone approves dependencies.
- Feedback takes the recorded response and main reason into account. Share reusable explanation parts rather than writing every response × reason × ending combination independently.

Do not spend the entire foundation milestone on architecture. Contracts should be just enough to enable the first scene.

## Build milestones and acceptance gates
| Milestone | Approximate active effort | Deliverable | Review gate |
| --- | --- | --- | --- |
| M0 — Submission and baseline | 30 min | Live portal requirements, one repo/project folder, scope and ownership | Required upload fields known; one canonical baseline |
| M1 — Foundation | 60–90 min | Runnable skeleton and shared contracts | Clean install/build works; B/C have exact contracts and file lists |
| M2 — One complete scene | 2–3 h | Observe, tap, select response/reason, lock, both continuations, explanation | Identical initial evidence, no early answer leak, answer cannot change after lock, feedback matches IDs |
| M3 — Parallel completion | 3–4 h elapsed | B adds three-scene content/languages; C improves phone UX; A integrates as pieces arrive | All three scenes usable; clear-view option works; English/Hindi complete; no conflicting file ownership |
| M4 — Focused QA | 2–3 h | Real phone checks, meaningful logic tests, defects fixed | No blocking defects; tap alignment stable; no broken flow/storage handling |
| M5 — Release and submission | 1–2 h | Source ZIP, README, clean-run verification, short demo if useful | ZIP runs from a clean extraction; actual portal deliverables verified |

These are planning estimates, not a guarantee. Build one working scene before polishing all three.
Use checkpoints as targets: first complete scene tonight; all committed features by late morning 11 October; release freeze by 2:00 PM; submit by 4:00 PM IST. Adjust active-work allocation to availability, keeping submission buffer.

## Integration rules
- Preferred: one Git repository, one branch per workstream, short commits, one integration owner. Shared baseline identified by exact commit SHA.
- If Git sharing is unavailable: A keeps the canonical folder. Each worker returns a patch/changed-files ZIP against one exact baseline. Never replace the canonical folder with an unrelated whole-project ZIP.
- Integrate small compatible changes during M2/M3. Do not defer assembly to the last milestone.
- No chat assumes another chat remembers decisions. Attach this roadmap, accepted contracts, exact baseline and task-specific file list to each handoff.
- Schema change requires A's proposed migration and this chat's review before dependent tasks use it.
- Fix review findings on the reviewed candidate; no opportunistic features or unrelated refactors.
- Never call an item accepted merely because a worker says tests passed. Inspect evidence and reproduce the relevant check.

## Mandatory handoff from each worker
1. Task and exact starting baseline.
2. Resulting commit SHA or complete patch and exact changed-file list.
3. Run instructions and dependency changes, if approved.
4. Checks actually run, with results. Label unexecuted checks explicitly.
5. Phone screenshots or a short recording of affected screens.
6. Known defects, limitations and assumptions.
7. Any changes to shared contracts.
8. Content-review status where applicable.

Review verdicts: accepted / repair required / blocked by missing evidence. Record accepted baseline after each merge.

## Content and safety checks
- Draft bus actions follow the final proposal: ease off and prepare to stop, or stay back and reassess before passing. Accepted alternatives and reasons remain condition-specific.
- Oncoming traffic and other decision-relevant conditions must be visible or neutrally stated before the answer.
- Do not imply a horn alone resolves hidden risk. Instructor review may approve it as a supplement in a suitable context.
- Show both training continuations with recorded-choice explanation, including explanations for accepted actions.
- Never predict that a selected action guarantees stopping, collision avoidance or a safe outcome.
- No graphic crashes.
- Clear-view scene is free of the target obstruction, not guaranteed free of all hazards.
- Shuffle choices while preserving ID-based mappings and record the displayed order.
- Highlight correct regions only during review. Retain the learner's own marked selection for explanation.
- If no qualified instructor review is available, keep explanations visibly provisional and do not run scored learner evaluation. Functional/content QA can proceed.
- Any optional usability trial: adult consent, no personal identifiers, report usability observations rather than effectiveness.
- Document sources and origins of generated/third-party artwork. Verify asset use permissions. Do not use the decorative cover as validated scene geometry.

## Focused verification
Automated checks:
- Accepted response/reason mappings survive reordered choices.
- Initial assessment does not depend on ending.
- Incomplete answers cannot lock; locked answers cannot be silently overwritten.
- Training requires both continuations to be available; assessment hides guidance before locking.
- The clear-view "none" recognition selection works.
- Scaling/letterboxing maps coordinates correctly.
- Storage failure/corruption does not break practice.

Manual checks:
- Real phone portrait at narrow widths; landscape/resize; scrolling and touch controls.
- Language switch preserves stable selections and shows complete translations.
- Feedback matches at least one accepted and one unaccepted response in each relevant scene.
- Tap regions remain aligned across screen sizes; keyboard alternative works.
- Replay, restart and next work without hidden actor/answer leakage.
- Fresh extraction, documented install/build/start, and no missing bundled assets.
- No fabricated performance/user-study claims in UI, README or demo.

## Release contents
Source code, package manifest and lockfile, bundled assets, README with setup/build/run commands and required versions, content-review status, limitations, sources/asset credits. Exclude node_modules, personal records, credentials and unrelated files.
A hosted preview and short demo can help judging, but do not replace a runnable source package. No deployment or external submission is authorised by this planning document alone.

## Initial task for Chat A
"Build only M0/M1 for BlindSpot using this roadmap and the final submitted proposal. Establish one canonical React/TypeScript project, runnable skeleton and short shared contracts. Define file ownership for B and C. Do not implement all scenes, add services or redesign the concept. Return the exact baseline, source/patch, run instructions, checks actually executed and the contracts for review. Work ends at the foundation review gate."

## Task template for Chat B after M1 acceptance
"Starting from [accepted baseline], implement only the scene/content/asset/localisation files listed in [ownership list], using [frozen contracts]. Prepare the three committed scene types with bilingual content and provisional review status. Do not modify shared types, dependencies, app state or UI. Return changes, content matrix, asset/region alignment evidence and limitations."

## Task template for Chat C after M1 acceptance
"Starting from [accepted baseline], implement only [UI file list], using [frozen contracts] and scene fixtures. Build phone-first observe/select/lock/review controls and sequential replay. Do not alter content, schema, scoring rules or dependencies without an approved request. Return changes, screenshots, checks and limitations."

## Next action
Start Chat A foundation. This review chat audits M1 before releasing B and C implementation. Keep integration in Chat A through the release unless an explicit handoff transfers the accepted baseline to a replacement integrator.

