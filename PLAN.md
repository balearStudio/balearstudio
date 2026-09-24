# balearstudio.com — portfolio refresh + SEO plan

Working doc. **Do one task per session**, and run `/clear` between sessions.

**To start a session:** `Read PLAN.md, then do Task <ID>.`
**To finish one:** tick the box, write anything unexpected under *Notes*, commit.
Only tick a box once that task's **Done when** check actually passes.
**Commits:** never add a `Co-Authored-By: Claude` line (or any Claude/AI attribution) to commit
messages or PR descriptions in this repo. The owner asked for this explicitly (2026-09-24).
Git author is repo-local `crisconh <christianreyesg@hotmail.com>`.

Written 2026-09-24 after reviewing the repo and the live site.

---

## Where things stand today (audit)

**Stack.** React 18 + Vite 5 SPA, GSAP, deployed to GitHub Pages at the root of
`balearstudio.com`. There is one route, and the three languages (ES/CA/EN) switch
client-side, with the choice saved in `localStorage`.

**Portfolio.** [src/data/projects.js](src/data/projects.js) holds 3 projects
(predicasa, melani, finai). Their copy is in `work.items.*` in
[src/i18n/translations.js](src/i18n/translations.js), and they render as list rows in
[src/components/Works/Works.jsx](src/components/Works/Works.jsx) with a lightbox gallery.
- Predicasa is flagged `private`, but predicasa.com is now public.
- The screenshots are unoptimised PNGs of up to 1.7 MB each (~8.6 MB in `public/`).
  The Predicasa card video uses `preload="auto"`.
- A list of rows doesn't scale well to 8 projects, and projects have no pages of their own.

**SEO gaps (ranked by impact).**
1. **Search engines only ever see the Spanish page.** The CA and EN versions have no URLs, so
   they can't be indexed, and there is no `hreflang`.
2. **The HTML is an empty SPA shell** (`<div id="root">`). All the content comes from JS. Google
   can render it, but other crawlers, link previews and AI crawlers see nothing.
3. `robots.txt` and `sitemap.xml` both return **404**.
4. There is **no structured data**: no Organization/LocalBusiness or WebSite JSON-LD.
5. There is **one indexable URL for the whole site**, so there's nothing to rank for "diseño web
   Mallorca" + sector, and projects have no case-study pages.
6. Performance costs: heavy PNGs, the autoplay video preloads, and Google Fonts are loaded as a
   render-blocking stylesheet.
7. Small issues: no `apple-touch-icon` or manifest; `aria-label`s are hard-coded in Spanish in
   Header; the footer year is hard-coded.

**Prior art to reuse.** `balear-ewf`'s `site-template` (e.g. `../sa-pamboleria`) already solves
issue 1 and issue 2. It uses a hand-rolled prerender (`react-dom/server` +
`scripts/prerender.mjs`) with `/es/` and `/en/` subpaths, per-page `<title>`, canonical,
`hreflang`, OG, sitemap and robots. **Copy that approach; don't invent a new one.**
Playwright is installed in `../balear-ewf` (`plugins/ewf/scripts/capture.mjs`).
ffmpeg is **not** installed (use the `ffmpeg-static` npm package if a task needs it).

---

## Projects in scope

Leave out for now: **Catiana Bauçà (dentist)** and **Sa Pamboleria**.

All the clients listed here have agreed to be named and shown (D2).

| Slug | Project | Capture from | Status | Link on card |
|---|---|---|---|---|
| `predicasa` | Predicasa: AI house-price prediction | https://predicasa.com (the app is behind a login; see P2) | `live` | predicasa.com |
| `darrod-tennis` | Darrod Tennis Academy | https://darrodtennis.dev.balearstudio.com/es/ | `preview` | none: "Coming soon" |
| `a2-dental` | A2 Dental, dental clinic in Portals | https://dental-a2.dev.balearstudio.com/ | `preview` | none: "Coming soon" |
| `rmelendi` | RMelendi, football content creator (brand-collab site) | https://balearstudio.github.io/rmelendi/ ¹ | `preview` | none: "Coming soon" |
| `panes-patagonia` | Panes Patagonia, artisan bakery for hospitality | http://panespatagonia.dev.balearstudio.com/ ² | `preview` | none: "Coming soon" |
| `melani` | Centro Melani Costa | https://centromelanicosta.com | `live` | yes |
| `finai` | Wedding website | (keep existing screenshots) | `private` (client asked) | no |

¹ `rmelendi.dev.balearstudio.com` resolves (wildcard DNS) but returns a 404 with no HTTPS certificate.
The repo's Pages custom domain was never set; `/ewf:preview` in balear-ewf handles that. rmelendi.com
still serves the client's old WordPress site. ² panespatagonia.com is the client's old site, not ours.

**When a preview site launches**, set its `status` to `live` and fill in its `url`. The card then
shows "Visit site" and the case-study page (S3) links out.

---

## Decisions (owner, 2026-09-24)

- [x] **D1. Unreleased sites:** screenshots **and** video, plus a "Coming soon" badge. Never link
  to `.dev` / github.io preview URLs; they are `noindex` and temporary.
- [x] **D2. Client permission:** every client in the table has agreed. The wedding site stays
  anonymous as it is today.
- [x] **D3. Predicasa demo account:** it exists. The credentials are in `.env.local` (gitignored,
  local to the owner's machine, **never committed**). **When P2 is done, tell the owner so
  they can delete the account.**
- [x] **D4. Featured order:** Predicasa, Darrod Tennis, A2 Dental.
- [ ] **D5. Google Search Console and Google Business Profile access:** still open. It only
  blocks S6.

---

## Recommended order

```
P1 ─┬─> P2 (media) ──┐
    ├─> P3 (copy) ───┼─> P4 (Works redesign) ──> S3 (case-study pages)
    │                │
S1 (quick wins, independent)     S2 (prerender + language URLs) ──> S3 ──> S4 ──> S5 ──> S6
```

P1 and S1 can go first, in parallel. **S2 must land before S3.** Project pages need real
URLs, and S2 creates the routing and prerender that they rely on.

---

## Track P — portfolio

### [x] P1. Project data model

**Goal:** make one structure the source of truth for every project, so later tasks only add data.

- Replace `src/data/projects.js` with a richer schema:
  `slug, order, featured, year, status ('live' | 'preview' | 'private'), url, sector,
  services[], stack[], media: { cover, video?, poster?, gallery[] }, copy: { es, ca, en }`.
  `copy` holds `name`, `category`, `summary` (1 line), `description` (2–3 lines), and optional
  `challenge / solution / result` for the case-study pages in S3.
- Move each project's copy out of `translations.js` and next to its data
  (`src/data/projects/<slug>.js` plus an `index.js` that sorts by `order`). The UI labels stay
  in `translations.js`.
- Media convention, which P2 relies on: `public/projects/<slug>/cover.{avif,webp}`,
  `gallery-01.{avif,webp}`, …, `video.mp4` / `video.webm`, `poster.webp`.
  Keep the `asset()` helper.
- Port the 3 existing projects and add placeholder entries for the 4 new ones
  (`status` per the table above, copy marked `TODO`). Remove `private: true` from Predicasa.
- Update `Works.jsx` just enough to render from the new shape. **No visual change** in this task.

**Done when:** `npm run build` passes, and the page looks and behaves exactly as before for the
3 existing projects, including the gallery.

### [x] P2. Capture and optimise project media

**Goal:** give every project light, consistent screenshots, plus a short video where it helps.

- Write `scripts/capture-projects.mjs`, modelled on `../balear-ewf/plugins/ewf/scripts/capture.mjs`.
  For each project with a URL, it takes a 1440×900 cover, 2–4 gallery shots (key sections plus one
  390 px mobile shot) and optionally a 6–10 s scroll video.
- Add an optimise step (`sharp` for AVIF + WebP at 1600w and 800w; `ffmpeg-static` for video:
  H.264 MP4 + WebM, no audio, ~1280w, **≤ 1.5 MB each**).
- Output goes to `public/projects/<slug>/` following P1's convention. Delete the old root PNGs
  once they're replaced.
- **Predicasa video (behind the login).** Playwright can sign in and record:
  - The credentials are already in `.env.local` (gitignored by `*.local`) as
    `PREDICASA_EMAIL` / `PREDICASA_PASSWORD`. Read them from there. **Never commit them, log
    them, or copy them into any other file.**
  - Use `browser.newContext({ recordVideo: { dir, size: { width: 1280, height: 800 } } })`,
    log in, then play a scripted journey: search an address → view the prediction → view the
    "cheap/expensive" verdict. Add `waitForTimeout` pauses so it's watchable. Trim the login out
    with ffmpeg (`-ss`).
  - It's a demo account (D3), but still check every frame for personal data before publishing.
  - Fallback if scripting is fragile: someone records the screen by hand (Win+Alt+R or OBS) and
    this task only trims and encodes the file.
- **Videos for the preview projects too (D1):** Darrod Tennis, A2 Dental, RMelendi and Panes
  Patagonia each get a short scroll video, captured from the URLs in the table above.
  Dismiss cookie banners and the like before recording.
- Wedding (`finai`) is private, so keep its existing screenshots and only re-encode them.

**Done when:** every project has a cover and a gallery under `public/projects/<slug>/`, every
project except `finai` has a video, no image is over ~250 KB (AVIF/WebP), each video is
≤ 1.5 MB, and the script can be run again.
**Then:** tell the owner that the Predicasa demo account can be deleted, and delete
`.env.local` (or blank the Predicasa lines in it).

### [x] P3. Project copy (ES / CA / EN)

**Goal:** real content for the 4 new projects and a refresh of the 3 existing ones.

- Sources: each live or preview site, `../balear-ewf/references/<slug>/notes.md`, and the client
  briefs in the client repos. Follow the voice in [company.md](company.md): outcomes over
  features, no buzzwords.
- For each project: name, category, a 1-line summary, a 2–3 line description, services,
  and stack. For the featured ones (D4), also challenge / solution / result for S3.
- Write each description with **searchable terms** in mind, without keyword stuffing,
  e.g. "web para clínica dental en Calvià", "web para academia de tenis en Mallorca".

**Done when:** no `TODO` copy is left in `src/data/projects/`, and all three languages are filled.

### [x] P4. Redesign the Works section

**Goal:** show 7+ projects clearly while keeping the monochrome, Swiss-minimal identity.

- Suggested layout: **3 featured projects as large cards** (media first, autoplay muted video on
  hover or in view, greyscale → colour, as today), then a **compact grid of the rest**.
  Optionally add a sector filter (Web / E-commerce / AI app) if it reads well.
  Show a status badge based on `status` (D1): `live` shows "Visit site"; `preview` shows a
  "Coming soon" badge and no link; `private` shows the existing lock + tooltip. The featured
  order is Predicasa, Darrod Tennis, A2 Dental (D4).
- Use `<picture>` with AVIF/WebP + `srcset`/`sizes`, explicit `width`/`height` (no layout shift),
  and `loading="lazy"` below the fold. Videos use `preload="none"` + poster and start playing
  through an IntersectionObserver. Keep `prefers-reduced-motion` support.
- Reuse the Lightbox as it is. Each card also gets a "View project" link to its case-study page,
  which S3 fills in (render it only once the route exists, or add it in S3).
- Check it on mobile at 390 px, and on a tablet.

**Done when:** all projects render in 3 languages with no console errors, a Lighthouse
mobile check of the page shows no CLS regression, and the owner signs off on the look.

---

## Track S — SEO

### [x] S1. Technical SEO quick wins (independent, can go first)

- Add `public/robots.txt` (allow all + `Sitemap: https://balearstudio.com/sitemap.xml`) and a
  static `public/sitemap.xml` with the home URL. S2 replaces it with a generated one.
- Put JSON-LD in `index.html`: `Organization` + `ProfessionalService`/`LocalBusiness`
  (name, url, logo, email `info@balearstudio.com`, `areaServed: Mallorca / Illes Balears`,
  address locality, `sameAs` for any socials), plus `WebSite`.
- Add `apple-touch-icon` (180 px PNG), `site.webmanifest` and `theme-color`.
- Fonts: self-host Space Grotesk (woff2, `font-display: swap`, preload the main weight) instead
  of the render-blocking Google Fonts stylesheet.
- Add `public/404.html` (GitHub Pages serves it).
- Fix the hard-coded Spanish `aria-label`s in Header and translate them.

**Done when:** `/robots.txt` and `/sitemap.xml` return 200 after deploy, the JSON-LD passes
Google's Rich Results Test / validator.schema.org, and Lighthouse SEO is 100.

### [x] S2. Prerender + real URLs per language

**Goal:** every language has its own crawlable, fully rendered HTML page.

- URLs: `/` (ES, default), `/ca/`, `/en/`. Recommend keeping Spanish at the root so the existing
  indexed URL doesn't change.
- Port the `site-template` approach from `../sa-pamboleria` (`scripts/prerender.mjs`, SSR entry,
  `react-dom/server`). At build time it writes one `index.html` per language, each with its own
  `<html lang>`, `<title>`, meta description, canonical, `hreflang` alternates (+ `x-default`),
  `og:locale`/`og:url`, and JSON-LD.
- The language comes from the URL, not from `localStorage`. The LanguageSwitcher becomes
  plain `<a href>` links. Keep an optional one-time redirect based on browser language, but
  **never redirect crawlers** (only do it on the client, and only when nothing has been stored yet).
- Guard SSR against `window`, `matchMedia`, GSAP and the Chat widget (render them client-only
  or use a `typeof window` check). Use `hydrateRoot` on the client.
- Generate `sitemap.xml` (with `xhtml:link` alternates) and `robots.txt` during the build,
  replacing S1's static files.
- Write per-language titles and descriptions aimed at the search terms, e.g.
  ES "Diseño web y soluciones con IA en Mallorca | balearSTUDIO".

**Done when:** `curl https://balearstudio.com/en/` returns HTML that already contains the
English hero and project copy (no JS needed), hreflang is valid in all 3 pages, there are no
hydration warnings in the console, and GitHub Pages serves `/ca/` and `/en/` correctly.

### [x] S3. Case-study pages per project (needs S2 + P1; better after P2/P3)

**Goal:** one indexable page per project, which ranks for sector searches and gives the portfolio depth.

- Routes: `/proyectos/<slug>/`, `/ca/projectes/<slug>/` and `/en/work/<slug>/`, prerendered for
  every non-private project.
- Page content: hero media, summary, sector/services/stack, challenge → solution → result,
  gallery, a link to the site (if `status: live`), a "next project" link, and a contact CTA.
- Each page gets its own title, description, OG image (the project cover), canonical, hreflang,
  `CreativeWork` JSON-LD with `creator` = balearSTUDIO, and `BreadcrumbList`.
- Cards in Works link to these pages. Add the pages to the sitemap.

**Done when:** every public project has 3 prerendered language pages listed in the sitemap, and
Rich Results Test passes on one of them.

### [ ] S4. Performance pass

- Run Lighthouse mobile against `npm run preview` for home + one case study, aiming for
  **≥ 95 Perf / 100 SEO / ≥ 95 A11y**, and fix whatever it flags.
- Likely fixes: lazy-load the Chat widget (dynamic `import()` on first click), load GSAP
  ScrollTrigger only where needed, check that the LCP element is text rather than media,
  and prefetch the case-study pages on hover.
- Note the before and after scores here.

### [ ] S5. Content for search

**Goal:** give the home page text that matches what local clients actually search for.

- Target terms (validate with Search Console data once S6 is done): *diseño web Mallorca,
  desarrollo web Palma, agencia web Mallorca, chatbot IA empresas Mallorca, tienda online
  Mallorca*, plus the CA and EN equivalents.
- Replace the flat services list in [Studio.jsx](src/components/Studio/Studio.jsx) with short
  service blocks (H3 + 1–2 sentences each), plus a "sectors we work with" line that links to
  the matching case studies (restaurants, clinics, sports, …).
- Optional: a short FAQ (price ranges, timelines, maintenance) with `FAQPage` JSON-LD.
- Keep it concise and on-brand. This must not turn into an SEO landing-page farm.

### [ ] S6. Off-site setup (mostly manual, owner-led; needs D5)

- Verify `balearstudio.com` in **Google Search Console** and Bing Webmaster Tools, and submit
  the sitemap.
- Create or claim a **Google Business Profile** (Mallorca, "Diseñador de sitios web"), with the
  same name, email and URL used in the JSON-LD.
- Add a **"Web: balearSTUDIO" footer credit link** on every client site we built, where the
  client agrees. RMelendi's preview already mentions balearstudio. These links are the easiest
  backlinks we can get.
- Add social profiles to `sameAs` in the JSON-LD.
- Re-check indexing and queries in Search Console 2–4 weeks after S2 and S3 ship.

---

## Notes

_(Add anything surprising found during a task here.)_

**S1 (2026-09-24) — built, verified locally, deployed and confirmed live by the owner.**
- Local `npm run preview`: `/robots.txt`, `/sitemap.xml`, `/site.webmanifest`, `/apple-touch-icon.png`, `/404.html` and
  the fonts all return 200. Lighthouse mobile SEO = **100**, Performance 96, Accessibility 90. No console errors,
  no requests to Google Fonts, and the aria-labels switch language.
- **Still to check after deploy:** the live `/robots.txt` and `/sitemap.xml` return 200 (both are 404 today), and
  the JSON-LD passes the Rich Results Test / validator.schema.org (I can only confirm it parses as JSON locally).
- Lighthouse crashes on Node 22.0.0 (`URL.parse is not a function` makes the canonical audit error and SEO read 0).
  Preload a one-line shim: `URL.parse ||= (u,b)=>{try{return new URL(u,b)}catch{return null}}` via `NODE_OPTIONS=--require`,
  or upgrade Node.
- JSON-LD has no `sameAs`: no social profiles were found anywhere in the repo. Add them under S6.
- Fonts are the variable Space Grotesk (300–700) in `public/fonts/` (latin preloaded, latin-ext on demand).
  `apple-touch-icon.png`, `icon-192.png` and `icon-512.png` were rendered from `favicon.svg`. The 180 px one is full-bleed
  (no rounded corners), as iOS expects.
- Left for S4 (Lighthouse a11y 90): the closed chat panel is `aria-hidden` but still has focusable children, and
  `.eyebrow`, `.footer__tagline` and some text spans fail colour contrast.
- The hard-coded footer year (issue 7) was not in S1's scope and is untouched.
- Line endings: the repo's working files are CRLF. Scripted edits need to handle that.

**P1 (2026-09-24)**
- **One intentional visual change:** Predicasa is now `status: 'live'` with `url: https://predicasa.com`
  (the task says to drop `private`), so its card shows the "Visit site" link and title link instead of
  the lock badge. Everything else on the page is unchanged.
- The 4 new projects are placeholders (`copy` = `TODO`, empty `media`). `Works.jsx` filters out
  projects whose `media.gallery` is empty, so they don't render until P2 adds media. P4 should
  replace that filter with proper handling of the `preview` status ("Coming soon" badge).
- Existing media still points at the old root PNGs / `predicasa-video.mp4`; P2 moves it to
  `public/projects/<slug>/`. `media.gallery` is the full lightbox list (it includes the cover as
  its first entry, as before); `media.cover` is only the card thumbnail.
- `services` / `stack` are empty for all projects (P3 fills them; not guessed here).
- The `asset()` helper moved to `src/data/asset.js`. `sector` values: `web | ecommerce | ai-app`.
- `work.items.*` was removed from `translations.js`; UI labels (`work.visit`, etc.) stay.
- `summary` for the 3 existing projects is a new short line I wrote in ES/CA/EN; review it in P3.


**S2 (2026-09-24) — built, verified locally, deployed and confirmed live by the owner.**
- `npm run build` is now `vite build && vite build --ssr src/entry-server.jsx --outDir dist-ssr && node scripts/prerender.mjs`.
  It writes `dist/index.html` (ES), `dist/ca/index.html`, `dist/en/index.html`, `sitemap.xml` (with hreflang + x-default) and `robots.txt`.
  `public/robots.txt` and `public/sitemap.xml` were deleted; the build generates them.
- Per-language head tags (title, description, canonical, hreflang, OG, JSON-LD) live in `src/seo.js`. The generic tags stay in
  `index.html`, which now holds `<!--app-head-->` / `<!--app-html-->` markers. `vite dev` serves the bare template (no SSR); for a real
  check use `npm run build && npm run preview`.
- No router: each language is a separate page, `LanguageProvider` takes `lang` as a prop, and the LanguageSwitcher is plain `<a href>` links.
  S3 needs routes for `/proyectos/<slug>/` etc. Extend `LANGUAGES` / `prerender.mjs` for that rather than bolting on react-router.
- **Deviation from the plan on redirects:** there is **no browser-language redirect**. Googlebot reports `navigator.language` as en-US, so it
  would be sent to `/en/`. The only redirect (`src/i18n/preference.js`) fires on `/` and only for a language the visitor explicitly clicked
  before. A fresh en-US visitor stays on `/` (verified).
- SSR guards: the Chat widget is wrapped in `ClientOnly` (so it is not in the prerendered HTML); Works reads `prefers-reduced-motion` after
  mount; Hero uses an isomorphic layout effect. `gsap` is bundled into the SSR build (`ssr.noExternal`) because Node can't import its CJS plugins.
- Hero entrance: the prerendered HTML would flash visible before hydration, so `Hero.css` hides the animated elements under `.js` (class set by
  an inline script in index.html) and `Hero.jsx` uses `fromTo`. It must set `y: 0` too, or GSAP parses the CSS `translateY(120%)` into px and
  the lines never reach 0.
- Verified locally (Playwright vs `vite preview`): all 3 pages return the right `<html lang>`, title and hero copy in the raw HTML; no console
  errors or hydration errors (checked on the production build, where mismatches surface as React errors); the hero animation ends at 0; the
  switcher links work; the no-JS render shows the content; reduced motion at 390 px has no horizontal overflow.
- **Still to check after deploy:** `curl https://balearstudio.com/en/` and `/ca/` return the translated HTML (GitHub Pages serves them as
  directory indexes), live `/sitemap.xml` and `/robots.txt` are 200, and hreflang validates.
- The GSAP warning "target not found" under reduced motion comes from `useScrollReveal` (sections without a reveal group) and predates S2.
- On Windows, stop `vite preview` before rebuilding: it locks `dist/predicasa-video.mp4` and the build fails with EPERM.

**P2 (2026-09-24)**
- `npm run capture` (`scripts/capture-projects.mjs`, helpers in `scripts/optimise-media.mjs`) captures every project and writes
  `public/projects/<slug>/`. Options: slugs as arguments, `--no-video`, `--optimise-only`. Raw captures stay in `.capture/` (gitignored).
  New dev dependencies: `playwright` (1.61.0, browsers are the shared Playwright cache), `sharp`, `ffmpeg-static`.
- Each project has `cover`, `gallery-01…03` (two desktop sections plus one 390 px mobile shot), `poster.webp` and `video.mp4`/`video.webm`, with
  AVIF + WebP at 1600w and `-800` variants. Every image is under 250 KB (the biggest is ~116 KB) and every video is under 1.5 MB (the largest is 1.47 MB).
  Screenshots are taken at 2× and downscaled, so they stay sharp. `media.gallery` in the data files is `[cover, gallery-01, …]`, pointing at the `.webp` files
  and `video.mp4` for now; P4 adds `<picture>` with AVIF and `srcset`.
- Predicasa: the script signs in once with the demo account and reuses the session **in memory only** (`storageState`, never written), so the
  recording starts already logged in and no credentials appear on screen. The journey is search "Palma" → results → first listing → price
  analysis and the rental-yield verdict (12.7 s). Every frame was checked: no personal data, only the "DE" avatar initials and a business name.
  The listing photos on predicasa.com carry Idealista watermarks, so the gallery/video show third-party listing images. Worth a glance from the owner.
- The demo account can be deleted now (D3). I blanked the Predicasa values in `.env.local` rather than deleting the file.
- RMelendi's site imitates TikTok/YouTube/Instagram on purpose, so its gallery shots are those sections (the owner confirmed it is the desired look).
- Marketing sites are captured with sections snapped under the sticky header, cookie/consent buttons are clicked away, and the scroll video is
  capped at ~4200 px (about 10 s). The wedding site (`finai`) only had its two PNGs re-encoded: no video, and its `poster` is null. Its source PNGs
  are now deleted, so re-running the script keeps its existing output.
- The old root PNGs and `predicasa-video.mp4` are deleted. `public/` is now 16 MB, and most of that is the 12 videos (P4 must use `preload="none"`).
- **Works.jsx:** the four new projects now have media but still have TODO copy, so the filter hides them until P3
  (`copy.es.summary !== 'TODO'`). P3 should remove that condition, and P4 replaces the filter with proper `preview` handling.
  Verified with `vite preview`: 3 cards, card videos play, the lightbox opens, no console errors, no failed requests.
- Lighthouse was not run (that belongs to P4). The old video/PNGs are gone, so page weight has dropped a lot for the current 3 cards.

**P3 (2026-09-24)**
- No `TODO` copy is left in `src/data/projects/`; all 7 projects have name, category, summary and description in ES/CA/EN. The 3 featured ones
  (Predicasa, Darrod, A2 Dental) also have challenge / solution / result for S3. Descriptions carry the searchable terms ("aplicación web con IA para
  el sector inmobiliario en Mallorca", "web para academia de tenis", "web para clínica dental en Portals (Calvià)", "web para centro de fisioterapia").
- **Sources.** The client repos and `balear-ewf/references/*/notes.md` had nothing usable: the notes describe *reference* sites (the old panespatagonia.com,
  a login-gate screenshot of Predicasa), and `clients/` has no briefs for these projects. So the copy is written from what each live site says, plus what I
  could detect in the served HTML/bundles. **I could not verify what balearSTUDIO did on each one, so please review `services` and the claims below.**
- **`services`** are now vocabulary keys (`design`, `development`, `webapp`, `ai`, `booking`, `multilingual`), with the labels in
  `work.services` in `translations.js`, so S3/S5 can show them in any language. `stack` is detected from the sites: Predicasa React + Vite + Supabase + Leaflet,
  Darrod Next.js, A2 Dental and Melani plain HTML/CSS/JS (Melani also uses a Doctoralia booking widget), RMelendi Astro, Panes Patagonia React + Vite,
  wedding React + Vite + GSAP.
- **Facts to confirm:** Predicasa figures ("más de 17.000 anuncios", Idealista + Fotocasa, nightly revaluation) come from predicasa.com today and will go
  stale. Darrod's "single calendar" booking comes from its booking section (I did not test that it submits). Melani "online booking" is the Doctoralia
  widget. The results are qualitative on purpose: no metrics exist for the preview sites and I did not invent any.
- RMelendi's description avoids gendered wording ("the content", not "his content") because the creator's pronouns are unknown.
- **Works.jsx changes beyond P3's scope (small, so nothing ships unlabelled):** the `TODO` filter is gone, so all 7 cards render now, and `preview`
  projects show a "Próximamente / Aviat / Coming soon" pill (`.project__soon`) instead of a link (D1). P4 should replace this with its own badge design.
  Checked with `vite preview` in ES, CA and EN (390 px for EN): 7 cards, 4 badges, no console errors, no overflow.
- Kept the wedding site's existing copy (already final, trilingual, and anonymous per D2).

**P4 (2026-09-24) — built and verified locally, deployed, and signed off by the owner after seeing it live.**
- Works is now 3 featured cards (Predicasa full-width lead, Darrod + A2 Dental two-up; driven by `featured` + `order`, so D4 holds) and a
  compact grid of the other 4 under a "More projects" heading (`work.moreTitle`). Cards are media-first and keep the greyscale → colour hover.
  Status: `live` → "Visit site" link (name is linked too), `preview` → "Coming soon" pill and no link, `private` → lock + tooltip.
- Images are `<picture>` with AVIF → WebP and `srcset` (800w / full width) + `sizes`, and explicit `width`/`height` from the new `media.coverSize`
  in each project file. `responsiveImage()` in `src/data/asset.js` derives the AVIF/`-800` names from the `.webp` cover path.
  All images `loading="lazy"` (the section is below the fold).
- Videos: `preload="none"`, `poster`, WebM then MP4 sources, laid over the `<picture>` and faded in on `playing`. An IntersectionObserver plays
  them at ≥50% visible and pauses them when they leave. Reduced motion renders no `<video>` at all. `muted` is set in JS because hydration doesn't.
- **Not done, on purpose:** the optional sector filter (the data is 6 web, 1 AI app, 0 e-commerce, so it wouldn't read well), and the
  "View project" link (there is no route until S3). The Lightbox is untouched.
- Verified with `vite preview` (Playwright): 7 cards (3 featured, 4 badges, 2 visit links, 1 lock) in ES/CA/EN at 1440, 820 and 390 px, no console
  errors or failed requests, no horizontal overflow, CLS 0, videos only play while in view, lightbox opens/navigates/closes.
- Lighthouse mobile, `/en/`: **Perf 90 / A11y 90 / SEO 100, CLS 0, LCP 3.5 s, TBT 60 ms.** Baseline (P3 build, same machine and shim): Perf 92 /
  A11y 90 / SEO 100, CLS 0, LCP 3.2 s, TBT 100 ms. So no CLS regression; the ±2 Perf difference is within run-to-run noise. Perf and A11y are still
  short of S4's targets (≥95 / ≥95).
- Not checked: a real tablet or phone (only Playwright viewports), and the touch behaviour of the hover colour reveal (it stays greyscale on touch, as before).

**S3 (2026-09-24) — built and verified locally, deployed, and confirmed live by the owner.**
- URLs: `/proyectos/<slug>/`, `/ca/projectes/<slug>/`, `/en/work/<slug>/` for the 6 non-private projects (18 pages, 21 with the homes, all in `sitemap.xml`
  with hreflang + x-default). `finai` (private) has no page. Routes live in `src/routes.js` (`PAGES`, `pagePath`, `pageFromPath`); `LANGUAGES` gained `projectsPath`.
  Still no router: `App` renders `ProjectPage` when the language context has a `slug`, and `prerender.mjs` loops over `PAGES`.
- `src/components/ProjectPage/`: breadcrumb, H1, summary, status (visit link / "Coming soon"), hero media (autoplay video like the cards), description + facts
  (sector, year, services, stack), challenge → solution → result (only when written: the 3 featured projects), screens strip, next project, then the
  existing Contact block as the CTA. The Lightbox opens from the hero or any screen.
- The LanguageSwitcher keeps you on the same project; Header/Logo links go to `<home>#work` etc. on case-study pages. Works cards got a "View project" link.
- `ProjectMedia` was extracted from Works (own CSS) so the cards and the page share it; `VisitArrow` too. `media.gallerySizes` (width/height per gallery entry) was
  added to every project file so screenshots have explicit dimensions; update it if the capture script's output sizes change.
- Head per page (`src/seo.js`): title `"<name> — <category> | balearSTUDIO"`, description = the project's description (160–240 chars, so Google may truncate the tail),
  canonical, hreflang, OG image = the project cover (absolute .webp URL), and JSON-LD `WebPage` + `CreativeWork` (creator = the Organization) + `ImageObject` +
  `BreadcrumbList`. `sameAs` = the client's URL only for `live` projects.
- Verified locally (Playwright vs `vite preview`, production build): 5 pages in 3 languages have correct `lang`, switcher and nav links; no console errors or
  hydration warnings, no failed requests, no horizontal overflow at 1440 / 820 / 390; lightbox opens from hero and screens; no-JS HTML contains the H1 and story;
  all 21 JSON-LD blocks parse as JSON.
- **Still to do after deploy:** run the Rich Results Test / validator.schema.org on one case-study URL (I can only confirm JSON validity offline), check that
  GitHub Pages serves the nested `/en/work/<slug>/` folders, then tick S3. The og image is a .webp; if a scraper (e.g. LinkedIn) ignores it, add a 1200×630 JPG.
- Not done: the "View project" link on Works points at pages that only exist after deploy (fine, they ship together).
