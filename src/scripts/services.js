export function initServices() {
  const narrow = window.matchMedia('(max-width: 600px)');
  const panels = [...document.querySelectorAll('.business-panel')];
  const panelButtons = panels.map((p) => p.querySelector('.panel-trigger'));
  function selectPanel(index, focus = false) {
    panels.forEach((panel, i) => {
      const active = i === index;
      panel.classList.toggle('is-active', active);
      panelButtons[i].setAttribute('aria-expanded', String(active));
      panel.querySelector('.panel-detail').inert = !active;
      panel.querySelector('.panel-plus').textContent = active ? '↗' : '+';
    });
    if (focus) panelButtons[index].focus({ preventScroll: true });
  }
  panels.forEach((panel, index) => {
    panelButtons[index].addEventListener('click', () => selectPanel(index));
    panel.addEventListener('pointerenter', (event) => {
      // Do not collapse a panel while someone is navigating its links with a keyboard.
      if (
        event.pointerType === 'mouse' &&
        !narrow.matches &&
        !panels.some((p) => p !== panel && p.contains(document.activeElement))
      )
        selectPanel(index);
    });
    panelButtons[index].addEventListener('keydown', (event) => {
      let target = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
        target = (index + 1) % panels.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
        target = (index - 1 + panels.length) % panels.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = panels.length - 1;
      else return;
      event.preventDefault();
      selectPanel(target, true);
    });
  });
  if ('IntersectionObserver' in window) {
    const serviceLinks = [...document.querySelectorAll('.service-jumps a')];
    const serviceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            serviceLinks.forEach((link) =>
              link.classList.toggle('active', link.hash === '#' + entry.target.id),
            );
        });
      },
      { rootMargin: '-15% 0px -45% 0px', threshold: 0 },
    );
    ['hogar', 'empresas'].forEach((id) => serviceObserver.observe(document.getElementById(id)));
  }
  selectPanel(0);
  document.documentElement.classList.add('js-services');
}
