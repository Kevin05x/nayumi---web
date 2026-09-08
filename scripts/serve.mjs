import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

export function createServer() {
  return http.createServer(async (request, response) => {
    const headers = {
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': 'no-store',
    };
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { ...headers, Allow: 'GET, HEAD' }).end();
      return;
    }
    try {
      const url = new URL(request.url, 'http://localhost');
      const name = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
      if (/[\\:\0]/.test(name) || name.split('/').some((segment) => segment.startsWith('.')))
        throw new Error('Ruta inválida');
      const target = path.resolve(root, '.' + name);
      if (!target.startsWith(root + path.sep)) throw new Error('Fuera de dist');
      const actual = await realpath(target);
      const actualRoot = await realpath(root);
      if (!actual.startsWith(actualRoot + path.sep) || !(await stat(actual)).isFile())
        throw new Error('No disponible');
      const type = types[path.extname(actual)];
      if (!type) throw new Error('Tipo no público');
      const bytes = await readFile(actual);
      response.writeHead(200, { ...headers, 'Content-Type': type, 'Content-Length': bytes.length });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch {
      response
        .writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' })
        .end('No encontrado');
    }
  });
}

export function listen() {
  const port = Number(process.env.PORT || 4180);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT no válido');
  const server = createServer();
  server.listen(port, '127.0.0.1', () => console.log(`NAYUMI · Local: http://127.0.0.1:${port}`));
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) listen();
