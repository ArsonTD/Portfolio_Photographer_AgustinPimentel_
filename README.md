# Agustín Pimentel — Portafolio

Sitio de portafolio para **Agustín Pimentel**, fotógrafo comercial especializado en gastronomía,
producto y joyería en República Dominicana.

Construido con **Astro 5**, con **GSAP + ScrollTrigger** para el movimiento y **Framer Motion**
(isla React) para el visor de sesiones.

## Arrancar

```bash
cd site
npm install
npm run dev
```

El sitio queda en `http://localhost:4321`. Para el build de producción, `npm run build` genera
`site/dist/`.

> El primer build tarda cerca de un minuto: Astro optimiza las 49 fotografías a WebP en varios
> anchos. Los siguientes son mucho más rápidos gracias al caché.

## Estructura

```
netlify.toml     configuración de despliegue (base: site, publish: site/dist)
site/            el proyecto Astro
  src/
    pages/       una página por sección
    components/  hero, galería, visor, servicios, reels…
    data/        todos los textos y proyectos, en un solo sitio
    assets/      las fotografías originales
  public/        logos, el portafolio en PDF y el sitemap
```

**La documentación completa está en [`site/README.md`](site/README.md)**: qué hay en cada página,
cómo editar textos y fotos, y las decisiones técnicas detrás del sitio.

## Editar el contenido

Casi todo se cambia sin tocar componentes:

- **Textos, contacto, servicios, proceso, reseñas y reels** → `site/src/data/site.ts`
- **Proyectos y sus fotografías** → `site/src/data/projects.ts`
- **Fotos nuevas** → déjalas en `site/src/assets/photos/` y nómbralas en `projects.ts`

## Despliegue

Salida estática: sirve `site/dist/` en cualquier hosting. El `netlify.toml` de la raíz ya viene
configurado (base `site`, publish `site/dist`, Node 22) con cabeceras de caché.

La URL del sitio se toma de la variable de entorno `SITE_URL`, y si no existe usa la `URL` que
Netlify y Vercel exponen solas; el valor por defecto es `https://agustinpimentell.com`. De ahí
salen la URL canónica, el sitemap y las etiquetas Open Graph.
