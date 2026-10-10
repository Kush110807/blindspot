# BlindSpot foundation handoff — review candidate

- Task: Implement M0/M1 only. One canonical React/TypeScript skeleton, shared contracts and minimal mount page.
- Source constraints: roadmap and submission-ready proposal. No backend, login, live AI or extra scene catalogue.
- Baseline: exact Git commit provided in accompanying delivery response and sibling handoff file (outside the Git tree to avoid changing the SHA).
- Source code: entire project ZIP with `.git` retained; no `node_modules` or private data.
- Environment: Node 22.16.0, npm 10.9.2, Git 2.47.3.
- **Dependency registry blocked (EAI_AGAIN):** no verified npm installation, package-lock, Vite dev server, Vite production build, browser visual, real-phone screenshots or clean extraction test using installed dependencies.
- Automated Node contract tests: **15/15 PASS** (`node --experimental-strip-types --test tests/*.test.ts`).
- Core-contract TypeScript check: **PASS** (`tsc --project tsconfig.contracts.json`, global TypeScript 5.8.3).
- Browser/app TypeScript build and npm clean install: **NOT RUN** due unavailable npm packages.
- Before acceptance: connect a machine to npm, generate/commit real lockfile, run clean `npm ci`, `npm run check`, browser screen on desktop and phone. Reviewer inspects results and stamps accepted SHA. Do **not** start B/C work against an unaccepted or changing baseline.

## Verification commands

```bash
node --version
npm --version
npm install
npm ci
npm run check
npm run dev
# open shown localhost port, validate mount screen and phone layout
```

Use `docs/FILE_OWNERSHIP.md` for exact B/C paths; `docs/CONTRACTS.md` for schema and ID rules. Future worker report must include changed paths, results of every test actually executed and missing evidence.
