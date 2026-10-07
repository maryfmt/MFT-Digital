"use strict";

const preferenciaMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

let limparAnimacoes = () => {};

function iniciarAnimacoes() {
    // Limpa animações anteriores antes de iniciar novamente.
    limparAnimacoes();

    if (preferenciaMovimento.matches) return;

    const limpezas = [];

    /* ======================================
       ELEMENTOS APARECENDO AO ROLAR A PÁGINA
    ====================================== */

    const elementos = document.querySelectorAll("[data-revelar]");

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (!entrada.isIntersecting) return;

                    entrada.target.classList.add("visivel");
                    observador.unobserve(entrada.target);
                });
            },
            {
                threshold: 0.1
            }
        );

        elementos.forEach((elemento) => {
            elemento.classList.add("revelar");
            observador.observe(elemento);
        });

        limpezas.push(() => {
            observador.disconnect();

            elementos.forEach((elemento) => {
                elemento.classList.remove("revelar", "visivel");
            });
        });
    }

    /* ======================================
       EFEITO DE DIGITAÇÃO NO TÍTULO
    ====================================== */

    const destaque = document.querySelector(".titulo-destaque");
    const textoBase = destaque?.querySelector(".texto-base");
    const textoDigitado = destaque?.querySelector(".texto-digitado");

    if (destaque && textoBase && textoDigitado) {
        const caracteres = Array.from(textoBase.textContent.trim());

        let posicao = 0;
        let temporizador;

        function finalizarDigitacao() {
            clearTimeout(temporizador);
            destaque.classList.remove("digitando");
            textoDigitado.textContent = "";
        }

        function digitar() {
            posicao += 1;

            textoDigitado.textContent = caracteres
                .slice(0, posicao)
                .join("");

            if (posicao < caracteres.length) {
                temporizador = setTimeout(digitar, 55);
            } else {
                temporizador = setTimeout(finalizarDigitacao, 450);
            }
        }

        // O texto original mantém o espaço e a acessibilidade.
        destaque.classList.add("digitando");
        textoDigitado.textContent = "";

        temporizador = setTimeout(digitar, 300);

        limpezas.push(finalizarDigitacao);
    }

    /* ======================================
       IMAGEM FLUTUANDO SUAVEMENTE
    ====================================== */

    const imagem = document.querySelector(".img-pessoa");

    if (imagem && typeof imagem.animate === "function") {
        const animacao = imagem.animate(
            [
                { transform: "translateY(0)" },
                { transform: "translateY(-12px)" },
                { transform: "translateY(0)" }
            ],
            {
                duration: 4200,
                iterations: Infinity,
                easing: "ease-in-out"
            }
        );

        let imagemVisivel = true;
        let observadorImagem;

        function atualizarMovimento() {
            if (document.hidden || !imagemVisivel) {
                animacao.pause();
            } else {
                animacao.play();
            }
        }

        // Pausa a animação quando a imagem não estiver na tela.
        if ("IntersectionObserver" in window) {
            observadorImagem = new IntersectionObserver(
                ([entrada]) => {
                    imagemVisivel = entrada.isIntersecting;
                    atualizarMovimento();
                }
            );

            observadorImagem.observe(imagem);
        }

        // Também pausa quando outra aba estiver aberta.
        document.addEventListener(
            "visibilitychange",
            atualizarMovimento
        );

        atualizarMovimento();

        limpezas.push(() => {
            observadorImagem?.disconnect();

            document.removeEventListener(
                "visibilitychange",
                atualizarMovimento
            );

            animacao.cancel();
        });
    }

    limparAnimacoes = () => {
        limpezas.forEach((limpar) => limpar());
        limparAnimacoes = () => {};
    };
}

/* ======================================
   REPRODUZ UM VÍDEO POR VEZ
====================================== */

const videos = document.querySelectorAll(".card-video video");

videos.forEach((videoAtual) => {
    videoAtual.addEventListener("play", () => {
        videos.forEach((outroVideo) => {
            if (outroVideo !== videoAtual) {
                outroVideo.pause();
            }
        });
    });
});

/* ======================================
   INICIALIZAÇÃO
====================================== */

iniciarAnimacoes();

// Respeita mudanças na preferência de movimento do sistema.
preferenciaMovimento.addEventListener(
    "change",
    iniciarAnimacoes
);