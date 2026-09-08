import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Tests never send a message or load external tracking/map resources.
  await page.route('https://**/*', (route) => route.abort());
  await page.addInitScript(() => {
    window.__preparedMessages = [];
    window.open = (url) => {
      window.__preparedMessages.push(url);
      return null;
    };
  });
});

for (const [width, height] of [
  [360, 800],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [844, 390],
]) {
  test(`Lectura y maquetación a ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Agencia de empleos');
    await expect(page.locator('#inicio .hero-actions a')).toHaveCount(2);
    await expect(page.locator('#solicitar-personal button[type=submit]')).toBeEnabled();
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll('main *')]
        .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
        .slice(-15)
        .map((el) => [el.tagName, el.className, Math.round(el.getBoundingClientRect().right)]),
    }));
    expect(layout.scroll, JSON.stringify(layout)).toBeLessThanOrEqual(layout.width + 1);
    for (const id of ['nosotros', 'servicios', 'proceso', 'proposito', 'oficina', 'contacto']) {
      await page.locator('#' + id).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        id,
      ).toBe(true);
    }
    await expect(page.locator('.whatsapp-form')).toHaveCount(2);
    expect(errors).toEqual([]);
  });
}

test('Cada camino lleva a su formulario y prepara el mensaje correcto', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Busco personal', exact: false }).click();
  await expect(page).toHaveURL(/#solicitar-personal$/);
  const personal = page.locator('form[data-type=personal]');
  await personal.locator('[name=name]').fill('Prueba María & José');
  await personal.locator('[name=audience]').selectOption({ label: 'Mi hogar' });
  await personal.locator('[name=service]').selectOption({ label: 'Niñeras' });
  await personal.locator('[name=district]').fill('Ate');
  await personal.locator('[name=details]').fill('Prueba sin envío.\nHorario + consulta #1');
  await personal.getByRole('button', { name: 'Continuar en WhatsApp' }).click();
  await expect(personal.locator('.form-status')).toContainText('preparado');
  await expect(personal.locator('.whatsapp-fallback')).toBeVisible();
  let prepared = await page.evaluate(() => window.__preparedMessages);
  expect(prepared).toHaveLength(1);
  expect(new URL(prepared[0]).pathname).toBe('/51950130473');
  expect(new URL(prepared[0]).searchParams.get('text')).toContain('Prueba María & José');
  await personal.locator('[name=details]').fill('Cambio');
  await expect(personal.locator('.whatsapp-fallback')).toBeHidden();
  await expect(personal.locator('.whatsapp-fallback')).not.toHaveAttribute('href');

  await page.locator('#inicio .hero-actions a[href="#oportunidades"]').click();
  await expect(page).toHaveURL(/#oportunidades$/);
  const trabajo = page.locator('form[data-type=trabajo]');
  await trabajo.locator('[name=name]').fill('Prueba Lucía');
  await trabajo.locator('[name=service]').selectOption({ label: 'Almacén y logística' });
  await trabajo.locator('[name=district]').fill('Santa Anita');
  await trabajo.locator('[name=experience]').selectOption({ label: 'Entre 1 y 3 años' });
  await trabajo.getByRole('button', { name: 'Continuar en WhatsApp' }).click();
  prepared = await page.evaluate(() => window.__preparedMessages);
  expect(prepared).toHaveLength(2);
  expect(new URL(prepared[1]).pathname).toBe('/51920385650');
  expect(new URL(prepared[1]).searchParams.get('text')).toContain('Almacén y logística');
  expect(
    await page.evaluate(() => Object.keys(localStorage).filter((key) => key !== 'nayumi-motion')),
  ).toEqual([]);
});

test('Validación vacía y espacios no abren WhatsApp', async ({ page }) => {
  await page.goto('/#solicitar-personal');
  const form = page.locator('form[data-type=personal]');
  await form.getByRole('button', { name: 'Continuar en WhatsApp' }).click();
  expect(await page.evaluate(() => window.__preparedMessages)).toEqual([]);
  await form.locator('[name=name]').fill('   ');
  await form.locator('[name=audience]').selectOption({ label: 'Mi empresa' });
  await form.locator('[name=service]').selectOption({ label: 'Ventas' });
  await form.locator('[name=district]').fill('Lima');
  await form.getByRole('button', { name: 'Continuar en WhatsApp' }).click();
  expect(await form.locator('[name=name]').evaluate((el) => el.validationMessage)).toBe(
    'Completa este campo.',
  );
  expect(await page.evaluate(() => window.__preparedMessages)).toEqual([]);
});

test('Menú móvil, foco y Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menuButton = page.getByRole('button', { name: 'Abrir menú' });
  await menuButton.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(menuButton).toBeFocused();
  await menuButton.click();
  await page.locator('#mobile-menu a[href="#servicios"]').click();
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(page.locator('#servicios')).toBeFocused();
});

test('Movimiento reducido y servicios por teclado', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/reduced-motion/);
  await expect(page.locator('.home-stack')).not.toHaveClass(/scroll-stack/);
  expect(
    await page.locator('.home-card').evaluateAll((cards) => cards.every((card) => !card.inert)),
  ).toBe(true);
  const trigger = page.locator('.panel-trigger').first();
  await trigger.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.panel-trigger').nth(1)).toBeFocused();
  await expect(page.locator('.panel-trigger').nth(1)).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#value-next').click();
  await expect(page.locator('#value-count')).toHaveText('02 / 03');
  await page
    .locator('#proposito details')
    .first()
    .getByText('Nuestra misión', { exact: false })
    .click();
  await expect(page.locator('#proposito details').first()).toHaveAttribute('open');
});

test('Scroll Stack: selección y alternativa al cambiar a móvil', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.home-stack')).toHaveClass(/scroll-stack/);
  await page.locator('.home-stack').scrollIntoViewIfNeeded();
  await page.locator('[data-stack-index="3"]').click();
  await expect(page.locator('.stack-counter')).toHaveText('04 / 04');
  await expect(page.locator('[data-stack-direction="1"]')).toBeDisabled();
  expect(
    await page
      .locator('.home-card')
      .evaluateAll((cards) => cards.filter((card) => !card.inert).length),
  ).toBe(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.home-stack')).not.toHaveClass(/scroll-stack/);
  expect(
    await page.locator('.home-card').evaluateAll((cards) => cards.every((card) => !card.inert)),
  ).toBe(true);
});

test('Sin JavaScript: identidad, servicios y contacto directo siguen disponibles', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route('https://**/*', (route) => route.abort());
  await page.goto('http://127.0.0.1:4180/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Agencia de empleos');
  await expect(page.locator('.direct-whatsapp')).toHaveCount(2);
  await expect(page.locator('.direct-whatsapp').first()).toBeVisible();
  await expect(page.locator('.no-js-forms')).toBeVisible();
  for (const detail of await page.locator('.panel-detail').all())
    await expect(detail).toBeVisible();
  expect(
    await page
      .locator('.panel-detail')
      .evaluateAll((elements) => elements.every((el) => !el.inert)),
  ).toBe(true);
  for (const card of await page.locator('.value-card').all()) await expect(card).toBeVisible();
  await context.close();
});

test('Capturas de revisión y aumento de texto', async ({ page }, testInfo) => {
  for (const [width, height] of [
    [390, 844],
    [768, 1024],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: testInfo.outputPath(`portada-${width}.png`) });
    await page.locator('#solicitar-personal').scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`contacto-${width}.png`) });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    for (const element of document.querySelectorAll('h1,h2,h3,p,a,label,button,summary')) {
      element.style.fontSize = parseFloat(getComputedStyle(element).fontSize) * 2 + 'px';
    }
  });
  const enlarged = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
    overflow: [...document.querySelectorAll('main *')]
      .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
      .slice(-20)
      .map((el) => [el.tagName, el.className, Math.round(el.getBoundingClientRect().right)]),
  }));
  expect(enlarged.scroll, JSON.stringify(enlarged)).toBeLessThanOrEqual(enlarged.width + 1);
  await expect(page.locator('#inicio .hero-actions')).toBeVisible();
});
