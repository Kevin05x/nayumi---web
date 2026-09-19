import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const components = [
  'header',
  'hero',
  'agency',
  'services',
  'process',
  'values',
  'purpose',
  'office',
  'contact',
  'footer',
];

export async function build() {
  let html = await readFile(path.join(root, 'src/layout.html'), 'utf8');
  for (const name of components) {
    const token = '{{ component:' + name + ' }}';
    if (html.split(token).length !== 2) throw new Error('Componente ausente o repetido: ' + name);
    const fragment = await readFile(path.join(root, 'src/components', name + '.html'), 'utf8');
    html = html.replace(token, () => fragment.trim());
  }
  if (/\{\{/.test(html)) throw new Error('Marcador sin resolver');
  const files = new Map([['index.html', html]]);
  for (const folder of ['styles', 'scripts']) {
    for (const entry of await readdir(path.join(root, 'src', folder), { withFileTypes: true })) {
      if (!entry.isFile() || !/^[a-z-]+\.(css|js)$/.test(entry.name))
        throw new Error('Fuente no prevista: ' + entry.name);
      const source = path.join(root, 'src', folder, entry.name);
      if (entry.name.endsWith('.js'))
        execFileSync(process.execPath, ['--check', source], { stdio: 'pipe' });
      files.set(folder + '/' + entry.name, await readFile(source, 'utf8'));
    }
  }
  const assets = await readdir(path.join(root, 'public/assets'), { withFileTypes: true });
  if (assets.filter((entry) => entry.name.endsWith('.webp')).length !== 13)
    throw new Error('Faltan imágenes aprobadas');
  for (const entry of assets) {
    if (!entry.isFile() || !/^[\w-]+\.(webp|png|svg|ttf|txt)$/.test(entry.name))
      throw new Error('Recurso no previsto: ' + entry.name);
    files.set('assets/' + entry.name, null);
  }
  // Archivos servidos en la raíz del sitio (dominio propio, SEO): CNAME, robots.txt, sitemap.xml.
  const rootFileNames = ['CNAME', 'robots.txt', 'sitemap.xml'];
  for (const name of rootFileNames) {
    files.set(name, await readFile(path.join(root, 'public/root', name), 'utf8'));
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length) throw new Error('ID duplicado');
  if ((html.match(/<h1\b/g) || []).length !== 1)
    throw new Error('Debe existir un solo título principal');
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(match[0]) || !/\bwidth=/.test(match[0]) || !/\bheight=/.test(match[0]))
      throw new Error('Imagen sin descripción o dimensiones');
  }
  let references = 0;
  for (const [name, text] of files) {
    if (text === null) continue;
    const source = text.replace(/url\((["'])data:[\s\S]*?\1\)/g, '');
    const matches = name.endsWith('.js')
      ? source.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g)
      : source.matchAll(/(?:src|href)="([^"]+)"|url\(['"]?([^)'"\s]+)['"]?\)/g);
    for (const match of matches) {
      const ref = match[1] || match[2];
      if (/^(https?:|data:|tel:)/.test(ref)) continue;
      if (ref.startsWith('#')) {
        if (!ids.includes(ref.slice(1))) throw new Error('Ancla inválida: ' + ref);
      } else {
        const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(name), ref));
        if (!files.has(resolved)) throw new Error('Recurso ausente: ' + name + ' → ' + ref);
      }
      references++;
    }
  }
  // Only the explicit public output is written; source, tests and documentation are never served.
  await mkdir(output, { recursive: true });
  for (const [name, text] of files) {
    const target = path.join(output, name);
    await mkdir(path.dirname(target), { recursive: true });
    if (text === null) await copyFile(path.join(root, 'public', name), target);
    else await writeFile(target, text);
  }
  // Fail instead of silently publishing stale or unexpected files from an earlier build.
  async function checkOutput(dir, prefix = '') {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const relative = prefix + entry.name;
      if (entry.isDirectory()) await checkOutput(path.join(dir, entry.name), relative + '/');
      else if (!entry.isFile() || !files.has(relative))
        throw new Error('Archivo inesperado en dist: ' + relative);
    }
  }
  await checkOutput(output);
  console.log(
    `NAYUMI: ${components.length} componentes, ${files.size} archivos públicos y ${references} referencias válidas.`,
  );
  return { components: components.length, files: files.size, references };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await build();
