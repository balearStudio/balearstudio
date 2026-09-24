/* Placeholder — media arrives in P2 (public/projects/darrod-tennis/), copy in P3.
   Works.jsx skips projects with an empty gallery until then. */
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
  media: { cover: null, video: null, poster: null, gallery: [] },
  copy: {
    es: { name: 'Darrod Tennis Academy', category: 'TODO', summary: 'TODO', description: 'TODO' },
    ca: { name: 'Darrod Tennis Academy', category: 'TODO', summary: 'TODO', description: 'TODO' },
    en: { name: 'Darrod Tennis Academy', category: 'TODO', summary: 'TODO', description: 'TODO' },
  },
}
