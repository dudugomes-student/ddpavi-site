// Cena 4 — "Dois mundos": seletor Empresa / Sua casa com troca por mola.
import { animate } from './engine.js';
import { reducedMotion } from './preferences.js';

export function initWorlds() {
  const root = document.querySelector('.worlds');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[role=tab]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
  const thumb = root.querySelector('.switch__thumb');
  root.classList.add('is-ready');
  const calm = reducedMotion();

  const moveThumb = (tab, first) => {
    if (!thumb) return;
    const x = tab.offsetLeft, w = tab.offsetWidth;
    thumb.style.width = `${w}px`;
    if (first || calm) { thumb.style.transform = `translate3d(${x}px,0,0)`; thumb.__x = x; return; }
    animate(thumb, { x: [thumb.__x ?? x, x] }, { stiffness: 320, damping: 20 });
    thumb.__x = x;
  };

  const select = (idx, first = false) => {
    tabs.forEach((t, i) => { t.setAttribute('aria-selected', String(i === idx)); t.tabIndex = i === idx ? 0 : -1; });
    panels.forEach((p, i) => { p.hidden = i !== idx; });
    moveThumb(tabs[idx], first);
    if (!first && !calm) {
      const items = panels[idx].querySelectorAll('[data-pop]');
      items.forEach((el, i) => animate(el, { y: [-46, 0], opacity: [0, 1] }, { stiffness: 190, damping: 12, delay: i * 0.06 }));
    }
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; select(n); tabs[n].focus(); }
    });
  });
  select(0, true);
  addEventListener('resize', () => moveThumb(tabs.find((t) => t.getAttribute('aria-selected') === 'true'), true));
  document.fonts?.ready.then(() => moveThumb(tabs[0], true));
}
