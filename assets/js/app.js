(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.site-menu');

  const closeMenu = () => {
    if (!navToggle || !menu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  };

  if (navToggle && menu) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  }

  document.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
    const trigger = dropdown.querySelector('.dropdown-toggle');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') !== 'true';
      trigger.setAttribute('aria-expanded', String(open));
      dropdown.classList.toggle('is-open', open);
    });
  });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('.nav-dropdown.is-open').forEach((dropdown) => {
      if (dropdown.contains(event.target)) return;
      dropdown.classList.remove('is-open');
      dropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  });

  let previousFocus = null;
  const closeDialog = (dialog) => {
    dialog.hidden = true;
    document.body.classList.remove('modal-open');
    previousFocus?.focus();
  };
  document.querySelectorAll('[data-modal-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.modalOpen);
      if (!dialog) return;
      previousFocus = button;
      dialog.hidden = false;
      document.body.classList.add('modal-open');
      dialog.querySelector('.dialog-close')?.focus();
    });
  });
  document.querySelectorAll('.dialog').forEach((dialog) => {
    dialog.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', () => closeDialog(dialog)));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const dialog = document.querySelector('.dialog:not([hidden])');
    if (dialog) closeDialog(dialog);
    document.querySelectorAll('.nav-dropdown.is-open').forEach((dropdown) => {
      dropdown.classList.remove('is-open');
      dropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
    closeMenu();
  });

  document.querySelectorAll('img:not([loading])').forEach((image) => {
    if (!image.closest('.site-header') && !image.closest('.carousel-item.active')) image.loading = 'lazy';
    image.decoding = 'async';
  });

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const rel = new Set((link.rel || '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    link.rel = [...rel].join(' ');
  });

  document.querySelectorAll('.fa-file-pdf-o').forEach((icon) => {
    const link = icon.closest('a');
    if (!link) return;
    link.setAttribute('aria-label', 'Скачать PDF');
    if (!link.title) link.title = 'Скачать PDF';
  });

  document.querySelectorAll('.carousel').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('.carousel-item')];
    if (slides.length < 2) return;
    const show = (nextIndex) => {
      const current = Math.max(0, slides.findIndex((slide) => slide.classList.contains('active')));
      slides[current].classList.remove('active');
      slides[(nextIndex + slides.length) % slides.length].classList.add('active');
    };
    carousel.querySelectorAll('[data-slide]').forEach((control) => {
      control.addEventListener('click', (event) => {
        event.preventDefault();
        const current = Math.max(0, slides.findIndex((slide) => slide.classList.contains('active')));
        show(current + (control.dataset.slide === 'prev' ? -1 : 1));
      });
    });
  });
})();
