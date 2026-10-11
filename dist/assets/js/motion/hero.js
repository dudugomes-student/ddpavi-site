// Cena 1 — "Busca": a mira varre o hero, trava no espaço livre ao lado do título (abaixo dele no celular) e acompanha o ponteiro de leve.
import { animate } from './engine.js';
import { reducedMotion } from './preferences.js';

export function initHero() {
  const hero = document.querySelector('.hero');
  const ret = hero?.querySelector('.reticle');
  const h1 = hero?.querySelector('h1');
  const inner = hero?.querySelector('.hero__inner');
  if (!hero || !ret || !h1 || !inner) return;
  const rings = [...ret.querySelectorAll('.reticle__ring')];
  const tag = ret.querySelector('.reticle__tag');
  const range = document.createRange();

  const place = () => {
    const h = hero.getBoundingClientRect(), b = h1.getBoundingClientRect(), r = inner.getBoundingClientRect();
    if (matchMedia('(min-width: 901px)').matches) {
      // espaço próprio: entre a direita do texto mais largo do título e a direita do conteúdo
      const textRight = Math.max(...[...h1.querySelectorAll('.line')].map((l) => { range.selectNodeContents(l); return range.getBoundingClientRect().right; }));
      ret.style.left = `${(textRight + r.right) / 2 - h.left}px`;
      ret.style.top = `${b.top + b.height / 2 - h.top}px`;
    } else {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      ret.style.left = `${h.width / 2}px`;
      ret.style.top = `${r.bottom - 5 * rem - h.top}px`;   // faixa reservada abaixo dos botões
    }
  };
  place();
  addEventListener('resize', place);
  document.fonts?.ready.then(place);

  if (reducedMotion()) { ret.dataset.in = ''; rings.forEach((r) => { r.dataset.in = ''; }); if (tag) tag.dataset.in = ''; return; }

  const vw = Math.min(innerWidth, 900);
  const wp = [[0.1, -0.12], [-0.09, 0.1], [0.07, 0.14], [-0.05, -0.06]].map(([a, b]) => [a * vw, b * Math.min(innerHeight, 700)]);
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
