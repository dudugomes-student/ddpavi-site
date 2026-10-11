// Cena 1 — "Busca": a mira varre o hero, trava no ponto final do título e acompanha o ponteiro de leve.
import { animate } from './engine.js';
import { reducedMotion } from './preferences.js';

export function initHero() {
  const hero = document.querySelector('.hero');
  const ret = hero?.querySelector('.reticle');
  const dot = hero?.querySelector('h1 .dot');
  if (!hero || !ret || !dot) return;
  const line = dot.closest('.line');
  const rings = [...ret.querySelectorAll('.reticle__ring')];
  const tag = ret.querySelector('.reticle__tag');

  const place = () => {
    const h = hero.getBoundingClientRect(), d = dot.getBoundingClientRect();
    const dy = line?.__m?.y || 0;                      // desconta a queda em andamento do título
    ret.style.left = `${d.left + d.width / 2 - h.left}px`;
    const fs = parseFloat(getComputedStyle(dot).fontSize);
    ret.style.top = `${d.top + fs * 0.9 - h.top - dy}px`;   // centro visual do ponto final (linha de base)
  };
  place();
  addEventListener('resize', place);
  document.fonts?.ready.then(place);

  if (reducedMotion()) { ret.dataset.in = ''; rings.forEach((r) => { r.dataset.in = ''; }); if (tag) tag.dataset.in = ''; return; }

  const vw = Math.min(innerWidth, 900);
  const wp = [[0.42, -0.34], [-0.38, 0.26], [0.26, 0.4], [-0.16, -0.18]].map(([a, b]) => [a * vw, b * Math.min(innerHeight, 700)]);
  animate(ret, { x: [wp[0][0], wp[0][0]], y: [wp[0][1], wp[0][1]] }, { stiffness: 1, damping: 1 });
  ret.dataset.in = '';
  rings.forEach((r) => { r.dataset.in = ''; });
  const scan = { stiffness: 90, damping: 15 };
  [[0.55, 1], [1.0, 2], [1.45, 3]].forEach(([t, i]) => setTimeout(() => animate(ret, { x: wp[i][0], y: wp[i][1] }, scan), t * 1000));
  setTimeout(() => {
    place();
    animate(ret, { x: 0, y: 0 }, { stiffness: 230, damping: 11 });
    rings.forEach((r, i) => animate(r, { scale: [2.4 + i * 0.5, 1] }, { stiffness: 250, damping: 12, delay: i * 0.05 }));
    if (tag) { tag.dataset.in = ''; animate(tag, { y: [14, 0], opacity: [0, 1] }, { stiffness: 220, damping: 13, delay: 0.25 }); }
    setTimeout(follow, 700);
  }, 1900);

  function follow() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      animate(ret, { x: px * 26, y: py * 26 }, { stiffness: 70, damping: 14 });
    });
    hero.addEventListener('pointerleave', () => animate(ret, { x: 0, y: 0 }, { stiffness: 90, damping: 12 }));
  }
}
