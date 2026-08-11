/**
 * VELORA ESTATES - Main Application Orchestrator
 * Controls navigation transitions, mobile menu, bottom dock, mobile filter sheet, and modal listeners
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initModalListeners();
  initMobileFilterSheet();
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

// --- Mobile Slide-Up Filter Sheet Drawer ---
function initMobileFilterSheet() {
  const triggerBtn = document.getElementById('dock-filter-trigger');
  const backdrop = document.getElementById('mobile-filter-backdrop');
  const sheet = document.getElementById('mobile-filter-sheet');
  const closeBtn = document.getElementById('mobile-filter-close');
  const applyBtn = document.getElementById('sheet-apply-btn');
  const resetBtn = document.getElementById('sheet-reset-btn');

  const sheetLoc = document.getElementById('sheet-filter-location');
  const sheetType = document.getElementById('sheet-filter-type');
  const sheetBeds = document.getElementById('sheet-filter-bedrooms');
  const sheetPrice = document.getElementById('sheet-filter-max-price');
  const sheetPriceVal = document.getElementById('sheet-price-val');

  if (!triggerBtn || !sheet) return;

  function openSheet() {
    // Sync current values from main filter controls
    const mainLoc = document.getElementById('filter-location')?.value || 'all';
    const mainType = document.getElementById('filter-type')?.value || 'all';
    const mainBeds = document.getElementById('filter-bedrooms')?.value || 'any';
    const mainPrice = document.getElementById('filter-max-price')?.value || '15';

    if (sheetLoc) sheetLoc.value = mainLoc;
    if (sheetType) sheetType.value = mainType;
    if (sheetBeds) sheetBeds.value = mainBeds;
    if (sheetPrice) {
      sheetPrice.value = mainPrice;
      const pVal = parseFloat(mainPrice);
      if (sheetPriceVal) {
        sheetPriceVal.textContent = pVal >= 15 ? '$15M+' : `Up to $${pVal.toFixed(1)}M`;
      }
    }

    backdrop?.classList.add('active');
    sheet.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSheet() {
    backdrop?.classList.remove('active');
    sheet.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggerBtn.addEventListener('click', openSheet);
  closeBtn?.addEventListener('click', closeSheet);
  backdrop?.addEventListener('click', closeSheet);

  if (sheetPrice && sheetPriceVal) {
    sheetPrice.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      sheetPriceVal.textContent = val >= 15 ? '$15M+' : `Up to $${val.toFixed(1)}M`;
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      // Push values to main filter bar
      const mainLoc = document.getElementById('filter-location');
      const mainType = document.getElementById('filter-type');
      const mainBeds = document.getElementById('filter-bedrooms');
      const mainPrice = document.getElementById('filter-max-price');
      const mainPriceDisp = document.getElementById('price-value-display');

      if (mainLoc && sheetLoc) mainLoc.value = sheetLoc.value;
      if (mainType && sheetType) mainType.value = sheetType.value;
      if (mainBeds && sheetBeds) mainBeds.value = sheetBeds.value;
      if (mainPrice && sheetPrice) {
        mainPrice.value = sheetPrice.value;
        const val = parseFloat(sheetPrice.value);
        if (mainPriceDisp) mainPriceDisp.textContent = val >= 15 ? '$15M+' : `Up to $${val.toFixed(1)}M`;
      }

      if (typeof applyFilters === 'function') {
        applyFilters();
      }

      closeSheet();

      const propertiesSec = document.getElementById('properties');
      if (propertiesSec) {
        propertiesSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (sheetLoc) sheetLoc.value = 'all';
      if (sheetType) sheetType.value = 'all';
      if (sheetBeds) sheetBeds.value = 'any';
      if (sheetPrice) sheetPrice.value = '15';
      if (sheetPriceVal) sheetPriceVal.textContent = '$15M+';

      if (typeof resetFilters === 'function') {
        resetFilters();
      }

      closeSheet();
    });
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
