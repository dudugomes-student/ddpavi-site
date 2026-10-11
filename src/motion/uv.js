// Cena 2 — "Revelação": lanterna UV em canvas. Desenhado em código, sem fotos.
// Ponteiro fino: a luz segue o mouse. Toque/teclado: a luz percorre o ambiente conforme o scroll.
import { animate } from './engine.js';
import { reducedMotion } from './preferences.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const path = (p) => ({ u: 0.5 + 0.34 * Math.sin(p * Math.PI * 4.4), v: 0.38 + 0.5 * p });

// Sinais escondidos, posicionados sobre o caminho da luz (para o toque achar todos) com pequeno desvio.
const MARKS = [
  { p: 0.07, t: 'roach', a: -0.5, label: 'Barata', j: [0.03, 0.04] },
  { p: 0.19, t: 'drop', a: 0, label: 'Fezes', j: [-0.05, 0.03] },
  { p: 0.31, t: 'prints', a: 0.35, label: 'Rastro de roedor', j: [0.04, -0.04] },
  { p: 0.43, t: 'roach', a: 2.4, label: 'Barata', j: [-0.04, 0.04] },
  { p: 0.55, t: 'stain', a: 0, label: 'Mancha', j: [0.05, 0.03] },
  { p: 0.67, t: 'ants', a: 0.2, label: 'Trilha de formigas', j: [-0.06, -0.03] },
  { p: 0.79, t: 'drop', a: 0, label: 'Fezes', j: [0.04, 0.03] },
  { p: 0.9, t: 'roach', a: 1.1, label: 'Barata', j: [-0.03, -0.04] },
].map((m) => { const q = path(m.p); return { ...m, u: clamp(q.u + m.j[0], 0.1, 0.9), v: clamp(q.v + m.j[1], 0.36, 0.86) }; });

function rnd(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }

function drawMark(c, m, u, x, y) {
  const R = rnd(Math.round(m.p * 100) + 3);
  c.save();
  c.translate(x, y);
  c.rotate(m.a);
  c.fillStyle = 'rgba(205,235,255,.96)';
  c.strokeStyle = 'rgba(205,235,255,.9)';
  c.lineWidth = Math.max(1, u * 0.16);
  c.lineCap = 'round';
  c.shadowColor = '#7fb2ff';
  c.shadowBlur = u * 2.4;
  if (m.t === 'roach') {
    c.beginPath(); c.ellipse(0, 0, u * 3.6, u * 2.1, 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(u * 3.9, 0, u * 1.2, u * 1.1, 0, 0, 7); c.fill();
    for (const s of [-1, 1]) for (const k of [-1.6, 0, 1.6]) {
      c.beginPath(); c.moveTo(k * u * 0.9, s * u * 1.6); c.lineTo(k * u * 0.9 + k * u * 0.6, s * u * 3.5); c.lineTo(k * u * 0.9 + k * u * 1.7, s * u * 3.9); c.stroke();
    }
    for (const s of [-1, 1]) { c.beginPath(); c.moveTo(u * 4.8, s * u * 0.4); c.quadraticCurveTo(u * 7.2, s * u * 1.2, u * 8.6, s * u * 3.2); c.stroke(); }
  } else if (m.t === 'drop') {
    for (let i = 0; i < 12; i++) { const r = u * (0.28 + R() * 0.3); c.beginPath(); c.ellipse((R() - 0.5) * u * 7, (R() - 0.5) * u * 5, r * 1.5, r, R() * 3, 0, 7); c.fill(); }
  } else if (m.t === 'prints') {
    for (let i = 0; i < 9; i++) { const x0 = i * u * 2.6 - u * 10, y0 = (i % 2 ? 1 : -1) * u * 1.1; c.beginPath(); c.ellipse(x0, y0, u * 0.75, u * 0.5, 0.3, 0, 7); c.fill(); for (const d of [-0.7, 0, 0.7]) { c.beginPath(); c.arc(x0 + u * 0.9, y0 + d * u * 0.5, u * 0.18, 0, 7); c.fill(); } }
  } else if (m.t === 'stain') {
    c.fillStyle = 'rgba(165,255,215,.55)';
    for (let i = 0; i < 9; i++) { c.beginPath(); c.arc((R() - 0.5) * u * 5, (R() - 0.5) * u * 4, u * (0.8 + R() * 1.6), 0, 7); c.fill(); }
  } else if (m.t === 'ants') {
    for (let i = 0; i < 22; i++) { const x0 = (i - 11) * u * 1.0; c.beginPath(); c.arc(x0, Math.sin(i * 0.7) * u * 1.3, u * 0.32, 0, 7); c.fill(); }
  }
  c.restore();
}

export function initUV() {
  const root = document.querySelector('.uv');
  const canvas = root?.querySelector('.uv__canvas');
  if (!root || !canvas) return;
  const stage = root.querySelector('.uv__sticky');
  const countEl = root.querySelector('.uv__count b');
  const done = root.querySelector('.uv__done');
  const skip = root.querySelector('.uv__skip');
  const hint = root.querySelector('.uv__hint');
  const ctx = canvas.getContext('2d');
  const hid = document.createElement('canvas'), hc = hid.getContext('2d');
  const tmp = document.createElement('canvas'), tc = tmp.getContext('2d');
  const fnd = document.createElement('canvas'), fc = fnd.getContext('2d');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const still = reducedMotion();
  let W = 0, H = 0, dpr = 1, U = 8, Rb = 160;
  let beam = { x: 0, y: 0 }, target = { x: 0, y: 0 };
  const found = new Set();
  const pings = [];
  let tiles = null, visible = false, raf = 0, finished = false, curP = 0;

  const pos = (m) => ({ x: m.u * W, y: m.v * H });

  function size() {
    const r = stage.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    for (const c of [canvas, hid, tmp, fnd]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    for (const c of [ctx, hc, tc, fc]) c.setTransform(dpr, 0, 0, dpr, 0, 0);
    U = Math.max(5.5, Math.min(W, H) / 70);
    Rb = Math.max(120, Math.min(W, H) * 0.25);
    buildTiles(); renderLayers();
    if (!beam.x) { const q = path(0); beam = { x: q.u * W, y: q.v * H }; target = { ...beam }; }
    draw(performance.now());
  }

  function buildTiles() {
    tiles = document.createElement('canvas'); tiles.width = Math.round(W * dpr); tiles.height = Math.round(H * dpr);
    const t = tiles.getContext('2d'); t.setTransform(dpr, 0, 0, dpr, 0, 0);
    t.fillStyle = '#060d17'; t.fillRect(0, 0, W, H);
    const s = Math.max(70, U * 11);
    t.strokeStyle = 'rgba(150,180,255,.06)'; t.lineWidth = 1;
    for (let x = 0; x < W; x += s) { t.beginPath(); t.moveTo(x, 0); t.lineTo(x, H); t.stroke(); }
    for (let y = 0; y < H; y += s) { t.beginPath(); t.moveTo(0, y); t.lineTo(W, y); t.stroke(); }
    const R = rnd(7); t.fillStyle = 'rgba(160,190,255,.05)';
    for (let i = 0; i < (W * H) / 900; i++) t.fillRect(R() * W, R() * H, 1.2, 1.2);
  }

  function renderLayers() {
    hc.clearRect(0, 0, W, H); fc.clearRect(0, 0, W, H);
    MARKS.forEach((m, i) => { const { x, y } = pos(m); drawMark(hc, m, U, x, y); if (found.has(i)) drawMark(fc, m, U, x, y); });
  }

  function foundMark(i) {
    if (found.has(i)) return;
    found.add(i);
    const { x, y } = pos(MARKS[i]);
    drawMark(fc, MARKS[i], U, x, y);
    pings.push({ x, y, t: performance.now(), i });
    countEl.textContent = String(found.size);
    if (found.size === MARKS.length) finish();
  }

  function finish() {
    if (finished) return; finished = true;
    root.dataset.done = '';
    if (done) { done.hidden = false; done.dataset.in = ''; if (!still) animate(done, { y: [-60, 0], opacity: [0, 1] }, { stiffness: 170, damping: 11 }); }
    if (hint) hint.hidden = true;
  }

  function revealAll() { MARKS.forEach((_, i) => { if (!found.has(i)) { found.add(i); } }); countEl.textContent = String(MARKS.length); renderLayers(); finish(); }

  function draw(now) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(tiles, 0, 0, W, H);
    if (still) { ctx.drawImage(fnd, 0, 0, W, H); labels(); return; }
    // luz ultravioleta
    const g = ctx.createRadialGradient(beam.x, beam.y, 0, beam.x, beam.y, Rb * 1.25);
    g.addColorStop(0, 'rgba(110,70,255,.34)'); g.addColorStop(0.55, 'rgba(70,60,230,.14)'); g.addColorStop(1, 'rgba(40,40,200,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // sinais já encontrados ficam levemente visíveis
    ctx.globalAlpha = 0.4; ctx.drawImage(fnd, 0, 0, W, H); ctx.globalAlpha = 1;
    // sinais iluminados agora
    tc.globalCompositeOperation = 'source-over'; tc.clearRect(0, 0, W, H); tc.drawImage(hid, 0, 0, W, H);
    tc.globalCompositeOperation = 'destination-in';
    const m = tc.createRadialGradient(beam.x, beam.y, 0, beam.x, beam.y, Rb);
    m.addColorStop(0, 'rgba(255,255,255,1)'); m.addColorStop(0.62, 'rgba(255,255,255,.9)'); m.addColorStop(1, 'rgba(255,255,255,0)');
    tc.fillStyle = m; tc.fillRect(0, 0, W, H);
    ctx.drawImage(tmp, 0, 0, W, H);
    // brilho do foco
    ctx.strokeStyle = 'rgba(160,150,255,.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(beam.x, beam.y, Rb * 0.98, 0, 7); ctx.stroke();
    for (let i = pings.length - 1; i >= 0; i--) {
      const k = (now - pings[i].t) / 700;
      if (k >= 1) { pings.splice(i, 1); continue; }
      ctx.strokeStyle = `rgba(236,32,32,${1 - k})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(pings[i].x, pings[i].y, U * (3 + k * 12), 0, 7); ctx.stroke();
    }
    labels();
  }

  function labels() {
    ctx.font = `600 ${Math.max(11, U * 1.5)}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    for (const i of found) {
      const { x, y } = pos(MARKS[i]);
      ctx.fillStyle = 'rgba(255,255,255,.88)';
      ctx.fillText(MARKS[i].label.toUpperCase(), x, y + U * 6.2);
    }
  }

  function updateTarget() {
    if (finePointer) return;
    const r = root.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
    curP = p;
    const q = path(p);
    target.x = q.u * W; target.y = q.v * H;
  }

  function tick(now) {
    raf = 0;
    if (!visible) return;
    updateTarget();
    const px = beam.x, py = beam.y;
    beam.x += (target.x - beam.x) * 0.2; beam.y += (target.y - beam.y) * 0.2;
    if (finePointer) {
      const n = Math.max(1, Math.ceil(Math.hypot(beam.x - px, beam.y - py) / (Rb * 0.25)));
      for (let k = 1; k <= n; k++) {
        const x = px + (beam.x - px) * (k / n), y = py + (beam.y - py) * (k / n);
        MARKS.forEach((m, i) => { const q = pos(m); if (Math.hypot(q.x - x, q.y - y) < Rb * 0.55) foundMark(i); });
      }
    } else {
      MARKS.forEach((m, i) => { if (curP >= m.p - 0.01) foundMark(i); });
    }
    draw(now);
    raf = requestAnimationFrame(tick);
  }

  size();
  addEventListener('resize', size);
  skip?.addEventListener('click', revealAll);

  if (still) { revealAll(); draw(0); return; }

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(tick); }, { threshold: 0 }).observe(root);
  if (finePointer) {
    stage.addEventListener('pointermove', (e) => { const r = stage.getBoundingClientRect(); target.x = e.clientX - r.left; target.y = e.clientY - r.top; });
  }
}
