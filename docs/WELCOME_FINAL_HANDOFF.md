# BlindSpot integrated welcome + final van artwork — independent review handoff

This branch descends from accepted `400201bc3ebf610d24a6f6bbe245ffb3c42a949c` and does not reset or discard the accepted UI pass. It adds a bilingual welcome page and composits the latest van correction from a preserved donor layer without regenerating the bus or clear background.

## What changed

- `src/App.tsx` — gated welcome-to-practice composition, locale preservation and focus/scroll on entry. No change to answer/record engine.
- `src/welcome/WelcomePage.tsx` — accessible interactive bus demonstration and full welcome experience with two explicit outcomes.
- `src/welcome/content.ts` — complete English and Hindi text for all sections including roadmap, caveats and CTAs.
- `src/styles/welcome.css` — editorial responsive navy/teal layout, system Hindi font fallback and keyboard focus.
- `src/integration/welcomeFlow.ts` — separate ephemeral preview state; never stored in a practice attempt.
- `src/content/scenes/unfamiliarBlocked.ts` — blocked artwork scene version `1.2.3-provisional` only. Existing hotspot stays at the right-hand partially screened junction; no semantic IDs or scoring mapping change.
- `public/scenes/unfamiliar-blocked-01/{van-shadow-layer.png,base.png}` — van cutout and contact shadow over fixed clear background. Existing bus and clear assets not edited.
- `assets/source-artwork/` — preserved donor and foreground mask to allow exact deterministic rebuilding, not learner-facing.
- `scripts/rebuild-van-layer.py`, `scripts/verify-artwork.py`, `tests/artworkIntegration.test.ts`, `tests/welcome.test.ts`, `README.md`, `index.html`, `docs/ASSET_CREDITS.md` — verification, regression coverage, repo/metadata documentation.

## Frozen invariants

- Scene schema version 1; IDs and answer semantics unchanged; reviewedCriteria remains null.
- Scene 1 training endings remain sequential and independent of welcome demo toggles.
- Clear-junction and bus images and actor overlay have unchanged decoded-pixel hashes.
- Image blocked view = `Image.alpha_composite(frozen_clear, van_shadow_layer)` pixel-for-pixel. No changed RGB pixel with van alpha zero.
- Welcome Start transitions to the same observation state (not answering) exactly once, with no lock or record write. `usePracticeCoordinator` remains sole owner of locale, attempt, feedback, storage and navigation.

## Real browser test matrix required

1. Desktop welcome English, language switch to Hindi and back; test font and visible focus, no overflow.
2. 375px welcome English/Hindi: first CTA readily visible, complete uncropped images, no horizontal scroll.
3. Example preview: initially only Explore; Nobody and Pedestrian buttons afterwards; actor appears in identical full-frame bus position only in second state. Confirm no change to practice records or ending progression.
4. Start and rapid repeat activation: one transition into Scene 1 observation, scroll reset, focused practice heading and preserved locale.
5. Scene 1 region tap, keyboard selection, response/reason, lock, visible review, both endings in order and replay without unlocking.
6. Scenes 2 and 3: blocked-region tap matches right-hand junction, clear-view none, mixed/supported/mistaken feedback and new-attempt retry history.
7. Corrupt, denied or unavailable localStorage, including visible warnings with no crashes and no overwrite of corrupt records.
8. Browser console/asset requests, desktop plus exact 375px viewport, screenshots of welcome, bilingual demo, observations and result reviews.

Screenshots of source images or a compatibility harness **do not** constitute running-app screenshots. Never claim browser QA without launching the compiled actual React/Vite app.

## Verification commands (Node 22.16.x/npm 10.x)

```powershell
node --version
npm --version
npm ci
npm run test
npm run typecheck
npm run build
npm run verify:repo
python scripts/rebuild-van-layer.py
python scripts/verify-artwork.py
npm run dev
```

Use a Python environment with Pillow and NumPy installed for the two pixel scripts. Open local Vite URL, emulate 375px, capture real screenshots. Do not publish or submit before independent review.

## Source-level limitations

The npm registry is unreachable in this execution sandbox, so `npm ci`, full TypeScript app typecheck, Vite build and actual browser interaction/screenshots may be blocked. Command logs are packed alongside the release ZIP; their failures should not be reinterpreted as application passes. Test success checks logic and pixel invariants, not visual usability or rider outcomes.
