/**
 * VELORA ESTATES - Seller Valuation & Enquiry Form Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initForms();
});

function initForms() {
  const sellerForm = document.getElementById('valuation-enquiry-form');
  const contactForm = document.getElementById('general-contact-form');
  const modalCloseBtn = document.getElementById('confirmation-modal-close');

  if (sellerForm) {
    sellerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = sellerForm.querySelector('[name="name"]')?.value || 'Valued Client';
      const loc = sellerForm.querySelector('[name="location"]')?.value || 'your area';

      showConfirmationModal(
        "Valuation Request Confirmed",
        `Thank you, ${name}. One of our senior property advisors will review the details for your property in ${loc} and reach out within 24 hours.`
      );

      sellerForm.reset();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]')?.value || 'Valued Client';

      showConfirmationModal(
        "Message Received",
        `Thank you, ${name}. Our private advisory team has received your message and will contact you shortly.`
      );

      contactForm.reset();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeConfirmationModal);
  }
}

function showConfirmationModal(title, text) {
  const modal = document.getElementById('confirmation-modal');
  const titleEl = document.getElementById('conf-modal-title');
  const textEl = document.getElementById('conf-modal-text');

  if (modal && titleEl && textEl) {
    titleEl.textContent = title;
    textEl.textContent = text;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    alert(`${title}\n\n${text}`);
  }
}

function closeConfirmationModal() {
  const modal = document.getElementById('confirmation-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
