# Criterios de validación y entrega

Lista de criterios para cada entrega. Los resultados concretos de la implementación del 8 de septiembre de 2026 están en `04-implementacion-y-pruebas.md`; esta lista se conserva como plantilla para futuras revisiones y no representa el resultado de esa ejecución. Las comprobaciones hechas al prototipo no certifican una migración futura.

## Funcionamiento

- [ ] Navegación, menú móvil y anclas funcionan sin ocultar el contenido bajo la cabecera.
- [ ] Scroll Stack permite avanzar y retroceder sin tarjetas invisibles que intercepten clics.
- [ ] Acordeón y carrusel funcionan con teclado y controles táctiles.
- [ ] Los dos formularios distinguen campos obligatorios y opcionales y muestran errores comprensibles.
- [ ] Mensajes de WhatsApp conservan tildes, saltos de línea y caracteres especiales, con el destino correcto.
- [ ] Espacios vacíos, opciones desconocidas y longitudes excesivas se validan.
- [ ] Un bloqueo de ventanas emergentes deja disponible un enlace alternativo.
- [ ] La web nunca indica que el mensaje ya fue enviado ni almacena respuestas.
- [ ] Mapa, dirección, teléfonos y enlaces han sido ratificados.

## Responsive y accesibilidad

Tamaños orientativos para la revisión: 360 y 390 px (celular), 768 y 1024 px (tablet), 1440 px (escritorio). Complementar con orientación horizontal y alturas pequeñas; no limitar la revisión a estos tamaños.

- [ ] Sin desplazamiento horizontal accidental ni textos cortados.
- [ ] Formularios legibles y utilizables con el teclado del celular abierto.
- [ ] Campos con etiquetas asociadas, foco visible y orden de tabulación coherente.
- [ ] Contraste, encabezados, textos alternativos y botones comprobados.
- [ ] Aumento de texto al 200 % sin perder acciones o información.
- [ ] Movimiento reducido sin bloquear contenido ni navegación.
- [ ] Contenido principal disponible cuando una animación o recurso externo falla.

## Calidad técnica

- [ ] Instalación reproducible desde el archivo de bloqueo.
- [ ] Comandos de comprobación y construcción terminan correctamente.
- [ ] Pruebas de lógica y validación registradas con resultados reales.
- [ ] Revisión en navegador y, cuando estén disponibles, dispositivos reales; anotar cuáles se probaron.
- [ ] Recursos públicos sin secretos, documentos privados o archivos de desarrollo.
- [ ] Imágenes y fuentes cargan, con licencias presentes y sin rutas absolutas de la computadora del desarrollador.
- [ ] Metadatos, idioma español, icono y configuración de indexación revisados para el entorno correspondiente.
- [ ] Rendimiento medido; no prometer puntuaciones sin realizar las mediciones.

## Compartir y publicar son entregas distintas

**Código:** repositorio Git para versionar y colaborar. No es la URL de la web.

**Revisión:** enlace HTTPS para que la clienta examine el diseño en sus dispositivos. Confirmar acceso; una etiqueta `noindex` no protege contenido privado. No compartir direcciones `127.0.0.1` o `localhost` como si fueran públicas.

**Lanzamiento:** dominio final y versión aprobada. Requiere comprobar la información de negocio, el aviso de privacidad y las cuentas responsables.

## Registro que se completará en cada entrega

```text
Versión / commit:
Fecha:
Cambios incluidos:
Comprobaciones ejecutadas y resultado:
Navegadores / dispositivos comprobados:
Pendientes conocidos:
Enlace de revisión (si existe):
Aprobación de la clienta (si existe):
```

No marcar una comprobación como superada por estar descrita en este documento.
