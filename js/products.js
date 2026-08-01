// Loads data/pixelated/manifest.json and data/pixelated-studios/manifest.json
// and fills in the "N apps available" text on each category card in
// products.html. Category names must match the "category" field used
// in each manifest's entries.

async function loadCategoryCounts() {
  try {
    const [pixelatedRes, studiosRes] = await Promise.all([
      fetch("data/pixelated/manifest.json"),
      fetch("data/pixelated-studios/manifest.json")
    ]);
    const apps = pixelatedRes.ok ? await pixelatedRes.json() : [];
    const games = studiosRes.ok ? await studiosRes.json() : [];

    const counts = {};
    apps.forEach(app => {
      const cat = app.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    counts["Games"] = games.length;

    const categoryIds = {
      "Academies": "count-academies",
      "System": "count-system",
      "Utilities": "count-utilities",
      "Games": "count-games",
      "Browsers": "count-browsers"
    };

    Object.entries(categoryIds).forEach(([cat, id]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const n = counts[cat] || 0;
      el.textContent = n === 0 ? "No apps yet" : `${n} app${n === 1 ? "" : "s"} available`;
    });
  } catch (err) {
    console.error(err);
    document.querySelectorAll(".cat-count").forEach(el => {
      el.textContent = "";
    });
  }
}

document.addEventListener("DOMContentLoaded", loadCategoryCounts);
