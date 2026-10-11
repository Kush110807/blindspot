# BlindSpot static deployment — release gate (not yet published)

## Frozen product and host target

- Accepted *product* baseline: `541e50e01f056297feaaef7e7f59c8d0fe08f172`.
- Deployment prep must not change layout, behaviour, learner answer IDs, records, scene versions, assets or the reviewed welcome/Resume flow.
- Root-domain static deployment only; all scene/favicons use leading `/` paths. URL subfolders (including a default GitHub Pages project URL) are **not supported without further edits/review**.
- No server, database, authentication, environment variables, remote service or tracking is needed.

## Build locally first

On Windows PowerShell with Node **22.16.0** and npm **10.9.2** installed:

```powershell
node --version
npm.cmd --version
npm.cmd ci
npm.cmd run test
npm.cmd run typecheck
npm.cmd run build
npm.cmd run verify:static
npm.cmd run verify:repo
python scripts/rebuild-van-layer.py
python scripts/verify-artwork.py
npm.cmd run preview
```

`verify:repo` must be run from a clean committed repository. `verify:static` inspects the actual `dist/` folder created by Vite and fails if required learner scene images/JS/CSS/favicon are missing, or unexpected assets, credential-like files or learner record exports appear. It excludes the scene README and unused van-shadow source layer **from published output only**. The provenance inputs remain in Git source.

## Netlify (configured)

Either connect an approved repo after permission to publish or upload the successful `dist/` directory through Netlify's manual deploy UI. `netlify.toml` specifies `npm run build`, `publish = "dist"`, Node 22.16.0, an SPA fallback, and basic response headers. Set the site at its **root**. Upload **only** built `dist` files; never upload source archive or `.git`. No environment secrets are needed.

## Other hosts

For Cloudflare Pages or another static host, configure the project as Vite with `npm run build`, output `dist`, and Node 22.16.x. If using manual static upload, copy the *contents* of `dist` to the host's document root; keep asset paths rooted at `/`. Configure history fallback to `index.html` if the platform requires it; the current UI itself does not use URL routing. Avoid a public path such as `/blindspot/` until `/scenes` and `/favicon` URLs have been reviewed for non-root hosting.

## Verify on the actual published preview *before* making it public

At desktop and 375px: welcome hero/demo (same bus base, second ending is only pedestrian overlay), English/Hindi, uncut images/no horizontal scrolling, keyboard focus, Start once and locale retention. Verify practice Scene 1 observation/answer/review → both sequential endings → Scene 2 → Scene 3 → completion. From answering and review test Back to welcome → Resume, preserving phase and locked snapshot. Check tapping the image and select-none, criterion-specific corrective feedback, retry immutability, and storage unavailable/corrupt fallback. Check DevTools console/network for missing `/scenes/` or `/favicon` assets, HTTP errors and unhandled exceptions. Do not call source-only regression tests or art previews running-browser verification.

## Static publication boundaries

Included in `dist`: `index.html`, two local favicons, hashed JS/CSS, and four learner-facing image files (bus base, pedestrian overlay, blocked base, clear base).

Excluded from `dist`: source code, `.git`, dependencies, original donor/mask/transparent van reconstruction layer, the scene README, local learner records, `.env`/credentials, review documents, test fixtures and logs. User browser localStorage is not packaged or uploaded. A repository can still contain commit history and provenance; separately review that history before making the *source repository* public.

## Evidence policy

A previous Windows run verified `npm ci`, production build and a foundation screen at an **earlier M1 commit**. That does not establish final-build or browser QA for the frozen navigation design. This package records new command results separately. If `npm ci` cannot resolve npm registry packages, mark typecheck/build and browser steps unverified; **do not deploy a guessed/dist-like artifact or claim a completed check**.

No publication or submission is authorized by this handoff.
