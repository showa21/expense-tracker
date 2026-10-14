(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Calc = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function totalsByCategory(expenses) {
    const totals = {};
    for (const e of expenses) totals[e.category] = Math.round(((totals[e.category] || 0) + e.amount) * 100) / 100;
    return totals;
  }

  const total = (expenses) => Math.round(expenses.reduce((s, e) => s + e.amount, 0) * 100) / 100;

  function monthTotal(expenses, yyyyMm) {
    return total(expenses.filter((e) => e.date.startsWith(yyyyMm)));
  }

  function parseAmount(raw) {
    const n = Number(String(raw).trim());
    return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
  }

  return { totalsByCategory, total, monthTotal, parseAmount };
});
