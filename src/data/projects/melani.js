import { asset } from '../asset'

export default {
  slug: 'melani',
  order: 6,
  featured: false,
  year: '2026',
  status: 'live',
  url: 'https://centromelanicosta.com',
  sector: 'web',
  services: ['design', 'development', 'booking', 'multilingual'],
  stack: ['HTML', 'CSS', 'JavaScript', 'Doctoralia'],
  media: {
    coverSize: [1600, 1000], // [width, height] of the full-size cover, for the <img> box
    gallerySizes: [[1600, 1000], [1600, 1000], [1600, 1000], [1170, 2532]], // [width, height] of each `gallery` entry
    cover: asset('/projects/melani/cover.webp'),
    video: asset('/projects/melani/video.mp4'),
    poster: asset('/projects/melani/poster.webp'),
    gallery: [
      asset('/projects/melani/cover.webp'),
      asset('/projects/melani/gallery-01.webp'),
      asset('/projects/melani/gallery-02.webp'),
      asset('/projects/melani/gallery-03.webp'),
    ],
  },
  copy: {
    es: {
      name:
        'Centro Melani Costa',
      category:
        'Web para centro de fisioterapia',
      summary:
        'Web de fisioterapia, rehabilitación y entrenamiento con reserva de cita en línea.',
      description:
        'Web para el centro de fisioterapia y entrenamiento de Melani Costa, medallista olímpica: servicios, técnicas, el espacio del centro y reserva de cita en línea, en español, inglés y alemán.',
    },
    ca: {
      name:
        'Centre Melani Costa',
      category:
        'Web per a centre de fisioteràpia',
      summary:
        'Web de fisioteràpia, rehabilitació i entrenament amb reserva de cita en línia.',
      description:
        'Web per al centre de fisioteràpia i entrenament de Melani Costa, medallista olímpica: serveis, tècniques, l\'espai del centre i reserva de cita en línia, en castellà, anglès i alemany.',
    },
    en: {
      name:
        'Centro Melani Costa',
      category:
        'Physiotherapy centre website',
      summary:
        'A physiotherapy, rehabilitation and training website with online appointment booking.',
      description:
        'Website for the physiotherapy and training centre of Melani Costa, Olympic medallist: services, techniques, the centre itself and online appointment booking, in Spanish, English and German.',
    },
  },
}
