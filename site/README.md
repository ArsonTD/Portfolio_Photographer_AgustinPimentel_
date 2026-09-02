# Agustín Pimentel — Portafolio

Sitio de portafolio para Agustín Pimentel, fotógrafo comercial (gastronomía, producto y joyería)
en República Dominicana.

Construido con **Astro 5**, con **GSAP + ScrollTrigger** para el movimiento y **Framer Motion**
(isla React) para el visor de fotos a pantalla completa.

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/` | Hero a sangre completa con portadas rotativas, cinta de marcas, selección de marcas, resumen de biografía, servicios, reseñas y CTA |
| `/portafolio` | Una portada por marca en mosaico, con filtros por categoría; al tocar una se abre el modal con toda la sesión |
| `/videos` | «El proceso detrás del arte»: los dos reels de Instagram con el making of y la edición |
| `/servicios` | Las tres especialidades en detalle + el proceso de trabajo en cuatro etapas |
| `/sobre-mi` | Biografía completa, especialidades y reseñas |
| `/contacto` | Canales directos y formulario que abre WhatsApp con el mensaje listo |
| `/privacidad` | Política de privacidad |

La navegación entre páginas usa un fundido: el velo se retira con una animación CSS, así que
la página nunca queda tapada si el JavaScript falla.

## Comandos

```bash
npm install       # instalar dependencias
npm run dev       # servidor local en http://localhost:4321
npm run build     # build estático a dist/
npm run preview   # previsualizar el build
```

El primer `build` tarda ~60 s porque Astro optimiza las 49 fotos a WebP en varios anchos
(unos 420 archivos). Los siguientes son mucho más rápidos gracias al caché en
`node_modules/.astro`.

## Estructura

```
src/
  assets/photos/       fotos originales (Astro las optimiza en el build)
  layouts/Base.astro   <head>, tema, nav, pie, velo de transición y carga del script
  pages/               una página por sección (ver tabla arriba)
  components/
    Nav.astro          barra fija con página activa + menú móvil
    Hero.astro         portada a sangre completa con cuatro fotos que rotan
    PageHeader.astro   encabezado de las páginas interiores
    Marquee.astro      cinta infinita de marcas (GSAP, reacciona al scroll)
    About.astro        retrato, biografía y contadores animados
    Gallery.astro      ⭐ mosaico masonry, una portada por marca + filtros
    Lightbox.tsx       modal de sesión con carrusel (React + Framer Motion)
    Services.astro     tres servicios en filas con hover
    Testimonials.astro reseñas enlazadas a Instagram
    Process.astro      cuatro etapas con barra de progreso al hacer scroll
    Reels.astro        los dos reels de Instagram (embed diferido)
    Contact.astro      canales + formulario que arma un mensaje de WhatsApp
    CtaBand.astro      franja de cierre reutilizable
    Footer.astro       pie + botón flotante de WhatsApp
  data/
    site.ts            textos, navegación, contacto, servicios, proceso, reseñas, reels
    projects.ts        proyectos y sus fotos
  lib/shots.ts         portadas del mosaico y grupos de fotos por proyecto para el modal
  scripts/main.ts      toda la interactividad (GSAP, filtros, tema, cursor)
  styles/
    global.css         tokens de color, tipografía y utilidades
    lightbox.css       estilos del visor
```

Varios componentes aceptan props para reutilizarse entre el inicio y su página:

- `<Gallery variant="preview" limit={9} />` — selección para el inicio (`limit` cuenta marcas, no
  fotos); `variant="full"` es el portafolio completo con filtros.
- `<About variant="teaser" />` — resumen; `variant="full" standalone` en `/sobre-mi`
  (`standalone` oculta su título interno porque el `PageHeader` ya lo presenta).
- `<Services variant="preview" />` — sin listas de detalle; `variant="full" standalone` en
  `/servicios`.
- `<Reels standalone />` — `standalone` oculta su título interno porque en `/videos` el
  `PageHeader` ya presenta la sección.

## Cómo editar el contenido

- **Textos, navegación, teléfono, correo, servicios, proceso, reseñas** → `src/data/site.ts`
- **Proyectos y fotos** → `src/data/projects.ts`
- **Fotos nuevas** → colócalas en `src/assets/photos/` y añade el nombre del archivo al
  proyecto correspondiente en `projects.ts`. Astro se encarga del resto (WebP, `srcset`,
  carga diferida).
- **Colores** → variables CSS en `src/styles/global.css` (`:root` para el tema oscuro,
  `:root[data-theme='light']` para el claro). El oro de las estrellas es `--star`, con un tono
  más profundo en el tema claro para que contraste sobre el crema.
- **Videos** → los dos reels de `/videos` salen del array `reels` en `src/data/site.ts`: basta
  con cambiar el `permalink`, el `title` y el `tag`. Si algún día hay archivos de video propios
  en lugar de reels de Instagram, sí se podrían reproducir solos; el embed de Instagram no.

## Detalles técnicos

- **Sin números a la vista**: no hay numeración ornamental (01, 02…), ni contadores, ni
  conteos de resultados. Su lugar lo ocupan filetes tipográficos. Las cifras que eran contenido
  ahora van escritas en palabras. La única excepción es el teléfono, que es un dato de contacto.
- **Hero**: cuatro portadas que se funden cada seis segundos con un zoom lento, con rótulo de la
  marca visible y barras de progreso en las que se puede hacer clic. Se detiene cuando la
  pestaña queda en segundo plano o el hero sale de pantalla.
- **Botón de WhatsApp**: late en doble golpe (lub-dub) con dos ondas desfasadas que se expanden.
  La entrada y el hover viven en el `<a>` y el latido en un `<span>` interior, para que las
  transformaciones no se pisen; al pasar el ratón el latido se pausa.
- **Cursor**: un punto que sigue al puntero al instante y un anillo que llega con retardo y
  cambia según lo que hay debajo — anillo relleno sobre enlaces, flecha sobre enlaces externos,
  y disco sólido con la acción escrita ("Ver", "Pantalla completa") sobre fotos y videos. En los
  campos de formulario vuelve el cursor nativo, que ahí sí ayuda. En táctil no aparece.
- **Galería**: mosaico de columnas CSS con **una sola portada por marca** — ningún producto se
  repite en la cuadrícula. Cada portada lleva su rótulo debajo, en versalitas (el patrón
  editorial de la referencia) y, al pasar por encima, un indicador de que detrás hay más fotos.
- **Modal de sesión**: un panel contenido sobre la página, no una toma de pantalla completa.
  El fondo detrás usa el propio color del sitio (`var(--bg)` al 78 %), así que se sigue viendo
  la página y el modal se adapta al tema claro y al oscuro — nada de negro fijo. Se abre con un
  `CustomEvent` (`ap:lightbox`) que envía el slug del proyecto, y dentro se recorren **solo las
  fotos de esa marca**, en carrusel: miniaturas abajo, flechas a los lados, teclado y arrastre.
  La miniatura activa se centra sola y se precargan la anterior y la siguiente. Con una sola
  foto (Glorioso) el carrusel y las flechas no aparecen.
- **Tema claro/oscuro**: se aplica antes del primer pintado desde `localStorage` (o la
  preferencia del sistema), así que no hay parpadeo.
- **Preloader**: saludos encadenados en nueve idiomas —`Hello`, `Bonjour`, `Ciao`, `Olá`,
  `Hallo`, `こんにちは`, `Привет`, `مرحبا`— y cierra en `Hola`, que es el idioma del sitio.
  Todos ocupan la misma celda del grid, así que al alternarlos no hay saltos, y las entradas y
  salidas van encadenadas para que nunca se vean dos superpuestos. Al final el panel sube con el
  borde inferior curvado y descubre el hero bajo un arco. La lista está en `Preloader.astro`.

  Playfair Display no cubre japonés ni árabe, así que esos dos caían a la fuente del sistema y
  desentonaban. `Base.astro` carga **Noto Serif JP** y **Noto Naskh Arabic** con el parámetro
  `text=` de Google Fonts: devuelve una fuente con solo esos glifos (unos pocos KB en vez de la
  familia entera) y el navegador la usa por descarte de la pila. Si cambias esos saludos, hay que
  actualizar el `text=` de los enlaces.

  Sale solo en el inicio y una vez por sesión (`sessionStorage`), para no repetirlo cada vez que
  se vuelve a la portada. **Para volver a verla, abre `/?intro`**: fuerza la animación aunque la
  sesión ya la haya mostrado.
- **Cada carga empieza arriba**: `history.scrollRestoration = 'manual'` en el `<head>` evita que
  el navegador devuelva al visitante a media página al recargar, y `ScrollTrigger.clearScrollMemory()`
  impide que GSAP reaplique la posición memorizada en su primer `refresh()`. Si la URL trae un
  ancla (`#galeria`) se respeta, y el scroll manual del visitante nunca se corrige.
- **Accesibilidad**: respeta `prefers-reduced-motion`, foco visible, `aria-*` en pestañas,
  menú y visor.
- **Reels de Instagram**: los dos reels publicados (`reels` en `data/site.ts`) van al final de
  `/videos`. El script de Instagram solo se descarga cuando la sección se acerca al viewport, así
  que quien no llega hasta ahí no paga ese peso. Si el script falla, dentro del `blockquote`
  queda un enlace al reel. **Instagram no permite autoreproducir sus embeds**: esos dos sí piden
  un clic, a diferencia de los clips propios. Su tarjeta también trae su propia interfaz
  (contador de «likes», botones), que no se puede restilar por ser un iframe de otro dominio.

## Despliegue

Salida estática — sirve `dist/` en cualquier hosting (Netlify, Vercel, Cloudflare Pages).

En la raíz del repo hay un `netlify.toml` ya configurado (base `site`, publish `site/dist`,
Node 22) más cabeceras de caché: un año para `/_astro/*`, que lleva hash en el nombre, y una
semana para los videos.

**Dominio.** `astro.config.mjs` toma la URL del sitio de la variable de entorno `SITE_URL`, y si
no existe usa la `URL` que Netlify y Vercel exponen automáticamente. Solo si no hay ninguna cae
en `https://agustinpimentell.com` (el mismo dominio que ya venía en las etiquetas `og:` del sitio
anterior). De ahí salen la URL canónica, el `sitemap` y el Open Graph, así que en producción se
resuelve solo. Para forzar un dominio concreto, define `SITE_URL` en el panel del hosting.

## El PDF del portafolio

`public/portafolio-agustin-pimentel.pdf` es una versión recomprimida del original: **77,7 MB →
17,9 MB (77 % menos)**, sin perder un solo píxel de resolución — solo se recomprimieron los JPEG
embebidos (calidad 60), sin redimensionar. Se verificó que las 34 páginas conservan el mismo
número de imágenes, las mismas dimensiones en píxeles y el mismo texto.

El original sin tocar sigue en la raíz del proyecto (`portafolio_agustín_pimentel.pdf`). Para
regenerarlo tras actualizar el portafolio:

```bash
python -c "import fitz; d=fitz.open('portafolio_agustín_pimentel.pdf'); d.rewrite_images(dpi_threshold=100000, dpi_target=0, quality=60); d.save('site/public/portafolio-agustin-pimentel.pdf', garbage=4, deflate=True, clean=True)"
```

Nota: no uses el redimensionado automático (`dpi_target`) de `rewrite_images`. Con imágenes
reutilizadas en dos tamaños dentro de la misma página calcula mal la resolución y deja alguna
foto borrosa.
