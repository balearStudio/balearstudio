/* Files live in public/ and are served from Vite's base path, which differs
   between local dev (/) and the GitHub Pages deploy (/balearstudio/). Resolve
   every public asset through this helper so the base prefix is always applied;
   a bare "/foo.png" would 404 on the subpath deploy. */
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

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
    video: asset('/predicasa-video.mp4'),
    images: [
      asset('/predicasa_main.png'),
      asset('/predicasa2.png'),
      asset('/predicasa3.png'),
      asset('/predicasa4.png'),
      asset('/predicasa5.png'),
    ],
  },
  {
    key: 'melani',
    index: '02',
    year: '2026',
    url: 'https://centromelanicosta.com',
    private: false,
    images: [asset('/melanicosta_main.png'), asset('/melanicosta2.png')],
  },
  {
    key: 'finai',
    index: '03',
    year: '2026',
    url: null, // kept private at the client's request
    private: true,
    images: [asset('/finaivicenc_main.png'), asset('/finaivicenc2.png')],
  },
]
