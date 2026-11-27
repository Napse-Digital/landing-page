(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  const year = document.querySelector('#current-year');

  if (year) year.textContent = String(new Date().getFullYear());
  if (!toggle || !menu) return;

  const setMenuOpen = (open, { restoreFocus = false } = {}) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (restoreFocus) {
      toggle.focus();
    } else if (open) {
      menu.querySelector('a')?.focus();
    }
  };

  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false, { restoreFocus: true });
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  const closeOnDesktop = window.matchMedia('(min-width: 901px)');
  closeOnDesktop.addEventListener?.('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });
})();
