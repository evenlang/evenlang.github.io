(() => {
  const modal = document.querySelector('.gallery-modal');
  if (!modal) return;

  const modalImage = modal.querySelector('img');
  const caption = modal.querySelector('.caption');
  const closeButton = modal.querySelector('.close');
  let captions = {};
  let trigger = null;

  try {
    captions = JSON.parse(document.getElementById('gallery-data')?.dataset.captions || '{}');
  } catch (_) {
    captions = {};
  }

  const close = () => {
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    modalImage.src = '';
    trigger?.focus();
  };

  document.querySelectorAll('[data-gallery-src]').forEach((button) => {
    button.addEventListener('click', () => {
      trigger = button;
      const details = captions[button.dataset.galleryKey] || [];
      modalImage.src = button.dataset.gallerySrc;
      modalImage.alt = details[0] || button.querySelector('img')?.alt || 'Фотография экспедиции';
      caption.textContent = details.filter(Boolean).join(' · ');
      modal.hidden = false;
      modal.classList.add('is-open');
      document.body.classList.add('modal-open');
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', close);
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) close();
  });
})();
