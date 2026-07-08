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

**If your repo is completely empty** (you just created it and skipped adding a README):
1. You'll see a page titled "Quick setup" with a line that says *"...or uploading an existing file"* — that phrase is a clickable blue link. Click it.
2. This takes you to the upload page. Drag in all 5 files, then scroll down and click **Commit changes**.

**If your repo already has a file in it** (e.g. you added a README when creating it):
1. Go to the repo's main **Code** tab, where the file list is shown.
2. Look for an **"Add file"** button near the top right of the file list (next to "Go to file"). Click it → choose **"Upload files"** from the dropdown.
3. Drag in all 5 files, scroll down, click **Commit changes**.

**If you still don't see either option:**
- Make sure you're on a **desktop browser** (or "Desktop site" mode if on mobile) — GitHub's mobile web view hides the upload UI on some phones/browsers.
- Make sure you're viewing **your own repo** while **logged in** — the button won't show on repos you don't own or while logged out.
- Alternative that works everywhere: click **"Add file" → "Create new file"**, type the filename (e.g. `manifest.json`), paste the contents in the text box, and commit. Repeat for each of the 5 files. Slower, but works from any device since it avoids the drag-and-drop uploader — for `icon-192.png`/`icon-512.png` (binary images) you'd need the drag-and-drop uploader or Git though, since you can't paste image bytes into the text editor.

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

## 7. Sharing the link so others can install it

### ⚠️ Two different links — only share ONE of them

| | What it looks like | What patients see |
|---|---|---|
| ❌ **Repo page (do NOT share this)** | `https://github.com/your-username/repo-name` | A list of 6 files (`index.html`, `manifest.json`, etc.) — this is the source code page, not the app. There's nothing to "press" here to install anything. |
| ✅ **Pages URL (share THIS one)** | `https://your-username.github.io/repo-name/` | The actual running app, straight away — with the "⬇️ Install App" button ready to tap. No files, no list. |

This is almost certainly what happened with your patient — he was sent (or clicked into) the repo page instead of the Pages URL, so he was staring at 6 files with no obvious button.

**Where to find your correct Pages URL:** go to your repo → **Settings → Pages** — it's shown in the green box near the top, and it always ends in `.github.io/repo-name/` (never `github.com/...`).

Once GitHub Pages is live, your app's URL is just:
```
https://your-username.github.io/repo-name/
```

Anyone who opens that link on their phone will see the same "⬇️ Install App" button you tested. A few things worth telling people when you send it:

- **Send the plain link** via WhatsApp, SMS, or email — no special sharing feature needed.
- **iPhone users must open it in Safari specifically.** If someone taps the link inside WhatsApp, Instagram, or Facebook Messenger, it may open in that app's built-in mini-browser instead of Safari — and installation won't work from there. Tell iPhone recipients: if it doesn't open in Safari automatically, tap the "•••" or share icon in that in-app browser and choose **"Open in Safari"** first.
- **Android users** can open it in any browser, though Chrome gives the smoothest one-tap install.
- **QR code (recommended for elderly patients / in-person sharing):** a QR code pointing to your URL lets people scan-and-open with their camera app instead of typing or tapping a link — often much easier for less tech-savvy users. Free QR generators like https://www.qr-code-generator.com or https://qrcode.tec-it.com let you paste your URL and download a PNG/PDF you can print or send as an image.

If you share your actual `https://your-username.github.io/...` URL with me, I can generate a ready-to-print QR code image for you directly.

## 8. "I deployed it but there's no Install App button"

Check these in order:

**A. Confirm all 5 files actually made it to GitHub.** Go to your repo's Code tab and confirm you see: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` — all at the root, all 5 present. If any are missing, the button JS still runs, but Chrome may refuse installability checks quietly. Re-upload anything missing.

**B. Clear the stale cache on the phone/browser you tested with.** This is the most common cause: if you (or your patient) opened the site earlier while it was still being set up, the service worker cached that *older* page — and a plain cache-first service worker (which is what the first version of `sw.js` used) will keep serving that old cached copy forever, even after you push new files. I've updated `sw.js` to check the network first for the main page now, so this won't keep happening going forward — but you still need to clear what's *already* stuck:

- **Chrome (Android or desktop):** open the site → tap the **🔒 or ⓘ icon** left of the address bar → **Site settings** → **Clear & reset** (or **Storage → Clear data**). Then close the tab fully and reopen the link fresh.
- **Chrome DevTools (desktop, more thorough):** F12 → **Application tab** → **Service Workers** → click **Unregister** → also click **Clear site data** at the top of that panel → reload.
- **Safari (iPhone):** Settings app → Safari → **Advanced → Website Data** → search "github.io" → **Delete**. Then reopen the link.
- **Quickest test either way:** open the link in a fresh **Incognito/Private window** — that bypasses all cached service workers, so if the button shows up there, you've confirmed it's a caching issue on your regular browser profile, not a real bug.

**C. Re-upload the updated `sw.js`** (attached again below) — it now fetches the live page fresh every time instead of trusting an old cache, so this shouldn't recur after future edits.

**D. Give it a moment on first visit.** Chrome sometimes takes a few seconds (or a reload) after first load to finish its installability checks before anything related to native install behavior kicks in.

## Other common gotchas

- **404 / blank page after enabling Pages:** double-check the file is named exactly `index.html` (lowercase) and sits at the repo root, not inside a subfolder.
- **Install button doesn't appear on Android:** Chrome sometimes takes a moment on first visit to decide the site is installable — reload once. Also confirm you're on `https://` (GitHub Pages URLs always are).
- **Nothing happens on iPhone:** remind users it must be opened in **Safari** — Chrome/Facebook/Instagram's in-app browser on iOS cannot install PWAs at all.
- **Icons look wrong:** replace `icon-192.png` / `icon-512.png` with your real logo, keeping the same filenames and sizes (192×192 and 512×512).
