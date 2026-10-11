---
name: ddpavi-site-premium-v2
description: Use ao criar ou editar qualquer site da DDPavi ou de marcas do mesmo dono: direção criativa "A mira", movimento por mola/quique, stack Astro+Motion, regras de conteúdo, SEO e acessibilidade.
---

# DDPavi — base premium V2

## Objetivo
Site que pareça de um estúdio internacional (nível "pagaria US$ 10 mil"): ideia única, execução impecável, zero cara de template. Peso igual entre clientes empresariais (condomínios, indústrias, food service, saúde) e residenciais.

## Conceito: "A mira"
O site é um visor. A marca já é um alvo e a promessa é "Pragas no alvo.". Todo movimento segue a lógica: a mira procura, trava e elimina.

## Roteiro da home (6 cenas, scroll com cenas fixas)
1. **Busca** — fundo escuro, mira vazia varre e trava; título cai e quica no lugar.
2. **Revelação (UV)** — ambiente "limpo" + frase "O que você não vê, a gente vê". Lanterna UV controlada por cursor/dedo revela rastros, ninhos e sinais desenhados em canvas/SVG (sem foto). Mobile: lanterna varre sozinha com o scroll. Reduced motion: estado já revelado.
3. **Alvos travados** — cada serviço é um alvo; a mira se fecha com mola e quique e revela a explicação (dedetização, desratização, descupinização, escorpiões, caixa d'água).
4. **Dois mundos** — seletor "Empresa / Sua casa" que reorganiza linguagem, ambientes e exemplos. Peso igual.
5. **Método** — 4 passos, linha que se desenha com o scroll.
6. **Fechamento** — a mira trava no botão do WhatsApp.

Páginas internas (serviços, sobre, contato): mais contidas e rápidas, mesma linguagem. Home = cinematográfica.

## Linguagem de movimento
- Mola, nunca fade: entrada por queda com quique (stiffness ~170, damping ~11), rise e pop para o resto. Rebote com restituição baixa (~0,3).
- Rolagem suave (Lenis) + cenas fixas (GSAP ScrollTrigger ou `scroll()` do Motion). Cursor-mira só em ponteiro fino.
- Cada movimento tem motivo narrativo (procurar, travar, revelar). Se não tem, corta.
- Reduced motion, celular fraco e sem JS: versão limpa e totalmente funcional.

## Tipografia e cor
Tinta + azul da marca + vermelho como único acento. Título em grotesco condensado gigante, destaques em serifa itálica; corpo em sans legível. Fontes locais (WOFF2), com subset latino. Se o dono não fornecer fonte autoral, usar Inter/Inter Display.

## Stack alvo
Astro (estático) + Motion + Lenis (+ GSAP só para cenas fixas). TypeScript opcional. Deploy: GitHub Pages por Actions, ou Netlify/Cloudflare Pages. Testes: vitest/`node --test` para SEO, links, alt e JSON-LD.

## Conteúdo e copy
Direto, concreto, sem clichê de "excelência e qualidade". Nunca inventar números, clientes, depoimentos ou prazos. Itens CONFIRMAR em `src/config/site.mjs` dependem do dono (licenças com número e validade, endereço, cidades, Instagram).

## SEO
`LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList` em JSON-LD; title/description únicos; canonical; sitemap e robots; OG 1200x630; páginas de serviço com intenção local ("em Jandira e região").

## Checklist antes de entregar
- [ ] Conceito legível em 3 segundos no celular
- [ ] Lighthouse mobile ≥ 90 em performance e 100 em acessibilidade/SEO
- [ ] Reduced motion e sem JS testados
- [ ] Nenhum dado inventado; CONFIRMAR listados ao dono
- [ ] Contraste do logo azul em fundo escuro resolvido
- [ ] Testado em 375, 768, 1024 e 1440 px, e em aparelho real
