import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from '../build.mjs';
import { html, raw } from '../src/lib/html.mjs';
import { waLink } from '../src/lib/seo.mjs';

await build();
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const walk = async (d) => (await Promise.all((await readdir(d)).map(async (n) => { const p = join(d, n); return (await stat(p)).isDirectory() ? walk(p) : [p]; }))).flat();
const pages = (await walk(dist)).filter((f) => f.endsWith('.html') && !/[\\/](sobre|contato)\.html$/.test(f));
const read = (f) => readFile(f, 'utf8');

test('html escapa interpolações', () => {
  assert.equal(String(html`<p>${'<script>"x"</script>'}</p>`), '<p>&lt;script&gt;&quot;x&quot;&lt;/script&gt;</p>');
  assert.equal(String(html`${raw('<b>ok</b>')}`), '<b>ok</b>');
});
test('waLink codifica o texto', () => assert.match(waLink('a b&c'), /^https:\/\/wa\.me\/5511916194867\?text=a%20b%26c$/));

test('cada página tem 1 h1, título único, descrição e canonical', async () => {
  const titles = new Set();
  for (const f of pages) {
    const s = await read(f);
    assert.equal((s.match(/<h1[ >]/g) || []).length, 1, f);
    const t = s.match(/<title>(.*?)<\/title>/)[1];
    assert.ok(!titles.has(t), `título repetido ${t}`); titles.add(t);
    assert.match(s, /<meta name="description" content="[^"]{40,}/, f);
    assert.match(s, /<link rel="canonical" href="https:\/\/ddpavidedetizadora\.com/, f);
  }
});
test('imagens têm alt e dimensões', async () => {
  for (const f of pages) for (const m of (await read(f)).matchAll(/<img\b[^>]*>/g)) {
    assert.match(m[0], /\balt="[^"]+"/, m[0]); assert.match(m[0], /\bwidth=/); assert.match(m[0], /\bheight=/);
  }
});
test('links internos existem em dist/', async () => {
  const files = new Set(await walk(dist));
  for (const f of pages) for (const m of (await read(f)).matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const p = m[1]; const cand = [join(dist, p), join(dist, p, 'index.html')];
    assert.ok(cand.some((c) => files.has(c)), `${f} → ${p}`);
  }
});
test('JSON-LD é válido', async () => {
  for (const f of pages) for (const m of (await read(f)).matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(m[1]);
});
test('sitemap lista só páginas indexáveis', async () => {
  const s = await read(join(dist, 'sitemap.xml'));
  assert.ok(!s.includes('404')); assert.ok(s.includes('/dedetizacao/'));
});

const frontSlugs = ['controle-de-pragas', 'servicos-gerais', 'portaria-e-controle-de-acesso', 'jardinagem-e-paisagismo'];
const pestSlugs = ['dedetizacao', 'desratizacao', 'descupinizacao', 'escorpioes', 'limpeza-de-caixa-dagua'];
const page = (slug) => read(join(dist, slug, 'index.html'));
const main = (s) => s.slice(s.indexOf('<main'), s.indexOf('</main>'));

test('as 4 frentes têm página, estão no menu, no rodapé, na home e no JSON-LD', async () => {
  const home = await read(join(dist, 'index.html'));
  assert.match(home, /<nav class="nav"[^]*?href="\/#servicos">Serviços integrados<[^]*?href="\/controle-de-pragas\/">Controle de pragas</);
  const footer = home.slice(home.indexOf('<footer'));
  const ld = home.match(/"hasOfferCatalog":\{.*?\]\}/)[0];
  for (const slug of frontSlugs) {
    await page(slug);
    assert.ok(footer.includes(`href="/${slug}/"`), `rodapé sem ${slug}`);
    assert.ok(main(home).includes(`class="service-row" href="/${slug}/"`), `home sem ${slug}`);
    assert.ok(ld.includes(`/${slug}/`), `JSON-LD sem ${slug}`);
  }
});
test('licenças e responsável técnico só aparecem no contexto de controle de pragas', async () => {
  for (const slug of frontSlugs.slice(1)) assert.doesNotMatch(main(await page(slug)), /ANVISA|IBAMA|CETESB|respons[aá]vel t[eé]cnico/i, slug);
  assert.match(main(await page('controle-de-pragas')), /ANVISA/);
});
test('guia de pragas lista os 5 serviços e as URLs antigas continuam no sitemap', async () => {
  const guide = main(await page('controle-de-pragas'));
  const sitemap = await read(join(dist, 'sitemap.xml'));
  for (const slug of pestSlugs) {
    assert.ok(guide.includes(`href="/${slug}/"`), `guia sem ${slug}`);
    assert.ok(sitemap.includes(`/${slug}/`), `sitemap sem ${slug}`);
  }
  for (const slug of frontSlugs) assert.ok(sitemap.includes(`/${slug}/`), `sitemap sem ${slug}`);
});
