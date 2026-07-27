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

        let valor = e.target.value.replace(/\D/g, "");

        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

        e.target.value = valor;

    });

}


// ================================
// FORMULÁRIO
// ================================

const formulario = document.querySelector(".contato-formulario");

if (formulario) {

    formulario.addEventListener("submit", (e) => {

        e.preventDefault();

        alert(
            "Obrigado pelo contato! Em breve nossa equipe retornará. Para atendimento imediato utilize o WhatsApp."
        );

        formulario.reset();

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