// Preferência de movimento. Resolvida o mais cedo possível (também por script inline no <head>).
export const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

export function reducedMotion() {
  try { return window.matchMedia(REDUCE_QUERY).matches; } catch { return false; }
}

export function watchReducedMotion(onChange) {
  try {
    const mq = window.matchMedia(REDUCE_QUERY);
    const handler = () => { document.documentElement.classList.toggle('reduce-motion', mq.matches); onChange?.(mq.matches); };
    mq.addEventListener('change', handler);
    handler();
  } catch { /* navegador antigo: segue sem a opção */ }
}
