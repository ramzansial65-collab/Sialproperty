(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fmt = n => "PKR " + Math.round(Number(n) || 0).toLocaleString("en-PK");
  const safeArray = v => Array.isArray(v) ? v : [];
  let db = null, listings = [], compareIds = new Set();
  let favorites = new Set();
  try { favorites = new Set(JSON.parse(localStorage.getItem("sialFavorites") || "[]")); } catch (_) {}
  try {
    const c = window.SIAL_CONFIG;
    if (window.supabase && c?.supabaseUrl && c?.supabasePublishableKey) {
      db = window.supabase.createClient(c.supabaseUrl, c.supabasePublishableKey);
    }
  } catch (err) { console.error("Supabase initialization failed", err); }

  function toast(message) {
    const el = $("toast");
    if (!el) return;
    el.textContent = message; el.classList.add("show");
    window.setTimeout(() => el.classList.remove("show"), 3000);
  }
  function imageMarkup(p) {
    const imgs = safeArray(p.image_urls);
    if (imgs[0]) return `<img src="${esc(imgs[0])}" alt="${esc(p.title || "Property image")}" loading="lazy" onerror="this.style.display='none'">`;
    if (p.video_url) return `<video src="${esc(p.video_url)}" controls playsinline preload="metadata"></video>`;
    return `<div class="property-placeholder">⌂</div>`;
  }
  function card(p) {
    const id = String(p.id || p.title || "");
    const saved = favorites.has(id);
    const location = [p.area, p.city].filter(Boolean).join(", ") || "Location on request";
    return `<article class="property-card">
      <div class="property-image">${imageMarkup(p)}
        <span class="purpose-tag">${esc(p.purpose || "Property")}</span>
        <button class="fav ${saved ? "saved" : ""}" data-fav="${esc(id)}" aria-label="Save property">${saved ? "♥" : "♡"}</button>
      </div>
      <div class="property-info">
        <div class="property-location">📍 ${esc(location)}</div>
        <h3>${esc(p.title || "Property listing")}</h3>
        <div class="property-price">${esc(p.price ? fmt(p.price) : "Price on request")}</div>
        <div class="property-meta">${esc(p.property_type || "Property")} · ${esc(p.size || "Size not listed")}${p.beds ? " · " + esc(p.beds) + " Beds" : ""}</div>
        <div class="property-actions">
          <button class="btn btn-small" data-detail="${esc(id)}">View Details ➜</button>
          <label class="compare-check"><input type="checkbox" data-compare="${esc(id)}" ${compareIds.has(id) ? "checked" : ""}> Compare</label>
        </div>
      </div>
    </article>`;
  }
  function render() {
    const q = ($("searchInput")?.value || "").toLowerCase().trim();
    const purpose = $("purposeFilter")?.value || "";
    const type = $("typeFilter")?.value || "";
    const shown = listings.filter(p =>
      (!q || [p.title,p.city,p.area,p.description].join(" ").toLowerCase().includes(q)) &&
      (!purpose || String(p.purpose || "").toLowerCase() === purpose.toLowerCase()) &&
      (!type || String(p.property_type || "").toLowerCase() === type.toLowerCase())
    );
    $("propertyGrid").innerHTML = shown.length ? shown.map(card).join("") :
      `<div class="no-listings">No matching approved properties found. Please contact us for current availability.</div>`;
    $("listingStatus").textContent = listings.length
      ? `${listings.length} approved listing(s) loaded.`
      : "No approved listings are currently available.";
    updateCompare();
  }
  function updateCompare() {
    $("compareBar").classList.toggle("show", compareIds.size > 0);
    $("compareCount").textContent = `${compareIds.size} propert${compareIds.size === 1 ? "y" : "ies"} selected`;
  }
  function openModal(id) { $(id)?.classList.add("open"); }
  function closeModal(id) { $(id)?.classList.remove("open"); }
  function showDetails(p) {
    const imgs = safeArray(p.image_urls);
    const location = [p.area,p.city].filter(Boolean).join(", ");
    $("detailTitle").textContent = p.title || "Property details";
    $("detailContent").innerHTML = `
      ${imgs.length ? `<div class="detail-gallery">${imgs.slice(0,6).map((u,i)=>`<img src="${esc(u)}" alt="Property photo ${i+1}" loading="lazy">`).join("")}</div>` : ""}
      ${p.video_url ? `<video src="${esc(p.video_url)}" controls playsinline style="width:100%;max-height:280px;border-radius:12px"></video>` : ""}
      <p><b class="gold">${esc(p.price ? fmt(p.price) : "Price on request")}</b> · ${esc(location || "Location on request")}</p>
      <p>${esc(p.description || "Contact us for further property details.")}</p>
      <p>Type: ${esc(p.property_type || "Not listed")} · Purpose: ${esc(p.purpose || "Not listed")} · Size: ${esc(p.size || "Not listed")}</p>
      <p>Bedrooms: ${esc(p.beds || "Not listed")} · Bathrooms: ${esc(p.baths || "Not listed")}</p>
      <a class="btn" href="https://wa.me/${window.SIAL_CONFIG?.whatsappNumber || "923248116406"}?text=${encodeURIComponent("Assalam o Alaikum, I am interested in " + (p.title || "your property") + " in " + location + ". Please share details.")}" target="_blank" rel="noopener">Enquire on WhatsApp ➜</a>
      <p class="calc-note">Listing information is supplied by the advertiser. Verify ownership, approvals, price and availability independently before any payment.</p>`;
    openModal("detailModal");
  }
  $("propertyGrid")?.addEventListener("click", e => {
    const fav = e.target.closest("[data-fav]");
    if (fav) {
      const id = fav.dataset.fav;
      favorites.has(id) ? favorites.delete(id) : favorites.add(id);
      localStorage.setItem("sialFavorites", JSON.stringify([...favorites]));
      render();
      toast(favorites.has(id) ? "Property saved to favourites." : "Removed from favourites.");
      return;
    }
    const detail = e.target.closest("[data-detail]");
    if (detail) {
      const p = listings.find(x => String(x.id || x.title || "") === detail.dataset.detail);
      if (p) showDetails(p);
    }
  });
  $("propertyGrid")?.addEventListener("change", e => {
    if (!e.target.matches("[data-compare]")) return;
    const id = e.target.dataset.compare;
    if (e.target.checked) {
      if (compareIds.size >= 3) { e.target.checked = false; toast("You can compare up to 3 properties."); return; }
      compareIds.add(id);
    } else compareIds.delete(id);
    updateCompare();
  });
  ["searchInput","purposeFilter","typeFilter"].forEach(id => $(id)?.addEventListener("input", render));
  $("clearCompare")?.addEventListener("click", () => { compareIds.clear(); render(); });
  $("compareBtn")?.addEventListener("click", () => {
    const chosen = listings.filter(p => compareIds.has(String(p.id || p.title || "")));
    if (chosen.length < 2) { toast("Select at least two properties to compare."); return; }
    const rows = [
      ["Price",p=>p.price?fmt(p.price):"On request"],
      ["Location",p=>[p.area,p.city].filter(Boolean).join(", ")||"Not listed"],
      ["Type",p=>p.property_type||"Not listed"],
      ["Purpose",p=>p.purpose||"Not listed"],
      ["Size",p=>p.size||"Not listed"],
      ["Bedrooms",p=>p.beds||"Not listed"],
      ["Bathrooms",p=>p.baths||"Not listed"]
    ];
    $("compareContent").innerHTML = `<div style="overflow:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">
      <tr><th style="text-align:left;padding:10px;border-bottom:1px solid #ffffff33">Details</th>${chosen.map(p=>`<th style="padding:10px;border-bottom:1px solid #ffffff33">${esc(p.title||"Property")}</th>`).join("")}</tr>
      ${rows.map(([label,fn])=>`<tr><td style="padding:10px;border-bottom:1px solid #ffffff18;color:#ffe29a">${label}</td>${chosen.map(p=>`<td style="padding:10px;border-bottom:1px solid #ffffff18">${esc(fn(p))}</td>`).join("")}</tr>`).join("")}
    </table></div><p>Compare only the details entered in each listing. Confirm all information with the seller.`;
    openModal("compareModal");
  });
  document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => closeModal(b.dataset.close)));
  document.querySelectorAll(".modal").forEach(m => m.addEventListener("click", e => { if (e.target === m) closeModal(m.id); }));
  async function load() {
    if (!db) {
      $("propertyGrid").innerHTML = `<div class="no-listings">Property database could not initialize. Please contact us on WhatsApp.</div>`;
      $("listingStatus").textContent = "Supabase connection is not available in this browser.";
      return;
    }
    try {
      const {data,error} = await db.from("listings").select("*").eq("status","approved").order("created_at",{ascending:false});
      if (error) throw error;
      listings = data || [];
      render();
    } catch (err) {
      console.error("Approved listings could not load:", err);
      $("propertyGrid").innerHTML = `<div class="no-listings">Unable to load properties right now. Please refresh or contact us on WhatsApp.</div>`;
      $("listingStatus").textContent = "Database connection error. Check the Supabase table and public read policy.";
    }
  }
  load();
})();