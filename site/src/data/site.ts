export const site = {
  name: 'Agustín Pimentel',
  role: 'Fotógrafo Comercial',
  location: 'República Dominicana',
  tagline: 'Fotografía gastronómica y de producto que captura la esencia de tu marca y conecta con tus clientes.',
  description:
    'Agustín Pimentel — Fotógrafo comercial especializado en gastronomía, producto y joyería en República Dominicana.',
  phone: '849-452-8731',
  phoneIntl: '18494528731',
  email: 'agustinpimentelfotos@gmail.com',
  instagram: 'agustinpimentell',
  instagramUrl: 'https://www.instagram.com/agustinpimentell/',
  pdf: '/portafolio-agustin-pimentel.pdf',
  wa: (text: string) => `https://wa.me/18494528731?text=${encodeURIComponent(text)}`,
};

export const stats = [
  { value: 'Gastronomía, producto\ny joyería', label: 'Especialidades' },
  { value: 'Más de quince marcas\nen el país', label: 'Han confiado en mí' },
  { value: '★★★★★', label: 'Calificación de mis clientes', stars: true },
];

export const nav = [
  { href: '/portafolio', label: 'Portafolio' },
  { href: '/videos', label: 'Videos' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/contacto', label: 'Contacto' },
];

export const services = [
  {
    title: 'Fotografía Gastronómica',
    copy: 'Capturo la textura, el color y el apetito de cada plato. Imágenes que hacen al cliente querer comer antes de llegar al restaurante.',
    features: [
      'Restaurantes y cafeterías',
      'Menús digitales e impresos',
      'Contenido para redes sociales',
      'Plataformas de delivery',
    ],
  },
  {
    title: 'Fotografía de Producto',
    copy: 'Imágenes limpias y modernas que transmiten calidad y diferencian tu producto de la competencia. Alineadas con tu identidad de marca.',
    features: [
      'Belleza y cuidado personal',
      'Electrónica y accesorios',
      'E-commerce y catálogos',
      'Campañas publicitarias',
    ],
  },
  {
    title: 'Fotografía de Joyería',
    copy: 'Resalto el brillo, la elegancia y el detalle de cada pieza. Iluminación especializada para capturar lo que hace única a cada joya.',
    features: [
      'Anillos, collares y pulseras',
      'Relojes y accesorios',
      'Lifestyle con modelos',
      'Tiendas online y catálogos',
    ],
  },
];

export const process = [
  {
    title: 'Consulta inicial',
    copy: 'Conversamos sobre tu marca, objetivos y visión. Entiendo qué necesitas comunicar antes de tomar una sola foto.',
  },
  {
    title: 'Planificación',
    copy: 'Definimos concepto, estilo, locación y props. Todo pensado para que las fotos se vean coherentes con tu identidad.',
  },
  {
    title: 'Sesión fotográfica',
    copy: 'Trabajo contigo en comunicación constante, mostrando avances durante la sesión para asegurar el resultado deseado.',
  },
  {
    title: 'Entrega',
    copy: 'Edición profesional en alta resolución. Entrega en pocos días laborables vía galería digital privada para descarga.',
  },
];

export const testimonials = [
  {
    brand: 'Lactoval',
    quote:
      'Lo que más me sorprendió fue lo bien que entendió el producto sin que tuviéramos que explicarle mucho. Las fotos salieron exactamente como las teníamos en mente, y mejor.',
    url: 'https://www.instagram.com/p/DPTshDogRP5/',
  },
  {
    brand: 'Nair',
    quote:
      'Bellas esas fotos, tal cual lo que necesito. Agustín es un crack.',
    url: 'https://www.instagram.com/p/DPTskaqAYAF/',
  },
  {
    brand: 'Zidal Plus',
    quote:
      'Agustín logró que nuestros productos se vean exactamente como los imaginábamos. Profesional, rápido y con un ojo increíble para el detalle.',
    url: 'https://www.instagram.com/p/DOBte-ikfD5/',
  },
];

/* Opciones de los formularios: las comparten el modal de cotización y la
   página de contacto, para no tener dos listas que se desincronicen. */
export const tiposDeNegocio = [
  'Restaurante o cafetería',
  'Marca de alimentos',
  'Joyería',
  'Belleza y cuidado personal',
  'Otro',
];

export const necesidades = [
  'Fotografía gastronómica',
  'Fotografía de producto',
  'Fotografía de joyería',
  'Paquete mensual de contenido',
  'Cotización a medida',
];

/* Los dos reels publicados en Instagram: el contenido de /videos. */
export const reels = [
  {
    title: 'Proceso de edición',
    tag: 'Making of',
    permalink: 'https://www.instagram.com/reel/DMbu77DMxtk/',
  },
  {
    title: 'Cómo funciona',
    tag: 'Explicativo',
    permalink: 'https://www.instagram.com/reel/DR0IyeWEnb6/',
  },
];
