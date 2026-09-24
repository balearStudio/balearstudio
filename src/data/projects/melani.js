import { asset } from '../asset'

export default {
  slug: 'melani',
  order: 6,
  featured: false,
  year: '2026',
  status: 'live',
  url: 'https://centromelanicosta.com',
  sector: 'web',
  services: [], // TODO (P3)
  stack: [], // TODO (P3)
  media: {
    cover: asset('/melanicosta_main.png'),
    video: null,
    poster: null,
    gallery: [asset('/melanicosta_main.png'), asset('/melanicosta2.png')],
  },
  copy: {
    es: {
      name: 'Centro Melani Costa',
      category: 'Web profesional',
      summary: 'Web clara y orientada a la conversión para un centro deportivo.',
      description:
        'Sitio web para el centro de Melani Costa, medallista olímpica, centrado en claridad y conversión.',
    },
    ca: {
      name: 'Centre Melani Costa',
      category: 'Web professional',
      summary: 'Web clara i orientada a la conversió per a un centre esportiu.',
      description:
        'Lloc web per al centre de la Melani Costa, medallista olímpica, centrat en claredat i conversió.',
    },
    en: {
      name: 'Centro Melani Costa',
      category: 'Professional website',
      summary: 'A clear, conversion-focused website for a sports centre.',
      description:
        'Website for the centre of Melani Costa, Olympic medallist, focused on clarity and conversion.',
    },
  },
}
