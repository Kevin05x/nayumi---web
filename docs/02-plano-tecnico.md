# Plano técnico y de componentes

## Punto de partida

La fuente visual vigente es `../../Prototipo/`, no los primeros bocetos de los documentos históricos. El prototipo utiliza HTML, CSS y JavaScript sin dependencias de aplicación. Se reutilizarán sus recursos, contenido y comportamiento; no es necesario generar nuevamente las imágenes.

**Jerarquía actualizada por el usuario:** la primera pantalla debe identificar inequívocamente a NAYUMI como agencia de empleos, explicar selección de personal y orientación a postulantes, y ofrecer los dos caminos de contacto sin esperar animaciones. La presentación de la agencia va antes de los servicios animados. Conservar imágenes, lemas, misión, visión y efectos; reorganizar no significa eliminar ni volver a priorizar la animación sobre el mensaje al migrar a `app/`.

**Base implementada:** HTML por componentes, CSS y módulos JavaScript nativos; construcción y servidor con Node.js. Playwright y Prettier son dependencias de desarrollo con versiones exactas. Se conserva la arquitectura del prototipo existente, sin instalar la propuesta histórica de Next.js/React, Tailwind, GSAP y Lenis. No se necesita una reescritura de las animaciones para el alcance actual.

El alcance funcional actual puede mantenerse sin base de datos: contenido informativo, mapa externo y enlaces de WhatsApp. No se incluyen cuentas, panel de administración, bolsa de vacantes, recepción de CV ni envío automático de mensajes.

## Mapa de migración

| Bloque de la aplicación | Referencia existente | Responsabilidad |
| --- | --- | --- |
| Cabecera y navegación | `index.html`, `app.js` | Marca, anclas, menú móvil y foco |
| Hero | `index.html`, `styles.css`, `app.js` | Imagen, titulares, llamadas a la acción y paralaje |
| Servicios del hogar | `app.js`, `styles.css` | Scroll Stack, indicadores, controles y alternativa vertical |
| Servicios para empresas | `index.html`, `app.js` | Acordeón accesible de cuatro servicios |
| Nosotros y proceso | `index.html`, `styles.css` | Presentación y cinco pasos |
| Valores, misión y visión | `index.html`, `app.js` | Carrusel de valores y contenido desplegable |
| Oficina y mapa | `index.html`, `contact.css` | Foto, dirección, enlace e iframe de Google Maps |
| Formularios de contacto | `contact.js`, `contact.css` | Dos formularios, validación y composición de mensajes |
| Pie de página | `index.html` | Marca y enlaces de cierre |

Los componentes están en `src/components/`: header, hero, agency, services, process, values, purpose, office, contact y footer. `src/layout.html` determina el orden; `scripts/build.mjs` los compone en HTML estático. Los módulos de interacción se encuentran en `src/scripts/`, y los estilos compartidos en `src/styles/`. No hay dependencia de archivos fuera de `app/`.

## Diseño compartido

- Tipografías actuales: **Newsreader** para titulares y **DM Sans** para interfaz y cuerpo, con archivos locales y licencias conservadas.
- Colores: azul profundo `#0E2A47`, oscuro `#081623`, azul `#2D6CDF`, verde `#4C8C3A`, crema `#F7F4EE`.
- Mantener escala editorial, espacios amplios, imágenes simbólicas, logo en mayúsculas y formularios oscuros redondeados.
- Centralizar colores, tipografías, radios y espaciados en estilos compartidos.
- Mantener las dimensiones de las imágenes para evitar saltos de contenido.
- Respetar `prefers-reduced-motion` y el control de movimiento existente.
- En móvil y pantallas bajas, priorizar lectura normal frente al apilado animado. Los puntos de corte se trasladan y luego se validan, no se asumen probados.

## Contacto y datos

| Flujo | Destino actual | Datos del formulario |
| --- | --- | --- |
| Solicitar personal | `51950130473` | Nombre, hogar/empresa, servicio, distrito, horario opcional y detalles opcionales |
| Buscar trabajo | `51920385650` | Nombre, servicio, distrito, experiencia, disponibilidad opcional y detalles opcionales |

El teléfono se define por flujo, no mediante una entrada libre del visitante. Extraer la construcción del mensaje como función comprobable y mantener separados los campos y validaciones de cada formulario.

Al continuar, abrir `https://wa.me/NUMERO?text=MENSAJE_CODIFICADO`. Mostrar un enlace alternativo si la nueva ventana no se abre. La confirmación significa **mensaje preparado**, nunca **mensaje enviado**. No persistir los campos ni registrar su contenido en analítica o logs. No enviar mensajes reales durante pruebas sin autorización específica.

Google Maps y WhatsApp requieren conexión y son servicios externos. Conservar dirección y enlace de ubicación legibles aunque el mapa no cargue. El iframe requiere revisar el aviso de privacidad y la ubicación antes de publicar.

## Recursos y herramientas que no se trasladan a ciegas

- Copiar únicamente recursos utilizados de `Prototipo/assets/`, incluidas sus licencias; no subir todas las referencias o vídeos originales.
- Revisar el SVG provisional antes del lanzamiento; no presentarlo como vector oficial aprobado.
- Adaptar las pruebas actuales de contacto y Scroll Stack a la nueva organización.
- `prepare-assets.mjs` depende de una ruta local de herramientas: no usarlo como requisito portátil sin adaptarlo.
- `revision.*` y el empaquetador del prototipo son herramientas de revisión, no se incluyen automáticamente en la web final.
