/**
 * VELORA ESTATES - Main Application Orchestrator
 * Controls navigation transitions, mobile menu, favorites storage, and modal listeners
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initModalListeners();
});

// --- Favorites LocalStorage Manager ---
function getFavorites() {
  try {
    const saved = localStorage.getItem('velora_favorites');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function toggleFavorite(propId, btnEl) {
  let favs = getFavorites();
  if (favs.includes(propId)) {
    favs = favs.filter(id => id !== propId);
    if (btnEl) btnEl.classList.remove('active');
  } else {
    favs.push(propId);
    if (btnEl) btnEl.classList.add('active');
  }

  try {
    localStorage.setItem('velora_favorites', JSON.stringify(favs));
  } catch (e) {}

  // Update button SVG fill
  if (btnEl) {
    const svgPath = btnEl.querySelector('svg path');
    const isFav = favs.includes(propId);
    if (svgPath) {
      svgPath.setAttribute('fill', isFav ? 'var(--color-accent)' : 'none');
      svgPath.setAttribute('stroke', isFav ? 'var(--color-accent)' : '#FFF');
    }
  }
}

// --- Navigation Controller ---
function initNavigation() {
  const nav = document.getElementById('main-header');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// --- Mobile Drawer Menu ---
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-menu-drawer');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
  }

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobile-menu-drawer');
  if (drawer) {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// --- Global Modal Close Listeners ---
function initModalListeners() {
  // Detail Modal Close
  const detailModal = document.getElementById('property-detail-modal');
  const detailClose = document.getElementById('property-modal-close');

  if (detailClose) {
    detailClose.addEventListener('click', () => {
      closePropertyModal();
    });
  }

  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        closePropertyModal();
      }
    });
  }

  // Confirmation Modal Close
  const confModal = document.getElementById('confirmation-modal');
  if (confModal) {
    confModal.addEventListener('click', (e) => {
      if (e.target === confModal) {
        closeConfirmationModal();
      }
    });
  }

  // Keyboard Escape Key Handler
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePropertyModal();
      closeConfirmationModal();
      closeMobileMenu();
    }
  });
}
