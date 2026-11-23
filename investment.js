(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const money = n => "PKR " + Math.round(Number(n) || 0).toLocaleString("en-PK");
  function update() {
    const price = Math.max(0, Number($("invPrice").value) || 0);
    const rent = Math.max(0, Number($("invRent").value) || 0);
    const expenses = Math.max(0, Number($("invExpenses").value) || 0);
    const annualRent = rent * 12;
    const netIncome = annualRent - expenses;
    $("grossYield").textContent = price ? (annualRent / price * 100).toFixed(2) + "%" : "—";
    $("netIncome").textContent = money(netIncome);
    $("netYield").textContent = price ? (netIncome / price * 100).toFixed(2) + "%" : "—";
    $("payback").textContent = netIncome > 0 ? (price / netIncome).toFixed(1) + " years" : "—";
  }
  ["invPrice","invRent","invExpenses"].forEach(id => $(id)?.addEventListener("input", update));
  update();
})();