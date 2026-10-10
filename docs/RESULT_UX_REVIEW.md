# BlindSpot — result UX review candidate

Starting commit: `1b81375d6965ceaeb19e716316a69cfec858512c`.

## Scope and source of guidance

This is a focused UI/presentation change to the integrated three-scene browser prototype. All scene definitions, semantic answer IDs, authored SVG artwork, scene versions, schema version 1 and locked-record version 1 are unchanged. The `src/integration/lessonPresentation.ts` module maps the existing authored rubric and B's original feedback into **provisional** learner-facing takeaways, supported alternatives and short, response-specific ending annotations. The added explanations and translations are drafts, not an instructor's endorsement, a numerical competence score or safety advice for real-world riding.

No `reviewedCriteria` values are presented or computed in the UI: A's existing selector still supplies `null`. Draft-supported and conditional labels are qualitative lesson comparisons, not validated correctness classifications. These labels must not be relabelled as `correct`, `safe`, `passed`, or instructor-approved before instructor review.

## What changed

- The locked review leads with one concise, answer-specific takeaway, including explicit recognition/response/reason separation. A recognized hidden area alone cannot make an unaddressed visibility risk an acceptable response.
- The learner's submitted location, response and main reason are shown from the frozen lock record, not editable selections. Compact criterion summaries then lead to "What it means / What to do differently / Why" and the lesson's two supported alternatives. Longer feedback is expandable.
- Conditional choices (moving toward the lane centre at the side street; horn + steady speed at the clear entrance) are explained as conditional, not automatically condemned. The clear-view "none" case explicitly means no **target** obstruction, not no hazards.
- Review overlays mark "Your mark" (blue) versus "Lesson focus" (lime) and accompany the comparison with text. None shows text instead of a fictitious target region.
- Two sequential bus endings retain the existing overlay sequence, and each displays a short, response-specific sentence. The original narrative remains behind an expandable disclosure. Replay does not alter the locked record.
- "Try this scene again" uses A's existing `restart` callback to create a fresh attempt. The final scene has a clear completion message instead of a permanently disabled Next button. Earlier navigation still requires the complete two-ending review.
- Decorative observe panel removed. Review hierarchy/typography and 375px layout CSS compacted. Images are the existing final B-authored SVGs.

## Regression scope

`tests/lessonPresentation.test.ts` exercises supported, mistaken and mixed answers, conditional responses, clear-view none, both languages, reordered answer IDs, mismatched scene/version/schema and immutable-record retry. Original engine and storage tests must also continue to pass.

## Browser acceptance checklist (not replaceable by unit tests)

On a connected environment using Node 22.16.x/npm 10.x, run `npm ci`, `npm run test`, `npm run typecheck`, `npm run build`, `npm run verify:repo`, and `npm run dev`. Check at 1440px and emulated **375px** using the real Vite application and B's existing SVGs:

1. Bus scene: support case (`space-beyond-bus`, `ease-prepare-to-stop`, `bus-hides-conflict`). Mark and focus should be visibly distinguishable; feedback stays provisional; both endings and replay are available; original locked record stays the same.
2. Bus scene: mistake (`space-beyond-bus`, `horn-hold-speed`, `horn-clears-risk`) and mixed case (same observation, `horn-hold-speed`, `bus-hides-conflict`). Verify the response remains a concern despite good recognition/reason; first and second ending messages refer to the selected action.
3. Side-street scene: choose the van edge, `shift-center-to-see`, `centre-improves-sightline`. Verify explicitly conditional response and no invented outcome video.
4. Clear-view scene: choose `none`, `ease-and-check`, `side-street-still-needs-checking`. Verify no intended rectangle, absence of target obstruction explained, ongoing road hazards noted, caution not marked as wrong, final completion appears.
5. Switch English/Hindi before and after answer lock; keyboard alternatives, pointer taps, next-scene gating, retry preserving old records, corrupt storage and storage-denied modes; verify overlays track final artwork at 375px.

Capture desktop/375px screenshots of the **actual combined application**, browser console and step-by-step log. Physical-device QA is still required later and must not be claimed from emulation.

## Environment limitation

This tool environment cannot resolve `registry.npmjs.org`; the npm cache lacks Vite 6.4.4. Thus a clean Vite-powered browser session and **real** app screenshots cannot be produced here. TypeScript transpile syntax checks are supplemental and are not a successful application typecheck. Report `npm ci`, full typecheck and build as blocked and do not substitute old screenshots or mock browser renders.
