# Hosting HealthLog Pro on GitHub Pages

## 1. Files you need in ONE folder (flat, no subfolders)

```
your-repo/
├── index.html        ← the app (renamed from healthlog_ai.html)
├── manifest.json
├── sw.js
├── icon-192.png
└── icon-512.png
```

**Important:** `index.html` must be named exactly that (not `healthlog_ai.html`) and must sit in the **root** of the repo. GitHub Pages automatically serves `index.html` when someone visits your site's URL — if you keep the old filename, visitors would need to type the full `.../healthlog_ai.html` path instead of just the clean root URL. I've already renamed the copy for you and updated `manifest.json` and `sw.js` to match.

All 5 files must stay in the same folder — the manifest, service worker, and icons are all linked with relative paths (`./`), so moving any of them into a subfolder will break the install prompt.

## 2. Create the repository

1. Go to [github.com](https://github.com) and log in (or sign up — it's free).
2. Click the **+** icon (top right) → **New repository**.
3. Give it a name, e.g. `healthlog-pro`.
4. Set it to **Public** (GitHub Pages on the free plan requires public repos, unless you have GitHub Pro/Team).
5. Click **Create repository**.

## 3. Upload the files

Easiest way (no coding tools needed):

1. On your new repo's page, click **"Add file" → "Upload files"**.
2. Drag in all 5 files: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`.
3. Scroll down, click **Commit changes**.

(If you're comfortable with Git, `git add . && git commit -m "add pwa" && git push` works just as well.)

## 4. Turn on GitHub Pages

1. In your repo, go to **Settings** → **Pages** (left sidebar).
2. Under "Build and deployment" → **Source**, choose **Deploy from a branch**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`. Click **Save**.
4. Wait 30–60 seconds. Refresh the page — a green box will show your live URL:
   ```
   https://your-username.github.io/healthlog-pro/
   ```

That URL is already **HTTPS**, which is required for PWA install to work — no extra setup needed.

## 5. Test it

1. Open the URL above on your phone (Android: any Chrome browser; iPhone: must be Safari).
2. Tap **"⬇️ Install App"** in the app and confirm the install flow works.
3. On desktop Chrome, you can also check **DevTools → Application tab → Manifest** to confirm there are no errors, and **Service Workers** to confirm `sw.js` registered.

## 6. Updating the app later

Whenever you edit the app, upload the changed file(s) again the same way (Add file → Upload files → Commit), or push via Git. GitHub Pages redeploys automatically within a minute. Because of the service worker's caching, users may need to fully close and reopen the installed app (or wait a bit) to see the update — this is normal PWA behavior.

## Common gotchas

- **404 / blank page after enabling Pages:** double-check the file is named exactly `index.html` (lowercase) and sits at the repo root, not inside a subfolder.
- **Install button doesn't appear on Android:** Chrome sometimes takes a moment on first visit to decide the site is installable — reload once. Also confirm you're on `https://` (GitHub Pages URLs always are).
- **Nothing happens on iPhone:** remind users it must be opened in **Safari** — Chrome/Facebook/Instagram's in-app browser on iOS cannot install PWAs at all.
- **Icons look wrong:** replace `icon-192.png` / `icon-512.png` with your real logo, keeping the same filenames and sizes (192×192 and 512×512).
