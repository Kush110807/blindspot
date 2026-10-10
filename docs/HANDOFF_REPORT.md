# BlindSpot — GitHub repository-preparation candidate (M0/M1)

The project is **local** and remains an unaccepted M0/M1 foundation candidate. No GitHub repository has been created, configured as `origin`, published or submitted. The coding-phase form needs a repository URL eventually; none exists yet.

## Baseline and changes

- Starting Git baseline: `22d8bbd08345ef8341965290baade897d72334b0` (`main`).
- New repository-preparation commit: record the exact SHA from `git rev-parse HEAD` in the **external delivery report** to avoid embedding a self-referential SHA in this commit.
- This pass changes README, `.gitignore`, `package.json`; adds `.gitattributes`, asset/source credits, readiness checklist, repository check script and this report.
- Scene contracts, scene fixture, engine implementation and UI are **not expanded beyond M0/M1**.

## Recorded checks

- Node `v22.16.0`, npm `10.9.2`, Git `2.47.3`.
- `npm run test`: **15/15 PASS** (zero failed).
- `tsc --project tsconfig.contracts.json`: **PASS** using globally available TypeScript `5.8.3`.
- `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=12000`: **FAIL**, npm registry DNS `EAI_AGAIN`.
- `npm run verify:repo`: **EXPECTED FAIL** while the required npm-generated `package-lock.json` is missing (and while any changes are uncommitted).
- `npm ci`, full `npm run typecheck`/`npm run build`, Vite server, browser render, phone screenshot, and clean external registry install: **NOT PASSING / NOT VERIFIED**.

The lack of a lockfile is a **hard release blocker**. Do not substitute unrelated lock data or describe this candidate as submission-ready. A Windows/macOS/Linux machine with npm registry access must generate and commit a genuine lockfile, run `npm ci`, full checks, and perform browser evidence collection. Independent M1 review then accepts a new exact SHA before parallel workstreams B/C begin.

See `README.md` and `docs/REPOSITORY_CHECKLIST.md` for command details, GitHub publication safeguards, and future handoff instructions.
