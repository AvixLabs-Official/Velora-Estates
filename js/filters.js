/**
 * VELORA ESTATES - Property Discovery & Filter Controller
 * Real-time filter & sort engine with zero page reloads
 */

let currentFilteredProperties = [...PROPERTIES_DATA];

document.addEventListener('DOMContentLoaded', () => {
  initFilterControls();
});

function initFilterControls() {
  const filterForm = document.getElementById('property-filter-form');
  const heroSearchBtn = document.getElementById('hero-search-btn');
  const sortSelect = document.getElementById('property-sort-select');
  const clearFilterBtn = document.getElementById('clear-filters-btn');

  // Input elements
  const locationSelect = document.getElementById('filter-location');
  const typeSelect = document.getElementById('filter-type');
  const bedroomsSelect = document.getElementById('filter-bedrooms');
  const statusSelect = document.getElementById('filter-status');
  const maxPriceInput = document.getElementById('filter-max-price');
  const priceValueDisplay = document.getElementById('price-value-display');

  if (maxPriceInput && priceValueDisplay) {
    maxPriceInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (val >= 15) {
        priceValueDisplay.textContent = "₹15 Cr+";
      } else {
        priceValueDisplay.textContent = `Up to ₹${val} Cr`;
      }
      applyFilters();
    });
  }

  // Hero Search Sync
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const heroLoc = document.getElementById('hero-filter-location')?.value;
      const heroType = document.getElementById('hero-filter-type')?.value;
      const heroPrice = document.getElementById('hero-filter-price')?.value;

      if (heroLoc && locationSelect) locationSelect.value = heroLoc;
      if (heroType && typeSelect) typeSelect.value = heroType;
      if (heroPrice && maxPriceInput) maxPriceInput.value = heroPrice;

      applyFilters();

      // Scroll smoothly to properties discovery section
      const targetSec = document.getElementById('properties');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Bind change listeners to filter inputs
  [locationSelect, typeSelect, bedroomsSelect, statusSelect].forEach(input => {
    if (input) {
      input.addEventListener('change', applyFilters);
    }
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }

  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', resetFilters);
  }

  // Initial render
  applyFilters();
}

function applyFilters() {
  const location = document.getElementById('filter-location')?.value || 'all';
  const type = document.getElementById('filter-type')?.value || 'all';
  const bedrooms = document.getElementById('filter-bedrooms')?.value || 'any';
  const status = document.getElementById('filter-status')?.value || 'all';
  const maxPrice = parseFloat(document.getElementById('filter-max-price')?.value || '15');
  const sortBy = document.getElementById('property-sort-select')?.value || 'recommended';

  currentFilteredProperties = PROPERTIES_DATA.filter(prop => {
    // Location Filter
    if (location !== 'all' && prop.city.toLowerCase() !== location.toLowerCase()) {
      return false;
    }
    // Property Type Filter
    if (type !== 'all' && prop.type.toLowerCase() !== type.toLowerCase()) {
      return false;
    }
    // Status Filter
    if (status !== 'all' && prop.status.toLowerCase().replace(' ', '-') !== status.toLowerCase()) {
      return false;
    }
    // Bedrooms Filter
    if (bedrooms !== 'any') {
      const minBeds = parseInt(bedrooms, 10);
      if (prop.bedrooms < minBeds) return false;
    }
    // Max Price Filter (in Cr)
    if (maxPrice < 15) {
      const maxPriceVal = maxPrice * 10000000;
      if (prop.priceValue > maxPriceVal) return false;
    }
    return true;
  });

  // Sorting
  sortProperties(currentFilteredProperties, sortBy);

  // Update UI & Counters
  renderPropertyGrid(currentFilteredProperties);
  updateResultCount(currentFilteredProperties.length);
}

function sortProperties(list, sortBy) {
  switch (sortBy) {
    case 'price-low':
      list.sort((a, b) => a.priceValue - b.priceValue);
      break;
    case 'price-high':
      list.sort((a, b) => b.priceValue - a.priceValue);
      break;
    case 'area-large':
      list.sort((a, b) => b.area - a.area);
      break;
    case 'newest':
      list.sort((a, b) => b.yearBuilt - a.yearBuilt);
      break;
    case 'recommended':
    default:
      // Featured/Signature first
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }
}

function resetFilters() {
  const locationSelect = document.getElementById('filter-location');
  const typeSelect = document.getElementById('filter-type');
  const bedroomsSelect = document.getElementById('filter-bedrooms');
  const statusSelect = document.getElementById('filter-status');
  const maxPriceInput = document.getElementById('filter-max-price');
  const priceValueDisplay = document.getElementById('price-value-display');
  const sortSelect = document.getElementById('property-sort-select');

  if (locationSelect) locationSelect.value = 'all';
  if (typeSelect) typeSelect.value = 'all';
  if (bedroomsSelect) bedroomsSelect.value = 'any';
  if (statusSelect) statusSelect.value = 'all';
  if (maxPriceInput) maxPriceInput.value = 15;
  if (priceValueDisplay) priceValueDisplay.textContent = '₹15 Cr+';
  if (sortSelect) sortSelect.value = 'recommended';

  applyFilters();
}

function updateResultCount(count) {
  const countEl = document.getElementById('property-count-display');
  if (countEl) {
    countEl.textContent = `${count} ${count === 1 ? 'Residence' : 'Residences'} Found`;
  }
}
