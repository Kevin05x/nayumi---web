export function initValues() {
  const valueCards = [...document.querySelectorAll('.value-card')];
  const deck = document.querySelector('.value-deck');
  let currentValue = 0;
  function selectValue(delta) {
    currentValue = (currentValue + delta + valueCards.length) % valueCards.length;
    valueCards.forEach((card, index) => {
      const offset = (index - currentValue + valueCards.length) % valueCards.length;
      card.className = 'value-card ' + ['current', 'next', 'back'][offset];
      card.inert = offset !== 0;
      card.setAttribute('aria-hidden', String(offset !== 0));
    });
    document.getElementById('value-count').textContent =
      `${String(currentValue + 1).padStart(2, '0')} / 03`;
  }
  document.getElementById('value-prev').addEventListener('click', () => selectValue(-1));
  document.getElementById('value-next').addEventListener('click', () => selectValue(1));
  let touchStart = null;
  deck.addEventListener(
    'touchstart',
    (event) => {
      touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    },
    { passive: true },
  );
  deck.addEventListener(
    'touchend',
    (event) => {
      if (!touchStart) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) selectValue(dx < 0 ? 1 : -1);
      touchStart = null;
    },
    { passive: true },
  );
  selectValue(0);
  document.documentElement.classList.add('js-values');
}
