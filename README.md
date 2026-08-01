# Pixelated — Site Structure

```
pixelated/
├── index.html              → Home page
├── products.html             → Products page (5 fixed categories)
├── about.html                 → About page
├── contact.html                → Contact page
├── downloads/
│   └── index.html             → Downloads page (auto-generated from data/apps.json)
├── data/
│   └── apps.json                → EDIT THIS to add/change/remove apps and download links
├── assets/
│   ├── icon/
│   │   ├── logo.svg              → Logo source (for reference/editing)
│   │   └── logo.png                → Used ONLY as the browser tab favicon
│   └── app-icons/
│       └── (your app icons)        → Icons for each app shown on the Downloads page
├── css/
│   └── style.css                    → All styling, shared across every page
└── js/
    ├── downloads.js                   → Reads apps.json and builds the download cards
    └── products.js                     → Fills in live app counts on the Products page
```

## How to update things

### The logo
The logo is now built directly in code (inline SVG) instead of a cropped
image, so it renders crisp and perfectly framed at every size — nav, footer,
and the big hero version. `assets/icon/logo.svg` holds a copy of it for
reference. The only place a PNG is still used is the browser tab favicon
(`assets/icon/logo.png`), since favicons need a raster format — replace that
file if you want a different tab icon.

If you want to change the logo's look (colors, shape), open `css/style.css`
and edit the SVG markup inside the `<svg>` blocks in `index.html`,
`products.html`, `about.html`, `contact.html`, and `downloads/index.html`
(nav + footer + hero).

### Product categories
`products.html` currently shows five fixed categories: **Academies, System,
Utilities, Games, Browsers**. Each category card links to the Downloads page
filtered to that category (e.g. `downloads/index.html?category=Games`) and
shows a live "N apps available" count pulled from `data/apps.json`.

To add a new category, duplicate one of the `.cat-card` blocks in
`products.html`, give it a new icon/name, and add a matching entry to the
`categoryIds` map in `js/products.js`.

### Add a new app / change download links
Open `data/apps.json` and add a new entry, e.g.:

```json
{
  "id": "my-new-app",
  "name": "My New App",
  "description": "A short one-line description.",
  "category": "Academies",
  "version": "1.0.0",
  "icon": "assets/app-icons/my-new-app.png",
  "downloads": {
    "windows": "https://yoursite.com/downloads/my-new-app.exe",
    "linux": "https://yoursite.com/downloads/my-new-app.AppImage",
    "portable": "https://yoursite.com/downloads/my-new-app-portable.zip",
    "lite": "https://yoursite.com/downloads/my-new-app-lite.zip"
  }
}
```

The `"category"` value must exactly match one of the five categories:
`Academies`, `System`, `Utilities`, `Games`, `Browsers` — that's how the
Products page count and filter links find it.

Drop the matching icon into `assets/app-icons/`. Any of the four download keys
can be left out if that build doesn't exist yet — the button just won't show.
The Downloads page rebuilds itself automatically from this file — no HTML editing needed.

### Edit About / Contact text
Just edit the text directly inside `about.html` / `contact.html`.

## Important: run this through a local server

The Downloads page loads `data/apps.json` using JavaScript's `fetch()`, which
browsers block when you open the HTML file directly (`file://...`). To view it
locally, run a simple server from the project folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. Once you upload the site to
real hosting (Netlify, Vercel, GitHub Pages, your own server, etc.), it will
work normally with no extra setup.

## Contact form

The contact form on `contact.html` is currently a placeholder (it just shows
an alert). To make it actually send you messages, connect it to a service like
Formspree, EmailJS, or your own backend endpoint.
