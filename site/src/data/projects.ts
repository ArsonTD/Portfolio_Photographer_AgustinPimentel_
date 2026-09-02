import type { ImageMetadata } from 'astro';

export type Category = 'gastronomia' | 'productos';

export interface Project {
  slug: string;
  title: string;
  category: Category;
  categoryLabel: string;
  year: string;
  blurb: string;
  photos: ImageMetadata[];
}

/* Cada carpeta de fotos se importa con eager glob para que Astro las optimice */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/photos/*.{jpg,jpeg,png}',
  { eager: true }
);

const img = (name: string): ImageMetadata => {
  const key = `../assets/photos/${name}`;
  const mod = files[key];
  if (!mod) throw new Error(`Falta la imagen: ${name}`);
  return mod.default;
};

export const portrait = img('yo.jpg');
export const bts = [img('dsc_0787.jpg'), img('dsc_0804.jpg'), img('dsc_0703.jpg'), img('dsc_0808.jpg')];

export const projects: Project[] = [
  {
    slug: 'arista',
    title: 'Arista Café Bar',
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    year: '2025',
    blurb: 'Carta completa y ambientación para un café bar de autor.',
    photos: ['arista.jpg', 'arista-2.jpg', 'arista-3.jpg', 'arista-4.jpg', 'arista-5.jpg', 'arista-6.jpg'].map(img),
  },
  {
    slug: 'lactoval',
    title: 'Lactoval',
    category: 'productos',
    categoryLabel: 'Productos',
    year: '2025',
    blurb: 'Campaña de producto lácteo con dirección de arte limpia.',
    photos: ['lactoval.jpg', 'lactoval-2.jpg', 'lactoval-3.jpg', 'lactoval-4.jpg', 'lactoval-5.jpg'].map(img),
  },
  {
    slug: 'joyeria',
    title: 'Joyería',
    category: 'productos',
    categoryLabel: 'Productos',
    year: '2025',
    blurb: 'Iluminación especializada para piezas de alta joyería.',
    photos: ['joya.jpg', 'joya-2.jpg', 'joya-3.jpg', 'joya-4.jpg', 'joya-5.jpg'].map(img),
  },
  {
    slug: 'la-pinseria',
    title: 'La Pinseria',
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    year: '2025',
    blurb: 'Pinsa romana fotografiada para menú y redes sociales.',
    photos: ['pinseria.jpg', 'pinseria-2.jpg', 'pinseria-3.jpg', 'pinseria-4.jpg', 'pinseria-5.jpg'].map(img),
  },
  {
    slug: 'nair',
    title: 'Nair',
    category: 'productos',
    categoryLabel: 'Productos',
    year: '2025',
    blurb: 'Cuidado personal con enfoque editorial y textura real.',
    photos: ['nair.jpg', 'nair-2.jpg', 'nair-3.jpg', 'nair-4.jpg', 'nair-5.jpg'].map(img),
  },
  {
    slug: 'bunies',
    title: "Bunie's",
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    year: '2024',
    blurb: 'Repostería y panadería para catálogo digital.',
    photos: ['bunis.jpg', 'bunis-2.jpg', 'bunis-3.jpg'].map(img),
  },
  {
    slug: 'zidal-plus',
    title: 'Zidal Plus',
    category: 'productos',
    categoryLabel: 'Productos',
    year: '2025',
    blurb: 'Producto farmacéutico con acabado publicitario.',
    photos: ['zidal.jpg', 'zidal-2.jpg', 'zidal-3.jpg', 'zidal-4.jpg', 'zidal-5.jpg'].map(img),
  },
  {
    slug: 'onlyrols',
    title: 'Onlyrols',
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    year: '2024',
    blurb: 'Rolls artesanales con dirección cálida y apetitosa.',
    photos: ['rol.jpg', 'rol-2.jpg', 'rol-3.jpg', 'rol-4.jpg', 'rol-5.jpg'].map(img),
  },
  {
    slug: 'xtuga',
    title: 'Xtuga',
    category: 'productos',
    categoryLabel: 'Productos',
    year: '2025',
    blurb: 'Electrónica y accesorios para e-commerce.',
    photos: ['xtuga.jpg', 'xtuga-2.jpg', 'xtuga-3.jpg', 'xtuga-4.jpg'].map(img),
  },
  {
    slug: 'nila',
    title: 'Nila',
    category: 'productos',
    categoryLabel: 'Productos',
    year: '2025',
    blurb: 'Belleza y cuidado personal con paleta suave.',
    photos: ['nila.jpg', 'nila-2.jpg', 'nila-3.jpg', 'nila-4.jpg', 'nila-5.jpg'].map(img),
  },
  {
    slug: 'glorioso',
    title: 'Glorioso',
    category: 'productos',
    categoryLabel: 'Productos',
    year: '2024',
    blurb: 'Bodegón de vino con iluminación dramática.',
    photos: ['vino.jpg'].map(img),
  },
];

export const filters = [
  { id: 'todo', label: 'Todo' },
  { id: 'gastronomia', label: 'Gastronomía' },
  { id: 'productos', label: 'Productos' },
] as const;
