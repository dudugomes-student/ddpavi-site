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
