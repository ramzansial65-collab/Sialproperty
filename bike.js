(() => {
  "use strict";
  const form = document.getElementById("bikeForm");
  if (!form) return;
  const msg = document.getElementById("bikeMessage");
  const btn = document.getElementById("bikeSubmit");
  let db = null;
  try {
    const cfg = window.SIAL_CONFIG?.firebaseConfig;
    if (window.firebase && cfg) {
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      db = firebase.firestore();
    }
  } catch (err) { console.error("Firebase initialization failed:", err); }
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!db) { msg.textContent = "Application service is unavailable. Please contact us on WhatsApp."; return; }
    btn.disabled = true; btn.textContent = "Submitting…"; msg.textContent = "Please wait…";
    const fd = new FormData(form);
    const record = {
      fullName: String(fd.get("fullName") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      city: String(fd.get("city") || "").trim(),
      cnic: String(fd.get("cnic") || "").trim(),
      salesPlan: String(fd.get("salesPlan") || "").trim(),
      termsAccepted: fd.get("terms") === "on",
      status: "pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    try {
      await db.collection("bikeApplications").add(record);
      form.reset();
      msg.textContent = "Your application has been submitted for review. This is not an approval or payment confirmation. Contact the administrator for official status.";
    } catch (err) {
      console.error("Bike application submission failed:", err);
      msg.textContent = "Could not submit your application. Check your connection or contact us on WhatsApp.";
    } finally {
      btn.disabled = false; btn.textContent = "Submit Application";
    }
  });
})();