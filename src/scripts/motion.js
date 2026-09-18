export function initMotion() {
  'use strict';
  const root = document.documentElement;
  const header = document.getElementById('header');
  const hero = document.querySelector('.hero');
  const heroArt = document.querySelector('.hero-art');
  const progress = document.querySelector('.reading-progress');
  const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 600px)');
  let userMotion = null;
  try {
    userMotion = localStorage.getItem('nayumi-motion');
  } catch {
    /* private browsing */
  }
  let reduced = userMotion === 'reduced' || (userMotion === null && systemMotion.matches);
  const stack = document.querySelector('.home-stack');
  const stackCards = [...stack.querySelectorAll('.home-card')];
  const stackControls = stack.querySelector('.stack-controls');
  const stackStops = [...stack.querySelectorAll('[data-stack-index]')];
  const stackArrows = [...stack.querySelectorAll('[data-stack-direction]')];
  const stackNames = stackCards.map((card) => card.querySelector('.service-name').textContent);
  const stackState = {
    enabled: false,
    start: 0,
    step: 1,
    height: 580,
    target: 0,
    shown: 0,
    active: -1,
    frame: 0,
    time: 0,
  };
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  // Original implementation inspired by the public Scroll Stack interaction.
  // No React Bits Pro source or licensed package is installed.
  function measureStack() {
    const enabled =
      !reduced && !systemMotion.matches && !narrow.matches && window.innerHeight >= 720;
    const wasEnabled = stackState.enabled;
    stackState.enabled = enabled;
    stack.classList.toggle('scroll-stack', enabled);
    stackControls.hidden = !enabled;
    cancelAnimationFrame(stackState.frame);
    stackState.frame = 0;
    if (!enabled) {
      stackCards.forEach((card) => {
        card.style.transform = '';
        card.style.opacity = '';
        card.style.filter = '';
        card.style.visibility = '';
        card.inert = false;
      });
      stack.style.removeProperty('--stack-height');
      stackState.active = -1;
      return;
    }
    stackState.height = Math.min(580, window.innerHeight - 250);
    stackCards.forEach((card) => {
      card.querySelector('img').loading = 'eager';
    });
    stackState.step = Math.max(520, window.innerHeight * 0.86);
    stack.style.setProperty('--stack-card-height', `${stackState.height}px`);
    stack.style.setProperty(
      '--stack-height',
      `${stackState.height + 128 + stackState.step * 3.45}px`,
    );
    stackState.start = stack.getBoundingClientRect().top + window.scrollY - 96;
    stackState.target = clamp(
      (window.scrollY - stackState.start) / stackState.step,
      0,
      stackCards.length - 1,
    );
    if (!wasEnabled) stackState.shown = stackState.target;
    paintStack(stackState.target);
    stackState.shown = stackState.target;
  }
  function paintStack(position) {
    const current = Math.floor(position);
    const phase = clamp((position - current - 0.18) / 0.72);
    const blend = phase * phase * (3 - 2 * phase);
    const active = Math.min(stackCards.length - 1, current + (blend > 0.6 ? 1 : 0));
    stackCards.forEach((card, index) => {
      let y = 0,
        scale = 1,
        rotate = 0,
        opacity = 1,
        depth = 0;
      if (index <= current) {
        depth = Math.min(3, current - index + blend);
        y = -20 * depth;
        scale = 1 - 0.052 * depth;
        rotate = -0.45 * depth;
      } else if (index === current + 1) {
        y = (stackState.height + 75) * (1 - blend);
        scale = 0.96 + 0.04 * blend;
        rotate = 1.2 * (1 - blend);
        opacity = clamp(blend * 4);
      } else {
        opacity = 0;
      }
      card.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      card.style.opacity = String(opacity);
      card.style.transform = `translate3d(0,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)}) rotate(${rotate.toFixed(3)}deg)`;
      card.style.filter = `brightness(${(1 - depth * 0.055).toFixed(3)}) blur(${(depth * 0.35).toFixed(2)}px)`;
      card.inert = index !== active;
    });
    stackStops.forEach((button, index) =>
      button.style.setProperty('--stop-progress', String(clamp(position - index + 1))),
    );
    if (stackState.active !== active) {
      stackState.active = active;
      stack.querySelector('.stack-counter').textContent =
        `${String(active + 1).padStart(2, '0')} / 04`;
      stack.querySelector('.stack-name').textContent = stackNames[active];
      stackStops.forEach((button, index) =>
        button.setAttribute('aria-pressed', String(index === active)),
      );
      stackArrows[0].disabled = active === 0;
      stackArrows[1].disabled = active === stackCards.length - 1;
    }
  }
  function tickStack(now) {
    const elapsed = stackState.time ? Math.min(50, now - stackState.time) : 16;
    stackState.time = now;
    stackState.shown += (stackState.target - stackState.shown) * (1 - Math.exp(-elapsed / 75));
    if (Math.abs(stackState.target - stackState.shown) < 0.0005)
      stackState.shown = stackState.target;
    paintStack(stackState.shown);
    stackState.frame =
      stackState.shown === stackState.target ? 0 : requestAnimationFrame(tickStack);
  }
  function updateStack() {
    if (!stackState.enabled) return;
    stackState.target = clamp(
      (window.scrollY - stackState.start) / stackState.step,
      0,
      stackCards.length - 1,
    );
    if (!stackState.frame && stackState.shown !== stackState.target) {
      stackState.time = 0;
      stackState.frame = requestAnimationFrame(tickStack);
    }
  }
  function goToStackCard(index) {
    if (!stackState.enabled) return;
    const target = clamp(index, 0, stackCards.length - 1);
    window.scrollTo({ top: stackState.start + target * stackState.step, behavior: 'smooth' });
  }
  stackStops.forEach((button, index) =>
    button.addEventListener('click', () => goToStackCard(index)),
  );
  stackArrows.forEach((button) =>
    button.addEventListener('click', () =>
      goToStackCard(stackState.active + Number(button.dataset.stackDirection)),
    ),
  );
  function applyMotion() {
    root.classList.toggle('reduced-motion', reduced);
    root.classList.toggle('js-motion', !reduced);
    measureStack();
    updateScroll();
  }
  systemMotion.addEventListener('change', () => {
    if (userMotion === null) {
      reduced = systemMotion.matches;
      applyMotion();
    }
  });

  // All content is visible if JavaScript or IntersectionObserver is unavailable.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Toggling both ways (instead of unobserving after the first reveal) lets each
          // element replay its entrance animation every time it re-enters the viewport,
          // whether the visitor is scrolling down or back up.
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      { threshold: 0.09, rootMargin: '0px 0px -20px 0px' },
    );
    document.querySelectorAll('.reveal, .process').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal, .process').forEach((el) => el.classList.add('is-visible'));
  }
  function updateScroll() {
    const y = window.scrollY;
    const total = root.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? Math.min(1, y / total) : 0})`;
    header.classList.toggle('scrolled', y > 120);
    updateStack();
    if (!reduced && !narrow.matches && y < hero.offsetHeight + 100) {
      const ratio = Math.min(1, y / hero.offsetHeight);
      heroArt.style.transform = `translate3d(0,${y * 0.22}px,0) scale(${1 + ratio * 0.09})`;
      heroArt.style.opacity = String(1 - ratio * 0.65);
    } else {
      heroArt.style.transform = '';
      heroArt.style.opacity = '';
    }
  }
  let scheduled = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
          updateScroll();
          scheduled = false;
        });
      }
    },
    { passive: true },
  );
  window.addEventListener(
    'resize',
    () => {
      measureStack();
      updateScroll();
    },
    { passive: true },
  );
  window.addEventListener('load', measureStack, { once: true });
  document.fonts?.ready.then(measureStack);
  applyMotion();
}
