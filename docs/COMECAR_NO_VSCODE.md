# Começar no VS Code

1. Instale Node 22 (nodejs.org), VS Code e a extensão **Claude Code** (ou rode `claude` no terminal integrado).
2. Descompacte este projeto, abra a pasta no VS Code (`File > Open Folder`).
3. Confirme que o Claude Code lê o projeto: peça "resuma o CLAUDE.md". Ele deve citar a direção "A mira".
4. Teste a base atual: `node build.mjs && node --test test/ && python3 -m http.server 8000 -d dist` e abra http://localhost:8000.
5. Primeira tarefa para dar ao Claude Code:
   "Migre o projeto para Astro, instale motion e lenis, mantenha content/seo/testes e implemente a cena 1 (Busca) conforme a skill ddpavi-site-premium-v2. Mostre no navegador e me peça ajuste fino."
6. Traga: fonte autoral (arquivos .woff2), fotos reais, número das licenças, endereço.
7. Skills da sua conta do claude.ai NÃO aparecem lá. Tudo que importa está em CLAUDE.md e .claude/skills/.

## Receita do vídeo do @iacomjota1 (o método que você quer usar como base)
O vídeo não ensina um projeto pronto, ensina um fluxo de trabalho no Claude Code:
1. Instalar o Claude Code (uma linha no terminal; já coberto no passo 1 acima).
2. **Adicionar o Motion** (antigo Framer Motion): no site motion.dev há o material de IA/skill do Motion para dar ao Claude Code (e a instalação `npm i motion`).
3. **Instalar a skill "UI UX Pro Max"** (inteligência de design): dentro do Claude Code, peça "instale a skill UI UX Pro Max". Confira o nome e a origem antes de aceitar, porque são terceiros.
4. **Colar a linha de comando de um exemplo**: no site de exemplos de animação (scroll animations, background lights etc.), copiar a linha/prompt do exemplo escolhido e colar no Claude Code. Cada exemplo vira uma cena.
5. **Frase-chave de prompt**: "pense como um designer sênior". Depois descreva o site (aqui: a direção "A mira") e peça o site completo, com design, animação e pronto para produção.
Nada disso foi instalado neste pacote, porque exige internet liberada. É para fazer aí no VS Code.
