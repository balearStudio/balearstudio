import { asset } from '../asset'

export default {
  slug: 'panes-patagonia',
  order: 5,
  featured: false,
  year: '2026',
  status: 'preview', // set to 'live' and fill `url` when the site launches
  url: null,
  sector: 'web',
  services: ['design', 'development'],
  stack: ['React', 'Vite'],
  media: {
    coverSize: [1600, 1000], // [width, height] of the full-size cover, for the <img> box
    gallerySizes: [[1600, 1000], [1600, 1000], [1600, 1000], [1170, 2532]], // [width, height] of each `gallery` entry
    cover: asset('/projects/panes-patagonia/cover.webp'),
    video: asset('/projects/panes-patagonia/video.mp4'),
    poster: asset('/projects/panes-patagonia/poster.webp'),
    gallery: [
      asset('/projects/panes-patagonia/cover.webp'),
      asset('/projects/panes-patagonia/gallery-01.webp'),
      asset('/projects/panes-patagonia/gallery-02.webp'),
      asset('/projects/panes-patagonia/gallery-03.webp'),
    ],
  },
  copy: {
    es: {
      name:
        'Panes Patagonia',
      category:
        'Web para obrador de pan',
      summary:
        'Web de producto para un obrador artesanal que sirve a la hostelería.',
      description:
        'Web para un obrador artesanal de pan de hamburguesa que trabaja solo con hostelería en toda España: catálogo de panes con la fotografía como protagonista, motivos para elegirlo y contacto directo por WhatsApp, correo o formulario.',
    },
    ca: {
      name:
        'Panes Patagonia',
      category:
        'Web per a obrador de pa',
      summary:
        'Web de producte per a un obrador artesanal que serveix l\'hostaleria.',
      description:
        'Web per a un obrador artesanal de pa d\'hamburguesa que treballa només amb hostaleria a tot Espanya: catàleg de pans amb la fotografia com a protagonista, motius per triar-lo i contacte directe per WhatsApp, correu o formulari.',
    },
    en: {
      name:
        'Panes Patagonia',
      category:
        'Bakery website',
      summary:
        'A product website for an artisan bakery that supplies hospitality.',
      description:
        'Website for an artisan burger-bun bakery that works only with hospitality across Spain: a catalogue of breads led by photography, reasons to choose it and direct contact by WhatsApp, email or form.',
    },
  },
}
