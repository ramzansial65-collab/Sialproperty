const https = require("https");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
}
function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
function send(statusCode, body, contentType="text/html; charset=utf-8") {
  return { statusCode, headers: {
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "public, max-age=300, s-maxage=600"
  }, body };
}
exports.handler = async function(event) {
  const url = new URL(event.rawUrl || `https://example.net${event.path || "/"}`);
  const slug = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || "");
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return send(404, "<h1>Property not found</h1>");
  const supabaseUrl = process.env.SUPABASE_URL || "https://mxckzszxihfnytjbzszg.supabase.co";
  const anonKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_ArxB_fvEOIog-E_8sM8KQA_8MWOIZPr";
  try {
    const endpoint = `${supabaseUrl}/rest/v1/listings?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.approved&limit=1`;
    const response = await fetch(endpoint, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
    if (!response.ok) throw new Error(`Database response ${response.status}`);
    const rows = await response.json();
    if (!rows.length) return send(404, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Property not found | Sial Property Adviser</title></head><body style="font-family:Arial;background:#081530;color:#fff;padding:40px"><h1>Property not found</h1><p>This listing may have been removed or is not published.</p><a href="/" style="color:#f8dfa0">Return to homepage</a></body></html>`);
    const p = rows[0];
    const canonical = `https://sialpropertyadviser.netlify.app/property/${encodeURIComponent(p.slug)}`;
    const title = p.seo_title || `${p.title} | Sial Property Adviser`;
    const desc = (p.seo_description || p.description || `${p.title} in ${[p.area,p.city].filter(Boolean).join(", ")}`).slice(0,160);
    const images = Array.isArray(p.image_urls) ? p.image_urls : [];
    const hero = images[0] || "";
    const loc = [p.area,p.city].filter(Boolean).join(", ");
    const price = p.price ? `Rs. ${Number(p.price).toLocaleString("en-PK")}` : "Price on request";
    const schema = {
      "@context":"https://schema.org",
      "@type":"RealEstateListing",
      "name":p.title,
      "description":desc,
      "url":canonical,
      "datePosted":p.created_at || undefined,
      "image":images,
      "address":{"@type":"PostalAddress","addressLocality":p.city || undefined,"addressRegion":p.area || undefined,"addressCountry":"PK"},
      "offers":{"@type":"Offer","price":p.price || undefined,"priceCurrency":"PKR","availability":"https://schema.org/InStock"},
      "category":p.property_type || "Property"
    };
    const gallery = images.map((u,i)=>`<img src="${escapeHtml(u)}" alt="${escapeHtml(`${p.title} - property photo ${i+1}`)}" loading="lazy">`).join("");
    const whatsappText = encodeURIComponent(`Assalam o Alaikum, I am interested in: ${p.title} (${loc})`);
    const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#081530"><title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}"><meta name="robots" content="index,follow">
<link rel="canonical" href="${escapeHtml(canonical)}">
<meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(desc)}"><meta property="og:url" content="${escapeHtml(canonical)}">${hero?`<meta property="og:image" content="${escapeHtml(hero)}">`:""}
<meta name="twitter:card" content="${hero?"summary_large_image":"summary"}"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(desc)}">
<script type="application/ld+json">${jsonLd(schema)}</script>
<style>
:root{--navy:#081530;--gold:#e4bd68;--gold2:#f8dfa0;--muted:#b8c2d5}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 80% 5%,#183464 0,transparent 34%),linear-gradient(135deg,#061027,#0b1c3c 55%,#07142c);color:#f8f9fc;font-family:Inter,system-ui,Arial,sans-serif}.wrap{width:min(1050px,92%);margin:auto}.nav{padding:18px 0;border-bottom:1px solid #e4bd6840}.brand{font-weight:900;color:#fff;text-decoration:none}.brand span{color:var(--gold)}.crumb{color:var(--muted);font-size:13px;margin:25px 0}.panel{border:1px solid #e4bd6840;background:#ffffff0b;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px #0004}.hero{width:100%;max-height:540px;object-fit:cover;display:block;background:#142447}.content{padding:clamp(18px,4vw,36px)}.tag{color:var(--gold2);font-size:12px;letter-spacing:1px;text-transform:uppercase}.title{font-size:clamp(28px,5vw,46px);line-height:1.12;margin:12px 0}.location{color:var(--muted)}.price{font-size:25px;font-weight:900;color:var(--gold2);margin:18px 0}.desc{line-height:1.8;color:#d0d9e8;white-space:pre-wrap}.facts{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}.fact{padding:10px 13px;border:1px solid #ffffff25;border-radius:12px;color:#e4eaf4}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:20px}.gallery img{width:100%;height:170px;object-fit:cover;border-radius:12px}.btn{display:inline-flex;padding:13px 18px;border-radius:12px;background:linear-gradient(135deg,var(--gold2),var(--gold));color:#1b1a16;text-decoration:none;font-weight:900}.footer{color:var(--muted);padding:30px 0;font-size:13px}@media(max-width:560px){.gallery img{height:130px}}
</style></head><body><header class="nav"><div class="wrap"><a class="brand" href="/">SIAL <span>PROPERTY</span> ADVISER</a></div></header>
<main class="wrap"><div class="crumb"><a href="/" style="color:var(--gold2)">Home</a> / Property details</div><article class="panel">${hero?`<img class="hero" src="${escapeHtml(hero)}" alt="${escapeHtml(`${p.title} - ${loc}`)}">`:""}<div class="content"><div class="tag">${escapeHtml(p.purpose || "Property")} · ${escapeHtml(p.property_type || "Listing")}</div><h1 class="title">${escapeHtml(p.title)}</h1><div class="location">⌖ ${escapeHtml(loc || "Location on request")}</div><div class="price">${escapeHtml(price)}</div><div class="facts"><span class="fact">${escapeHtml(p.size || "Size not listed")}</span>${p.beds?`<span class="fact">${escapeHtml(p.beds)} Bedrooms</span>`:""}${p.baths?`<span class="fact">${escapeHtml(p.baths)} Bathrooms</span>`:""}</div>${p.description?`<p class="desc">${escapeHtml(p.description)}</p>`:""}<a class="btn" href="https://wa.me/923248116406?text=${whatsappText}" target="_blank" rel="noopener">Ask about this property ↗</a>${images.length>1?`<div class="gallery">${gallery}</div>`:""}</div></article></main><footer class="wrap footer">© ${new Date().getFullYear()} Sial Property Adviser · Verify property details independently before any transaction.</footer></body></html>`;
    return send(200, html);
  } catch (error) {
    return send(500, "<h1>Property page temporarily unavailable</h1><p>Please try again later.</p>");
  }
};
