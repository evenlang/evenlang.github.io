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
    const setOpen = (open) => {
      trigger.setAttribute('aria-expanded', String(open));
      dropdown.classList.toggle('is-open', open);
    };
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
    });
    dropdown.addEventListener('mouseenter', () => {
      if (window.matchMedia('(min-width: 1181px)').matches) setOpen(true);
    });
    dropdown.addEventListener('mouseleave', () => {
      if (window.matchMedia('(min-width: 1181px)').matches) setOpen(false);
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

  const fileActions = [
    ['.fa-file-pdf-o', 'Скачать PDF'],
    ['.fa-file-audio-o', 'Скачать аудио'],
    ['.fa-file-image-o', 'Скачать оригинал']
  ];

  fileActions.forEach(([selector, label]) => {
    document.querySelectorAll(selector).forEach((icon) => {
      const link = icon.closest('a');
      if (!link || link.classList.contains('file-action')) return;
      link.classList.add('file-action');
      link.setAttribute('aria-label', label);
      link.title = label;
    });
  });

  document.querySelectorAll('.site-content table').forEach((table) => {
    const rows = [...table.querySelectorAll('tbody tr')];
    const hasDocumentDownloads = rows.some((row) => row.cells[0]?.querySelector('a[download].file-action'));
    if (!hasDocumentDownloads) return;

    const headings = [...table.querySelectorAll('thead tr th')];
    const existingDownloadIndex = headings.findIndex((heading) => heading.textContent.trim().toLowerCase() === 'скачать');
    if (existingDownloadIndex >= 0) {
      headings[existingDownloadIndex].classList.add('download-column');
      rows.forEach((row) => {
        const titleDownload = row.cells[0]?.querySelector('a[download].file-action');
        const downloadCell = row.cells[existingDownloadIndex];
        if (!downloadCell) return;
        downloadCell.classList.add('download-cell');
        if (titleDownload && downloadCell.querySelector('a[download].file-action')) titleDownload.remove();
        else if (titleDownload) downloadCell.append(titleDownload);
      });
      return;
    }

    const firstHeading = table.querySelector('thead tr th:first-child');
    if (firstHeading && !table.querySelector('thead .download-column')) {
      const heading = document.createElement('th');
      heading.className = 'download-column';
      heading.scope = 'col';
      heading.textContent = 'Скачать';
      firstHeading.after(heading);
    }

    rows.forEach((row) => {
      const titleCell = row.cells[0];
      if (!titleCell || row.querySelector('.download-cell')) return;
      const downloadCell = document.createElement('td');
      downloadCell.className = 'download-cell';
      const download = titleCell.querySelector('a[download].file-action');
      if (download) downloadCell.append(download);
      titleCell.after(downloadCell);
    });
  });

  document.querySelectorAll('table tbody td:first-child a[target="_blank"]').forEach((link) => {
    if (link.querySelector('.fa') || link.querySelector('.document-link__hint')) return;
    link.classList.add('document-link');
    const hint = document.createElement('span');
    hint.className = 'document-link__hint';
    hint.textContent = '↗';
    link.append(hint);

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
