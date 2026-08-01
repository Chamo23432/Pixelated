// Reads data/apps.json and builds a download card for each app.
// To add a new app: add an entry to data/apps.json (and drop its icon
// in assets/app-icons/) — nothing here needs to change.

const ICONS = {
  windows: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  linux: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 014 4v3a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M6 21c0-3 3-5 6-5s6 2 6 5"/></svg>`,
  portable: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>`,
  lite: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>`
};

const LABELS = {
  windows: "Windows (.exe)",
  linux: "Linux (AppImage)",
  portable: "Portable",
  lite: "Lite"
};

async function loadApps() {
  const list = document.getElementById("app-list");
  if (!list) return;

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  try {
    const res = await fetch("data/apps.json");
    if (!res.ok) throw new Error("Failed to load apps.json");
    let apps = await res.json();

    if (category) {
      apps = apps.filter(a => (a.category || "").toLowerCase() === category.toLowerCase());
      const heading = document.getElementById("downloads-filter-label");
      if (heading) heading.textContent = `Category: ${category}`;
    }

    if (!apps.length) {
      list.innerHTML = category
        ? `<div class="coming-soon">No apps in "${category}" yet — check back soon.</div>`
        : `<div class="coming-soon">No apps published yet — check back soon.</div>`;
      return;
    }

    list.innerHTML = apps.map(renderAppCard).join("") +
      `<div class="coming-soon">More apps are on the way — check back soon.</div>`;
  } catch (err) {
    console.error(err);
    list.innerHTML = `<div class="state-msg">Couldn't load the app list right now.</div>`;
  }
}

function renderAppCard(app) {
  const initial = app.name ? app.name.charAt(0).toUpperCase() : "?";
  const iconHtml = app.icon
    ? `<img src="${app.icon}" alt="${app.name} icon" onerror="this.parentElement.textContent='${initial}'">`
    : initial;

  const buttons = Object.entries(app.downloads || {})
    .map(([key, url]) => {
      if (!url) return "";
      const icon = ICONS[key] || "";
      const label = LABELS[key] || key;
      return `<a href="${url}" class="dl-btn" target="_blank" rel="noopener">${icon}${label}</a>`;
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

document.addEventListener("DOMContentLoaded", loadApps);
