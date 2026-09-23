/* VOLUNTEER — badge role cycle + tilt, flip cards, day tabs, roster, application form, leaderboard */
(function () {
  'use strict';
  const { $, $$, icon, observe, ready, toast, burst, fixImages, getUser, reduce, finePointer } = PP;
  const IMG = (id) => `images/${id}`;

  /* ---------- hero: tape marquee, badge role cycle ---------- */
  const track = $('.tape .marq-track');
  if (track) track.innerHTML += track.innerHTML;
  PP.paintIcons(track || document);

  const roles = ['Dog walker', 'Cat socialiser', 'Kitchen crew', 'Vet assistant', 'Photographer', 'Rescue driver'];
  let ri = 0;
  setInterval(() => {
    ri = (ri + 1) % roles.length;
    const cur = $('#bRole'), n = document.createElement('span');
    n.id = 'bRole'; n.textContent = roles[ri]; cur.replaceWith(n);
  }, 2600);

  /* lanyard follows the pointer a little once the swing has settled */
  const lan = $('#lanyard');
  if (lan && finePointer && !reduce) {
    const stage = lan.parentElement;
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      lan.style.animation = 'none';
      lan.style.transition = 'transform .25s ease-out';
      lan.style.transform = `rotate(${x * 14}deg)`;
    });
    stage.addEventListener('mouseleave', () => {
      lan.style.transition = 'transform 1.4s cubic-bezier(.3,1.6,.5,1)';
      lan.style.transform = 'rotate(0)';
      setTimeout(() => { lan.style.transition = ''; lan.style.transform = ''; lan.style.animation = 'idle 6.5s ease-in-out infinite alternate'; }, 1400);
    });
  }

  /* ---------- flip cards (tap / Enter on touch & keyboard) ---------- */
  $$('.fc').forEach(c => {
    c.addEventListener('click', e => { if (e.target.closest('[data-apply]')) return; c.classList.toggle('flip'); });
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { if (e.target.closest('button')) return; e.preventDefault(); c.classList.toggle('flip'); } });
  });
  $$('[data-apply]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const sel = $('#vRole'); const want = b.dataset.apply.replace(/&amp;/g, '&');
    const opt = Array.from(sel.options).find(o => o.textContent.replace(/&amp;/g, '&').toLowerCase().includes(want.toLowerCase().split(' ')[0]));
    if (opt) sel.value = opt.value || opt.textContent;
    toast(`${want} selected — pick your shifts next.`, 'check');
    $('#shifts').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* ---------- a Saturday at the shelter ---------- */
const DAY = [
  {
    t: '7:00 AM',
    l: 'Arrival',
    ic: 'clock',
    h: 'Coffee, gloves and a briefing',
    p: 'The shift lead shares today’s notes: who’s recovering, who’s nervous, who needs extra cuddles.',
    tip: 'Wear closed shoes and clothes you don’t mind getting muddy.',
    img: 'images/pet1.webp'
  },

  {
    t: '8:00 AM',
    l: 'Breakfast',
    ic: 'bowl',
    h: 'Breakfast for 600 mouths',
    p: 'Diets are portioned from colour-coded charts. Every bowl is checked twice, and every animal who skips a meal gets reported.',
    tip: 'This is the loudest and most joyful hour of the day.',
    img: 'images/pet2.webp'
  },

  {
    t: '9:30 AM',
    l: 'Walks',
    ic: 'paw',
    h: 'Sunrise walks and sniff-time',
    p: 'You’ll be paired with a dog matched to your pace. Walks are calm, unhurried and always in pairs.',
    tip: 'Dogs learn manners fastest with predictable routines.',
    img: 'images/pet3.webp'
  },

  {
    t: '11:00 AM',
    l: 'Clinic',
    ic: 'med',
    h: 'Recovery ward rounds',
    p: 'Help our vet team settle post-surgery patients and record their temperature, appetite and mood.',
    tip: 'Gentle voices and slow hands are the best medicine.',
    img: 'images/pet4.webp'
  },

  {
    t: '1:00 PM',
    l: 'Lunch',
    ic: 'users',
    h: 'Lunch with your new friends',
    p: 'Volunteers eat together in the courtyard while the animals nap. It’s where most friendships start.',
    tip: 'Lunch is on us. Vegetarian and non-veg options.',
    img: 'images/pet5.webp'
  },

  {
    t: '2:30 PM',
    l: 'Enrichment',
    ic: 'sparkle',
    h: 'Puzzle feeders and cat rooms',
    p: 'Build toys from cardboard, hide treats in snuffle mats and let the kittens climb all over you.',
    tip: 'Bored animals are stressed animals. Play is care.',
    img: 'images/pet6.webp'
  },

  {
    t: '4:00 PM',
    l: 'Photo hour',
    ic: 'camera',
    h: 'Portraits for the adoption page',
    p: 'Golden-hour photos of new arrivals go live the same evening. A great portrait can halve the wait for a family.',
    tip: 'Bring your phone — we’ll show you how to frame a tail-wag.',
    img: 'images/pet7.webp'
  }
];

  const tabs = $('#dayTabs'), panel = $('#dayPanel');
  tabs.innerHTML = DAY.map((d, i) => `<button type="button" role="tab" class="dt" data-i="${i}" aria-selected="false">${d.t}<small>${d.l}</small></button>`).join('');
  let di = 0, auto = true, timer;
  function showDay(i, fromUser) {
    di = i;
    $$('.dt', tabs).forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('auto', k === i && auto); b.setAttribute('aria-selected', k === i); });
    const d = DAY[i];
    panel.innerHTML = `<div class="dp-ph"><img src="${d.img}" alt="${d.h}"></div>
      <div class="dp-tx"><span class="clock">${icon(d.ic)}${d.t}</span><h3 class="h3">${d.h}</h3><p>${d.p}</p><p class="tip">${icon('sparkle')}<span>${d.tip}</span></p></div>`;
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
    fixImages(panel);
    if (fromUser) { const b = $$('.dt', tabs)[i]; b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }
  }
  function loop() { clearInterval(timer); if (!auto || reduce) return; timer = setInterval(() => showDay((di + 1) % DAY.length), 6000); }
  tabs.addEventListener('click', e => { const b = e.target.closest('.dt'); if (!b) return; auto = false; clearInterval(timer); showDay(+b.dataset.i, true); });
  showDay(0);
  ready(() => observe($('#day'), () => { if (!reduce) loop(); }, { threshold: .3 }));
  if (reduce) { auto = false; $$('.dt', tabs).forEach(b => b.classList.remove('auto')); }

  /* ---------- roster ---------- */
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const SLOTS = [['Morning', '7 – 11 AM', 4], ['Afternoon', '12 – 4 PM', 4], ['Evening', '5 – 8 PM', 3]];
  const SPOTS = [
    [5, 3, 0, 4, 2, 6, 5],
    [2, 4, 3, 1, 5, 0, 3],
    [4, 1, 5, 6, 0, 2, 4]
  ];
  const roster = $('#roster'), picks = new Map(), MAX = 4;
  let html = '<div></div>' + DAYS.map(d => `<div class="gh">${d}</div>`).join('');
  SLOTS.forEach((s, r) => {
    html += `<div class="gl">${s[0]}<small>${s[1]}</small></div>`;
    DAYS.forEach((d, c) => {
      const n = SPOTS[r][c], key = `${r}-${c}`;
      html += `<button type="button" class="slot ${n === 0 ? 'full' : n <= 2 ? 'low' : ''}" data-k="${key}" data-r="${r}" data-c="${c}" ${n === 0 ? 'disabled aria-disabled="true"' : ''} aria-pressed="false" aria-label="${d} ${s[0]}, ${n === 0 ? 'full' : n + ' spots left'}">${n === 0 ? 'Full' : d.slice(0, 3)}<small>${n === 0 ? '—' : n + ' left'}</small></button>`;
    });
  });
  roster.innerHTML = html;
  function paintPicks() {
    const list = Array.from(picks.values());
    $('#picks').innerHTML = list.length ? list.map(p => `<span>${p.d} · ${p.s}</span>`).join('') : '<span class="none">Nothing selected yet</span>';
    $('#hrs').textContent = list.reduce((a, p) => a + p.h, 0);
    $('#vAvail').value = list.length ? list.map(p => `${p.d} ${p.s.toLowerCase()}`).join(', ') : 'No shifts picked yet — choose from the roster above';
  }
  roster.addEventListener('click', e => {
    const b = e.target.closest('.slot'); if (!b || b.disabled) return;
    const k = b.dataset.k;
    if (picks.has(k)) { picks.delete(k); b.classList.remove('pick'); b.setAttribute('aria-pressed', 'false'); }
    else {
      if (picks.size >= MAX) { toast(`You can pick up to ${MAX} shifts. Deselect one to swap.`, 'info'); return; }
      const r = +b.dataset.r, c = +b.dataset.c;
      picks.set(k, { d: DAYS[c], s: SLOTS[r][0], h: SLOTS[r][2] });
      b.classList.add('pick'); b.setAttribute('aria-pressed', 'true');
      const rc = b.getBoundingClientRect(); burst(rc.left + rc.width / 2, rc.top + rc.height / 2, ['🐾'], 5);
    }
    paintPicks();
  });
  $('#toApply').addEventListener('click', () => {
    if (!picks.size) toast('Tip: pick at least one shift so we can plan your orientation.', 'info');
    $('#apply').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---------- application form ---------- */
  // const form = $('#vForm'), done = $('#vDone');
  // const u = getUser(); if (u) $('#vName').value = u.name;
  // $('#vPhone').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10); });
  // const mark = (el, ok) => { el.closest('.field').classList.toggle('err', !ok); return ok; };
  // const flag = (id, ok) => { $(id).classList.toggle('on', !ok); return ok; };
  // form.addEventListener('submit', e => {
  //   e.preventDefault();
  //   const res = [
  //     mark($('#vName'), $('#vName').value.trim().length >= 2),
  //     mark($('#vMail'), /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#vMail').value.trim())),
  //     mark($('#vPhone'), /^[6-9]\d{9}$/.test($('#vPhone').value)),
  //     mark($('#vCity'), !!$('#vCity').value),
  //     mark($('#vRole'), !!$('#vRole').value),
  //     flag('#vAgeErr', $('#vAge').checked),
  //     flag('#vCodeErr', $('#vCode').checked)
  //   ];
  //   if (res.includes(false)) { toast('Please complete the highlighted fields.', 'info'); const bad = $('#vForm .field.err .input'); bad && bad.focus(); return; }
  //   const name = $('#vName').value.trim().split(' ')[0];
  //   const sat = nextSaturday();
  //   const ref = 'PPV-' + Math.floor(1000 + Math.random() * 8999);
  //   $('#vDoneMsg').textContent = `Thanks, ${name}! We’ll call ${$('#vPhone').value.replace(/(\d{5})(\d{5})/, '$1 $2')} within two days. Your orientation is pencilled in for ${sat.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at 10 AM, Green Park Campus.`;
  //   $('#vRef').textContent = 'Reference ' + ref;
  //   form.hidden = true; done.hidden = false;
  //   const r = $('#applyCard').getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 100, ['🐾', '❤️', '⭐', '🐶', '🐱'], 26);
  //   $('#applyCard').scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  //   $('#vIcs').onclick = () => downloadIcs(sat, ref);
  // });
  // function nextSaturday() {
  //   const d = new Date(); d.setHours(10, 0, 0, 0);
  //   d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  //   return d;
  // }
  // function downloadIcs(d, ref) {
  //   const p = n => String(n).padStart(2, '0');
  //   const f = x => `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`;
  //   const end = new Date(d.getTime() + 90 * 60000);
  //   const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PawPledge//Volunteer//EN', 'BEGIN:VEVENT', `UID:${ref}@pawpledge.org`, `DTSTAMP:${f(new Date())}`,
  //     `DTSTART:${f(d)}`, `DTEND:${f(end)}`, 'SUMMARY:PawPledge volunteer orientation', 'LOCATION:21 Banyan Lane\\, Green Park\\, Rescue Campus', 'DESCRIPTION:Bring closed shoes and a water bottle.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  //   const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  //   a.download = 'pawpledge-orientation.ics'; document.body.appendChild(a); a.click(); a.remove();
  //   setTimeout(() => URL.revokeObjectURL(a.href), 500);
  // }

  // /* ---------- leaderboard ---------- */
  const LB = [['Divya R.', 'Cat socialiser', 46], ['Karthik M.', 'Photographer', 41], ['Imran S.', 'Dog walker', 37], ['Sneha P.', 'Kitchen crew', 33], ['Ravi K.', 'Rescue driver', 29]];
  const max = LB[0][2];
  $('#lb').innerHTML = LB.map((r, i) => `<li><span class="rk">${i + 1}</span><span class="nm">${r[0]}<small>${r[1]}</small></span><span class="hr">${r[2]} hrs</span><span class="bar"><i data-w="${r[2] / max * 100}"></i></span></li>`).join('');
  ready(() => observe($('#lb'), () => $$('#lb i').forEach((b, k) => setTimeout(() => { b.style.width = b.dataset.w + '%'; }, k * 160)), { threshold: .4 }));
})();
