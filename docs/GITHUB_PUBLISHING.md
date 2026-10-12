# Publish the existing BlindSpot Git repository — only with owner authorization

**No repository creation, GitHub push, public redeployment, or competition submission is part of this package.**

## Local gates on Windows (PowerShell)

Extract the supplied integrated ZIP. Open PowerShell in its `project` folder (it already includes `.git`). Install **Node 22.16.x / npm 10.x** and use an internet-connected machine:

```powershell
node --version
npm.cmd --version
git rev-parse HEAD
git status --short
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

Check the production preview in a real browser at desktop and 375px, including English/Hindi, image loading/error behavior, three-scene progression, both training endings, feedback and Back/Resume. Check the browser Console and Network tabs for missing assets; fix any regressions **before** publication.

## Publishing an already existing Git history

When the checks pass and the owner has authorised creation of a GitHub repository, create an **empty** repository through GitHub with no generated README/license/`.gitignore`. Then run, from the existing `project` directory:

```powershell
git status --short
git rev-parse HEAD
git branch --show-current
# This source package currently has no local main branch. Only for a new empty remote:
git switch -c main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

If `main` or `origin` already exists locally, or the destination repository already contains commits, **stop and inspect first** (`git branch -a`, `git remote -v`, `git fetch origin`). Do not force-push or rewrite anyone's history. Substitute your own GitHub URL only after it exists. Check the README rendering and commit SHA on GitHub after an authorised push.

## Repository and deployment boundaries

- `.git` and source-artwork donor/mask assets are retained in the **source ZIP/repository** for provenance and reproducibility.
- Static hosting publishes only the verified `dist/` directory. Neither raw source nor any learner records belong in the public site artifact.
- Never commit `.env`, access keys, browser storage exports, `node_modules`, `dist`, local logs, editor caches or screenshots containing personal information.
- `.gitignore` alone does not protect historical commits. Review historical Git objects and source rights before making the source public.
- The existing live Netlify demo is https://err404-blindspot.netlify.app/ and is **not** proof that this new source commit has been deployed there.
- Credit synthetic artwork and AI assistance as detailed in `docs/ASSET_CREDITS.md`; scenario feedback is provisional, without instructor validation or effectiveness claims.
