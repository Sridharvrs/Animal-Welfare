/* ADOPT — filterable pet grid, profile modal, match quiz, funding rings, stamps, story strip */
(function () {
  'use strict';
  const { $, $$, icon, observe, ready, toast, burst, fixImages, getUser } = PP;
  const IMG = (file) => `images/${file}`;

  /* ---------- data ---------- */
  const PETS = [
    { id: 'bruno', name: 'Bruno', sp: 'dog', breed: 'Indie mix', m: 26, sex: 'Male', size: 'Medium', energy: 'moderate', home: 'any', kids: true, fee: 800, shelter: 'Green Park Campus', img: 'pet1.webp', badge: 'Most loved',
      desc: 'A goofy, loyal boy who greets every visitor with a full-body wag.', story: 'Bruno was found tied outside a tea stall with a knotted rope and no name. Six months later he knows sit, paw and “dinner”. He walks calmly on a leash and loves car rides.', tags: ['Vaccinated', 'Neutered', 'Good with kids'] },
    { id: 'luna', name: 'Luna', sp: 'cat', breed: 'Domestic shorthair', m: 4, sex: 'Female', size: 'Small', energy: 'moderate', home: 'apartment', kids: true, fee: 600, shelter: 'Riverside Cat Sanctuary', img: 'pet2.webp', badge: 'New',
      desc: 'A silver-grey kitten who chases sunbeams and purrs like a tiny motor.', story: 'Luna arrived with her three siblings after their mother was rescued from a construction site. She is litter-trained, curious and adores string toys and laps in equal measure.', tags: ['Vaccinated', 'Litter-trained', 'Loves laps'] },
    { id: 'milo', name: 'Milo', sp: 'dog', breed: 'Labrador mix', m: 14, sex: 'Male', size: 'Large', energy: 'energetic', home: 'yard', kids: true, fee: 1000, shelter: 'Green Park Campus', img: 'pet3.webp', badge: '',
      desc: 'An endlessly happy young Lab mix who needs a running buddy and a garden.', story: 'Milo was surrendered when his family moved abroad. He knows a dozen commands, fetches like a champion and will happily join any morning jog.', tags: ['Vaccinated', 'Neutered', 'Trained'] },
    { id: 'coco', name: 'Coco', sp: 'cat', breed: 'Domestic shorthair', m: 13, sex: 'Female', size: 'Small', energy: 'energetic', home: 'any', kids: true, fee: 600, shelter: 'Riverside Cat Sanctuary', img: 'pet4.webp', badge: '',
      desc: 'A curious climber with enormous eyes and zero fear of ceiling fans.', story: 'Coco grew up in our foster network and has never met a stranger. She needs a home with shelves to climb and someone who enjoys being followed from room to room.', tags: ['Vaccinated', 'Spayed', 'Playful'] },
    { id: 'honey', name: 'Honey', sp: 'dog', breed: 'Golden retriever', m: 62, sex: 'Female', size: 'Large', energy: 'moderate', home: 'yard', kids: true, fee: 1500, shelter: 'Hillview Recovery Ward', img: 'pet5.webp', badge: 'Gentle giant',
      desc: 'A sunny, patient golden who has been waiting far longer than she deserves.', story: 'Honey came to us after a breeder retired her. She had never seen grass. Now she rolls in it daily, adores children and is completely house-trained.', tags: ['Vaccinated', 'Spayed', 'House-trained'] },
    { id: 'pumpkin', name: 'Pumpkin', sp: 'dog', breed: 'Pug', m: 108, sex: 'Male', size: 'Small', energy: 'calm', home: 'apartment', kids: false, fee: 500, shelter: 'Hillview Recovery Ward', img: 'pet6.webp', badge: 'Senior',
      desc: 'A snoring, snuggling nine-year-old who wants nothing more than a warm lap.', story: 'Pumpkin lost his owner last year and has been our ward’s unofficial mascot since. He needs a quiet home, gentle walks and someone who enjoys a good snore.', tags: ['Vaccinated', 'Neutered', 'Quiet home'] },
    { id: 'sultan', name: 'Sultan', sp: 'cat', breed: 'Tabby', m: 36, sex: 'Male', size: 'Medium', energy: 'calm', home: 'apartment', kids: false, fee: 700, shelter: 'Riverside Cat Sanctuary', img: 'pet7.webp', badge: '',
      desc: 'A regal green-eyed tabby who prefers observation to chaos.', story: 'Sultan spent two years as a street cat before injuring his paw. He has healed fully, and while he takes a few days to trust, he becomes fiercely devoted.', tags: ['Vaccinated', 'Neutered', 'Independent'] },
    { id: 'ginger', name: 'Ginger', sp: 'dog', breed: 'Indie mix', m: 40, sex: 'Female', size: 'Medium', energy: 'moderate', home: 'any', kids: true, fee: 600, shelter: 'Green Park Campus', img: 'pet8.webp', badge: '',
      desc: 'A thoughtful, street-smart girl who learns everything in one try.', story: 'Ginger raised two litters on the road before we brought her in. She is calm indoors, brilliant on a leash and settles quickly into new routines.', tags: ['Vaccinated', 'Spayed', 'Leash-trained'] },
    { id: 'cooper', name: 'Cooper', sp: 'cat', breed: 'Domestic shorthair', m: 26, sex: 'Male', size: 'Medium', energy: 'moderate', home: 'any', kids: true, fee: 700, shelter: 'Riverside Cat Sanctuary', img: 'pet9.webp', badge: 'Cool cat',
      desc: 'Too cool for school, too soft for the street. Sunglasses not included.', story: 'Cooper was surrendered by a student who couldn’t keep him in a hostel. He’s a big talker, loves head scratches and gets on well with other cats.', tags: ['Vaccinated', 'Neutered', 'Talkative'] },
    { id: 'snowball', name: 'Snowball', sp: 'rabbit', breed: 'Dutch rabbit', m: 12, sex: 'Female', size: 'Small', energy: 'calm', home: 'apartment', kids: true, fee: 400, shelter: 'Riverside Cat Sanctuary', img: 'pet10.webp', badge: '',
      desc: 'A gentle bunny who loves carrots, cuddles and binkying across the floor.', story: 'Snowball was an abandoned Easter gift. She is litter-trained, quiet and happiest with a large indoor pen, fresh hay and daily floor time.', tags: ['Health-checked', 'Litter-trained', 'Quiet'] },
    { id: 'biscuit', name: 'Biscuit', sp: 'dog', breed: 'Indie puppy', m: 3, sex: 'Male', size: 'Small', energy: 'energetic', home: 'any', kids: true, fee: 500, shelter: 'Green Park Campus', img: 'pet11.webp', badge: 'New',
      desc: 'A three-month-old bundle of paws, chewed slippers and pure joy.', story: 'Biscuit and his sister were found in a cardboard box near the highway. He is learning fast, sleeps through the night and is ready to grow up with a loving family.', tags: ['First vaccines', 'Puppy', 'Good with kids'] },
    { id: 'mango', name: 'Mango', sp: 'cat', breed: 'Orange tabby', m: 5, sex: 'Male', size: 'Small', energy: 'energetic', home: 'any', kids: true, fee: 600, shelter: 'Riverside Cat Sanctuary', img: 'pet12.webp', badge: 'New',
      desc: 'A ginger kitten with a big personality and an even bigger appetite.', story: 'Mango was found on a temple step, crying for breakfast. Now he is a confident little ball of energy who sleeps on shoulders and stalks shoelaces.', tags: ['Vaccinated', 'Litter-trained', 'Playful'] }
  ];
  const byId = Object.fromEntries(PETS.map(p => [p.id, p]));
  const ageLabel = m => m < 12 ? m + ' months' : Math.floor(m / 12) + ' yrs';
  const ageGroup = m => m < 6 ? 'baby' : m < 24 ? 'young' : m < 84 ? 'adult' : 'senior';
  const cap = s => s[0].toUpperCase() + s.slice(1);

  /* ---------- state ---------- */
  const state = { sp: 'all', age: 'all', q: '', sort: 'featured', saved: false };
  const favs = new Set();

  /* ---------- grid ---------- */
  const grid = $('#pets'), empty = $('#empty'), countEl = $('#count');
  const cardHTML = (p, i) => `
    <article class="a-card lift pet" style="--i:${i}" data-id="${p.id}">
      <div class="pet-ph">
        <img src="${IMG(p.img)}" alt="${p.name}, a ${p.breed.toLowerCase()} ${p.sp}" loading="lazy">
        ${p.badge ? `<span class="pet-badge">${p.badge}</span>` : ''}
        <button type="button" class="fav ${favs.has(p.id) ? 'on' : ''}" data-fav="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="Save ${p.name}">${icon('heart')}</button>
      </div>
      <div class="pet-body">
        <h3 class="h3">${p.name}<small>${ageLabel(p.m)}</small></h3>
        <p class="br">${p.breed} · ${p.sex} · ${p.size}</p>
        <p class="desc">${p.desc}</p>
        <ul class="tags">${p.tags.map(t => `<li>${t}</li>`).join('')}</ul>
        <button type="button" class="btn btn-dark btn-sm" data-open="${p.id}">Meet ${p.name}${icon('arrow')}</button>
      </div>
    </article>`;

  function render() {
    const q = state.q.trim().toLowerCase();
    let list = PETS.filter(p =>
      (state.sp === 'all' || p.sp === state.sp) &&
      (state.age === 'all' || ageGroup(p.m) === state.age) &&
      (!state.saved || favs.has(p.id)) &&
      (!q || [p.name, p.breed, p.sp, p.shelter, ...p.tags].join(' ').toLowerCase().includes(q)));
    if (state.sort === 'young') list.sort((a, b) => a.m - b.m);
    if (state.sort === 'old') list.sort((a, b) => b.m - a.m);
    if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    grid.innerHTML = list.map(cardHTML).join('');
    empty.hidden = list.length > 0;
    countEl.textContent = list.length ? `Showing ${list.length} of ${PETS.length} companions` : '';
    fixImages(grid);
  }

  $('#fSpecies').addEventListener('click', e => {
    const b = e.target.closest('.fc'); if (!b || b.id === 'fSaved') return;
    $$('#fSpecies .fc:not(#fSaved)').forEach(x => x.classList.toggle('on', x === b));
    state.sp = b.dataset.v; render();
  });
  $('#fSaved').addEventListener('click', e => {
    state.saved = !state.saved;
    e.currentTarget.classList.toggle('on', state.saved);
    e.currentTarget.setAttribute('aria-pressed', state.saved);
    if (state.saved && !favs.size) toast('Tap the heart on any card to save a favourite.', 'heart');
    render();
  });
  $('#fSearch').addEventListener('input', e => { state.q = e.target.value; render(); });
  $('#fAge').addEventListener('change', e => { state.age = e.target.value; render(); });
  $('#fSort').addEventListener('change', e => { state.sort = e.target.value; render(); });
  $('#fReset').addEventListener('click', () => {
    Object.assign(state, { sp: 'all', age: 'all', q: '', sort: 'featured', saved: false });
    $('#fSearch').value = ''; $('#fAge').value = 'all'; $('#fSort').value = 'featured';
    $$('#fSpecies .fc').forEach(x => x.classList.toggle('on', x.dataset.v === 'all'));
    $('#fSaved').classList.remove('on'); render();
  });

  function toggleFav(id, btn) {
    const on = !favs.has(id);
    on ? favs.add(id) : favs.delete(id);
    $('#savedN').textContent = favs.size;
    if (btn) {
      btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on);
      if (on) { const r = btn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, ['❤️', '🐾'], 10); }
    }
    if (on) toast(`${byId[id].name} saved to your shortlist.`, 'heart');
    if (state.saved && !on) render();
  }

  grid.addEventListener('click', e => {
    const f = e.target.closest('[data-fav]');
    if (f) { toggleFav(f.dataset.fav, f); return; }
    const o = e.target.closest('[data-open]');
    if (o) openModal(o.dataset.open);
    else { const c = e.target.closest('.pet'); if (c && e.target.closest('.pet-ph')) openModal(c.dataset.id); }
  });

  /* ---------- modal ---------- */
  const modal = $('#petModal'), mBody = $('#mBody');
  let lastFocus = null;
  function openModal(id) {
    const p = byId[id]; if (!p) return;
    lastFocus = document.activeElement;
    const u = getUser();
    mBody.innerHTML = `
      <div class="m-grid">
        <div class="m-ph"><img src="${IMG(p.img, 900)}" alt="${p.name}, a ${p.breed.toLowerCase()} ${p.sp}"></div>
        <div class="m-info">
          <p class="tag">${icon('pin')}${p.shelter}</p>
          <h3 class="h2" id="mName">${p.name}</h3>
          <ul class="facts">
            <li><small>Age</small><b>${ageLabel(p.m)}</b></li>
            <li><small>Sex</small><b>${p.sex}</b></li>
            <li><small>Size</small><b>${p.size}</b></li>
            <li><small>Energy</small><b>${cap(p.energy)}</b></li>
            <li><small>Kids</small><b>${p.kids ? 'Great with kids' : 'Older kids only'}</b></li>
            <li><small>Contribution</small><b>₹${p.fee.toLocaleString('en-IN')}</b></li>
          </ul>
          <p>${p.story}</p>
          <ul class="tags">${p.tags.map(t => `<li>${t}</li>`).join('')}</ul>
          <form class="mform" id="mForm" novalidate>
            <h4>Request a meet-and-greet with ${p.name}</h4>
            <div class="mrow">
              <div class="field"><label for="mfN">Your name</label><input class="input" id="mfN" value="${u ? u.name : ''}" autocomplete="name" placeholder="Full name"><span class="err-msg">Please enter your name.</span></div>
              <div class="field"><label for="mfP">Mobile number</label><input class="input" id="mfP" inputmode="tel" autocomplete="tel" placeholder="10-digit number"><span class="err-msg">Enter a valid 10-digit mobile number.</span></div>
            </div>
            <button class="btn btn-primary" type="submit" onclick="location.href='error.html'">${icon('calendar')}Request visit</button>
          </form>
        </div>
      </div>`;
    fixImages(mBody);
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock');
    setTimeout(() => $('#mClose').focus(), 60);
    $('#mForm').addEventListener('submit', ev => {
      ev.preventDefault();
      const n = $('#mfN'), ph = $('#mfP');
      const okN = n.value.trim().length >= 2, okP = /^[6-9]\d{9}$/.test(ph.value.replace(/[\s-]/g, ''));
      n.closest('.field').classList.toggle('err', !okN); ph.closest('.field').classList.toggle('err', !okP);
      if (!okN || !okP) return;
      const r = ev.submitter.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top, ['🐾', '❤️', '⭐'], 16);
      toast(`Request sent! We'll call about ${p.name} within 24 hours.`, 'check');
      closeModal();
    });
  }
  function closeModal() {
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock');
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  $('#mClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  /* ---------- match quiz ---------- */
  const QS = [
    { t: 'What does your home look like?', k: 'home', o: [['🏢', 'A flat or apartment', 'apartment'], ['🏡', 'A house, ideally with a yard', 'yard'], ['🛖', 'Somewhere in between', 'any']] },
    { t: 'How would your ideal weekend go?', k: 'energy', o: [['🛋️', 'Slow, cosy and quiet', 'calm'], ['🚶', 'A walk, a coffee, a movie', 'moderate'], ['🏃', 'Out and about all day', 'energetic']] },
    { t: 'Who are you hoping to meet?', k: 'sp', o: [['🐶', 'A dog', 'dog'], ['🐱', 'A cat', 'cat'], ['🐰', 'Something small & fluffy', 'rabbit'], ['🐾', 'Surprise me', 'any']] }
  ];
  const ans = {}; let qi = 0;
  const qbody = $('#qbody'), qbar = $('#qbar');
  function showQ() {
    qbar.style.width = (qi / QS.length * 100) + '%';
    if (qi >= QS.length) return showResult();
    const q = QS[qi];
    qbody.innerHTML = `<div class="qstep"><p class="q-n">Question ${qi + 1} of ${QS.length}</p><h3 class="q-t">${q.t}</h3>
      <div class="opts">${q.o.map(o => `<button type="button" class="opt" data-v="${o[2]}"><span>${o[0]}</span>${o[1]}</button>`).join('')}</div></div>`;
  }
  function score(p) {
    let s = 0; const why = [];
    if (ans.sp === 'any' || ans.sp === p.sp) { s += 4; if (ans.sp !== 'any') why.push(`A ${p.sp}, just as you hoped`); }
    if (ans.energy === p.energy) { s += 3; why.push(`${cap(p.energy)} energy matches your pace`); }
    else if (p.energy === 'moderate' || ans.energy === 'moderate') s += 1;
    if (ans.home === 'any' || p.home === 'any' || ans.home === p.home) { s += 2; if (ans.home === 'apartment' && p.home !== 'yard') why.push('Happy in a flat'); if (ans.home === 'yard' && p.home !== 'apartment') why.push('Will love the outdoor space'); }
    if (p.kids) s += .3;
    return { p, s, why };
  }
  function showResult() {
    const ranked = PETS.map(score).sort((a, b) => b.s - a.s);
    const top = ranked[0], p = top.p, more = ranked.slice(1, 3);
    const why = top.why.length ? top.why : ['A gentle all-rounder with a lot of love to give'];
    if (p.kids) why.push('Good with children');
    qbody.innerHTML = `<div class="res">
      <div class="res-ph"><img src="${IMG(p.img, 400)}" alt="${p.name}"></div>
      <div><p class="q-n">Your best match</p><h3 class="h3">${p.name}, ${ageLabel(p.m)}</h3>
      <ul>${why.slice(0, 3).map(w => `<li>${icon('check')}${w}</li>`).join('')}</ul>
      <div class="res-btns"><button class="btn btn-dark btn-sm" type="button" data-open="${p.id}">Meet ${p.name}</button><button class="btn btn-ghost btn-sm" type="button" id="qRetake">Retake</button></div></div></div>
      <p class="also">Also consider: ${more.map(m => `<button type="button" data-open="${m.p.id}">${m.p.name}</button>`).join('')}</p>`;
    fixImages(qbody);
    const r = qbody.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 80, ['🐾', '⭐', '❤️'], 14);
  }
  qbody.addEventListener('click', e => {
    const o = e.target.closest('.opt');
    if (o) { ans[QS[qi].k] = o.dataset.v; qi++; showQ(); return; }
    const op = e.target.closest('[data-open]'); if (op) { openModal(op.dataset.open); return; }
    if (e.target.closest('#qRetake')) { qi = 0; Object.keys(ans).forEach(k => delete ans[k]); showQ(); }
  });

  /* ---------- urgent: rings + sponsor buttons ---------- */
  const C = 251.3;
  const fmt = n => '₹' + n.toLocaleString('en-IN');
  function paintCase(c, animateNumber) {
    const goal = +c.dataset.goal, raised = +c.dataset.raised, p = Math.min(raised / goal, 1);
    $('.bar', c).style.strokeDashoffset = C * (1 - p);
    $('.pct', c).textContent = Math.round(p * 100) + '%';
    $('.r-now', c).textContent = fmt(raised);
    if (raised >= goal) { $('.quick', c).innerHTML = '<span class="pet-badge" style="position:static">Fully funded — thank you!</span>'; }
  }
  $$('.case').forEach(c => {
    ready(() => observe(c, () => paintCase(c), { threshold: .35 }));
    c.addEventListener('click', e => {
      const b = e.target.closest('[data-add]'); if (!b) return;
      c.dataset.raised = Math.min(+c.dataset.raised + +b.dataset.add, +c.dataset.goal);
      paintCase(c);
      const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top, ['🐾', '❤️', '⭐'], 12);
      toast(`Thank you! ${fmt(+b.dataset.add)} added (demo pledge).`, 'heart');
    });
  });

  /* ---------- passport stamps thump in ---------- */
  ready(() => observe($$('.st'), el => {
    el.classList.add('in');
    setTimeout(() => el.classList.add('lift'), 1400);
  }, { threshold: .3 }));
  $$('.st').forEach(el => el.classList.remove('lift'));

  /* ---------- happy tails strip ---------- */
  const strip = $('#strip');
  const step = () => (strip.querySelector('.tail').offsetWidth + 24);
  $('#tNext').addEventListener('click', () => strip.scrollBy({ left: step(), behavior: 'smooth' }));
  $('#tPrev').addEventListener('click', () => strip.scrollBy({ left: -step(), behavior: 'smooth' }));
  let down = false, sx = 0, sl = 0;
  strip.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = strip.scrollLeft; strip.classList.add('drag'); });
  window.addEventListener('pointerup', () => { down = false; strip.classList.remove('drag'); });
  window.addEventListener('pointermove', e => { if (down) strip.scrollLeft = sl - (e.clientX - sx); });
  strip.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') strip.scrollBy({ left: step(), behavior: 'smooth' });
    if (e.key === 'ArrowLeft') strip.scrollBy({ left: -step(), behavior: 'smooth' });
  });

  /* ---------- init ---------- */
  render(); showQ();
})();
