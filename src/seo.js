/* ============================================================
   Per-language <head> for the prerendered pages. Pure JS (no React,
   no browser APIs) so scripts/prerender.mjs can call it at build time.
   Generic head tags (icons, manifest, font preload) stay in index.html.
   ============================================================ */
import { LANGUAGES, DEFAULT_LANG } from './i18n/translations.js'

export const SITE_ORIGIN = 'https://balearstudio.com'
export const OG_IMAGE = `${SITE_ORIGIN}/og.png`

export const langUrl = (code) =>
  SITE_ORIGIN + LANGUAGES.find((l) => l.code === code).path

// Titles and descriptions are written around what local clients search for.
export const meta = {
  es: {
    title: 'Diseño web y soluciones con IA en Mallorca | balearSTUDIO',
    description:
      'Estudio digital en Mallorca. Diseñamos y construimos webs, tiendas online, aplicaciones y chatbots con Inteligencia Artificial para empresas.',
    imageAlt: 'balearSTUDIO — estudio digital en Mallorca',
  },
  ca: {
    title: 'Disseny web i solucions amb IA a Mallorca | balearSTUDIO',
    description:
      'Estudi digital a Mallorca. Dissenyem i construïm webs, botigues en línia, aplicacions i xatbots amb Intel·ligència Artificial per a empreses.',
    imageAlt: 'balearSTUDIO — estudi digital a Mallorca',
  },
  en: {
    title: 'Web design and AI solutions in Mallorca | balearSTUDIO',
    description:
      'Digital studio in Mallorca. We design and build websites, online stores, apps and AI chatbots for businesses.',
    imageAlt: 'balearSTUDIO — digital studio in Mallorca',
  },
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function jsonLd(lang) {
  const { description } = meta[lang]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: 'balearSTUDIO',
        url: `${SITE_ORIGIN}/`,
        logo: `${SITE_ORIGIN}/icon-512.png`,
        email: 'info@balearstudio.com',
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_ORIGIN}/#business`,
        name: 'balearSTUDIO',
        url: `${SITE_ORIGIN}/`,
        image: OG_IMAGE,
        logo: `${SITE_ORIGIN}/icon-512.png`,
        email: 'info@balearstudio.com',
        description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mallorca',
          addressRegion: 'Illes Balears',
          addressCountry: 'ES',
        },
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Mallorca' },
          { '@type': 'AdministrativeArea', name: 'Illes Balears' },
        ],
        knowsLanguage: LANGUAGES.map((l) => l.code),
        parentOrganization: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        name: 'balearSTUDIO',
        url: `${SITE_ORIGIN}/`,
        inLanguage: LANGUAGES.map((l) => l.code),
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${langUrl(lang)}#webpage`,
        url: langUrl(lang),
        name: meta[lang].title,
        description,
        inLanguage: lang,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': `${SITE_ORIGIN}/#business` },
      },
    ],
  }
}

/** Head markup that differs per language: title, description, canonical,
 *  hreflang, Open Graph / Twitter and JSON-LD. */
export function buildHead(lang) {
  const { title, description, imageAlt } = meta[lang]
  const url = langUrl(lang)
  const current = LANGUAGES.find((l) => l.code === lang)

  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...LANGUAGES.map(
      (l) => `<link rel="alternate" hreflang="${l.code}" href="${langUrl(l.code)}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${langUrl(DEFAULT_LANG)}" />`,
    // Open Graph / Twitter. Scrapers fetch these server-side, so og:image and
    // og:url must be absolute URLs.
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="balearSTUDIO" />`,
    `<meta property="og:locale" content="${current.locale}" />`,
    ...LANGUAGES.filter((l) => l.code !== lang).map(
      (l) => `<meta property="og:locale:alternate" content="${l.locale}" />`,
    ),
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd(lang)).replace(/</g, '\\u003c')}</script>`,
  ]
  return lines.join('\n    ')
}

export function buildSitemap() {
  const alternates = [
    ...LANGUAGES.map(
      (l) => `\n    <xhtml:link rel="alternate" hreflang="${l.code}" href="${langUrl(l.code)}" />`,
    ),
    `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${langUrl(DEFAULT_LANG)}" />`,
  ].join('')
  const entries = LANGUAGES.map(
    (l) => `  <url>\n    <loc>${langUrl(l.code)}</loc>${alternates}\n  </url>`,
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`
}

export const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`
