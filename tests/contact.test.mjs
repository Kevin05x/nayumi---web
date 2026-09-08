import assert from 'node:assert/strict';
import { buildMessage } from '../src/scripts/whatsapp.js';
const employer = {
  name: 'María & José',
  audience: 'Mi hogar',
  service: 'Niñeras',
  district: 'Ate, Lima',
  schedule: '8:00 a 17:00',
  details: 'Cuidado y apoyo.\nConsulta: ¿lunes + viernes? #familia',
};
const applicant = {
  name: 'Lucía de prueba',
  service: 'Atención al cliente',
  district: 'Santa Anita',
  experience: 'Entre 1 y 3 años',
  availability: 'Inmediata',
  details: 'Atención en español, ventas & caja.',
};
for (const [type, values, phone] of [
  ['personal', employer, '51950130473'],
  ['trabajo', applicant, '51920385650'],
]) {
  const result = buildMessage(type, values);
  const url = new URL(result.url);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/' + phone);
  assert.equal(url.hash, '');
  assert.equal([...url.searchParams].length, 1);
  assert.equal(url.searchParams.get('text'), result.message);
  for (const value of Object.values(values)) assert.ok(result.message.includes(value));
  assert.ok(result.message.startsWith('Hola, NAYUMI.\n'));
}
const withoutOptional = buildMessage('personal', { ...employer, schedule: '', details: '   ' });
assert.ok(!withoutOptional.message.includes('Horario o modalidad:'));
assert.ok(!withoutOptional.message.includes('Detalles de la búsqueda:'));
assert.throws(() => buildMessage('personal', { ...employer, name: '   ' }), /Completa/);
assert.throws(() => buildMessage('trabajo', { ...applicant, experience: '' }), /Completa/);
assert.throws(
  () => buildMessage('trabajo', { ...applicant, details: 'x'.repeat(501) }),
  /demasiado largo/,
);
assert.throws(() => buildMessage('personal', { ...employer, service: 'Inválido' }), /Selecciona/);
assert.throws(() => buildMessage('desconocido', employer), /no válido/);
assert.throws(() => buildMessage('__proto__', employer), /no válido/);
assert.throws(
  () => buildMessage('personal', { ...employer, audience: 'Manipulado' }),
  /Selecciona/,
);
assert.throws(
  () => buildMessage('trabajo', { ...applicant, experience: 'Manipulado' }),
  /Selecciona/,
);
assert.throws(
  () => buildMessage('trabajo', { ...applicant, availability: 'Manipulado' }),
  /Selecciona/,
);
assert.ok(
  buildMessage('personal', { ...employer, details: '<script>prueba</script>' }).url.includes(
    '%3Cscript%3E',
  ),
);
console.log(
  'Contacto: ambos destinatarios, contenido completo, acentos, saltos de línea, caracteres especiales, opcionales y validaciones correctos. No se abrió ni envió ningún mensaje.',
);
