// Motor de animação por mola, sem dependências. API deliberadamente parecida com a do Motion
// (animate / stagger / inView) para que a troca futura seja só mudar o import.
//
// Mola: a = (-k·(x - alvo) - c·v) / m, integrada em passos fixos de 1/240 s (estável e previsível).
const REST = {
  x: [0.05, 0.4], y: [0.05, 0.4], rotate: [0.04, 0.3], rotateX: [0.04, 0.3], rotateY: [0.04, 0.3],
  scale: [0.0008, 0.01], opacity: [0.002, 0.02],
};
const DEFAULTS = { x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, opacity: 1 };
const running = new Map();   // `${elId}:${key}` -> anim
const dirty = new Set();
let raf = 0, last = 0, uid = 0;

const state = (el) => (el.__m ||= { id: ++uid, ...DEFAULTS });

function write(el) {
  const s = el.__m;
  const t = [];
  if (s.x || s.y) t.push(`translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`);
  if (s.rotateX) t.push(`rotateX(${s.rotateX.toFixed(3)}deg)`);
  if (s.rotateY) t.push(`rotateY(${s.rotateY.toFixed(3)}deg)`);
  if (s.rotate) t.push(`rotate(${s.rotate.toFixed(3)}deg)`);
  if (s.scale !== 1) t.push(`scale(${s.scale.toFixed(4)})`);
  el.style.transform = t.length ? t.join(' ') : '';
  el.style.opacity = s.opacity >= 0.999 ? '' : String(Math.max(0, Math.min(1, s.opacity)));
}

function tick(now) {
  const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
  last = now;
  for (const [id, a] of running) {
    if (a.delay > 0) { a.delay -= dt; continue; }
    a.elapsed += dt;
    const n = Math.ceil(dt * 240), h = dt / n;
    for (let i = 0; i < n; i++) {
      const acc = (-a.k * (a.x - a.to) - a.c * a.v) / a.m;
      a.v += acc * h; a.x += a.v * h;
    }
    const s = state(a.el);
    s[a.key] = a.key === 'opacity' ? Math.max(0, Math.min(1, a.x)) : a.x;
    dirty.add(a.el);
    const [dx, dv] = REST[a.key];
    if ((Math.abs(a.v) < dv && Math.abs(a.x - a.to) < dx) || a.elapsed > 4) {
      s[a.key] = a.to; running.delete(id); a.done();
    }
  }
  for (const el of dirty) write(el);
  dirty.clear();
  raf = running.size ? requestAnimationFrame(tick) : 0;
}

/**
 * animate(el, { y: [-80, 0], opacity: [0, 1] }, { stiffness, damping, mass, delay })
 * Valores: número (anima do estado atual até ele) ou [de, até].
 */
export function animate(el, props, opts = {}) {
  const s = state(el);
  const { stiffness = 220, damping = 18, mass = 1, delay = 0 } = opts;
  const promises = [];
  for (const [key, value] of Object.entries(props)) {
    if (!(key in DEFAULTS)) continue;
    const [from, to] = Array.isArray(value) ? value : [s[key], value];
    const id = `${s.id}:${key}`;
    const prev = running.get(id);
    const v0 = prev && !Array.isArray(value) ? prev.v : 0;     // continuidade de velocidade ao reapontar
    if (prev) prev.done();
    s[key] = from;
    const isOpacity = key === 'opacity';
    let resolve; promises.push(new Promise((r) => (resolve = r)));
    running.set(id, {
      el, key, x: from, to, v: v0, delay, elapsed: 0, m: mass,
      k: isOpacity ? 260 : stiffness, c: isOpacity ? 34 : damping, done: resolve,
    });
  }
  write(el);
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  return {
    finished: Promise.all(promises),
    stop() { for (const key of Object.keys(props)) { const a = running.get(`${s.id}:${key}`); if (a) { running.delete(`${s.id}:${key}`); a.done(); } } },
  };
}

export const stagger = (step = 0.08, { start = 0 } = {}) => (i) => start + i * step;

/** Dispara cb(el) quando o elemento entra na tela (uma vez). */
export function inView(elements, cb, { amount = 0.15, margin = '0px 0px -8% 0px' } = {}) {
  const list = typeof elements === 'string' ? [...document.querySelectorAll(elements)] : [...elements];
  if (!('IntersectionObserver' in window)) { list.forEach(cb); return () => {}; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { io.unobserve(e.target); cb(e.target); }
  }, { threshold: amount, rootMargin: margin });
  list.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

// Presets de mola do site (os mesmos tokens do anúncio: queda com quique, subida suave, pop).
export const presets = {
  drop: { from: { y: -90, opacity: 0 }, spring: { stiffness: 170, damping: 11, mass: 1 } },
  rise: { from: { y: 30, opacity: 0 }, spring: { stiffness: 190, damping: 24, mass: 1 } },
  pop: { from: { scale: 0.7, opacity: 0 }, spring: { stiffness: 320, damping: 15, mass: 1 } },
  lock: { from: { scale: 2.6, opacity: 0 }, spring: { stiffness: 260, damping: 13, mass: 1 } },
  fade: { from: { opacity: 0 }, spring: { stiffness: 200, damping: 30, mass: 1 } },
};
