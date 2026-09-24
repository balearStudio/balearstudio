import { asset } from '../asset'

/* Placeholder — media is in place (P2); copy is still TODO until P3.
   Works.jsx skips projects with TODO copy until then. */
export default {
  slug: 'panes-patagonia',
  order: 5,
  featured: false,
  year: '2026',
  status: 'preview', // set to 'live' and fill `url` when the site launches
  url: null,
  sector: 'web',
  services: [], // TODO (P3)
  stack: [], // TODO (P3)
  media: {
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
    es: { name: 'Panes Patagonia', category: 'TODO', summary: 'TODO', description: 'TODO' },
    ca: { name: 'Panes Patagonia', category: 'TODO', summary: 'TODO', description: 'TODO' },
    en: { name: 'Panes Patagonia', category: 'TODO', summary: 'TODO', description: 'TODO' },
  },
}
