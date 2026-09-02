import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { projects, type Project } from '../data/projects';
import { site } from '../data/site';

/* Una foto ya optimizada, lista para el visor (Framer Motion no puede
   usar <Image> de Astro, así que resolvemos las URLs aquí). */
export interface FullShot {
  src: string;
  srcSet: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
}

/* Un proyecto con todas sus fotos: la primera es la portada que sale en
   el mosaico, el resto son las que se recorren dentro del modal. */
export interface ProjectGroup {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  blurb: string;
  photos: FullShot[];
}

export interface Cover {
  slug: string;
  src: ImageMetadata;
  project: Project;
}

/* Una sola imagen por proyecto para la cuadrícula. */
export function buildCovers(): Cover[] {
  return projects.map((project) => ({
    slug: project.slug,
    src: project.photos[0],
    project,
  }));
}

export async function buildGroups(): Promise<ProjectGroup[]> {
  return Promise.all(
    projects.map(async (project) => {
      const photos = await Promise.all(
        project.photos.map(async (photo) => {
          const [big, small] = await Promise.all([
            getImage({ src: photo, widths: [800, 1280, 1800], format: 'webp', quality: 78 }),
            getImage({ src: photo, width: 180, format: 'webp', quality: 62 }),
          ]);

          return {
            src: big.src,
            srcSet: big.srcSet.attribute,
            thumb: small.src,
            width: photo.width,
            height: photo.height,
            alt: `${project.title} — ${project.categoryLabel}, fotografía de ${site.name}`,
          } satisfies FullShot;
        })
      );

      return {
        slug: project.slug,
        title: project.title,
        category: project.category,
        categoryLabel: project.categoryLabel,
        blurb: project.blurb,
        photos,
      };
    })
  );
}
