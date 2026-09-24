import { asset } from '../asset'

/* Placeholder — media is in place (P2); copy is still TODO until P3.
   Works.jsx skips projects with TODO copy until then. */
export default {
  slug: 'rmelendi',
  order: 4,
  featured: false,
  year: '2026',
  status: 'preview', // set to 'live' and fill `url` when the site launches
  url: null,
  sector: 'web',
  services: [], // TODO (P3)
  stack: [], // TODO (P3)
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
    es: { name: 'RMelendi', category: 'TODO', summary: 'TODO', description: 'TODO' },
    ca: { name: 'RMelendi', category: 'TODO', summary: 'TODO', description: 'TODO' },
    en: { name: 'RMelendi', category: 'TODO', summary: 'TODO', description: 'TODO' },
  },
}
