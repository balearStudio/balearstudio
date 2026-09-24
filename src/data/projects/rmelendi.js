import { asset } from '../asset'

export default {
  slug: 'rmelendi',
  order: 4,
  featured: false,
  year: '2026',
  status: 'preview', // set to 'live' and fill `url` when the site launches
  url: null,
  sector: 'web',
  services: ['design', 'development'],
  stack: ['Astro'],
  media: {
    cover: asset('/projects/rmelendi/cover.webp'),
    video: asset('/projects/rmelendi/video.mp4'),
    poster: asset('/projects/rmelendi/poster.webp'),
    gallery: [
      asset('/projects/rmelendi/cover.webp'),
      asset('/projects/rmelendi/gallery-01.webp'),
      asset('/projects/rmelendi/gallery-02.webp'),
      asset('/projects/rmelendi/gallery-03.webp'),
    ],
  },
  copy: {
    es: {
      name:
        'RMelendi',
      category:
        'Web para creador de contenido',
      summary:
        'Web de colaboraciones con marcas para un creador de fútbol.',
      description:
        'Web de colaboraciones para un creador de contenido de fútbol con más de 435.000 seguidores. Cada sección imita la plataforma donde vive el contenido (TikTok, YouTube e Instagram) y cierra con los formatos para trabajar juntos.',
    },
    ca: {
      name:
        'RMelendi',
      category:
        'Web per a creador de contingut',
      summary:
        'Web de col·laboracions amb marques per a un creador de futbol.',
      description:
        'Web de col·laboracions per a un creador de contingut de futbol amb més de 435.000 seguidors. Cada secció imita la plataforma on viu el contingut (TikTok, YouTube i Instagram) i tanca amb els formats per treballar junts.',
    },
    en: {
      name:
        'RMelendi',
      category:
        'Content creator website',
      summary:
        'A brand-collaboration website for a football content creator.',
      description:
        'A collaboration website for a football content creator with over 435,000 followers. Each section mimics the platform where the content lives (TikTok, YouTube and Instagram) and ends with the ways to work together.',
    },
  },
}
