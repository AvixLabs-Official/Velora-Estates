/**
 * VELORA ESTATES - Property Cards & Detail Modal Renderer
 */

function renderPropertyGrid(properties) {
  const container = document.getElementById('properties-grid');
  const emptyState = document.getElementById('properties-empty-state');

  if (!container) return;

  if (!properties || properties.length === 0) {
    container.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  container.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';

  const favorites = getFavorites();

  container.innerHTML = properties.map((prop, idx) => {
    const isFav = favorites.includes(prop.id);
    const isAsymmetricLarge = idx === 0 || idx === 5; // Asymmetric editorial layout

    return `
      <article class="property-card ${isAsymmetricLarge ? 'card-large' : ''}" data-id="${prop.id}">
        <div class="card-image-box">
          <img src="${prop.image}" alt="${prop.name} - ${prop.location}" class="card-img" loading="lazy">
          <span class="card-badge badge-${prop.status.toLowerCase().replace(' ', '-')}">${prop.status}</span>
          <button class="favorite-btn ${isFav ? 'active' : ''}" data-id="${prop.id}" aria-label="Save Property">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'var(--color-accent)' : 'none'}" stroke="${isFav ? 'var(--color-accent)' : '#FFF'}" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div class="card-body">
          <div class="card-meta-top">
            <span class="card-type">${prop.type}</span>
            <span class="card-location">${prop.location}</span>
          </div>
          <h3 class="card-title">${prop.name}</h3>
          <div class="card-price">${prop.price}</div>
          <div class="card-specs">
            <span><strong>${prop.bedrooms}</strong> Beds</span>
            <span class="spec-divider">•</span>
            <span><strong>${prop.bathrooms}</strong> Baths</span>
            <span class="spec-divider">•</span>
            <span><strong>${prop.area.toLocaleString('en-IN')}</strong> ${prop.areaUnit}</span>
          </div>
          <div class="card-footer">
            <button class="btn-link view-detail-btn" data-id="${prop.id}">View Residence →</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Re-bind click handlers
  bindCardInteractions();
}

function bindCardInteractions() {
  // Favorite Buttons
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const propId = btn.getAttribute('data-id');
      toggleFavorite(propId, btn);
    });
  });

  // View Detail Buttons
  document.querySelectorAll('.view-detail-btn, .card-image-box').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const card = el.closest('.property-card');
      const propId = card?.getAttribute('data-id');
      if (propId) {
        openPropertyModal(propId);
      }
    });
  });
}

function openPropertyModal(propId) {
  const prop = PROPERTIES_DATA.find(p => p.id === propId);
  if (!prop) return;

  const agent = ADVISORS_DATA.find(a => a.id === prop.agentId) || ADVISORS_DATA[0];
  const modal = document.getElementById('property-detail-modal');
  const body = document.getElementById('property-modal-content');

  if (!modal || !body) return;

  const favorites = getFavorites();
  const isFav = favorites.includes(prop.id);

  body.innerHTML = `
    <div class="detail-container">
      <!-- Gallery Header -->
      <div class="detail-gallery-section">
        <div class="detail-main-img-box">
          <img id="detail-active-img" src="${prop.gallery[0] || prop.image}" alt="${prop.name}" class="detail-main-img">
        </div>
        <div class="detail-thumbs-strip">
          ${(prop.gallery || [prop.image]).map((imgUrl, i) => `
            <button class="thumb-btn ${i === 0 ? 'active' : ''}" data-src="${imgUrl}">
              <img src="${imgUrl}" alt="Thumbnail ${i + 1}">
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Overview Info -->
      <div class="detail-info-grid">
        <div class="detail-main-info">
          <div class="detail-header-meta">
            <span class="card-badge badge-${prop.status.toLowerCase().replace(' ', '-')}">${prop.status}</span>
            <span class="detail-type-tag">${prop.type} • ${prop.city}</span>
          </div>
          <h1 class="detail-title">${prop.name}</h1>
          <p class="detail-location-sub">${prop.location}</p>
          <div class="detail-price-hero">${prop.price}</div>

          <div class="detail-quick-specs">
            <div class="quick-spec-item">
              <span class="spec-label">Bedrooms</span>
              <span class="spec-val">${prop.bedrooms}</span>
            </div>
            <div class="quick-spec-item">
              <span class="spec-label">Bathrooms</span>
              <span class="spec-val">${prop.bathrooms}</span>
            </div>
            <div class="quick-spec-item">
              <span class="spec-label">Total Area</span>
              <span class="spec-val">${prop.area.toLocaleString('en-IN')} ${prop.areaUnit}</span>
            </div>
            <div class="quick-spec-item">
              <span class="spec-label">Year Built</span>
              <span class="spec-val">${prop.yearBuilt}</span>
            </div>
            <div class="quick-spec-item">
              <span class="spec-label">Parking</span>
              <span class="spec-val">${prop.parking}</span>
            </div>
          </div>

          <div class="detail-block">
            <h3 class="detail-block-heading">About The Residence</h3>
            <p class="detail-description">${prop.description}</p>
          </div>

          <div class="detail-block">
            <h3 class="detail-block-heading">Features & Amenities</h3>
            <div class="amenities-grid">
              ${prop.amenities.map(am => `
                <div class="amenity-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${am}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Sticky Sidebar Enquiry Card -->
        <aside class="detail-sidebar">
          <div class="sidebar-agent-card">
            <div class="agent-avatar-box">
              <img src="${agent.image}" alt="${agent.name}">
            </div>
            <div class="agent-meta">
              <h4>${agent.name}</h4>
              <p>${agent.role}</p>
              <span class="agent-exp">${agent.experience}</span>
            </div>
            <form class="sidebar-enquiry-form" id="detail-modal-form">
              <input type="text" placeholder="Your Full Name" required>
              <input type="email" placeholder="Email Address" required>
              <input type="tel" placeholder="Phone Number" required>
              <textarea placeholder="I am interested in scheduling a private viewing of ${prop.name}..." rows="3"></textarea>
              <button type="submit" class="btn btn-primary btn-full">Request Private Viewing →</button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Gallery Thumbnail interactions
  const thumbs = body.querySelectorAll('.thumb-btn');
  const mainImg = body.querySelector('#detail-active-img');
  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      thumbs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const newSrc = t.getAttribute('data-src');
      if (mainImg && newSrc) mainImg.src = newSrc;
    });
  });

  // Modal Form submission
  const modalForm = body.querySelector('#detail-modal-form');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showConfirmationModal("Viewing Request Received", `Thank you! ${agent.name} will contact you shortly regarding ${prop.name}.`);
    });
  }
}

function closePropertyModal() {
  const modal = document.getElementById('property-detail-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
