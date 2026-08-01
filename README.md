# Pixelated — Site Structure

## Adding a new download (drop-in system)

Each brand has its own folder under `data/`:

```
data/
├── pixelated/manifest.json + files/        ← Jot, FileFlow, Lens, Egypt Academy...
├── sedico13/manifest.json + files/          ← PixelOS builds (ISOs)
├── pixelated-studios/manifest.json + files/ ← games
├── mods/manifest.json + files/               ← game mods (Pixel Web Store)
└── themes/manifest.json                       ← app themes (Pixel Web Store)
```

**To add a new file (app, ISO, game, or mod):**
1. Drop the real file into that brand's `files/` folder.
2. Add an entry to that folder's `manifest.json` pointing at it.
3. Save — it shows up automatically wherever it belongs (Downloads page,
   Sedico13 page, Studios page, or the Store's Mods tab). No HTML editing.

Supported download keys: `windows`, `linux`, `mac`, `portable`, `lite`, `iso`.

## Pixel Web Store (`store.html`)

Scoped to exactly two things:
- **Themes** — browse and download themes for Jot, FileFlow, and Lens
- **Mods** — for Pixelated Studios games (drop-in system, same as everything else)

The actual apps/games/OS downloads live on their own pages (Downloads,
Sedico13, Pixelated Studios) — the Store does not duplicate them.

## How themes actually work

Themes are plain `.json` files. A user:
1. Downloads a theme from the Store (e.g. "Future" for Jot).
2. Opens Jot → Settings → drags the downloaded file into the theme box.
3. The app checks the file's `"app"` field — if it says `"jot"`, it's
   accepted and saved to Jot's own theme library (so it's there for good,
   no need to re-import). If it's a theme for a different app, it's
   rejected with a message explaining why.

Each app's theme library is stored separately (their own localStorage
key), so a theme downloaded for Jot can never show up in FileFlow or Lens.

**To add a new theme:** create a `.json` file like this and drop it in
`data/themes/` (plus add an entry to `data/themes/manifest.json` so it's
listed in the Store):
```json
{
  "app": "jot",
  "id": "jot-my-theme",
  "name": "My Theme",
  "desc": "One line about the vibe.",
  "vars": { "--bg":"#000000","--panel":"#0d0d0d","--panel2":"#161616","--border":"#242424","--text":"#ffffff","--dim":"#999999","--accent1":"#fff","--accent2":"#fff","--accent3":"#fff" }
}
```
`app` must be one of: `jot`, `fileflow`, `lens` — or the id of any future
app once it ships with the same theme system.

## Every future app gets the theme system

From now on, every new Pixelated app ships with the same theme
infrastructure (Settings panel, drag-and-drop import, per-app library) —
even before it has any actual themes designed for it. Themes get added
to the Store later, once ready, without changing the app itself.

## Running locally

The site uses `fetch()` for manifests, so it needs a local server:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.
