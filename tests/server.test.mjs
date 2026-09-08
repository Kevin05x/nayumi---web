import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../scripts/serve.mjs';

test('El servidor solo expone archivos públicos y rechaza escritura', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetch(origin);
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-type'), /text\/html/);
    assert.equal(page.headers.get('x-content-type-options'), 'nosniff');
    for (const route of [
      '/src/layout.html',
      '/package.json',
      '/.git/config',
      '/%2e%2e%5cpackage.json',
      '/assets/../../README.md',
    ]) {
      assert.equal((await fetch(origin + route)).status, 404, route);
    }
    assert.equal((await fetch(origin, { method: 'POST', body: 'test' })).status, 405);
    assert.equal(await (await fetch(origin, { method: 'HEAD' })).text(), '');
    assert.match(
      (await fetch(origin + '/scripts/main.js')).headers.get('content-type'),
      /javascript/,
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
