/* Generic brand manifest loader — reused by Downloads, Sedico13, and
   Pixelated Studios pages. Each brand has its own manifest.json plus
   a files/ folder: drop the real file into files/, add one entry to
   manifest.json pointing at it, and it shows up automatically. No
   HTML editing needed for new releases. */

const ICONS = {
  windows: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  linux: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 014 4v3a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M6 21c0-3 3-5 6-5s6 2 6 5"/></svg>`,
  portable: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>`,
  lite: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>`,
  iso: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`,
  mac: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 015 5c0 2-1 3-2 4 3 0 5 3 5 6 0 3-2 5-4 5-2 0-3-1-4-1s-2 1-4 1c-2 0-4-2-4-5 0-3 2-6 5-6-1-1-2-2-2-4a5 5 0 015-5z"/></svg>`
};

const LABELS = {
  windows: "Windows (.exe)",
  linux: "Linux (AppImage)",
  mac: "macOS (.dmg)",
  portable: "Portable",
  lite: "Lite",
  iso: "ISO Image"
};

async function loadManifest(manifestPath, listElementId, categoryFilter){
  const list = document.getElementById(listElementId);
  if(!list) return;

  try{
    const res = await fetch(manifestPath);
    if(!res.ok) throw new Error("Failed to load manifest");
    let items = await res.json();

    if(categoryFilter){
      items = items.filter(a => (a.category||"").toLowerCase() === categoryFilter.toLowerCase());
    }

    if(!items.length){
      list.innerHTML = `<div class="coming-soon">Nothing published yet — check back soon.</div>`;
      return;
    }

    list.innerHTML = items.map(renderAppCard).join("");
  }catch(err){
    console.error(err);
    list.innerHTML = `<div class="state-msg">Couldn't load the file list right now.</div>`;
  }
}

function renderAppCard(app){
  const initial = app.name ? app.name.charAt(0).toUpperCase() : "?";
  const iconHtml = app.icon
    ? `<img src="${app.icon}" alt="${app.name} icon" onerror="this.parentElement.textContent='${initial}'">`
    : initial;

  const buttons = Object.entries(app.downloads || {})
    .map(([key, url]) => {
      if(!url) return "";
      const icon = ICONS[key] || "";
      const label = LABELS[key] || key;
      return `<a href="${url}" class="dl-btn" download>${icon}${label}</a>`;
    })
    .join("");

  return `
    <div class="app-card">
      <div class="app-icon">${iconHtml}</div>
      <div class="app-info">
        <h3>${app.name}</h3>
        <p>${app.description || ""}</p>
        <div class="app-tags">
          ${app.category ? `<span class="tag">${app.category}</span>` : ""}
          ${app.version ? `<span class="tag">v${app.version}</span>` : ""}
        </div>
      </div>
      <div class="dl-group">${buttons}</div>
    </div>
  `;
}
