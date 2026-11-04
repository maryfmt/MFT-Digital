// Menu acessível para telas pequenas e ano do rodapé.
const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute(
    'aria-label',
    isOpen ? 'Abrir menu' : 'Fechar menu'
  );

  mainNav.classList.toggle('open', !isOpen);
});

// Fecha o menu depois que a pessoa escolhe uma seção.
mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  });
});

// Atualiza automaticamente o ano no rodapé.
document.querySelector('#year').textContent = new Date().getFullYear();