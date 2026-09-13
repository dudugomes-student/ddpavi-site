// ================================
// DDPAVI - Script Principal
// ================================

// HEADER AO ROLAR

const header = document.querySelector(".cabecalho");

window.addEventListener("scroll", () => {

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
    "section, article, .servico-card, .ambiente-card, .proposito-card"
);

const observador = new IntersectionObserver((entradas) => {

    entradas.forEach((entrada) => {

        if (entrada.isIntersecting) {

            entrada.target.classList.add("aparecer");

        }

    });

}, {

    threshold: 0.15

});

elementos.forEach((item) => {

    item.classList.add("escondido");

    observador.observe(item);

});


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

        behavior: "smooth"

    });

});


// ================================
// MÁSCARA DE TELEFONE
// ================================

const telefone = document.querySelector("#telefone");

if (telefone) {

    telefone.addEventListener("input", (e) => {

        const digitos = e.target.value.replace(/\D/g, "").slice(0, 11);
        const local = digitos.slice(2);
        const divisao = local.length > 8 ? 5 : 4;
        e.target.value = digitos.length > 2
            ? `(${digitos.slice(0, 2)}) ${local.slice(0, divisao)}${local.length > divisao ? '-' + local.slice(divisao) : ''}`
            : digitos;

    });

}


// ================================
// FORMULÁRIO
// ================================

const formulario = document.querySelector(".contato-formulario");

if (formulario) {

    const servico = formulario.querySelector('#servico');
    const solicitado = new URLSearchParams(window.location.search).get('servico');
    if ([...servico.options].some((opcao) => opcao.value === solicitado)) {
        servico.value = solicitado;
    }

    formulario.addEventListener("submit", (e) => {

        e.preventDefault();

        if (!formulario.reportValidity()) return;
        const dados = new FormData(formulario);
        const ambiente = formulario.querySelector('#tipo-ambiente');
        const mensagem = [
            'Olá! Gostaria de solicitar um orçamento com a DDPAVI Serviços Integrados.',
            '',
            `Nome: ${dados.get('nome').trim()}`,
            `Telefone: ${dados.get('telefone').trim()}`,
            dados.get('email').trim() ? `E-mail: ${dados.get('email').trim()}` : '',
            `Cidade: ${dados.get('cidade').trim()}`,
            `Ambiente: ${ambiente.selectedOptions[0].textContent.trim()}`,
            `Serviço: ${servico.selectedOptions[0].textContent.trim()}`,
            '',
            `Necessidade: ${dados.get('mensagem').trim()}`
        ].filter((linha) => linha !== '').join('\n');

        window.location.assign(`https://wa.me/5511916194867?text=${encodeURIComponent(mensagem)}`);

    });

}


// ================================
// MENU SUAVE
// ================================

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", function (e) {

        const destino = document.querySelector(this.getAttribute("href"));

        if (!destino) return;

        e.preventDefault();

        destino.scrollIntoView({

            behavior: "smooth"

        });

    });

});


// ================================
// PULSO NO WHATSAPP
// ================================

const whatsapp = document.querySelector(".whatsapp-flutuante");

if (whatsapp) {

    setInterval(() => {

        whatsapp.classList.toggle("pulse");

    }, 1800);

}
