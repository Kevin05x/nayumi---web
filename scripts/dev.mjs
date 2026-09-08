import { watch } from 'node:fs';
import path from 'node:path';
import { build, root } from './build.mjs';
import { listen } from './serve.mjs';

await build();
const server = listen();
let timer;
let building = false;
let pending = false;
async function rebuild() {
  if (building) {
    pending = true;
    return;
  }
  building = true;
  try {
    await build();
    console.log('Cambios listos. Recarga la vista para verlos.');
  } catch (error) {
    console.error(error.message);
  } finally {
    building = false;
    if (pending) {
      pending = false;
      await rebuild();
    }
  }
}
const watchers = ['src', 'public'].map((folder) =>
  watch(path.join(root, folder), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 120);
  }),
);
function close() {
  clearTimeout(timer);
  watchers.forEach((watcher) => watcher.close());
  server.close();
}
process.on('SIGINT', close);
process.on('SIGTERM', close);
