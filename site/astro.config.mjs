import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

/* De aquí salen la URL canónica, el sitemap y las etiquetas Open Graph.
   Netlify y Vercel exponen la URL real del sitio en `URL`, así que en
   producción se toma sola. El valor por defecto es el dominio propio
   (el mismo que ya venía en las etiquetas og: del sitio anterior). */
const site =
  process.env.SITE_URL ||
  process.env.URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://agustinpimentell.com';

export default defineConfig({
  site: site.startsWith('http') ? site : `https://${site}`,
  // El puerto lo asigna el entorno (PORT); 4321 es solo el valor por defecto.
  // El build emite directorios y Cloudflare redirige a la forma con
  // barra final: se exige aquí para que dev y producción coincidan.
  trailingSlash: 'always',
  server: { port: Number(process.env.PORT) || 4321 },
  integrations: [react(), sitemap()],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  build: { inlineStylesheets: 'auto' },
});
