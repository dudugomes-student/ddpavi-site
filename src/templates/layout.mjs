import { html, raw } from '../lib/html.mjs';
import { site, nav } from '../config/site.mjs';
import { abs, waLink, telLink, jsonLd } from '../lib/seo.mjs';
import { services } from '../data/content.mjs';
import { icon } from './icons.mjs';

const earlyScript = `document.documentElement.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reduce-motion')}catch(e){}setTimeout(function(){if(!document.documentElement.classList.contains('motion-ready'))document.documentElement.classList.add('motion-timeout')},3500);`;

export function layout({ title, description, path, schema = [], body, noindex = false, assetVersion }) {
  const fullTitle = path === '/' ? `${title} | ${site.name}` : `${title} | ${site.short}`;
  const url = abs(path);
  const og = abs('/img/og.png');
  return html`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
${noindex ? raw('<meta name="robots" content="noindex">') : raw('<meta name="robots" content="index, follow, max-image-preview:large">')}
<meta name="theme-color" content="#07101b">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="preload" href="/fonts/InterDisplay-Black.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="/fonts/Inter-Regular.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=${assetVersion}">
<script>${raw(earlyScript)}</script>
${schema.map((s) => raw(`<script type="application/ld+json">${jsonLd(s)}</script>`))}
</head>
<body>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
${header(path)}
<main id="conteudo">
${body}
</main>
${footer()}
<div class="sticky-cta" aria-label="Contato rápido">
  <a class="btn btn--red" href="${waLink('Olá! Vim pelo site da DDPavi e gostaria de um orçamento.')}" target="_blank" rel="noopener">${icon('chat')} Orçamento</a>
  <a class="btn btn--ghost" href="${telLink()}">${icon('phone')} Ligar</a>
</div>
<script type="module" src="/assets/js/main.js?v=${assetVersion}"></script>
</body>
</html>`;
}

function header(path) {
  const current = (href) => (href === path || (href !== '/' && !href.includes('#') && path.startsWith(href)) ? 'page' : null);
  return html`<header class="header">
  <div class="container header__bar">
    <a class="brand" href="/" aria-label="${site.name} — página inicial"><img src="/img/logo-dark.png" width="283" height="84" alt="${site.name}"></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav" aria-label="Abrir menu"><span></span></button>
    <nav class="nav" id="nav" aria-label="Principal">
      ${nav.map((n) => html`<a href="${n.href}"${current(n.href) ? raw(' aria-current="page"') : ''}>${n.label}</a>`)}
      <a class="btn btn--red" href="${waLink('Olá! Vim pelo site da DDPavi e gostaria de um orçamento.')}" target="_blank" rel="noopener">Orçamento no WhatsApp</a>
    </nav>
  </div>
</header>`;
}

function footer() {
  return html`<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div>
        <img src="/img/logo-dark.png" width="283" height="84" alt="${site.name}" loading="lazy">
        <p>Controle de pragas e serviços integrados para condomínios, empresas e residências. Sede em ${site.city}, ${site.region}.</p>
      </div>
      <div>
        <h4>Serviços</h4>
        <ul>${services.map((s) => html`<li><a href="/${s.slug}/">${s.title}</a></li>`)}</ul>
      </div>
      <div>
        <h4>Empresa</h4>
        <ul>
          <li><a href="/sobre/">Sobre</a></li>
          <li><a href="/contato/">Contato</a></li>
          <li><a href="/#segmentos">Quem atendemos</a></li>
          <li><a href="/#perguntas">Perguntas frequentes</a></li>
        </ul>
      </div>
      <div>
        <h4>Contato</h4>
        <ul>
          <li><a href="${waLink()}" target="_blank" rel="noopener">WhatsApp ${site.whatsapp.display}</a></li>
          <li><a href="${telLink()}">Telefone ${site.phone.display}</a></li>
          <li>${site.city}, ${site.region}</li>
        </ul>
      </div>
    </div>
    <div class="footer__legal">
      <span>© ${site.year} ${site.name}. Todos os direitos reservados.</span>
      <span>Licenciada: ${site.licenses.join(' · ')}</span>
    </div>
  </div>
</footer>`;
}
