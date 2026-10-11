import { html } from '../lib/html.mjs';
import { site } from '../config/site.mjs';
import { waLink, telLink, localBusiness, breadcrumbs } from '../lib/seo.mjs';
import { pillars, steps, services, fronts, pest } from '../data/content.mjs';
import { icon } from '../templates/icons.mjs';

export const sobre = () => ({
  path: '/sobre/',
  title: 'Sobre a DDPavi',
  description: `Conheça a ${site.name}: controle de pragas, serviços gerais, portaria e controle de acesso e jardinagem e paisagismo na ${site.area}.`,
  schema: [localBusiness(), breadcrumbs([{ name: 'Início', path: '/' }, { name: 'Sobre', path: '/sobre/' }])],
  body: html`
<section class="page-hero">
  <div class="container">
    <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a> / Sobre</nav>
    <h1 data-motion="drop" data-delay="0.15">Sobre a DDPavi</h1>
    <p class="lead" data-motion="rise" data-delay="0.5">A ${site.name} reúne quatro frentes: controle de pragas, serviços gerais, portaria e controle de acesso e jardinagem e paisagismo. A base fica em ${site.city}, ${site.region}, e o atendimento cobre a ${site.area}.</p>
  </div>
</section>
<section class="section" aria-labelledby="certs-title">
  <div class="container">
    <div class="section__head"><p class="eyebrow">Controle de pragas</p><h2 id="certs-title" data-motion="rise">Certificações e licenças</h2><p class="lead">Licenças e responsável técnico do serviço de controle de pragas.</p></div>
    <div class="trust" data-stagger="0.1">${pillars.map((p) => html`<div class="trust__item" data-motion="rise"><h3>${p.title}</h3><p>${p.text}</p></div>`)}</div>
    <ul class="certs" data-stagger="0.1">${site.certifications.map((c) => html`<li class="cert" data-motion="rise">
      <span class="cert__mark" aria-hidden="true"></span>
      <h3>${c.name}</h3>
      ${c.issuer ? html`<p class="cert__issuer">${c.issuer}</p>` : ''}
      ${c.number || c.validUntil ? html`<dl class="cert__meta">
        ${c.number ? html`<div><dt>Nº</dt><dd>${c.number}</dd></div>` : ''}
        ${c.validUntil ? html`<div><dt>Válida até</dt><dd><time datetime="${c.validUntil}">${c.validUntil.split('-').reverse().join('/')}</time></dd></div>` : ''}
      </dl>` : ''}
    </li>`)}</ul>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section__head"><p class="eyebrow">Como trabalhamos</p><h2 data-motion="rise">Do contato à orientação</h2></div>
    <ol class="steps" data-stagger="0.12">${steps.map((s) => html`<li class="step" data-motion="rise"><span class="step__mark" aria-hidden="true"></span><h3>${s.title}</h3><p>${s.text}</p></li>`)}</ol>
    <div class="btn-row" style="margin-block-start:3rem"><a class="btn btn--red" href="${waLink('Olá! Vim pelo site da DDPavi e gostaria de um orçamento.')}" target="_blank" rel="noopener">${icon('chat')} Pedir orçamento</a></div>
  </div>
</section>`,
});

export const contato = () => ({
  path: '/contato/',
  title: 'Contato e orçamento',
  description: `Peça seu orçamento de serviços integrados na ${site.area}: WhatsApp ${site.whatsapp.display}, telefone ${site.phone.display} ou formulário.`,
  schema: [localBusiness(), breadcrumbs([{ name: 'Início', path: '/' }, { name: 'Contato', path: '/contato/' }])],
  body: html`
<section class="page-hero">
  <div class="container">
    <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a> / Contato</nav>
    <h1 data-motion="drop" data-delay="0.15">Peça seu orçamento</h1>
    <p class="lead" data-motion="rise" data-delay="0.5">Conte qual serviço você precisa e onde fica o local. Respondemos pelo WhatsApp.</p>
  </div>
</section>
<section class="section">
  <div class="container split" style="align-items:start">
    <form class="form" id="orcamento" data-whatsapp="${site.whatsapp.number}" novalidate>
      <div class="field"><label for="f-nome">Nome</label><input id="f-nome" name="nome" type="text" autocomplete="name" required></div>
      <div class="field"><label for="f-servico">Serviço</label>
        <select id="f-servico" name="servico" required>
          ${fronts.map((f) => f === pest
            ? html`<optgroup label="${pest.title}">${services.map((s) => html`<option value="${s.title}">${s.title}</option>`)}</optgroup>`
            : html`<option value="${f.title}">${f.title}</option>`)}
          <option value="Outro">Outro</option>
        </select></div>
      <div class="field"><label for="f-local">Local (bairro e tipo de imóvel)</label><input id="f-local" name="local" type="text" autocomplete="address-level2"></div>
      <div class="field"><label for="f-msg">Mensagem</label><textarea id="f-msg" name="mensagem"></textarea></div>
      <button class="btn btn--red" type="submit">${icon('chat')} Enviar pelo WhatsApp</button>
      <p class="form__hint">Ao enviar, abrimos o WhatsApp com a mensagem pronta. Nada é guardado neste site.</p>
    </form>
    <div class="contact-cards">
      <a href="${waLink()}" target="_blank" rel="noopener"><small>WhatsApp</small><strong>${site.whatsapp.display}</strong></a>
      <a href="${telLink()}"><small>Telefone</small><strong>${site.phone.display}</strong></a>
      <div><small>Atendimento</small><strong>${site.area}</strong></div>
    </div>
  </div>
</section>`,
});

export const notFound = () => ({
  path: '/404.html',
  title: 'Página não encontrada',
  description: 'A página que você procura não existe ou foi movida.',
  noindex: true,
  body: html`
<section class="page-hero">
  <div class="container">
    <h1>Página não encontrada</h1>
    <p class="lead">O endereço pode ter mudado. Volte ao início ou fale com a gente.</p>
    <div class="btn-row"><a class="btn btn--red" href="/">Ir para o início</a><a class="btn btn--ghost" href="/contato/">Contato</a></div>
  </div>
</section>`,
});
