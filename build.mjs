// Gerador estático sem dependências: `node build.mjs` → pasta dist/
import { mkdir, rm, cp, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './src/config/site.mjs';
import { services, fronts, pest } from './src/data/content.mjs';
import { layout } from './src/templates/layout.mjs';
import { home } from './src/pages/home.mjs';
import { servicePage, frontPage, pestGuide } from './src/pages/services.mjs';
import { sobre, contato, notFound } from './src/pages/institutional.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');

const minifyCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim();

export async function build() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(join(dist, 'assets/js'), { recursive: true });

  const css = minifyCss((await Promise.all(['tokens', 'base', 'components', 'scenes', 'motion'].map((f) => readFile(join(root, `src/styles/${f}.css`), 'utf8')))).join('\n'));
  const assetVersion = createHash('sha1').update(css).digest('hex').slice(0, 8);
  await writeFile(join(dist, 'assets/site.css'), css);

  await cp(join(root, 'src/motion'), join(dist, 'assets/js/motion'), { recursive: true });
  await cp(join(root, 'src/main.js'), join(dist, 'assets/js/main.js'));
  await cp(join(root, 'public'), dist, { recursive: true });

  const pages = [home(), pestGuide(), ...fronts.filter((f) => f !== pest).map(frontPage), ...services.map(servicePage), sobre(), contato(), notFound()];
  for (const p of pages) {
    const out = p.path === '/' ? 'index.html' : p.path.endsWith('.html') ? p.path.slice(1) : `${p.path.slice(1)}index.html`;
    await mkdir(dirname(join(dist, out)), { recursive: true });
    await writeFile(join(dist, out), String(layout({ ...p, assetVersion })));
  }

  // Endereços antigos (site anterior) → novos
  for (const [oldFile, to] of [['sobre.html', '/sobre/'], ['contato.html', '/contato/']]) {
    const target = new URL(to, site.url).toString();
    await writeFile(join(dist, oldFile), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Redirecionando…</title><link rel="canonical" href="${target}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${to}"><a href="${to}">Continuar</a></html>`);
  }

  const urls = pages.filter((p) => !p.noindex).map((p) => new URL(p.path, site.url).toString());
  const day = new Date().toISOString().slice(0, 10);
  await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${day}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
  await writeFile(join(dist, 'CNAME'), new URL(site.url).hostname + '\n');
  return pages.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(`✔ ${await build()} páginas em dist/`);
