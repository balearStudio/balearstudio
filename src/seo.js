/* ============================================================
   Per-page <head> for the prerendered pages (home and case studies, in
   each language). Pure JS (no React, no browser APIs) so
   scripts/prerender.mjs can call it at build time.
   Generic head tags (icons, manifest, font preload) stay in index.html.
   ============================================================ */
import { LANGUAGES, DEFAULT_LANG, translations } from './i18n/translations.js'
import { publicProjects } from './data/projects/index.js'
import { PAGES, pagePath } from './routes.js'

export const SITE_ORIGIN = 'https://balearstudio.com'
export const OG_IMAGE = `${SITE_ORIGIN}/og.png`

export const langUrl = (code) =>
  SITE_ORIGIN + LANGUAGES.find((l) => l.code === code).path

/** Absolute URL of a page: the home page when `slug` is null, else a case study. */
export const pageUrl = (code, slug = null) => SITE_ORIGIN + pagePath(code, slug)

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

const organizationNode = {
  '@type': 'Organization',
  '@id': `${SITE_ORIGIN}/#organization`,
  name: 'balearSTUDIO',
  url: `${SITE_ORIGIN}/`,
  logo: `${SITE_ORIGIN}/icon-512.png`,
  email: 'info@balearstudio.com',
}

const websiteNode = {
  '@type': 'WebSite',
  '@id': `${SITE_ORIGIN}/#website`,
  name: 'balearSTUDIO',
  url: `${SITE_ORIGIN}/`,
  inLanguage: LANGUAGES.map((l) => l.code),
  publisher: { '@id': `${SITE_ORIGIN}/#organization` },
}

function jsonLd(lang) {
  const { description } = meta[lang]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode,
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
      websiteNode,
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

/** Case-study copy for the <head>: the title and description are the project's
 *  own words, so each page targets its sector ("web para academia de tenis"). */
function projectMeta(lang, project) {
  const { name, category, description } = project.copy[lang]
  const [width, height] = project.media.coverSize
  return {
    title: `${name} — ${category} | balearSTUDIO`,
    description,
    imageAlt: name,
    image: { url: SITE_ORIGIN + project.media.cover, width, height },
  }
}

function projectJsonLd(lang, project) {
  const { name, category, description } = project.copy[lang]
  const url = pageUrl(lang, project.slug)
  const home = langUrl(lang)
  const serviceLabels = project.services.map((s) => translations[lang].work.services[s])
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode,
      websiteNode,
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: projectMeta(lang, project).title,
        description,
        inLanguage: lang,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        primaryImageOfPage: { '@id': `${url}#image` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        mainEntity: { '@id': `${url}#project` },
      },
      {
        '@type': 'ImageObject',
        '@id': `${url}#image`,
        url: SITE_ORIGIN + project.media.cover,
        width: project.media.coverSize[0],
        height: project.media.coverSize[1],
        caption: name,
      },
      {
        '@type': 'CreativeWork',
        '@id': `${url}#project`,
        name,
        headline: name,
        description,
        url,
        inLanguage: lang,
        image: { '@id': `${url}#image` },
        genre: category,
        keywords: [...serviceLabels, ...project.stack].join(', '),
        dateCreated: project.year,
        creator: { '@id': `${SITE_ORIGIN}/#organization` },
        // The client's own site, once it is public.
        ...(project.status === 'live' && { sameAs: [project.url] }),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'balearSTUDIO', item: home },
          { '@type': 'ListItem', position: 2, name: translations[lang].nav.work, item: `${home}#work` },
          { '@type': 'ListItem', position: 3, name, item: url },
        ],
      },
    ],
  }
}

/** Head markup that differs per page: title, description, canonical, hreflang,
 *  Open Graph / Twitter and JSON-LD. `slug` is null for the home page. */
export function buildHead(lang, slug = null) {
  const project = slug ? publicProjects.find((p) => p.slug === slug) : null
  const { title, description, imageAlt, image } = project
    ? projectMeta(lang, project)
    : { ...meta[lang], image: { url: OG_IMAGE, width: 1200, height: 630 } }
  const graph = project ? projectJsonLd(lang, project) : jsonLd(lang)
  const url = pageUrl(lang, slug)
  const current = LANGUAGES.find((l) => l.code === lang)

  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...LANGUAGES.map(
      (l) => `<link rel="alternate" hreflang="${l.code}" href="${pageUrl(l.code, slug)}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl(DEFAULT_LANG, slug)}" />`,
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
    `<meta property="og:image" content="${image.url}" />`,
    `<meta property="og:image:width" content="${image.width}" />`,
    `<meta property="og:image:height" content="${image.height}" />`,
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`,
  ]
  return lines.join('\n    ')
}

/** One <url> per page (home and case studies, in every language), each listing
 *  all of its language alternates. */
export function buildSitemap() {
  const entries = PAGES.map(({ lang, slug }) => {
    const alternates = [
      ...LANGUAGES.map(
        (l) => `\n    <xhtml:link rel="alternate" hreflang="${l.code}" href="${pageUrl(l.code, slug)}" />`,
      ),
      `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(DEFAULT_LANG, slug)}" />`,
    ].join('')
    return `  <url>\n    <loc>${pageUrl(lang, slug)}</loc>${alternates}\n  </url>`
  }).join('\n')

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
