# Implementación y pruebas — 8 de septiembre de 2026

## Implementación

- Diez componentes HTML compuestos al construir; el contenido no depende de JavaScript para aparecer.
- Módulos separados para contacto, navegación, servicios, valores y movimiento.
- Se conserva la arquitectura nativa del prototipo; no se instaló la propuesta histórica de React/Next.js/GSAP/Lenis.
- Recursos locales y licencias. Construcción: 29 archivos públicos, 50 referencias verificadas.
- Git dentro de `app/`, dependencias de desarrollo con versiones exactas y archivo de bloqueo.
- Configuración de Sites privada. Este informe describe la implementación; la disponibilidad del enlace debe confirmarse al terminar el despliegue.

## Correcciones

- Opciones HTML mal formadas en hogar/empresa, experiencia y disponibilidad. Las pruebas antiguas de mensajes no detectaban ese fallo de interfaz.
- Validación de todas las listas y rechazo de tipos de consulta heredados del prototipo de objetos.
- Desbordamiento horizontal de 4 px a 360 px; ajuste de etiquetas/acciones con texto ampliado.
- Menú accesible también en tablet entre 601 y 800 px.
- Sin JavaScript, todos los servicios y valores permanecen legibles, con enlaces de contacto directos.
- Scroll Stack con alternativa vertical y preferencias de movimiento conservadas.

## Comprobaciones realizadas

`npm run build` y `npm test`: correctos. Cuatro archivos de prueba superados (contacto, contenido, animación y servidor). El renderizador se ejercita en 602 posiciones de avance/retroceso.

Mensajes comprobados con tildes, saltos de línea, caracteres especiales, opcionales, límites y ambos destinos. El servidor local no expone fuente/configuración/Git ni acepta escritura.

**13 pruebas de navegador superadas** en Chromium 153 mediante Playwright 1.63.0 sobre Windows:

- Tamaños emulados: 360×800, 390×844, 768×1024, 1024×768, 1440×900 y 844×390.
- Sin desbordamiento horizontal en esos tamaños ni errores JavaScript no controlados detectados.
- Ambos formularios completos con apertura simulada y enlace alternativo.
- Validación de vacíos/espacios y limpieza del enlace al editar respuestas.
- Menú móvil, Escape y foco al navegar.
- Movimiento reducido, acordeón por teclado, tarjetas de valores y misión desplegable.
- Scroll Stack, selección y desactivación al pasar a móvil.
- Contenido y contacto sin JavaScript.
- Ampliación al doble del tamaño calculado de textos/controles sin desbordamiento horizontal.

Capturas de portada/contacto generadas a 390, 768 y 1440 px en `test-results/`. Revisadas visualmente la portada escritorio/tablet y el contacto móvil. Informes y capturas no se publican ni se incluyen en Git.

## Límites y pendientes

- Emulación no equivale a dispositivos físicos, Safari/iOS o Firefox.
- Google Maps bloqueado durante pruebas: pin y carga real no certificados.
- WhatsApp simulado: no se enviaron mensajes. La persona envía desde WhatsApp.
- No se realizó auditoría completa WCAG, contraste sobre imágenes, lector de pantalla ni rendimiento/Core Web Vitals. El ensayo de texto ampliado no sustituye esa auditoría.
- Faltan ratificar información comercial, privacidad y aprobación final.
- Una publicación privada para el propietario no es aún una entrega accesible a la clienta. Confirmar su acceso sin hacer pública la revisión por defecto.
