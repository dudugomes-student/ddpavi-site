import { html } from '../lib/html.mjs';
import { site } from '../config/site.mjs';
import { waLink, telLink, localBusiness, faqSchema } from '../lib/seo.mjs';
import { services, fronts, pest, segments, steps, pillars, homeFaq } from '../data/content.mjs';
import { icon } from '../templates/icons.mjs';
import { serviceRow } from './services.mjs';

const WA = waLink('Olá! Vim pelo site da DDPavi e gostaria de um orçamento.');
const empresa = segments.filter((s) => s.name !== 'Residências');
const casa = segments.find((s) => s.name === 'Residências');
const casaServicos = ['dedetizacao', 'desratizacao', 'escorpioes', 'descupinizacao', 'limpeza-de-caixa-dagua'].map((s) => services.find((x) => x.slug === s));

export const home = () => ({
  path: '/',
  title: 'Serviços integrados na Grande São Paulo — Serviços no alvo',
  description:
    'Serviços integrados na Grande São Paulo: controle de pragas, serviços gerais, portaria e controle de acesso e jardinagem e paisagismo. Peça seu orçamento pelo WhatsApp.',
  schema: [localBusiness(), faqSchema(homeFaq)],
  body: html`
<section class="hero">
  <div class="reticle" aria-hidden="true">
    <span class="reticle__line reticle__line--h"></span>
    <span class="reticle__line reticle__line--v"></span>
    <span class="reticle__ring reticle__ring--1"></span>
    <span class="reticle__ring reticle__ring--2"></span>
    <span class="reticle__ring reticle__ring--3"></span>
    <span class="reticle__tag">Alvo travado</span>
  </div>
  <div class="container hero__inner">
    <p class="eyebrow" data-motion="fade" data-delay="0.1"><span><b>Serviços integrados</b> na ${site.area}</span></p>
    <h1>
      <span class="line" data-motion="drop" data-delay="0.3">Serviços</span>
      <span class="line line--red" data-motion="drop" data-delay="0.62">no alvo<span class="dot">.</span></span>
    </h1>
    <div class="hero__foot">
      <p class="hero__sub" data-motion="rise" data-delay="1.0"><strong>Controle de pragas, serviços gerais, portaria e controle de acesso e jardinagem e paisagismo</strong>: quatro frentes da mesma empresa, na ${site.area}.</p>
      <div class="btn-row" data-motion="rise" data-delay="1.15">
        <a class="btn btn--red" href="${WA}" target="_blank" rel="noopener">${icon('chat')} Pedir orçamento no WhatsApp</a>
        <a class="btn btn--ghost" href="${telLink()}">${icon('phone')} ${site.phone.display}</a>
      </div>
    </div>
    <a class="scroll-cue" href="#servicos" data-motion="fade" data-delay="2.4"><span>Role para conhecer</span><i aria-hidden="true"></i></a>
  </div>
</section>

<section class="section" id="servicos">
  <div class="container">
    <div class="section__head">
      <p class="eyebrow">Serviços integrados</p>
      <h2 data-motion="rise">Quatro frentes, um alvo</h2>
      <p class="lead">Controle de pragas, serviços gerais, portaria e controle de acesso e jardinagem e paisagismo. Escolha a frente e peça seu orçamento.</p>
    </div>
    <div class="service-list">
      ${fronts.map((f) => serviceRow(f, `/${f.slug}/`, f.text))}
    </div>
  </div>
</section>

<section class="section" id="pragas" aria-labelledby="pragas-title">
  <div class="container">
    <div class="section__head">
      <p class="eyebrow">${pest.title}</p>
      <h2 id="pragas-title" data-motion="rise">Cada praga, um alvo</h2>
      <p class="lead">Dedetização, desratização, descupinização, escorpiões e limpeza de caixa d’água, com licenças e responsável técnico habilitado.</p>
    </div>
  </div>
</section>

<section class="uv" id="revelacao" aria-labelledby="uv-title">
  <div class="uv__sticky">
    <canvas class="uv__canvas" aria-hidden="true"></canvas>
    <div class="uv__ui container">
      <p class="eyebrow">Inspeção</p>
      <h2 id="uv-title">O que você não vê, a gente vê.</h2>
      <p class="uv__hint"><span class="uv__hint-fine">Passe a luz pelo ambiente com o mouse.</span><span class="uv__hint-touch">Role a página: a luz percorre o ambiente.</span></p>
      <p class="uv__count"><b>0</b> / 8 sinais encontrados</p>
      <button class="uv__skip" type="button">Revelar tudo</button>
    </div>
    <div class="uv__done container" hidden>
      <h3>Isso estava aí o tempo todo.</h3>
      <p>Baratas, roedores, formigas e outros sinais quase nunca aparecem à luz do dia. A avaliação no local mostra o que está acontecendo e qual serviço resolve.</p>
      <div class="btn-row"><a class="btn btn--red" href="${WA}" target="_blank" rel="noopener">${icon('chat')} Pedir avaliação no WhatsApp</a></div>
    </div>
  </div>
  <p class="sr-only">Cena interativa: uma lanterna de luz ultravioleta revela sinais de pragas escondidos em um ambiente escuro, como baratas, fezes, rastros de roedor, manchas e trilhas de formigas. O botão "Revelar tudo" mostra todos.</p>
</section>

<section aria-label="Licenças do controle de pragas" class="container">
  <div class="trust" data-stagger="0.1">
    ${pillars.map((p) => html`<div class="trust__item" data-motion="rise"><h3>${p.title}</h3><p>${p.text}</p></div>`)}
  </div>
  <div class="btn-row" style="margin-block-start:2rem"><a class="btn btn--ghost" href="/${pest.slug}/">Todos os serviços de pragas ${icon('arrow')}</a></div>
</section>

<section class="section worlds" id="segmentos">
  <div class="container">
    <div class="section__head">
      <p class="eyebrow">Ambientes</p>
      <h2 data-motion="rise">Dois mundos, o mesmo rigor</h2>
    </div>
    <div class="switch" role="tablist" aria-label="Tipo de ambiente">
      <span class="switch__thumb" aria-hidden="true"></span>
      <button class="switch__tab" role="tab" id="tab-empresa" aria-controls="mundo-empresa" aria-selected="true" type="button">Para empresa</button>
      <button class="switch__tab" role="tab" id="tab-casa" aria-controls="mundo-casa" aria-selected="false" tabindex="-1" type="button">Para sua casa</button>
    </div>

    <div class="world" id="mundo-empresa" role="tabpanel" aria-labelledby="tab-empresa">
      <p class="lead" data-pop>Controle de pragas, serviços gerais, portaria e controle de acesso e jardinagem e paisagismo para o dia a dia de condomínios e empresas. O serviço é combinado conforme o expediente.</p>
      <div class="segments">
        ${empresa.map((s) => html`<div class="segment" data-pop><h3>${s.name}</h3><p>${s.text}</p></div>`)}
      </div>
      <div class="btn-row" data-pop><a class="btn btn--red" href="${waLink('Olá! Vim pelo site da DDPavi e gostaria de um orçamento para minha empresa.')}" target="_blank" rel="noopener">${icon('chat')} Orçamento para empresa</a></div>
    </div>

    <div class="world" id="mundo-casa" role="tabpanel" aria-labelledby="tab-casa">
      <p class="lead" data-pop>${casa.text}</p>
      <ul class="chips-list">
        ${casaServicos.map((s) => html`<li data-pop><a class="chip" href="/${s.slug}/">${s.title}</a></li>`)}
      </ul>
      <p class="note" data-pop>Se há crianças, idosos, gestantes ou animais em casa, avise já no pedido de orçamento. O técnico explica como preparar o ambiente.</p>
      <div class="btn-row" data-pop><a class="btn btn--red" href="${waLink('Olá! Vim pelo site da DDPavi e gostaria de um orçamento para minha casa.')}" target="_blank" rel="noopener">${icon('chat')} Orçamento para minha casa</a></div>
    </div>
  </div>
</section>

<section class="section" id="como-funciona">
  <div class="container">
    <div class="section__head">
      <p class="eyebrow">Método</p>
      <h2 data-motion="rise">Do contato à orientação</h2>
    </div>
    <ol class="steps" data-stagger="0.12">
      ${steps.map((s) => html`<li class="step" data-motion="rise"><span class="step__mark" aria-hidden="true"></span><h3>${s.title}</h3><p>${s.text}</p></li>`)}
    </ol>
  </div>
</section>

<section class="section" id="perguntas">
  <div class="container">
    <div class="section__head">
      <p class="eyebrow">Perguntas frequentes</p>
      <h2 data-motion="rise">Antes de chamar</h2>
    </div>
    <div class="faq">
      ${homeFaq.map((f) => html`<details><summary>${f.q}</summary><p class="faq__a">${f.a}</p></details>`)}
    </div>
  </div>
</section>

<section class="cta-final">
  <div class="cta-final__rings" aria-hidden="true"><span class="ring ring--3"></span><span class="ring ring--2"></span><span class="ring ring--1"></span></div>
  <div class="container">
    <h2 data-motion="rise">Escolha o serviço. Mire e chame.</h2>
    <p>Conte o que está acontecendo e receba o orçamento pelo WhatsApp.</p>
    <div class="btn-row">
      <span class="lockbtn">
        <span class="lock lock--1" data-motion="lock" aria-hidden="true"></span><span class="lock lock--2" data-motion="lock" data-delay="0.1" aria-hidden="true"></span>
        <a class="btn btn--white" href="${WA}" target="_blank" rel="noopener">${icon('chat')} Chamar no WhatsApp</a>
      </span>
      <a class="btn btn--ghost" href="/contato/">Outras formas de contato</a>
    </div>
    <div class="cta-final__contacts"><a href="${telLink()}">${site.phone.display}</a><span>WhatsApp ${site.whatsapp.display}</span></div>
  </div>
</section>`,
});
