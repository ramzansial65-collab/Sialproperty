(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const money = n => "PKR " + Math.round(Number(n) || 0).toLocaleString("en-PK");
  let mode = "buy";
  const tabs = [...document.querySelectorAll(".calculator-page .tab")];
  function calculate() {
    let a = 0, b = 0, label1 = "", label2 = "", note = "";
    if (mode === "buy") {
      const price = Math.max(0, Number($("buyPrice").value) || 0);
      const down = Math.min(price, Math.max(0, Number($("downPayment").value) || 0));
      const years = Math.max(1, Number($("loanYears").value) || 5);
      const principal = Math.max(0, price - down);
      a = principal / (years * 12); b = price;
      label1 = "Estimated Monthly Principal"; label2 = "Total Property Price";
      note = "Illustrative zero-interest estimate: remaining principal divided evenly by selected months. Taxes, fees, markup and bank terms are excluded.";
    } else if (mode === "rent") {
      const rent = Math.max(0, Number($("rentBudget").value) || 0);
      const increase = Math.max(0, Number($("rentIncrease").value) || 0) / 100;
      const years = Math.max(1, Number($("rentYears").value) || 1);
      a = rent;
      let total = 0, annual = rent * 12;
      for (let y = 0; y < years; y++) total += annual * Math.pow(1 + increase, y);
      b = total; label1 = "Current Monthly Rent"; label2 = "Estimated Total Rent";
      note = "Simplified estimate using your entered annual increase, applied once per year. Actual lease terms may differ.";
    } else {
      const price = Math.max(0, Number($("investPrice").value) || 0);
      const rent = Math.max(0, Number($("monthlyRent").value) || 0);
      const expenses = Math.max(0, Number($("annualExpenses").value) || 0);
      const annual = rent * 12, net = annual - expenses;
      a = price ? annual / price * 100 : 0; b = net;
      label1 = "Gross Rental Yield"; label2 = "Annual Net Income";
      note = "Estimate excludes vacancy, tax, financing, transaction costs and expenses not entered above.";
    }
    $("resultLabel1").textContent = label1;
    $("resultLabel2").textContent = label2;
    $("result1").textContent = mode === "investment" ? a.toFixed(2) + "%" : money(a);
    $("result2").textContent = money(b);
    $("calcNote").textContent = note;
  }
  tabs.forEach(tab => tab.addEventListener("click", () => {
    mode = tab.dataset.mode;
    tabs.forEach(x => x.classList.toggle("active", x === tab));
    $("buyFields").hidden = mode !== "buy";
    $("rentFields").hidden = mode !== "rent";
    $("investmentFields").hidden = mode !== "investment";
    calculate();
  }));
  ["buyPrice","downPayment","loanYears","rentBudget","rentIncrease","rentYears","investPrice","monthlyRent","annualExpenses"].forEach(id => {
    const el = $(id); if (el) el.addEventListener("input", calculate);
  });
  $("calculateBtn")?.addEventListener("click", calculate);
  calculate();
})();
