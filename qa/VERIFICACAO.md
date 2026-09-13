# Verificação local — 13/09/2026

- Páginas inicial, Sobre e Contato renderizadas no Microsoft Edge headless.
- Larguras verificadas: 1440, 390 e 320 pixels. Sem rolagem horizontal, imagens ausentes ou duplicação de H1.
- Links internos e seus destinos verificados nas três páginas, sem âncoras inválidas.
- Seleção automática de Portaria e Serviços Gerais pelo link do formulário confirmada.
- Formulário validou os campos obrigatórios e formatou telefone celular e fixo.
- Navegação ao WhatsApp interceptada antes da requisição externa. Destinatário conferido: 5511916194867. Mensagem preservou acentos, `&`, quebra de linha, tipo de ambiente e serviço. Nenhuma mensagem foi enviada.
- Capturas: `desktop.png`, `services.png` e `mobile-form.png`.

## Transparência da imagem concluída

A remoção do fundo foi concluída por edição local autorizada pelo usuário. Arquivo final: `assets/img/logo-servicos-integrados-transparente.png`, 2172 × 724, RGBA (`Format32bppArgb`), com 1.132.076 pixels totalmente transparentes. Bordas sem fundo branco verificadas sobre fundos claro e escuro em `logo-fundo-claro.png` e `logo-fundo-escuro.png`. As três páginas usam o arquivo transparente, e o painel branco da logo foi removido do CSS. As capturas anteriores das páginas documentam a versão antes desta correção.
