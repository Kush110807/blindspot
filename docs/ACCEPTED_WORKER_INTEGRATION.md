# BlindSpot — A+B+C accepted-worker integration handoff

Integration candidate, **not accepted and not published**. See logs bundled separately with the handoff ZIP.

## Full Git history and owned-file preservation

- Accepted A tip: `1d711b14f96eaea9e3b311c10b260abe9ac2d08f`
- Original B implementation: `e0c6a0f67800b3ccfd8fdd7c1874d591fec4822a`
- Accepted B repair: `bcd0b5de2ad475ba72775f8e2e1431e1c67ba5f5`
- Original C implementation: `ac5e803` (full value available in `git log`)
- Accepted C repair: `42175db5186d6a8d51ac76df13540ee8eee05312`

Both bundles passed `git bundle verify`, share M1 ancestor `3bb4fff2c6ba5abcb0d16ae22766f3de91c3b47e`, and were imported by full-history merges on the A runtime branch. The merge imports the **original AND repair commits** from each worker, not repair-only patches. Worker source files were not edited. The A-only `src/integration/slots.ts` connects the frozen named exports. Added integration tests use B's actual three scenes, not fixture-only examples.

## Independent checks in this environment

- Node `22.16.0`, npm `10.9.2`.
- `npm run test`: 34/34 PASS (28 original + 6 accepted-worker integration tests).
- All four final SVG artwork files parsed as valid XML and exist at their authored paths.
- `catalogueErrors(scenes)`: [] (all three scenes provisional).
- `npm ci`: attempted; network registry resolution unavailable. `npm ci --offline`: FAIL `ENOTCACHED` for Vite 6.4.4.
- `npm run typecheck`: FAIL TS2688, `vite/client` missing because packages are not installed.
- `npm run build`: FAIL at the same missing dependency precondition; no production bundle produced.
- `npm run verify:repo`: run again after final Git commit and clean tree; see accompanying logs.
- Desktop/375px integrated-browser screenshots: **not captured**. Do not use C's isolated interface screenshots or the earlier Windows foundation screenshots as evidence of actual A+B+C browser rendering.

## Mandatory independent reviewer/browser matrix

On a supported, connected Node 22.16.x/npm 10.x machine, after extracting the canonical ZIP and checking the exact SHA:

```bash
npm ci
npm run test
npm run typecheck
npm run build
npm run verify:repo
npm run dev
```

Capture one desktop and one Chrome DevTools **375px** screenshot of the **actual integrated running app** showing B's own scene image. Verify all three scene order and English/Hindi text; tap/keyboard region choice and clear-view `none`; lock immutability and recorded answer summary; visible explanations only after review; two distinct training endings from identical initial evidence plus replay; no progression before both training endings; assessment never leaks hints; navigation and restart; local storage present, malformed and unavailable. Inspect DevTools Console and asset/network requests; no fake learner scores, personal-data collection or instructor endorsement. Record the browser version, local viewport, screenshot filenames and results. Physical phone testing is additional release QA, not inferable from emulation.

## Scope/credits

Only three authored scenes and the frozen B/C exports are integrated. No instructor validation, live services, backend, scorecard, login, physics engine or publication. Authored SVG and C interface credits remain in their worker-owned notes. Do not edit those files from integration without a further review request.
