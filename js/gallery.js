/**
 * VELORA ESTATES - Standalone Lightbox & Keyboard Navigation Engine
 */

let lightboxImages = [];
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
});

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
  if (nextBtn) nextBtn.addEventListener('click', showNextImage);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });
}

function openLightbox(imagesArray, startIndex = 0) {
  lightboxImages = imagesArray || [];
  currentImageIndex = startIndex;

  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-active-img');

  if (modal && img && lightboxImages.length > 0) {
    img.src = lightboxImages[currentImageIndex];
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function showPrevImage() {
  if (lightboxImages.length === 0) return;
  currentImageIndex = (currentImageIndex - 1 + lightboxImages.length) % lightboxImages.length;
  const img = document.getElementById('lightbox-active-img');
  if (img) img.src = lightboxImages[currentImageIndex];
}

function showNextImage() {
  if (lightboxImages.length === 0) return;
  currentImageIndex = (currentImageIndex + 1) % lightboxImages.length;
  const img = document.getElementById('lightbox-active-img');
  if (img) img.src = lightboxImages[currentImageIndex];
}
