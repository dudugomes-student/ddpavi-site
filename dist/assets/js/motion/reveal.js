import { animate, inView, presets } from './engine.js';
import { reducedMotion } from './preferences.js';

/**
 * Marcação:  data-motion="drop|rise|pop|fade"   data-delay="0.3" (segundos)
 * Grupos:    data-stagger="0.09" no pai → cada filho [data-motion] ganha atraso crescente.
 */
export function initReveal() {
  const els = [...document.querySelectorAll('[data-motion]')];
  if (!els.length) return;

  if (reducedMotion()) {          // sem movimento: tudo visível, nada anima
    els.forEach((el) => { el.dataset.in = ''; });
    document.querySelectorAll('[data-stagger]').forEach((g) => { g.dataset.in = ''; });
    return;
  }

  document.querySelectorAll('[data-stagger]').forEach((group) => {
    const step = parseFloat(group.dataset.stagger) || 0.08;
    [...group.querySelectorAll(':scope > [data-motion], :scope > * > [data-motion]')].forEach((el, i) => {
      el.dataset.delay = String((parseFloat(el.dataset.delay) || 0) + i * step);
    });
  });

  const run = (el) => {
    const p = presets[el.dataset.motion] || presets.rise;
    const delay = parseFloat(el.dataset.delay) || 0;
    const from = p.from;
    // aplica o estado inicial em linha ANTES de liberar o elemento, sem piscar
    const props = {};
    for (const [k, v] of Object.entries(from)) props[k] = [v, k === 'opacity' ? 1 : k === 'scale' ? 1 : 0];
    const handle = animate(el, props, { ...p.spring, delay });
    el.dataset.in = '';
    return handle;
  };

  inView(els, run, { amount: 0.12 });
  document.querySelectorAll('[data-stagger]:not([data-motion])').forEach((g) => inView([g], (el) => { el.dataset.in = ''; }, { amount: 0.2 }));
}
