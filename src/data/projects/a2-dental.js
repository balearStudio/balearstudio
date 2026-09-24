import { asset } from '../asset'

/* Placeholder — media is in place (P2); copy is still TODO until P3.
   Works.jsx skips projects with TODO copy until then. */
export default {
  slug: 'a2-dental',
  order: 3,
  featured: true,
  year: '2026',
  status: 'preview', // set to 'live' and fill `url` when the site launches
  url: null,
  sector: 'web',
  services: [], // TODO (P3)
  stack: [], // TODO (P3)
  media: {
    cover: asset('/projects/a2-dental/cover.webp'),
    video: asset('/projects/a2-dental/video.mp4'),
    poster: asset('/projects/a2-dental/poster.webp'),
    gallery: [
      asset('/projects/a2-dental/cover.webp'),
      asset('/projects/a2-dental/gallery-01.webp'),
      asset('/projects/a2-dental/gallery-02.webp'),
      asset('/projects/a2-dental/gallery-03.webp'),
    ],
  },
  copy: {
    es: { name: 'A2 Dental', category: 'TODO', summary: 'TODO', description: 'TODO' },
    ca: { name: 'A2 Dental', category: 'TODO', summary: 'TODO', description: 'TODO' },
    en: { name: 'A2 Dental', category: 'TODO', summary: 'TODO', description: 'TODO' },
  },
}
