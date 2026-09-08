# NAYUMI — Agencia de Empleos

Landing page responsive para Agencia de Empleos NAYUMI, orientada a hogares y empresas que buscan personal, y a personas que buscan oportunidades laborales en Lima.

## Enlaces

- **Revisión privada:** https://nayumi-agencia-empleos.gruasvp-eirl.chatgpt.site/
- *Aclaración:* Es una versión de revisión y pruebas internas, no el dominio comercial definitivo.

## Qué puede hacer una persona en la web

- Entender desde la portada que NAYUMI es una agencia de empleos.
- Solicitar personal para hogar o empresa.
- Buscar oportunidades laborales.
- Explorar servicios para hogar y empresas.
- Conocer proceso, valores, misión, visión y ubicación.
- Preparar un mensaje de WhatsApp con la información del formulario.

## Características

- Diseño responsive para celular, tablet y escritorio.
- Scroll Stack para servicios del hogar.
- Acordeón accesible para servicios de empresas.
- Movimiento reducido y navegación por teclado.
- Dos formularios separados de WhatsApp.
- Contenido disponible aun sin JavaScript.
- Imágenes y tipografías locales.

## Tecnologías

HTML, CSS, JavaScript modular, Node.js, Playwright y Prettier.

## Estructura breve del proyecto

- `src/`: Contiene el documento principal (`layout.html`), los componentes modulares de la interfaz, los scripts de interactividad y las hojas de estilos.
- `public/assets/`: Recursos estáticos que incluyen imágenes optimizadas, vectores de iconos, tipografías y el logo SVG provisional.
- `scripts/`: Herramientas de soporte para la compilación estática (`build.js`) y el servidor local de desarrollo (`dev-server.js`).
- `tests/`: Batería de pruebas automatizadas que cubren la lógica de contacto, validación de estados y pruebas de extremo a extremo (E2E) con Playwright.
- `docs/`: Documentación técnica del proyecto, planes de trabajo, arquitectura y reportes de pruebas.

## Instalación y ejecución

```sh
npm ci
npm run dev
```

## Comprobaciones

```sh
npm run check
npx playwright install chromium
npm run test:e2e
npm run format:check
```

## Privacidad y límites

- Los formularios no almacenan datos.
- La persona revisa y envía el mensaje desde WhatsApp.
- Google Maps y WhatsApp requieren conexión.
- No hay testimonios, métricas, horarios ni información comercial inventada.
- El logo SVG actual es provisional hasta validar el vector oficial.
- El pin exacto de la oficina debe confirmarse antes del lanzamiento.

## Estado

- Repositorio privado.
- Dominio comercial pendiente de adquirir y configurar.
- Antes de publicar: confirmar dominio, ubicación, logo, privacidad y contenido final.
