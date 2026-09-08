export function initNavigation() {
  const narrow = window.matchMedia('(max-width: 800px)');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const menuLinks = [...menu.querySelectorAll('a')];
  function toggleMenu(open) {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', open);
  }
  menuButton.addEventListener('click', () => toggleMenu(menu.hidden));
  menuLinks.forEach((link) =>
    link.addEventListener('click', () => {
      toggleMenu(false);
      const destination = document.querySelector(link.getAttribute('href'));
      destination?.setAttribute('tabindex', '-1');
      destination?.focus({ preventScroll: true });
    }),
  );
  document.addEventListener('keydown', (event) => {
    if (menu.hidden) return;
    if (event.key === 'Escape') {
      toggleMenu(false);
      menuButton.focus();
    }
    if (event.key === 'Tab') {
      const last = menuLinks[menuLinks.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        menuButton.focus();
      } else if (event.shiftKey && document.activeElement === menuButton) {
        event.preventDefault();
        last.focus();
      }
    }
  });
  narrow.addEventListener('change', (e) => {
    if (!e.matches) toggleMenu(false);
  });
}
