# Ownership and handoff — proposed after M1 gate

**One canonical Git baseline. No shared simultaneous production-code edits.** Each workstream branches from the exact accepted M1 commit; send a commit/patch ZIP, not an untracked whole-project replacement. A alone merges and runs release checks. This document is a proposed ownership allocation awaiting independent acceptance.

| Stream | Exact owned paths for future changes | Excluded from independent edits |
|---|---|---|
| **A — foundation/integration** | `package.json`, `package-lock.json` (when generated), `.npmrc`, `.gitignore`, `index.html`, `tsconfig.json`, `src/main.tsx`, `src/App.tsx`, `src/contracts/**` (including `integration.ts`), `src/engine/**`, `src/records/**`, `tests/**`, `docs/**`, `README.md`, integration/release scripts | Authored scene content and C's UI implementation after delegation; changes only as integrator after review |
| **B — scenes/language** | `src/content/scenes/**` (scene definitions), `src/content/i18n/**` (language text), `public/scenes/**` (base art, actor overlays), `docs/CONTENT_NOTES_B.md` | `src/contracts/**`, `src/engine/**`, `src/records/**`, `src/App.tsx`, `src/ui/**`, `src/styles/**`, package/build files |
| **C — interface** | `src/ui/**` (screen, view components and accessibility), `src/styles/practice.css` and new C-named CSS under `src/styles/**`, `docs/INTERFACE_NOTES_C.md` | `src/contracts/**`, `src/engine/**`, `src/records/**`, `src/content/**`, `public/scenes/**`, `src/App.tsx`, `src/main.tsx`, existing `src/styles/foundation.css`, package/build files |
| **Review chat** | Review findings and acceptance ledger only. | No concurrent production-code changes |

A wires C's exported screen into `src/App.tsx` after both patch streams are accepted. C may use a **local test harness in an untracked scratch location**, not commit edits to `src/App.tsx`. B cannot revise the schema without requesting A's migration/review.

**B delivery target after M1 acceptance:** one parked-bus training scene, one unfamiliar blocked-view assessment, one matched clear-view control with explicit `none`, authored assets and overlays, both languages and content-review status. No invented instructor review. Content must cite self-authored art or verified rights in `docs/CONTENT_NOTES_B.md`.

**C delivery target after M1 acceptance:** phone-first observe/answer/lock/review, neutral selectable regions and keyboard alternatives, language control that keeps IDs, no early answers, both training endings sequentially, restart and next controls. Not a general physics engine. No dependency changes without A approval.

**Both handoffs:** starting SHA, resulting SHA or patch, exact changed paths, checks actually run, screenshots **if obtainable**, limitations, contract changes (ideally none) and content-review status.


## M1 repair: exact import/export ownership

**B** later creates `src/content/scenes/index.ts` with named `scenes: SceneCatalogue` (readonly `SceneDefinition[]`) defined in A-owned `src/contracts/integration.ts`. B owns authored `en`/`hi` strings and assets; not locale state. No B scenes are implemented at M1.

**C** later creates `src/ui/PracticeScreen.tsx` with named `PracticeScreen(props: PracticeScreenProps)`; A-owned `src/contracts/integration.ts` has every prop and callback type. C owns rendering, keyboard/phone interaction, visual state only. It must not independently store selected answers, locale, records or navigation progression. No C screen is implemented at M1.

**A** later integrates B's `scenes` and C's `PracticeScreen` in `src/App.tsx`, and alone owns attempt state/transitions, language selection, persistence, feedback/classification gating and next/restart gating. A is the only writer of the exported prop interface, schema, dependency manifests and lockfile. See section 8 of `docs/CONTRACTS.md` for exact callbacks and invariants.
