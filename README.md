# Site DDPavi (base premium V2)

Gerador estático **sem dependências** (só Node 22). Conteúdo em `src/data/content.mjs` e `src/config/site.mjs`.

    node build.mjs        # gera dist/
    node --test test/     # testes (SEO, links, alt, JSON-LD)
    python3 -m http.server 8000 -d dist

## Publicar
1. Suba esta pasta num repositório GitHub (branch `main`) e ative Settings → Pages → Source: GitHub Actions.
2. No Wix (onde está o domínio), aponte o DNS: `A` para 185.199.108.153 / .109.153 / .110.153 / .111.153 e `CNAME www` → `<usuario>.github.io`. O arquivo `CNAME` já está em `dist/`.
3. Alternativa: enviar o conteúdo de `dist/` para qualquer hospedagem estática (Netlify, Cloudflare Pages).

## Pendências do cliente (CONFIRMAR antes de publicar)
Números e validade das licenças · endereço completo · cidades atendidas · fotos reais da equipe · depoimentos autorizados · Instagram.

## Movimento
`src/motion/engine.js` é um motor de molas próprio, com API parecida com a do Motion (`animate`, `inView`). Para trocar pela biblioteca Motion, basta trocar o import quando houver acesso ao npm.
Respeita `prefers-reduced-motion`; sem JS tudo aparece normalmente.
