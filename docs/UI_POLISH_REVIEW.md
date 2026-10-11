# BlindSpot — coordinated UI-polish candidate

Starting commit: `9d79f120a728d1ebe1fc0351a23d633a6a646dd3`

## Scope

Presentation-only changes to `src/ui/PracticeScreen.tsx`, `src/ui/reviewTone.ts`, `src/styles/practice.css` and UI regression tests. The three authored scenes, images, versions, tap bounds, rubric IDs, contracts, locked snapshots, records, storage and replay/navigation engine are unchanged. Instructor review remains provisional; no score or safety guarantee is displayed.

## Visible behavior

- Observe: no forced panel height, short instruction adjacent to the primary continue button.
- Answer: full uncropped art with a sticky desktop scene; choices use normal page scroll without nested scrolling. Selection is explicit in fill, border, radio state and aria-pressed.
- Lock: neutral lock symbol and "submitted, not scored" message.
- Review: overall colour derived from recognition, response and reason (not merely the action); mixed is amber, fully supported green, reconsideration coral, conditional amber. One full-width takeaway with immediate tailored next action, followed by full-width scene/outcome grouping and criterion cards with visible remediation.
- Ending: heading, current scene frame, choice-specific ending explanation, expandable detail and sequential-next control form one review section. Replay remains secondary. Navigation gate is supplied unchanged by A.
- Submitted choices: shown once, compactly, in review and sourced only from the locked snapshot.
- Provisional disclosure: one note, not repeated in multiple oversized callouts.
- Phone: single column, uncropped artwork, wide touch targets, Hindi system-font fallbacks, and no nested scroll zones.
- Available storage: disclosure collapsed in footer details; storage failures remain visible.

## Verification

Run `npm ci`, `npm run test`, `npm run typecheck`, `npm run build`, `npm run verify:repo`, and `python3 scripts/verify-artwork.py` on a system with registry access. A source-only test pass or syntax check is **not** evidence that the running React/Vite application renders correctly.

### Real browser acceptance matrix (pending where npm is unavailable)

Desktop (1440×900 recommended) and mobile browser emulation (375×812):

1. Observe: art fully visible, compact instruction and CTA, no large vertical gap.
2. Answer: scroll through location/action/reason options; on desktop the scene remains sticky. Confirm selected fill, border and keyboard focus.
3. Bus supported: choose the intended bus region, draft-supported action and reason. Review headline should be green; check "What to keep doing".
4. Bus mixed: select intended bus region, draft-supported response, and incorrect reason; headline must not be green. Confirm visible reason remediation. Repeat with wrong region and supported action.
5. Bus mistaken: choose non-target region, hold-speed action, wrong reason; review must be coral/mixed, not all-green.
6. Training ending 1: confirm first ending and no next-scene button. View ending 2; confirm pedestrian overlay and original locked choices. Replay, then check next scene remains gated until ending 2 again.
7. Both assessments: blocked and clear-view (explicit "none"); tap aligned areas and inspect highlights; confirm no horizontal overflow.
8. Hindi: switch before and after locking, check Devanagari legibility and semantic selections unchanged.
9. Retry: new attempt, old record still present, never change locked submission.
10. Storage failure/corrupt storage: notice visible and practice remains usable, corrupt bytes not overwritten.

Capture actual browser screenshots for observe, answer, supported/mixed/mistaken review and Hindi at both desktop and 375px. Do not substitute scene artwork previews.
