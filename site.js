(() => {
  "use strict";
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));
    document.addEventListener("click", e => {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) navLinks.classList.remove("open");
    });
  }
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const newsletter = document.getElementById("newsletterForm");
  if (newsletter) {
    newsletter.addEventListener("submit", e => {
      e.preventDefault();
      const email = (document.getElementById("newsletterEmail")?.value || "").trim();
      if (!email) return;
      const number = window.SIAL_CONFIG?.whatsappNumber || "923248116406";
      const message = "Please add this email to property update notifications: " + email;
      window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(message), "_blank", "noopener");
      const status = document.getElementById("newsletterMsg");
      if (status) status.textContent = "WhatsApp opened so you can confirm your subscription request.";
    });
  }

  document.querySelectorAll("form[data-whatsapp-form]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(form);
      const parts = [];
      for (const [key, value] of data.entries()) {
        if (key === "terms" || key === "submit") continue;
        if (String(value).trim()) parts.push(key + ": " + String(value).trim());
      }
      const intro = form.dataset.message || "Assalam o Alaikum, I would like property assistance.";
      const number = form.dataset.whatsappNumber || window.SIAL_CONFIG?.whatsappNumber || "923248116406";
      const status = form.querySelector("[data-form-status]");
      const url = "https://wa.me/" + number + "?text=" + encodeURIComponent(intro + "\n\n" + parts.join("\n"));
      window.open(url, "_blank", "noopener");
      if (status) status.textContent = "WhatsApp opened with your details. Please press Send there to submit your request.";
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.08});
    document.querySelectorAll(".page-card, .page-section .panel, .page-section .tool-card").forEach(el => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }
})();