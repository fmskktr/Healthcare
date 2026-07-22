# Nicotine Addiction Management Toolkit — GitHub Pages / PWA bundle

This folder is ready to push straight to a GitHub repo and deploy with
GitHub Pages. Once live, opening the link on a phone will:
- **Android** — automatically show an in-app "Install" banner; one tap
  triggers Chrome's native install prompt.
- **iPhone** — show the same banner, but tapping it opens a 3-step sheet
  ("Tap Share → Add to Home Screen → Add"), since Apple doesn't allow any
  website to trigger installation directly — this is the closest possible
  equivalent on iOS.

Contents:
```
index.html      the app itself (PWA-enabled)
manifest.json   tells the OS the app's name, icon, colours
sw.js           service worker — enables offline use + is required for the
                install prompt to appear on Android
icons/          app icons in every size iOS/Android ask for
.nojekyll       tells GitHub Pages to serve files as-is (skips Jekyll
                processing, which can otherwise mangle the icons/ folder)
```

## 1. Push to GitHub

1. Create a new repo (public or private both work with GitHub Pages on a
   free account, though private repos need GitHub Pro/Team/Enterprise for
   Pages — public is simplest).
2. Upload **all 6 items above** — `index.html`, `manifest.json`, `sw.js`,
   `icons/`, `.nojekyll`, and this `README.md` — to the repo root. (Drag and
   drop into the GitHub web UI works fine, or `git add . && git commit &&
   git push` if you're working from the command line. `.nojekyll` has no
   filename after the dot — some drag-and-drop uploaders hide dotfiles, so
   if you don't see it after uploading, add it manually via "Add file →
   Create new file" and name it exactly `.nojekyll`, leaving it empty.)
3. Repo → **Settings → Pages** → under "Build and deployment", set
   **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)** →
   Save.
4. GitHub will give you the live URL, typically
   `https://<your-username>.github.io/<repo-name>/` — it can take a minute
   or two to go live the first time.

## 2. Test it

Open that URL on an Android phone in Chrome — the install banner should
appear within a second or two. On an iPhone, open it in Safari (not Chrome
— iOS only allows installation from Safari) and confirm the banner appears
and the instructions sheet opens correctly.

To double check the technical install criteria are met on desktop: open the
URL in Chrome, DevTools → Application → Manifest, and it should show a
green "Installability" check with no errors.

## 3. Updating the app later

Browsers cache PWAs aggressively so installed copies load instantly and
work offline. When you push a content change:
1. Edit `index.html` as needed.
2. Open `sw.js` and bump the version number, e.g.
   `const CACHE_NAME = "nicotine-toolkit-v5";` → `"...-v6";`
   (this one line forces every installed copy to fetch the new version on
   next launch — skip it and users may keep seeing the old cached version).
3. Commit and push — GitHub Pages redeploys automatically, usually within
   a minute.
