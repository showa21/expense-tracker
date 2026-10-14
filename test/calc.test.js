'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { totalsByCategory, total, monthTotal, parseAmount } = require('../calc');

const data = [
  { amount: 10.1, category: 'Food', date: '2026-10-01' },
  { amount: 0.2, category: 'Food', date: '2026-10-02' },
  { amount: 50, category: 'Rent', date: '2026-09-30' },
];

test('totals by category avoid float drift', () => {
  assert.deepStrictEqual(totalsByCategory(data), { Food: 10.3, Rent: 50 });
});
test('overall and monthly totals', () => {
  assert.strictEqual(total(data), 60.3);
  assert.strictEqual(monthTotal(data, '2026-10'), 10.3);
});
test('parseAmount validates input', () => {
  assert.strictEqual(parseAmount(' 12.345 '), 12.35);
  assert.strictEqual(parseAmount('-1'), null);
  assert.strictEqual(parseAmount('abc'), null);
  assert.strictEqual(parseAmount(''), null);
});
