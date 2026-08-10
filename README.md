# balearSTUDIO — website

Marketing site for balearSTUDIO, a digital studio based in Mallorca.
Built with **React + Vite**, animated with **GSAP**, fully multilingual (ES / CA / EN).

## Stack

- **React 18** + **Vite 5** — fast dev server and build
- **GSAP** (+ ScrollTrigger) — hero intro + scroll-reveal animations
- **Space Grotesk** (Google Fonts, OFL — free for commercial use)
- Hand-written CSS with a monochrome design system (no UI framework)

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start dev server → http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Deployment (GitHub Pages)

The site auto-deploys to **https://balearstudio.com/** on every push
to `main`, via [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
(`npm ci && npm run build`, then publishes `dist/`).

One-time setup in the repo: **Settings → Pages → Build and deployment → Source →
GitHub Actions**. Without this the workflow runs but nothing is served.

Because it's served from the root of a custom domain:

- `base: '/'` is set in [vite.config.js](vite.config.js). If the site is ever moved
  back under a subpath (e.g. the `crisconh.github.io/balearstudio/` project page),
  update `base` to match (`'/balearstudio/'`, with both slashes).
- [public/CNAME](public/CNAME) holds the custom domain. The Pages Actions workflow
  publishes `dist/`, so the file has to ship inside the build artifact — deleting it
  can drop the custom domain on the next deploy.
- Assets in `public/` should be referenced through Vite's base rather than as bare
  `/foo.png`, so they survive a future base change. [src/data/projects.js](src/data/projects.js)
  does this with an `asset()` helper built on `import.meta.env.BASE_URL` — reuse it
  for any new images or videos.

## Design system

Pure monochrome. Defined as CSS variables in [src/styles/index.css](src/styles/index.css):

- `--color-ink` `#0a0a0a` — highlight / near-black (headings, emphasis)
- `--color-text` `#6b6b6b` — normal body text (grey)
- `--color-text-soft` `#9a9a9a` — captions / muted
- `--color-bg` / `--color-bg-alt` — white / subtle grey sections

## Internationalisation

Spanish is the default; Catalan and English are switchable from the header.

- Copy lives in [src/i18n/translations.js](src/i18n/translations.js)
- State + `t('path.to.key')` helper in [src/i18n/LanguageContext.jsx](src/i18n/LanguageContext.jsx)
- The chosen language is persisted in `localStorage` and reflected on `<html lang>`

To edit any text, change it in `translations.js` for all three languages.

## Structure

```
src/
├── main.jsx                  # entry — mounts <App> inside <LanguageProvider>
├── App.jsx                   # page composition
├── styles/index.css          # design system + global reset
├── i18n/                     # translations + language context
├── hooks/useScrollReveal.js  # reusable GSAP scroll-reveal
├── data/projects.js          # portfolio project list
└── components/
    ├── Header/               # nav + mobile menu
    ├── Logo/                 # balearSTUDIO wordmark
    ├── LanguageSwitcher/     # ES / CA / EN toggle
    ├── Hero/                 # landing + GSAP intro
    ├── Works/                # portfolio projects
    ├── Studio/               # who we are / what we do
    ├── Contact/              # email CTA (info@balearstudio.com)
    └── Footer/
```

## Portfolio projects

Managed in [src/data/projects.js](src/data/projects.js). Descriptions are
translated per language under `work.items.<key>` in `translations.js`.

- **finAI Vicenç** — https://finaivicenc.cr2host.com
- **Centro Melani Costa** — https://centromelanicosta.com
- **Predicasa** — private (housing-price prediction for Mallorca). No public
  link; add screenshots when available (see note below).

### Adding Predicasa screenshots later

Drop images in `public/` (e.g. `public/predicasa-1.png`) and render them inside
the Works item — the `predicasa` entry already carries a `private: true` flag so
you can branch on it in [src/components/Works/Works.jsx](src/components/Works/Works.jsx).
