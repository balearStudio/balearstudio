/* Portfolio projects. `key` maps into translations (work.items.<key>),
   which supplies the display name, category and description per language.
   `images` is the full gallery shown in the lightbox; the first entry is
   also used as the card thumbnail (or the poster/fallback for `video`,
   when present — the card plays `video` instead if it loads). */
export const projects = [
  {
    key: 'predicasa',
    index: '01',
    year: '2025',
    url: null, // private — only reachable with credentials
    private: true,
    video: '/predicasa-video.mp4',
    images: [
      '/predicasa_main.png',
      '/predicasa2.png',
      '/predicasa3.png',
      '/predicasa4.png',
      '/predicasa5.png',
    ],
  },
  {
    key: 'melani',
    index: '02',
    year: '2026',
    url: 'https://centromelanicosta.com',
    private: false,
    images: ['/melanicosta_main.png', '/melanicosta2.png'],
  },
  {
    key: 'finai',
    index: '03',
    year: '2026',
    url: null, // kept private at the client's request
    private: true,
    images: ['/finaivicenc_main.png', '/finaivicenc2.png'],
  },
]
