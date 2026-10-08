// Google Ads conversion tracking. The gtag.js base tag is loaded in layout.html;
// this module only reports the "Enviar formulario de clientes potenciales" conversion
// when a visitor starts a WhatsApp conversation. It never throws if gtag is unavailable
// (ad blockers, offline, etc.), so it cannot break the site.
const CONVERSION = 'AW-18494637451/KjgiCP_7oJEdEIuL9_JE';
const WHATSAPP_LINK = 'a[href*="wa.me/"], a[href*="api.whatsapp.com/send"]';

export function trackConversion() {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: CONVERSION,
        value: 1.0,
        currency: 'PEN',
      });
    }
  } catch {
    /* tracking must never affect the page */
  }
}

export function initAnalytics() {
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest(WHATSAPP_LINK) : null;
    // The fallback link only appears after the form already reported its conversion.
    if (link && !link.classList.contains('whatsapp-fallback')) trackConversion();
  });
}
