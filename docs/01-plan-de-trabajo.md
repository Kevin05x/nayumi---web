# Plan de trabajo — del prototipo a la web

## 1. Preparación — completada en esta entrega

- [x] Crear `app/`, separada del prototipo y de las referencias originales.
- [x] Preparar espacio para código, recursos y pruebas.
- [x] Documentar componentes, etapas y criterios de entrega.
- [x] Registrar decisiones de negocio pendientes.

La preparación inicial está completada. El 8 de septiembre de 2026 se implementaron las etapas 2 y 3; ver `04-implementacion-y-pruebas.md`. La revisión y el lanzamiento conservan los pendientes indicados abajo.

## 2. Base técnica y Git — implementada

- [x] Revisar el entorno y concretar la herramienta de construcción, manteniendo el diseño existente.
- [x] Preparar la aplicación ejecutable, configuración y dependencias con versiones registradas en el archivo de bloqueo.
- [x] Documentar los comandos reales de desarrollo, comprobación y construcción.
- [x] Inicializar Git **dentro de `app/`**, revisar los archivos incluidos y registrar el primer avance. No incluir automáticamente la carpeta completa de referencias.
- [x] Trasladar los estilos de marca, fuentes e imágenes necesarias con sus licencias.
- [x] Implementar navegación y hero como primer bloque funcional, sin reemplazar el prototipo.

**Resultado esperado:** una primera versión local que se pueda ejecutar y cuyo historial se pueda seguir. El repositorio remoto se configura después de confirmar cuenta, nombre y visibilidad; no se crea uno público por defecto.

## 3. Construcción por componentes

- [x] Servicios del hogar: tarjetas y Scroll Stack con alternativa sin movimiento.
- [x] Servicios para empresas: acordeón usable con teclado y pantalla táctil.
- [x] Nosotros, proceso, valores, misión y visión.
- [x] Oficina y mapa, conservando la fotografía real.
- [x] Dos formularios independientes: solicitar personal y buscar trabajo.
- [x] Footer, navegación entre secciones y estados de interacción.

**Resultado esperado:** toda la landing trasladada a `app`, con el aspecto del prototipo y código organizado. Revisar cada bloque antes de continuar al siguiente.

## 4. Revisión responsive y funcional

- [x] Comprobar tamaños de escritorio, tablet y celular en Chromium (seis tamaños emulados). Dispositivos físicos y otros navegadores pendientes.
- [ ] Revisar teclado, foco, lectura, contraste y movimiento reducido.
- [x] Probar validación y composición de mensajes para ambos números de WhatsApp, con apertura simulada y sin enviar mensajes.
- [x] Revisar recursos y enlaces locales, errores JavaScript, capturas de portada/contacto y construcción. Mapa real y otros navegadores pendientes.
- [ ] Resolver los pendientes de contenido necesarios para publicar.

**Resultado esperado:** lista de comprobaciones con resultados reales, incidencias corregidas y pendientes explícitos. No considerar una compilación exitosa como prueba visual.

## 5. Enlace de revisión para la clienta

- [ ] Confirmar dónde se alojará la revisión y quién debe acceder a ella.
- [x] Preparar una versión de revisión separada del lanzamiento definitivo, con noindex y configuración privada de Sites.
- [ ] Publicar esa versión con HTTPS y verificar el enlace desde fuera de la computadora de desarrollo.
- [ ] Entregar un mensaje breve con el enlace y una lista de aspectos a revisar.
- [ ] Registrar los cambios solicitados y obtener aprobación para lanzamiento.

**Resultado esperado:** la clienta abre la misma dirección en computadora, tablet o celular, sin instalar herramientas ni abrir archivos de código. `localhost` no sirve para esta entrega remota. Una URL difícil de adivinar no equivale a acceso privado.

## 6. Lanzamiento y entrega

- [ ] Confirmar dominio y alojamiento, sin asumir que `nayumi.com.pe` está disponible o contratado.
- [ ] Completar metadatos y configuración de indexación con el dominio real.
- [ ] Revisar con el responsable el aviso de privacidad y los servicios externos utilizados.
- [ ] Publicar la versión aprobada y verificar HTTPS, mapa y contacto.
- [ ] Entregar acceso al repositorio, instrucciones de mantenimiento y forma de volver a una versión anterior.

## Pendientes de negocio

Estos puntos no impiden preparar la base, pero deben resolverse antes del lanzamiento correspondiente:

- **Dirección y mapa:** el brief dice Ate; la consulta usada por el prototipo devuelve Centro Comercial Jessie, Av. Nicolás Ayllón 3080, Santa Anita. Confirmar pin y distrito con NAYUMI.
- **Logo:** validar el SVG provisional o proporcionar el vector oficial.
- **Contacto:** ratificar los números de empleadores y postulantes y cualquier horario a mostrar.
- **Contenido adicional:** no mostrar cifras ni testimonios hasta contar con información real autorizada.
- **Publicación:** confirmar titularidad de cuentas, dominio y acceso a la revisión.
- **Hero:** conservar el paralaje actual; separar cada mano exige nuevos recursos por capas y no forma parte automática de la migración.

No se ha fijado precio, plazo de entrega ni contratado ningún servicio con este plan.
