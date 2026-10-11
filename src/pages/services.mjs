import { html } from '../lib/html.mjs';
import { waLink, serviceSchema, faqSchema, breadcrumbs } from '../lib/seo.mjs';
import { services } from '../data/content.mjs';
import { icon } from '../templates/icons.mjs';

export const servicePage = (s) => {
  const path = `/${s.slug}/`;
  const others = services.filter((x) => x.slug !== s.slug);
  return {
    path,
    title: s.metaTitle,
    description: s.metaDescription,
    schema: [serviceSchema(s, path), faqSchema(s.faq), breadcrumbs([{ name: 'Início', path: '/' }, { name: s.title, path }])],
    body: html`
<section class="page-hero">
  <div class="container">
    <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a> / <a href="/#servicos">Serviços</a> / ${s.title}</nav>
    <h1 data-motion="drop" data-delay="0.15">${s.title}</h1>
    <p class="lead" data-motion="rise" data-delay="0.5">${s.lead}</p>
    <div class="btn-row" data-motion="rise" data-delay="0.65">
      <a class="btn btn--red" href="${waLink(`Olá! Vim pelo site da DDPavi e gostaria de um orçamento de ${s.title.toLowerCase()}.`)}" target="_blank" rel="noopener">${icon('chat')} Pedir orçamento</a>
      <a class="btn btn--ghost" href="/contato/">Outras formas de contato</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div>
      <p class="eyebrow">Atenção aos sinais</p>
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
