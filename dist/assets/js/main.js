import { reducedMotion, watchReducedMotion } from './motion/preferences.js';
import { initReveal } from './motion/reveal.js';
import { initHero } from './motion/hero.js';
import { initUV } from './motion/uv.js';
import { initWorlds } from './motion/worlds.js';
import { initCursor } from './motion/cursor.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

document.documentElement.classList.add('motion-ready');
watchReducedMotion();
initReveal();
initHero();
initUV();
initWorlds();
initCursor();

/* Cabeçalho: ganha fundo ao rolar */
const header = $('.header');
const onScroll = () => { if (header) header.toggleAttribute('data-stuck', window.scrollY > 8); };
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* Menu no celular */
const toggle = $('.menu-toggle');
const nav = $('#nav');
if (toggle && nav) {
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.toggleAttribute('data-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (m) => { if (m.matches) setOpen(false); });
}

/* Formulário: monta a mensagem e abre o WhatsApp (o site é estático, sem servidor) */
const form = $('#orcamento');
if (form) {
  const number = form.dataset.whatsapp;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = Object.fromEntries(new FormData(form));
    const lines = ['Olá! Vim pelo site da DDPavi e gostaria de um orçamento.', '', `Nome: ${d.nome}`, `Serviço: ${d.servico}`];
    if (d.local) lines.push(`Local: ${d.local}`);
    if (d.mensagem) lines.push('', d.mensagem);
    const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
    const w = window.open(url, '_blank', 'noopener');
    if (!w) window.location.href = url;
  });
}
