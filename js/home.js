/* HOME — typed words, parallax, favourites, story slider, rescue path */
(function () {
  'use strict';
  const { $, $$, observe, burst, reduce, finePointer } = PP;

  /* typed rotating words in the hero pill */
  const typed = $('#typed');
  if (typed && !reduce) {
    const words = ['Rescue', 'Heal', 'Rehome', 'Love'];
    let w = 0, i = words[0].length, del = true;
    const loop = () => {
      const word = words[w];
      typed.textContent = word.slice(0, i);
      if (del) { i--; if (i < 0) { del = false; w = (w + 1) % words.length; i = 0; } }
      else { i++; if (i > words[w].length) { del = true; i = words[w].length; setTimeout(loop, 1300); return; } }
      setTimeout(loop, del ? 55 : 110);
    };
    setTimeout(loop, 2600);
  }

  /* hero image + chips react to the mouse */
  const hero = $('.hero');
  if (hero && finePointer && !reduce) {
    const img = $('.hero-img'), chips = $$('.chip', hero);
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      img.style.translate = `${-x * 26}px ${-y * 18}px`;
      chips.forEach((c, i) => { c.style.translate = `${x * (i ? -30 : 30)}px ${y * 22}px`; });
    });
  }

  /* favourite hearts */
  $$('.fav').forEach(b => b.addEventListener('click', () => {
    b.classList.toggle('on');
    if (b.classList.contains('on')) { const r = b.getBoundingClientRect(); burst(r.left + 20, r.top + 20, ['❤️', '💛', '🐾'], 10); PP.toast('Saved to your wishlist.', 'heart'); }
  }));

  /* story slider */
  const slides = $$('.slide'), dotsBox = $('#dots');
  let cur = 0, timer;
  slides.forEach((_, i) => { const d = document.createElement('span'); d.addEventListener('click', () => go(i)); dotsBox.appendChild(d); });
  const dots = $$('span', dotsBox);
  function go(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === cur));
    dots.forEach((d, i) => d.classList.toggle('on', i === cur));
    restart();
  }
  function restart() { clearInterval(timer); if (!reduce) timer = setInterval(() => go(cur + 1), 6000); }
  $('#prev').addEventListener('click', () => go(cur - 1));
  $('#next').addEventListener('click', () => go(cur + 1));
  $('#slider').addEventListener('mouseenter', () => clearInterval(timer));
  $('#slider').addEventListener('mouseleave', restart);
  go(0);

  /* rescue path — line fills, paw walks, nodes light up in order */
  const path = $('#path');
  if (path) observe(path, () => {
    path.classList.add('go');
    const steps = $$('.path-steps li', path), total = reduce ? 1 : 2600;
    steps.forEach((li, i) => setTimeout(() => li.classList.add('lit'), (total / (steps.length - 1)) * i * .92));
  }, { threshold: .35 });
})();

function updateJourney(progress) {
  const fill = document.getElementById('pathFill');
  const walker = document.getElementById('walker');

  if (!fill || !walker) return;

  if (window.innerWidth <= 850) {
    fill.style.width = '100%';
    fill.style.height = `${progress}%`;

    walker.style.left = '50%';
    walker.style.top = `${progress}%`;
  } else {
    fill.style.height = '100%';
    fill.style.width = `${progress}%`;

    walker.style.top = '50%';
    walker.style.left = `${progress}%`;
  }
}