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
    slug: 'yao',
    title: 'Yao',
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    year: '2025',
    blurb: 'Cocina asiática con luz de contraste y detalle de textura.',
    photos: ['yao.jpg', 'yao-2.jpg', 'yao-3.jpg'].map(img),
  },
  {
    slug: 'flor-de-cafe',
    title: 'Flor de Café',
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    year: '2025',
    blurb: 'Cafetería de autor: platos, repostería y ambientación de sala.',
    photos: ['flor-de-cafe-12.jpg', 'flor-de-cafe.jpg', 'flor-de-cafe-2.jpg', 'flor-de-cafe-3.jpg', 'flor-de-cafe-4.jpg', 'flor-de-cafe-5.jpg', 'flor-de-cafe-6.jpg', 'flor-de-cafe-7.jpg', 'flor-de-cafe-8.jpg', 'flor-de-cafe-9.jpg', 'flor-de-cafe-10.jpg', 'flor-de-cafe-11.jpg', 'flor-de-cafe-13.jpg', 'flor-de-cafe-14.jpg', 'flor-de-cafe-15.jpg', 'flor-de-cafe-16.jpg', 'flor-de-cafe-17.jpg'].map(img),
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
    slug: 'dolce-italia',
    title: 'Dolce Italia',
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    year: '2025',
    blurb: 'Pizza napolitana con luz dirigida sobre fondos profundos.',
    photos: ['dolce-italia-3.jpg', 'dolce-italia.jpg', 'dolce-italia-2.jpg', 'dolce-italia-4.jpg'].map(img),
  },
  {
    slug: 'bonno',
    title: 'Bonno',
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    year: '2025',
    blurb: 'Cheesecakes y repostería de vitrina para carta y redes.',
    photos: ['bonno-5.jpg', 'bonno.jpg', 'bonno-2.jpg', 'bonno-3.jpg', 'bonno-4.jpg', 'bonno-6.jpg', 'bonno-7.jpg'].map(img),
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
    slug: 'planeta-sushi',
    title: 'Planeta Sushi',
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    year: '2025',
    blurb: 'Rolls y entradas de barra para carta y contenido digital.',
    photos: ['planeta-sushi-9.jpg', 'planeta-sushi.jpg', 'planeta-sushi-2.jpg', 'planeta-sushi-3.jpg', 'planeta-sushi-4.jpg', 'planeta-sushi-5.jpg', 'planeta-sushi-6.jpg', 'planeta-sushi-7.jpg', 'planeta-sushi-8.jpg', 'planeta-sushi-10.jpg', 'planeta-sushi-11.jpg', 'planeta-sushi-12.jpg', 'planeta-sushi-13.jpg', 'planeta-sushi-14.jpg', 'planeta-sushi-15.jpg', 'planeta-sushi-16.jpg', 'planeta-sushi-17.jpg', 'planeta-sushi-18.jpg', 'planeta-sushi-19.jpg', 'planeta-sushi-20.jpg', 'planeta-sushi-21.jpg', 'planeta-sushi-22.jpg', 'planeta-sushi-23.jpg'].map(img),
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
    slug: 'cielito',
    title: 'Cielito RD',
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    year: '2025',
    blurb: 'Comida criolla de servicio rápido con dirección apetitosa.',
    photos: ['cielito-9.jpg', 'cielito.jpg', 'cielito-2.jpg', 'cielito-3.jpg', 'cielito-4.jpg', 'cielito-5.jpg', 'cielito-6.jpg', 'cielito-7.jpg', 'cielito-8.jpg', 'cielito-10.jpg', 'cielito-11.jpg'].map(img),
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
    slug: 'xtuga',
    title: 'Xtuga',
    category: 'productos',
    categoryLabel: 'Productos',
    year: '2025',
    blurb: 'Electrónica y accesorios para e-commerce.',
    photos: ['xtuga.jpg', 'xtuga-2.jpg', 'xtuga-3.jpg', 'xtuga-4.jpg'].map(img),
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
    slug: 'carles',
    title: 'Carles',
    category: 'productos',
    categoryLabel: 'Productos',
    year: '2025',
    blurb: 'Snacks empacados fotografiados en escenarios de exterior.',
    photos: ['carles.jpg', 'carles-2.jpg', 'carles-3.jpg', 'carles-4.jpg', 'carles-5.jpg', 'carles-6.jpg', 'carles-7.jpg'].map(img),
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
    slug: 'santanna',
    title: "Sant'Anna",
    category: 'productos',
    categoryLabel: 'Productos',
    year: '2025',
    blurb: 'Agua embotellada en contexto de vida activa y exterior.',
    photos: ['santanna.jpg', 'santanna-2.jpg', 'santanna-3.jpg', 'santanna-4.jpg'].map(img),
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
];

export const filters = [
  { id: 'todo', label: 'Todo' },
  { id: 'gastronomia', label: 'Gastronomía' },
  { id: 'productos', label: 'Productos' },
] as const;
