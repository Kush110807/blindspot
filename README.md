# BlindSpot — M0/M1 foundation (review candidate)

**M0/M1 only.** React + TypeScript browser skeleton and shared contracts. This does **not** implement the submitted three-scene experience, nor does it claim its educational content or safety effectiveness has been reviewed. Do not submit this partial foundation as the final functional learning app.

Source of scope: `docs/CODING_ROADMAP_REFERENCE.md` and the final `BlindSpot_Hackoverflow_Submission_Ready(1).pdf` proposal (consulted; PDF not duplicated in package). Event FAQ at https://hackoverflow.arhn.in/ says source code + run instructions + functional ZIP/TAR submission through Unstop; **live per-field submission form not verified**.

## Toolchain

- **Node.js 22.16.x** (or newer 22.x as allowed in `package.json`)
- npm 10.x
- Any current browser; actual phone/browser test still outstanding
- No backend, no login, no API key, no analytics, no external image service

## Setup and run on a machine with npm registry access

```bash
cd blindspot-m0m1
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173/). The screen must say **"The foundation is in place."** with a diagnostic section; it does not yet show real rider scenes.

For future clean reproducibility, after generating and **committing** the npm lockfile:

```bash
npm ci
npm run check
npm run preview
```

`npm run test`: Node built-in test suite (15/15 passing in the authoring environment). `tsc --project tsconfig.contracts.json`: dependency-free core TypeScript check (passed). `npm run typecheck`: TypeScript. `npm run build`: TypeScript + Vite build to `dist/`. `npm run preview`: serve an existing build.

**Known environment blocker:** the foundation-generation sandbox could not access the npm registry (`EAI_AGAIN`). A genuine transitive `package-lock.json` therefore could **not** be generated or verified. Do **not** infer `npm ci`, `npm run dev`, React rendering or Vite build have been checked. A reviewer with network access must run `npm install` to generate/commit the lockfile, then run `npm ci && npm run check && npm run dev` before accepting M1 and starting B/C implementation. Never substitute a fabricated lockfile. Pin versions in `package.json` remain exact.

## Scope implemented

- One minimal mount-only `src/App.tsx` page, CSS-only placeholder (not a verified road illustration)
- Versioned scene model + stable IDs + 2-language strings + fixed normalized tap rectangles + training actor overlays + feedback fragments + provisional/review status
- Pure answer state: observe → answer region/none, response and reason → immutable lock → review/endings
- ID-based response/reason explanations and review-gated criteria; no ending-dependent result classification
- `object-fit:contain` geometry helpers for letterboxing + keyboard alternative contract
- Local records read/write with blocked/corrupt storage fallback; no personal data
- Node tests using a **test-only** scene fixture, not a finished app

## Ownership and contracts

Read `docs/CONTRACTS.md` and `docs/FILE_OWNERSHIP.md` **before** opening content (B) or interface (C) implementation chats. A exclusively owns integration and shared contracts. Future B/C files must be returned against the **exact reviewer-accepted baseline**, not this candidate merely because files exist. Integration owner records acceptance SHAs and merges work in small batches.

## Checks and limitations

- Tests for contract validation, incomplete/immutable lock, stable IDs despite option reordering, both-endings independence, no pre-lock assessment hints in the core API, clear-view `none`, rect/letterbox math, corrupt/unavailable browser storage.
- At this milestone: no actual scene artwork or content, no tap UI, no persisted on-screen attempt, no playback/continuation UI, no translated runtime interface, no scored tests, no browser screenshot or real-phone checks.
- `contentReview` remains provisional unless genuine qualified-instructor review occurs. The test-only instructor-reviewed stub is explicitly fictional, for gating logic tests only.

## Assets and attribution

The mount screen's decorative road is generated entirely in local CSS; it is explicitly a placeholder and **not** scene geometry. No external artwork, fonts, datasets or user-level results are bundled. B must document the origin/license of each new artwork file and never borrow decorative proposal imagery as validated training geometry.
