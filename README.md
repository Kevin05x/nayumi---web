# NAYUMI — Aplicación web

Implementación de la landing de **Agencia de Empleos NAYUMI**, con la organización de contenido aprobada. Esta carpeta es independiente: no necesita el prototipo ni las referencias originales para funcionar.

## Empezar

Requiere Node.js 22 o superior y npm. Comprobado en Node.js 26.5.0 y npm 11.17.0, Windows.

```sh
npm ci
npm run dev
```

Abrir `http://127.0.0.1:4180`. El servidor reconstruye al editar `src/` o `public/`; recargar el navegador para ver los cambios. Solo atiende en esta computadora. Para otro puerto en PowerShell, definir `$env:PORT = '4181'`.

## Comprobar

```sh
npm run check
npx playwright install chromium
npm run test:e2e
npm run format:check
```

- `npm run build`: compone las secciones, verifica sintaxis/recursos y genera `dist/`.
- `npm test`: pruebas de contacto, orden, 602 estados de animación y servidor. Ejecutar después de construir.
- `npm run test:e2e`: pruebas en Chromium, con tamaños emulados. Bloquea conexiones externas y simula la apertura de WhatsApp: **no envía mensajes**.
- `npm run preview`: sirve únicamente `dist/`, sin reconstruir.
- `npm run format`: da formato a fuentes, scripts y pruebas.

Solo hay dependencias de desarrollo: Playwright y Prettier, con versiones exactas en `package-lock.json`. La web utiliza HTML, CSS y módulos JavaScript nativos, sin framework ni base de datos.

## Dónde editar

```text
app/
├── src/
│   ├── layout.html       Documento principal y orden de las secciones
│   ├── components/       Diez componentes HTML
│   ├── scripts/          Contacto, navegación, servicios, valores y movimiento
│   └── styles/           Sistema visual y formularios
├── public/assets/        Imágenes, logo provisional, fuentes y licencias
├── scripts/              Construcción y servidor
├── tests/                Lógica y navegador
├── docs/                 Plan, arquitectura y comprobaciones
├── .openai/hosting.json  Identificador de Sites y salida estática
└── dist/                 Resultado generado; no editar ni versionar
```

La portada explica el negocio y ofrece «Busco personal» y «Busco trabajo». Siguen la agencia, servicios, proceso, valores, misión/visión, oficina y contacto. Se conservan las imágenes y animaciones.

Los mensajes se construyen en `src/scripts/whatsapp.js`; `contact.js` los conecta con los formularios. Los números también aparecen en enlaces directos de los componentes: al cambiarlos, actualizar ambos lugares y las pruebas.

## Git y publicación

El repositorio se limita a `app/`. Consultar `git log --oneline` y `git status`. No incluye referencias, vídeos originales, dependencias instaladas, informes ni `dist/`.

Sites está configurado para revisión privada, no para el lanzamiento comercial. El acceso exclusivo del propietario **no da acceso a la clienta**: falta confirmar cómo compartir. El repositorio asociado a Sites no es un repositorio en la cuenta GitHub del usuario; no se creó uno allí.

Se conserva `noindex, nofollow`. No se contrató un dominio. Antes del lanzamiento deben confirmarse ubicación/distrito, logo definitivo, teléfonos/horarios, privacidad y dominio.

Los formularios no almacenan respuestas ni envían mensajes automáticamente. Mapa y WhatsApp requieren Internet. No se añadieron métricas, testimonios, políticas legales u horarios inventados. La separación individual de manos requiere nuevos recursos por capas y no se implementó.

Ver [plan](docs/01-plan-de-trabajo.md) e [informe de pruebas](docs/04-implementacion-y-pruebas.md).
