import { html } from '../lib/html.mjs';
import { waLink, serviceSchema, faqSchema, breadcrumbs } from '../lib/seo.mjs';
import { services, fronts, pest, pillars, pestFaq } from '../data/content.mjs';
import { icon } from '../templates/icons.mjs';

const integrated = { name: 'Serviços integrados', path: '/#servicos' };
const pestCrumb = { name: pest.title, path: `/${pest.slug}/` };
const quote = (title) => waLink(`Olá! Vim pelo site da DDPavi e gostaria de um orçamento de ${title.toLowerCase()}.`);

// Mesmo template para os 5 serviços de pragas e para as frentes novas; muda só a trilha e os "outros serviços".
const detailPage = (s, { parent, siblings, eyebrow }) => {
  const path = `/${s.slug}/`;
  const others = siblings.filter((x) => x.slug !== s.slug);
  return {
    path,
    title: s.metaTitle,
    description: s.metaDescription,
    schema: [serviceSchema(s, path), faqSchema(s.faq), breadcrumbs([{ name: 'Início', path: '/' }, parent, { name: s.title, path }])],
    body: html`
<section class="page-hero">
  <div class="container">
    <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a> / <a href="${parent.path}">${parent.name}</a> / ${s.title}</nav>
    <h1 data-motion="drop" data-delay="0.15">${s.title}</h1>
    <p class="lead" data-motion="rise" data-delay="0.5">${s.lead}</p>
    <div class="btn-row" data-motion="rise" data-delay="0.65">
      <a class="btn btn--red" href="${quote(s.quoteLabel || s.title)}" target="_blank" rel="noopener">${icon('chat')} Pedir orçamento</a>
      <a class="btn btn--ghost" href="/contato/">Outras formas de contato</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div>
      <p class="eyebrow">${s.signsEyebrow || eyebrow}</p>
      <h2 data-motion="rise">${s.signsTitle}</h2>
      ${s.note ? html`<p class="note">${s.note}</p>` : ''}
    </div>
    <ul class="signs" data-stagger="0.07">${s.signs.map((x) => html`<li data-motion="rise">${x}</li>`)}</ul>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head"><p class="eyebrow">Perguntas frequentes</p><h2 data-motion="rise">Sobre ${s.title.toLowerCase()}</h2></div>
    <div class="faq">${s.faq.map((f) => html`<details><summary>${f.q}</summary><p class="faq__a">${f.a}</p></details>`)}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head"><p class="eyebrow">Outros serviços</p></div>
    <div class="related">${others.map((o) => html`<a class="chip" href="/${o.slug}/">${o.title}</a>`)}</div>
  </div>
</section>`,
  };
};

export const servicePage = (s) => detailPage(s, { parent: pestCrumb, siblings: services, eyebrow: 'Atenção aos sinais' });
export const frontPage = (f) => detailPage(f, { parent: integrated, siblings: fronts, eyebrow: 'Quando contratar' });

export const serviceRow = (s, href, tag, external = false) => html`<a class="service-row" href="${href}"${external ? html` target="_blank" rel="noopener"` : ''} data-motion="rise">
        <h3 class="service-row__title">${s.title}</h3>
        <span class="service-row__tag">${tag}</span>
        <span class="service-row__go" aria-hidden="true">
          <span class="lock lock--1" data-motion="lock"></span><span class="lock lock--2" data-motion="lock" data-delay="0.08"></span>
          ${icon('arrow')}
        </span>
      </a>`;

// Guia de controle de pragas: reúne os 5 serviços (as URLs de cada um continuam as mesmas).
export const pestGuide = () => {
  const path = `/${pest.slug}/`;
  return {
    path,
    title: pest.metaTitle,
    description: pest.metaDescription,
    schema: [serviceSchema(pest, path), faqSchema(pestFaq), breadcrumbs([{ name: 'Início', path: '/' }, integrated, { name: pest.title, path }])],
    body: html`
<section class="page-hero">
  <div class="container">
    <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a> / <a href="${integrated.path}">${integrated.name}</a> / ${pest.title}</nav>
    <h1 data-motion="drop" data-delay="0.15">${pest.title}</h1>
    <p class="lead" data-motion="rise" data-delay="0.5">${pest.lead}</p>
    <div class="btn-row" data-motion="rise" data-delay="0.65">
      <a class="btn btn--red" href="${quote(pest.title)}" target="_blank" rel="noopener">${icon('chat')} Pedir orçamento</a>
      <a class="btn btn--ghost" href="/contato/">Outras formas de contato</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head"><p class="eyebrow">Serviços</p><h2 data-motion="rise">Cada praga, um alvo</h2></div>
    <div class="service-list">
      ${services.map((s) => serviceRow(s, `/${s.slug}/`, s.tagline))}
    </div>
  </div>
</section>

<section aria-label="Licenças e equipe" class="container">
  <div class="trust" data-stagger="0.1">
    ${pillars.map((p) => html`<div class="trust__item" data-motion="rise"><h3>${p.title}</h3><p>${p.text}</p></div>`)}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head"><p class="eyebrow">Perguntas frequentes</p><h2 data-motion="rise">Sobre controle de pragas</h2></div>
    <div class="faq">${pestFaq.map((f) => html`<details><summary>${f.q}</summary><p class="faq__a">${f.a}</p></details>`)}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head"><p class="eyebrow">Outros serviços integrados</p></div>
    <div class="related">${fronts.filter((f) => f !== pest).map((o) => html`<a class="chip" href="/${o.slug}/">${o.title}</a>`)}</div>
  </div>
</section>`,
  };
};
