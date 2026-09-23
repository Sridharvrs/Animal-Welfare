/* ABOUT — image wipes, scroll-driven timeline, animated bars, partner marquee */
(function () {
  'use strict';
  const { $, $$, observe, ready } = PP;

  /* arch images wipe in one after another */
  ready(() => observe($$('.wipe'), el => el.classList.add('in'), { threshold: .2 }));

  /* timeline: orange line fills as you scroll, dots light up */
  const tl = $('#tl'), fill = $('#tlFill'), items = $$('.tl-item');
  function updateTl() {
    const r = tl.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(Math.max((vh * .62 - r.top) / r.height, 0), 1);
    fill.style.height = (p * 100) + '%';
    items.forEach(it => {
      const ir = it.getBoundingClientRect();
      it.classList.toggle('lit', ir.top + 42 < vh * .62);
    });
  }
  if (tl) { addEventListener('scroll', updateTl, { passive: true }); addEventListener('resize', updateTl); updateTl(); }

  /* fund allocation bars grow when they enter the screen */
  ready(() => observe($$('.bar'), b => { b.style.setProperty('--v', b.dataset.v); b.classList.add('in'); }, { threshold: .5 }));

  /* endless partner marquee */
  const track = $('.partners .marq-track');
  if (track) track.innerHTML += track.innerHTML;
})();
