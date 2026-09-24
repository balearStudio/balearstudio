import { asset } from '../asset'

export default {
  slug: 'finai',
  order: 7,
  featured: false,
  year: '2026',
  status: 'private', // kept private at the client's request
  url: null,
  sector: 'web',
  services: ['design', 'development'],
  stack: ['React', 'Vite', 'GSAP'],
  media: {
    coverSize: [1050, 1280], // [width, height] of the full-size cover, for the <img> box
    gallerySizes: [[1050, 1280], [1600, 983]], // [width, height] of each `gallery` entry
    cover: asset('/projects/finai/cover.webp'),
    video: null,
    poster: null,
    gallery: [
      asset('/projects/finai/cover.webp'),
      asset('/projects/finai/gallery-01.webp'),
    ],
  },
  copy: {
    es: {
      name: 'Web de boda',
      category: 'Web de boda',
      summary: 'Web de boda con cuenta atrás en directo e ilustraciones a mano.',
      description:
        'Web de boda con un estilo mediterráneo limpio y elegante: cuenta atrás en directo, ilustraciones hechas a mano y toda la información de la celebración en un solo lugar.',
    },
    ca: {
      name: 'Web de casament',
      category: 'Web de casament',
      summary: 'Web de casament amb compte enrere en directe i il·lustracions a mà.',
      description:
        'Web de casament amb un estil mediterrani net i elegant: compte enrere en directe, il·lustracions fetes a mà i tota la informació de la celebració en un sol lloc.',
    },
    en: {
      name: 'Wedding website',
      category: 'Wedding website',
      summary: 'A wedding site with a live countdown and hand-drawn illustrations.',
      description:
        'A wedding site with a clean, classy Mediterranean style: a live countdown, hand-drawn illustrations and every celebration detail in one place.',
    },
  },
}
