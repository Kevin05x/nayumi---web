import { buildMessage } from './whatsapp.js';

export function initContact() {
  document.querySelectorAll('.whatsapp-form').forEach((form) => {
    const submit = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    const fallback = form.querySelector('.whatsapp-fallback');
    const fields = [...form.querySelectorAll('input, select, textarea')];
    fields.forEach((field) =>
      field.addEventListener('input', () => {
        field.setCustomValidity('');
        status.textContent = '';
        fallback.hidden = true;
        fallback.removeAttribute('href');
      }),
    );
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      fields.forEach((field) =>
        field.setCustomValidity(
          field.required && !field.value.trim() ? 'Completa este campo.' : '',
        ),
      );
      if (!form.reportValidity()) return;
      try {
        const result = buildMessage(form.dataset.type, Object.fromEntries(new FormData(form)));
        fallback.href = result.url;
        fallback.hidden = false;
        status.textContent =
          'Tu mensaje está preparado. Si WhatsApp no se abrió, usa el enlace de abajo.';
        window.open(result.url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        status.textContent = error.message;
      }
    });
    submit.disabled = false;
  });
}
