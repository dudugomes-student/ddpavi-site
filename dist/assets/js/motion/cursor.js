// Cursor-mira: um anel que segue o ponteiro com mola. Só em mouse/trackpad e com movimento permitido.
import { animate } from './engine.js';
import { reducedMotion } from './preferences.js';

export function initCursor() {
  if (reducedMotion() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', '1');
  el.innerHTML = '<i></i>';
  document.body.append(el);
  let shown = false;
  addEventListener('pointermove', (e) => {
    if (!shown) { shown = true; el.dataset.on = ''; animate(el, { x: [e.clientX, e.clientX], y: [e.clientY, e.clientY] }, { stiffness: 1, damping: 1 }); }
    animate(el, { x: e.clientX, y: e.clientY }, { stiffness: 420, damping: 30, mass: 0.6 });
    const t = e.target.closest?.('a, button, summary, [role=tab], input, select, textarea');
    el.toggleAttribute('data-hot', !!t);
    el.toggleAttribute('data-hide', !!e.target.closest?.('.uv__sticky'));
  }, { passive: true });
  document.addEventListener('pointerleave', () => { el.removeAttribute('data-on'); shown = false; });
}
