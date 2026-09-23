/* DONATE — jar, calculator, impact tiles, checkout validation, plans, donut, live feed */
(function () {
  'use strict';
  const { $, $$, icon, observe, ready, toast, burst, getUser } = PP;
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const S = { freq: 'once', amt: 500, fee: false, focus: 'Where it’s needed most' };
  const GOAL = 800000; let raised = 568400;

  /* ---------- hero: goal bar + jar level ---------- */
  function paintGoal(animate) {
    const p = Math.min(raised / GOAL, 1);
    $('#goalRaised').textContent = inr(raised);
    $('#goalPct').textContent = Math.round(p * 100) + '%';
    $('#goalFill').style.width = (p * 100) + '%';
    $('.goal-bar').setAttribute('aria-valuenow', Math.round(p * 100));
    $('#liquid').style.setProperty('--ty', (352 - (352 - 108) * p) + 'px');
    $('#jarTxt').textContent = raised >= 100000 ? '₹' + (raised / 100000).toFixed(1) + 'L' : inr(raised);
  }
  ready(() => setTimeout(() => paintGoal(), 250));

  /* ---------- calculator ---------- */
  const seg = $('.seg'), amts = $('#amts'), custom = $('#dCustom'), range = $('#dRange');
  const total = () => S.amt + (S.fee ? Math.round(S.amt * .02) : 0);

  const IMPACT = [
    { p: 30, n: 'nutritious meals', s: 'a full bowl for one animal', i: 'bowl' },
    { p: 300, n: 'vaccinations', s: 'core vaccine + deworming', i: 'shield' },
    { p: 800, n: 'rescue trips', s: 'ambulance, fuel & handler', i: 'truck' },
    { p: 1500, n: 'sterilisations', s: 'spay/neuter surgery', i: 'med' },
    { p: 8000, n: 'emergency surgeries', s: 'fractures, wounds, blockages', i: 'pulse' }
  ];
  function paintImpact() {
    const list = $('#imp'), first = !list.children.length;
    if (first) list.innerHTML = IMPACT.map(x => `<li><span class="n">0</span><span class="t">${x.n}<small>${x.s}</small></span>${icon(x.i)}</li>`).join('');
    IMPACT.forEach((x, k) => {
      const li = list.children[k], n = Math.floor(S.amt / x.p), el = $('.n', li);
      li.classList.toggle('dim', n === 0);
      const txt = n === 0 ? '–' : n.toLocaleString('en-IN');
      if (el.textContent !== txt) { el.textContent = txt; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    });
    $('#impAmt').textContent = inr(S.amt);
    $('#impNote').textContent = S.freq === 'month'
      ? `Given monthly, that’s ${inr(S.amt * 12)} over a year — enough to plan care, not just react to it.`
      : S.amt < 300 ? 'Every meal counts. Small gifts, given together, keep our kitchens running.' : 'Every gift is pooled with others so we can say yes to the most urgent case first.';
  }
  function sync(from) {
    S.amt = Math.max(100, Math.min(500000, Math.round(S.amt) || 100));
    $('#dTotal').textContent = inr(total());
    $('#dFreq').textContent = S.freq === 'month' ? 'every month · cancel any time' : 'one time';
    $$('button', amts).forEach(b => b.classList.toggle('on', +b.dataset.a === S.amt && from !== 'custom'));
    if (from !== 'range') range.value = Math.min(S.amt, +range.max);
    range.style.setProperty('--p', ((Math.min(S.amt, +range.max) - +range.min) / (+range.max - +range.min) * 100) + '%');
    if (from !== 'custom') custom.value = '';
    $('.cust').classList.toggle('on', !!custom.value);
    // checkout summary
    $('#sType').textContent = S.freq === 'month' ? 'Monthly' : 'One-time';
    $('#sFocus').textContent = S.focus;
    $('#sGift').textContent = inr(S.amt) + (S.freq === 'month' ? ' /mo' : '');
    $('#sFee').textContent = S.fee ? inr(Math.round(S.amt * .02)) : '—';
    $('#sTotal').textContent = inr(total());
    $('#cPay span').textContent = (S.freq === 'month' ? 'Start monthly gift of ' : 'Donate ') + inr(total());
    paintImpact();
  }
  seg.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    S.freq = b.dataset.f; seg.classList.toggle('month', S.freq === 'month');
    $$('button', seg).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
    sync();
  });
  amts.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.amt = +b.dataset.a; sync('chip'); });
  custom.addEventListener('input', () => { if (!custom.value) { $('.cust').classList.remove('on'); return; } S.amt = +custom.value; sync('custom'); });
  range.addEventListener('input', () => { S.amt = +range.value; sync('range'); });
  $('#dFee').addEventListener('change', e => { S.fee = e.target.checked; sync(); });
  $('#dFocus').addEventListener('change', e => { S.focus = e.target.value; sync(); });
  $('#dGo').addEventListener('click', () => {
    if (S.amt < 100) { toast('The minimum gift is ₹100.', 'info'); return; }
    $('#checkout').scrollIntoView({ behavior: PP.reduce ? 'auto' : 'smooth' });
  });

  /* ---------- plans ---------- */
  $$('[data-plan]').forEach(b => b.addEventListener('click', () => {
    S.freq = 'month'; S.amt = +b.dataset.plan;
    seg.classList.add('month');
    $$('button', seg).forEach(x => { const on = x.dataset.f === 'month'; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
    sync('chip');
    toast(`${b.closest('.plan').querySelector('.h3').textContent} plan selected — ${inr(S.amt)} a month.`, 'heart');
    $('#calculator').scrollIntoView({ behavior: PP.reduce ? 'auto' : 'smooth' });
  }));

  /* ---------- checkout ---------- */
  const tabs = $('.pay-tabs'); let method = 'upi';
  tabs.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    method = b.dataset.p;
    $$('button', tabs).forEach(x => x.classList.toggle('on', x === b));
    $$('.pay-pane').forEach(p => p.classList.toggle('on', p.dataset.pane === method));
  });
  const digits = (el, max) => el.addEventListener('input', () => { el.value = el.value.replace(/\D/g, '').slice(0, max); });
  $('#kNum').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); });
  $('#kExp').addEventListener('input', e => { let v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); e.target.value = v; });
  digits($('#kCvv'), 3); digits($('#cPhone'), 10);
  const u = getUser();
  if (u) $('#cName').value = u.name;

  const mark = (el, ok) => { el.closest('.field').classList.toggle('err', !ok); return ok; };
  const validExp = v => { const m = /^(\d{2})\/(\d{2})$/.exec(v); if (!m) return false; const mm = +m[1], yy = 2000 + +m[2], now = new Date(); return mm >= 1 && mm <= 12 && (yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1)); };

  $('#coForm').addEventListener('submit', e => {
    e.preventDefault();
    const pan = $('#cPan').value.trim().toUpperCase();
    const checks = [
      mark($('#cName'), $('#cName').value.trim().length >= 2),
      mark($('#cMail'), /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#cMail').value.trim())),
      mark($('#cPhone'), /^[6-9]\d{9}$/.test($('#cPhone').value)),
      mark($('#cPan'), !pan || /^[A-Z]{5}\d{4}[A-Z]$/.test(pan))
    ];
    if (method === 'upi') checks.push(mark($('#uId'), /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test($('#uId').value.trim())));
    if (method === 'card') checks.push(
      mark($('#kNum'), $('#kNum').value.replace(/\s/g, '').length === 16),
      mark($('#kName'), $('#kName').value.trim().length >= 2),
      mark($('#kExp'), validExp($('#kExp').value)),
      mark($('#kCvv'), $('#kCvv').value.length === 3));
    if (method === 'net') checks.push(mark($('#nBank'), !!$('#nBank').value));
    if (checks.includes(false)) {
      toast('Please fix the highlighted fields.', 'info');
      const bad = $('#coForm .field.err .input'); bad && bad.focus();
      return;
    }
    complete($('#cName').value.trim(), $('#cMail').value.trim());
  });

  /* ---------- success ---------- */
  const modal = $('#thanks'); let receiptText = '';
  function complete(name, mail) {
    const id = 'PP-2026-' + Math.floor(10000 + Math.random() * 89999);
    const date = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const via = { upi: 'UPI', card: 'Card', net: 'Net banking' }[method];
    const gift = S.amt, tot = total();
    const meals = Math.floor(gift / 30);
    $('#tName').textContent = name.split(' ')[0];
    $('#tMsg').textContent = S.freq === 'month'
      ? `Your monthly gift of ${inr(gift)} will feed, vaccinate and protect animals all year. A receipt is on its way to ${mail}.`
      : `Your ${inr(gift)} can provide about ${meals.toLocaleString('en-IN')} meals for animals in our care. A receipt is on its way to ${mail}.`;
    $('#tReceipt').innerHTML = `
      <div><span>Receipt</span><span>${id}</span></div>
      <div><span>Date</span><span>${date}</span></div>
      <div><span>Type</span><span>${S.freq === 'month' ? 'Monthly' : 'One-time'}</span></div>
      <div><span>Purpose</span><span>${S.focus}</span></div>
      <div><span>Method</span><span>${via}</span></div>
      <div class="tot"><span>Total</span><span>${inr(tot)}</span></div>`;
    receiptText = ['PawPledge Animal Welfare Trust — Donation receipt (DEMO)', '----------------------------------------------------',
      `Receipt no : ${id}`, `Date       : ${date}`, `Donor      : ${name}`, `Email      : ${mail}`, `Type       : ${S.freq === 'month' ? 'Monthly' : 'One-time'}`,
      `Purpose    : ${S.focus}`, `Method     : ${via}`, `Gift       : ${inr(gift)}`, `Total      : ${inr(tot)}`, '',
      'This is a demonstration receipt. No payment was processed.'].join('\n');
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock');
    setTimeout(() => $('#tClose').focus(), 60);
    const r = modal.querySelector('.check-big').getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 40, ['🐾', '❤️', '⭐', '🐶', '🐱'], 26);
    raised += gift; paintGoal();
    addFeed(!$('#cAnon').checked ? name : 'Anonymous friend', 'Chennai', gift, true);
    $('#coForm').reset(); if (u) $('#cName').value = u.name;
  }
  function closeThanks() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock'); }
  $('#tClose').addEventListener('click', closeThanks);
  modal.addEventListener('click', e => { if (e.target === modal) closeThanks(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeThanks(); });
  $('#tDl').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([receiptText], { type: 'text/plain' }));
    a.download = 'pawpledge-receipt.txt'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  });

  /* ---------- donut ---------- */
  const PARTS = [
    { n: 'Medical care & surgeries', v: 42, c: '#FF7A2F' },
    { n: 'Food & shelter', v: 26, c: '#0E5A66' },
    { n: 'Rescue & transport', v: 16, c: '#3B2A78' },
    { n: 'Adoption & rehoming', v: 12, c: '#E0457B' },
    { n: 'Admin & fundraising', v: 4, c: '#5F7480' }
  ];
  const R = 74, CIRC = 2 * Math.PI * R;
  const donut = $('#donut'), legend = $('#legend'), dcVal = $('#dcVal'), dcLab = $('#dcLab');
  let acc = 0;
  donut.innerHTML = '<circle cx="100" cy="100" r="74" fill="none" stroke="rgba(11,31,42,.12)" stroke-width="28"/>' + PARTS.map((p, i) => {
    const off = acc; acc += p.v;
    return `<circle class="dseg" data-i="${i}" cx="100" cy="100" r="${R}" stroke="${p.c}" stroke-dasharray="0 ${CIRC}" stroke-dashoffset="${-off / 100 * CIRC}" data-len="${p.v / 100 * CIRC - 2}"/>`;
  }).join('');
  legend.innerHTML = PARTS.map((p, i) => `<li><button type="button" data-i="${i}"><i style="background:${p.c}"></i>${p.n}<span>₹${p.v}</span></button></li>`).join('');
  const hi = i => {
    $$('.dseg').forEach(s => { s.classList.toggle('hi', i !== null && +s.dataset.i === i); s.classList.toggle('dim', i !== null && +s.dataset.i !== i); });
    $$('button', legend).forEach(b => b.classList.toggle('hi', i !== null && +b.dataset.i === i));
    dcVal.textContent = i === null ? '₹100' : '₹' + PARTS[i].v;
    dcLab.textContent = i === null ? 'every ₹100 you give' : PARTS[i].n;
  };
  legend.addEventListener('mouseover', e => { const b = e.target.closest('button'); b && hi(+b.dataset.i); });
  legend.addEventListener('focusin', e => { const b = e.target.closest('button'); b && hi(+b.dataset.i); });
  legend.addEventListener('click', e => { const b = e.target.closest('button'); b && hi(+b.dataset.i); });
  legend.addEventListener('mouseleave', () => hi(null));
  donut.addEventListener('mouseover', e => { const s = e.target.closest('.dseg'); s && hi(+s.dataset.i); });
  donut.addEventListener('mouseleave', () => hi(null));
  ready(() => observe($('.donut-box'), () => setTimeout(() => $$('.dseg').forEach((s, i) => {
    setTimeout(() => s.setAttribute('stroke-dasharray', `${s.dataset.len} ${CIRC}`), i * 220);
  }), 200), { threshold: .35 }));

  /* ---------- live supporter wall ---------- */
  const NAMES = [['Priya S.', 'Chennai', 500], ['Arun K.', 'Coimbatore', 1000], ['Fatima R.', 'Hyderabad', 300], ['Vikram N.', 'Bengaluru', 2500], ['Meena T.', 'Salem', 500], ['Rohan D.', 'Mumbai', 1500], ['Lakshmi P.', 'Madurai', 300], ['Sanjay B.', 'Pune', 5000], ['Anitha M.', 'Erode', 500], ['Zoya A.', 'Delhi', 1000]];
  const feed = $('#feed'); let fi = 0;
  function addFeed(name, city, amt, me) {
    const li = document.createElement('li');
    li.className = 'd-card fi' + (me ? ' me' : '');
    li.innerHTML = `<span class="av">${name[0]}</span><span class="who">${me ? name + ' (you)' : name}<small>${city} · ${me ? 'just now' : fi < 3 ? 'moments ago' : Math.ceil(Math.random() * 9) + ' min ago'}</small></span><span class="amt">${inr(amt)}</span>`;
    feed.prepend(li);
    while (feed.children.length > 5) feed.lastElementChild.remove();
  }
  for (let k = 4; k >= 0; k--) { const n = NAMES[k]; addFeed(n[0], n[1], n[2]); fi++; }
  setInterval(() => { const n = NAMES[fi++ % NAMES.length]; addFeed(n[0], n[1], n[2]); raised += n[2]; paintGoal(); }, 5200);

  /* ---------- deep link: ?amount= ---------- */
  const q = new URLSearchParams(location.search).get('amount');
  if (q && +q >= 100) S.amt = +q;

  sync('chip');
})();
