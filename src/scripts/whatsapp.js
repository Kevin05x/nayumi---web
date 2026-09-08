const services = [
  'Niñeras',
  'Cuidado de adulto mayor',
  'Cocina',
  'Limpieza',
  'Choferes',
  'Ventas',
  'Almacén y logística',
  'Atención al cliente',
  'Otro',
];
const schemas = {
  personal: {
    phone: '51950130473',
    title: 'Quisiera solicitar personal.',
    fields: [
      ['name', 'Nombre', 80, true],
      ['audience', 'Busco personal para', 30, true],
      ['service', 'Servicio', 50, true],
      ['district', 'Distrito o zona de trabajo', 80, true],
      ['schedule', 'Horario o modalidad', 80, false],
      ['details', 'Detalles de la búsqueda', 500, false],
    ],
  },
  trabajo: {
    phone: '51920385650',
    title: 'Estoy buscando una oportunidad de trabajo.',
    fields: [
      ['name', 'Nombre', 80, true],
      ['service', 'Área de interés', 50, true],
      ['district', 'Distrito donde vivo', 80, true],
      ['experience', 'Experiencia en el área', 50, true],
      ['availability', 'Disponibilidad', 50, false],
      ['details', 'Sobre mi experiencia', 500, false],
    ],
  },
};
export function buildMessage(type, values) {
  if (!Object.hasOwn(schemas, type)) throw new Error('Tipo de consulta no válido.');
  const schema = schemas[type];
  const choices = {
    service: services,
    audience: ['Mi hogar', 'Mi empresa'],
    experience: [
      'Busco mi primera oportunidad',
      'Menos de 1 año',
      'Entre 1 y 3 años',
      'Más de 3 años',
    ],
    availability: ['Inmediata', 'En una semana', 'En dos semanas', 'Por coordinar'],
  };
  const lines = ['Hola, NAYUMI.', schema.title, ''];
  for (const [key, label, limit, required] of schema.fields) {
    const text = String(values[key] ?? '')
      .replace(/\r\n?/g, '\n')
      .trim();
    if (required && !text) throw new Error('Completa el campo: ' + label + '.');
    if (text.length > limit) throw new Error('El campo ' + label + ' es demasiado largo.');
    if (text && choices[key] && !choices[key].includes(text))
      throw new Error('Selecciona una opción de la lista: ' + label + '.');
    if (text) lines.push(label + ': ' + text);
  }
  const message = lines.join('\n');
  return {
    phone: schema.phone,
    message,
    url: 'https://wa.me/' + schema.phone + '?text=' + encodeURIComponent(message),
  };
}
