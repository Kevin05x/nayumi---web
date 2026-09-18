import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html = (await readFile(new URL('../dist/index.html', import.meta.url), 'utf8'))
  .replace(/\s+/g, ' ')
  .replace(/\s+>/g, '>')
  .replace(/>\s+/g, '>')
  .replace(/\s+</g, '<');
const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0];
assert.ok(hero, 'Debe existir la portada');
assert.match(hero, /<h1[^>]*><span>Agencia de empleos<\/span><em>NAYUMI<\/em><\/h1>/);
assert.match(hero, /Seleccionamos personal para hogares y empresas/);
assert.match(hero, /href="#solicitar-personal">Busco personal/);
const essential = hero.match(/<div class="hero-content wrap">([\s\S]*?)<\/div>/)?.[1];
assert.ok(essential, 'Debe conservarse el bloque principal con ambas acciones');
assert.match(essential, /href="#solicitar-personal">Busco personal/);
assert.match(essential, /href="#oportunidades">Busco trabajo/);
assert.doesNotMatch(essential, /\breveal\b|\shidden(?:\s|=|>)/);
const sections = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
assert.deepEqual(sections, [
  'inicio',
  'nosotros',
  'servicios',
  'proceso',
  'proposito',
  'oficina',
  'contacto',
]);
assert.equal((html.match(/class="[^"]*\bhome-card\b[^"]*"/g) || []).length, 4);
assert.equal((html.match(/class="whatsapp-form"/g) || []).length, 2);
assert.match(html, /Tu empresa merece el equipo ideal/);
assert.match(html, /Las buenas conexiones<em>cambian todo/);
assert.match(html, /Nuestra misión/);
assert.match(html, /Nuestra visión/);
assert.match(html, /assets\/hero.webp/);
assert.match(html, /assets\/vision.webp/);
assert.match(html, /assets\/acuerdo.webp/);
console.log(
  'Jerarquía comprobada: agencia y dos acciones en portada, presentación antes de servicios, lemas y secciones conservados. Prueba estática, no visual.',
);
