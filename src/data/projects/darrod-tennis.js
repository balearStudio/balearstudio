import { asset } from '../asset'

/* Placeholder — media is in place (P2); copy is still TODO until P3.
   Works.jsx skips projects with TODO copy until then. */
export default {
  slug: 'darrod-tennis',
  order: 2,
  featured: true,
  year: '2026',
  status: 'preview', // set to 'live' and fill `url` when the site launches
  url: null,
  sector: 'web',
  services: [], // TODO (P3)
  stack: [], // TODO (P3)
  media: {
    cover: asset('/projects/darrod-tennis/cover.webp'),
    video: asset('/projects/darrod-tennis/video.mp4'),
    poster: asset('/projects/darrod-tennis/poster.webp'),
    gallery: [
      asset('/projects/darrod-tennis/cover.webp'),
      asset('/projects/darrod-tennis/gallery-01.webp'),
      asset('/projects/darrod-tennis/gallery-02.webp'),
      asset('/projects/darrod-tennis/gallery-03.webp'),
    ],
  },
  copy: {
    es: { name: 'Darrod Tennis Academy', category: 'TODO', summary: 'TODO', description: 'TODO' },
    ca: { name: 'Darrod Tennis Academy', category: 'TODO', summary: 'TODO', description: 'TODO' },
    en: { name: 'Darrod Tennis Academy', category: 'TODO', summary: 'TODO', description: 'TODO' },
  },
}
