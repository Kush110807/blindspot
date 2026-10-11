# Navigation repair candidate — independent review

Starting tip: `4fbdfa6bcb46fc94a029ae4bd1a0f31cb6e331d5`.

## Scope

Only navigation presentation and ephemeral welcome-screen routing were modified. No scene imagery, tap region, authored feedback, locked-snapshot engine, record schema, storage handling, or dependency versions changed.

- The Scene 1 review footer displays disabled **Continue to next scene**, explanatory guidance and **View the other ending** until the sequential second ending is reached. The coordinator's existing `canAdvance` gate remains authoritative.
- Once both endings are viewed, **Continue to next scene** becomes enabled. Scene 2 advances to Scene 3 on review; Scene 3 shows the final completion message.
- **Back to welcome** in English/Hindi only toggles ephemeral welcome routing. The practice coordinator remains mounted with the same attempts, choices, locale, saved records, and ending progression. The welcome CTA becomes **Resume practice** once practice has been entered.
- Heading focus and document scroll move to the appropriate page/scene or ending after a navigation transition. Desktop and 375px header controls remain operable; focus visibility is preserved.

## Browser QA required on a machine with installed dependencies

1. Run `npm ci`, `npm run test`, `npm run typecheck`, `npm run build`, `npm run verify:repo` and `python scripts/verify-artwork.py`.
2. In Chrome at desktop and 375px, verify Welcome → Scene 1 observe/answer/review. Review footer must show disabled Continue and direct other-ending action until ending 2.
3. View ending 2, activate Continue, complete Scene 2, activate Continue, complete Scene 3; confirm completion.
4. In both English and Hindi, use Back to welcome/Resume during answering and again during review/second ending. Verify locale, answers, records and progress remain unchanged.
5. Verify keyboard tab order, focus indications, heading focus after transitions, scroll reset, 375px horizontal overflow, and storage-failure handling.

Do not claim browser verification from reducer/source tests alone. Instructor review remains provisional. No release or publication.
