# Pixelated — Site Structure

## Adding a new download (drop-in system)

Each brand has its own folder under `data/`:

```
data/
├── pixelated/
│   ├── manifest.json    ← list of apps (Jot, FileFlow, Lens, Egypt Academy...)
│   └── files/            ← drop the actual .exe/.AppImage/.zip files here
├── sedico13/
│   ├── manifest.json    ← PixelOS builds (ISOs)
│   └── files/            ← drop the .iso file here
├── pixelated-studios/
│   ├── manifest.json    ← games
│   └── files/            ← drop game installers/builds here
└── themes/
    └── manifest.json     ← themes for the Pixel Web Store (see below)
```

**To add a new file (app, ISO, or game):**
1. Drop the real file into that brand's `files/` folder — e.g. `data/sedico13/files/pixelos-1.0.iso`.
2. Open that brand's `manifest.json` and add an entry pointing at it:
```json
{
  "id": "pixelos",
  "name": "PixelOS",
  "description": "The first public build of PixelOS.",
  "category": "System",
  "version": "1.0.0",
  "icon": "assets/app-icons/pixelos.png",
  "downloads": {
    "iso": "data/sedico13/files/pixelos-1.0.iso"
  }
}
```
3. Save — it appears automatically on that brand's downloads section (Downloads page for Pixelated, the downloads section on the Sedico13 page for PixelOS, or the Studios page for games) and in the Pixel Web Store. No HTML editing needed.

Supported download keys: `windows`, `linux`, `mac`, `portable`, `lite`, `iso` — each renders its own labeled button automatically.

## Pixel Web Store (`store.html`)

Browses all three brands' manifests in one place, with a brand filter
(All / Pixelated / Sedico13 / Studios). Also has a **Themes** tab.

## Per-app theme system

Each Pixelated app (Jot, FileFlow, Lens) has its own theme system with a
settings gear icon, storing the chosen theme under its own localStorage
key so themes never leak between apps:

- Jot → `pixelated_notes_theme`
- FileFlow → `pixelated_converter_theme`
- Lens → `pixelated_imagetools_theme`

**Themes added through the Pixel Web Store** are listed in
`data/themes/manifest.json`. Each entry is tagged to exactly one app via
its `"app"` field (`jot`, `fileflow`, or `lens`) and only shows up in that
app's section of the Store. Clicking "Set as theme" writes the choice to
that app's own localStorage key — opening the app on the same device/browser
will already have it applied.

**To add a new theme:** add an entry to `data/themes/manifest.json`:
```json
{
  "id": "jot-my-theme",
  "name": "My Theme",
  "app": "jot",
  "appName": "Jot",
  "description": "One line about the vibe.",
  "preview": { "bg":"#000000", "accent1":"#fff", "accent2":"#fff", "accent3":"#fff" },
  "vars": { "--bg":"#000000","--panel":"#0d0d0d","--panel2":"#161616","--border":"#242424","--text":"#ffffff","--dim":"#999999","--accent1":"#fff","--accent2":"#fff","--accent3":"#fff" }
}
```
No app code changes needed — apps read unrecognized theme IDs from a shared
`pixelated_store_themes` localStorage entry that the Store writes to.

## Running locally

The site uses `fetch()` for manifests, so it needs a local server (not
`file://`):
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.
