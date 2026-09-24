/* Placeholder — media arrives in P2 (public/projects/a2-dental/), copy in P3.
   Works.jsx skips projects with an empty gallery until then. */
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
  media: { cover: null, video: null, poster: null, gallery: [] },
  copy: {
    es: { name: 'A2 Dental', category: 'TODO', summary: 'TODO', description: 'TODO' },
    ca: { name: 'A2 Dental', category: 'TODO', summary: 'TODO', description: 'TODO' },
    en: { name: 'A2 Dental', category: 'TODO', summary: 'TODO', description: 'TODO' },
  },
}
