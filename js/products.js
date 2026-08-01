// Loads data/apps.json and fills in the "N apps available" text
// on each category card in products.html. Category names must match
// the "category" field used in apps.json entries.

async function loadCategoryCounts() {
  try {
    const res = await fetch("data/apps.json");
    if (!res.ok) throw new Error("Failed to load apps.json");
    const apps = await res.json();

    const counts = {};
    apps.forEach(app => {
      const cat = app.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });

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
