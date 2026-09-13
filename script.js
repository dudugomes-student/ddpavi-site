// ================================
// DDPAVI - Script Principal
// ================================

// HEADER AO ROLAR

const header = document.querySelector(".cabecalho");
const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {

        header.style.background = "rgba(6,16,27,.96)";
        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";

    } else {

        header.style.background = "";
        header.style.boxShadow = "";

    }

});


// ================================
// ANIMAÇÕES AO ENTRAR NA TELA
// ================================

const elementos = document.querySelectorAll(
    ".servico-card, .ambiente-card, .proposito-card, .cliente-card, .sobre-servico-item, .canal-contato-card, .processo-item, .diferencial-item, .valor-item"
);

if ('IntersectionObserver' in window && !movimentoReduzido.matches) {
const observador = new IntersectionObserver((entradas, obs) => {

    entradas.forEach((entrada) => {

        if (entrada.isIntersecting) {

            entrada.target.classList.add("aparecer");
            obs.unobserve(entrada.target);

        }

    });

}, {

    threshold: 0

});

elementos.forEach((item) => {

    item.classList.add("escondido");

    observador.observe(item);

});
movimentoReduzido.addEventListener('change', () => {
    if (movimentoReduzido.matches) {
        elementos.forEach((item) => item.classList.add('aparecer'));
        observador.disconnect();
    }
});
}


// ================================
// BOTÃO VOLTAR AO TOPO
// ================================

const voltarTopo = document.createElement("button");

voltarTopo.innerHTML = "↑";

voltarTopo.className = "voltar-topo";
voltarTopo.type = "button";
voltarTopo.setAttribute("aria-label", "Voltar ao topo");

document.body.appendChild(voltarTopo);

window.addEventListener("scroll", () => {

    if (window.scrollY > 600) {

        voltarTopo.classList.add("mostrar");

    } else {

        voltarTopo.classList.remove("mostrar");

    }

});

voltarTopo.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: movimentoReduzido.matches ? "instant" : "smooth"

    });

});


// ================================
// MÁSCARA DE TELEFONE
// ================================

const telefone = document.querySelector("#telefone");

function formatarTelefone(valor) {
    let digitos = valor.replace(/\D/g, '');
    if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith('55')) {
        digitos = digitos.slice(2);
    }
    // Não descarta dígitos de números inválidos: pede correção ao visitante.
    if (digitos.length > 11) return valor;
    if (digitos.length <= 2) return digitos;
    const local = digitos.slice(2);
    const divisao = local.length > 8 ? 5 : 4;
    return `(${digitos.slice(0, 2)}) ${local.slice(0, divisao)}${local.length > divisao ? '-' + local.slice(divisao) : ''}`;
}

function atualizarTelefone() {
    const antes = telefone.value;
    const cursor = telefone.selectionStart;
    const quantidadeAntes = antes.slice(0, cursor).replace(/\D/g, '').length;
    telefone.value = formatarTelefone(antes);
    const removidos = antes.replace(/\D/g, '').length - telefone.value.replace(/\D/g, '').length;
    if (document.activeElement === telefone && cursor !== null) {
        let restantes = Math.max(0, quantidadeAntes - removidos);
        let posicao = 0;
        while (posicao < telefone.value.length && restantes > 0) {
            if (/\d/.test(telefone.value[posicao])) restantes--;
            posicao++;
        }
        telefone.setSelectionRange(posicao, posicao);
    }
    const valido = /^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone.value);
    telefone.setCustomValidity(telefone.value && !valido ? 'Informe um telefone com DDD e 10 ou 11 dígitos.' : '');
}

if (telefone) {
    telefone.addEventListener('input', atualizarTelefone);
    telefone.addEventListener('change', atualizarTelefone);
    atualizarTelefone();
}


// ================================
// FORMULÁRIO
// ================================

const formulario = document.querySelector(".contato-formulario");

if (formulario) {

    const camposTexto = ['nome', 'cidade', 'mensagem'].map((id) => formulario.querySelector(`#${id}`));
    function validarTexto(campo) {
        campo.setCustomValidity(campo.value && !campo.value.trim() ? 'Preencha este campo com sua informação.' : '');
    }
    camposTexto.forEach((campo) => campo.addEventListener('input', () => validarTexto(campo)));

    const servico = formulario.querySelector('#servico');
    const solicitado = new URLSearchParams(window.location.search).get('servico');
    if ([...servico.options].some((opcao) => opcao.value === solicitado)) {
        servico.value = solicitado;
    }

    formulario.addEventListener("submit", (e) => {

        e.preventDefault();

        atualizarTelefone();
        camposTexto.forEach(validarTexto);
        if (!formulario.reportValidity()) return;
        const dados = new FormData(formulario);
        const ambiente = formulario.querySelector('#tipo-ambiente');

        const linhas = [
            'Olá! Gostaria de solicitar um orçamento com a DDPAVI Serviços Integrados.',
            '',
            `Nome: ${dados.get('nome').trim()}`,
            `Telefone: ${dados.get('telefone').trim()}`
        ];

        const email = dados.get('email');
        if (email && email.trim()) {
            linhas.push(`E-mail: ${email.trim()}`);
        }

        linhas.push(
            `Cidade: ${dados.get('cidade').trim()}`,
            `Ambiente: ${ambiente.selectedOptions[0].textContent.trim()}`,
            `Serviço: ${servico.selectedOptions[0].textContent.trim()}`,
            '',
            `Necessidade: ${dados.get('mensagem').trim()}`
        );

        const mensagem = linhas.join('\n');

        window.location.assign(`https://wa.me/5511916194867?text=${encodeURIComponent(mensagem)}`);

    });

    // O formulário aparece somente depois que seu envio está configurado.
    formulario.hidden = false;
    const alternativa = document.querySelector('#contato-sem-script');
    if (alternativa) alternativa.hidden = true;
}


// ================================
// ÂNCORAS NATIVAS E ALTURA DO CABEÇALHO
// ================================

// A navegação nativa preserva URL e histórico e respeita o movimento reduzido no CSS.
if (header && 'ResizeObserver' in window) {
    const tamanhoCabecalho = new ResizeObserver(() => {
        document.documentElement.style.setProperty('--altura-cabecalho', `${header.offsetHeight + 16}px`);
    });
    tamanhoCabecalho.observe(header);
}


// ================================
// BOTÃO FLUTUANTE DO WHATSAPP
// ================================

const whatsapp = document.querySelector(".whatsapp-flutuante");

if (whatsapp) {

    whatsapp.addEventListener("click", () => {
        whatsapp.classList.add("clicado");
        setTimeout(() => {
            whatsapp.classList.remove("clicado");
        }, 1200);
    });

}
