# DDPavi — site "A mira" (base premium V2)

Empresa: DDPAVI Serviços Integrados, controle de pragas, Jandira–SP. Domínio: ddpavidedetizadora.com (registrado no Wix; o site é HTML estático hospedado fora do Wix).
Ao trabalhar neste projeto, leia e siga `.claude/skills/ddpavi-site-premium-v2/SKILL.md` (direção criativa, movimento, regras de conteúdo). O dono escreve em português do Brasil.

## Estado do projeto
- `build.mjs` + `src/` = gerador estático SEM dependências (Node 22). Já tem: conteúdo (`src/data/content.mjs`), dados da empresa (`src/config/site.mjs`), SEO/JSON-LD (`src/lib/seo.mjs`), testes (`test/`), deploy (`.github/workflows/deploy.yml`).
- É uma base provisória e genérica. A meta é migrar para **Astro + Motion + Lenis (+ GSAP só para cenas fixas)** e refazer o visual na direção "A mira". Reaproveite content, config, seo, testes e deploy; refaça layout, estilos e movimento.
- `src/motion/engine.js` é um motor de molas próprio, criado porque o npm estava bloqueado. Substituir por Motion (`animate`, `inView`, `scroll`).

## Método de referência (vídeo @iacomjota1)
Fluxo: Claude Code + Motion + skill UI UX Pro Max (terceiros: verificar origem antes de instalar) + colar prompts de exemplos do Motion para cada cena + instrução "pense como um designer sênior". Ver `docs/COMECAR_NO_VSCODE.md`.

## O que já existe da direção "A mira" (home)
Cena 1 `src/motion/hero.js` (mira varre e trava no ponto final do título) · Cena 2 `src/motion/uv.js` (lanterna UV em canvas; mouse no desktop, scroll no toque; botão "Revelar tudo") · Cena 3 anéis `lock` nas linhas de serviço · Cena 4 `worlds.js` (Empresa/Sua casa) · Cena 5 passos · Cena 6 mira travando no botão do WhatsApp · `cursor.js` (cursor-mira). Pendências: rolagem suave (Lenis), fonte autoral, fotos reais, refinar quique/ritmo em aparelho real, páginas internas ainda no estilo antigo.

## Regras inegociáveis
- Nada inventado: sem números, clientes, depoimentos, prazos ou licenças que não estejam em `site.mjs`/`content.mjs`. Itens marcados CONFIRMAR dependem do dono.
- Sem estética genérica de IA: nada de gradientes roxos, cards iguais em grade, fade-in padrão, ícones de stock. Movimento = mola e quique, nunca fade.
- Acessibilidade: `prefers-reduced-motion` com versão limpa, contraste AA, foco visível, funcionar sem JS, um `<h1>` por página.
- Performance: LCP < 2,0 s no celular, sem layout shift, imagens com largura/altura, fontes locais com subset.
- Cores: tinta #07101B, azul #0028C8, vermelho #D60E0E (único acento). Logo com "DD" azul original (cuidado com contraste em fundo escuro; usar placa clara se preciso).
- Fotos geradas por IA: nunca como protagonistas. Só como textura com tratamento forte, ou ficam de fora até haver fotos reais.
- Não publicar nem fazer push sem o dono pedir.

## Comandos
    node build.mjs && node --test test/    # base atual
    (após migrar) npm run dev | npm run build | npm test
