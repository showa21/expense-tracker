(function () {
  const KEY = 'expense-tracker:v1';
  const COLORS = ['#0d9488', '#6366f1', '#f59e0b', '#ec4899', '#64748b'];
  const $ = (id) => document.getElementById(id);
  const money = (n) => '$' + n.toFixed(2);
  let expenses = JSON.parse(localStorage.getItem(KEY) || '[]');
  $('date').valueAsDate = new Date();

  const save = () => localStorage.setItem(KEY, JSON.stringify(expenses));

  function drawChart(totals) {
    const canvas = $('chart'), ctx = canvas.getContext('2d');
    const cx = canvas.width / 2, cy = canvas.height / 2, r = 150;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const entries = Object.entries(totals);
    const sum = entries.reduce((s, [, v]) => s + v, 0);
    $('legend').innerHTML = '';
    if (!sum) return;
    let angle = -Math.PI / 2;
    entries.forEach(([cat, value], i) => {
      const slice = (value / sum) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      angle += slice;
      const li = document.createElement('li');
      const sw = document.createElement('i');
      sw.style.background = COLORS[i % COLORS.length];
      li.append(sw, `${cat}: ${money(value)} (${Math.round((value / sum) * 100)}%)`);
      $('legend').appendChild(li);
    });
    ctx.globalCompositeOperation = 'destination-out'; // donut hole
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function render() {
    $('total').textContent = money(Calc.total(expenses));
    $('month').textContent = money(Calc.monthTotal(expenses, new Date().toISOString().slice(0, 7)));
    $('list').innerHTML = '';
    [...expenses].sort((a, b) => b.date.localeCompare(a.date)).forEach((e) => {
      const li = document.createElement('li');
      const left = document.createElement('div');
      const name = document.createElement('span');
      name.textContent = e.desc;
      const meta = document.createElement('small');
      meta.textContent = `${e.category} · ${e.date}`;
      left.append(name, meta);
      const right = document.createElement('div');
      right.append(money(e.amount));
      const del = document.createElement('button');
      del.textContent = '×';
      del.setAttribute('aria-label', 'Delete expense');
      del.onclick = () => { expenses = expenses.filter((x) => x.id !== e.id); save(); render(); };
      right.appendChild(del);
      li.append(left, right);
      $('list').appendChild(li);
    });
    drawChart(Calc.totalsByCategory(expenses));
  }

  $('form').onsubmit = (ev) => {
    ev.preventDefault();
    const amount = Calc.parseAmount($('amount').value);
    if (amount === null) { $('amount').setCustomValidity('Enter a positive number'); $('amount').reportValidity(); return; }
    $('amount').setCustomValidity('');
    expenses.push({ id: Date.now() + Math.random(), desc: $('desc').value.trim(), amount,
                    category: $('category').value, date: $('date').value });
    save(); render();
    $('desc').value = ''; $('amount').value = '';
  };
  render();
})();
