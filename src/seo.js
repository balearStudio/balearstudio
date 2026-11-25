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
// Social card per language (public/og*.png, 1200×630).
export const OG_IMAGES = {
  es: `${SITE_ORIGIN}/og.png`,
  ca: `${SITE_ORIGIN}/og-ca.png`,
  en: `${SITE_ORIGIN}/og-en.png`,
}

export const langUrl = (code) =>
  SITE_ORIGIN + LANGUAGES.find((l) => l.code === code).path

/** Absolute URL of a page: the home page when `slug` is null, else a case study. */
export const pageUrl = (code, slug = null) => SITE_ORIGIN + pagePath(code, slug)

// Home page: the site now leads with ToolDeck (product claims follow
// ToolDeck/docs/guia-comercial.md, section 12: no prices, no "AI included").
// Local searches ("web para academia de tenis…") are covered by the case-study
// pages. Title ≤ 60 characters, description ≤ 160.
// `studio` describes balearSTUDIO itself, for the ProfessionalService node.
export const meta = {
  es: {
    title: 'ToolDeck: herramientas de IA para tu equipo | balearSTUDIO',
    description:
      'ToolDeck convierte los prompts que tu empresa repite en herramientas con formulario que entregan Word, Excel, PowerPoint o PDF con tu plantilla. Datos en la UE.',
    ogTitle: 'ToolDeck, by balearSTUDIO',
    ogDescription: 'Del prompt de una persona a la herramienta de toda la empresa.',
    imageAlt: 'ToolDeck, by balearSTUDIO — Del prompt de una persona a la herramienta de toda la empresa.',
    app: 'Plataforma web que convierte los prompts de IA que una empresa repite en herramientas con formulario que entregan documentos Word, Excel, PowerPoint o PDF con la plantilla de la empresa.',
    studio: 'Estudio de Mallorca que crea ToolDeck y desarrolla webs, aplicaciones y soluciones a medida con Inteligencia Artificial.',
  },
  ca: {
    title: "ToolDeck: eines d'IA per al teu equip | balearSTUDIO",
    description:
      'ToolDeck converteix els prompts que repeteix la teva empresa en eines amb formulari que lliuren Word, Excel, PowerPoint o PDF amb la teva plantilla.',
    ogTitle: 'ToolDeck, by balearSTUDIO',
    ogDescription: "Del prompt d'una persona a l'eina de tota l'empresa.",
    imageAlt: "ToolDeck, by balearSTUDIO — Del prompt d'una persona a l'eina de tota l'empresa.",
    app: "Plataforma web que converteix els prompts d'IA que una empresa repeteix en eines amb formulari que lliuren documents Word, Excel, PowerPoint o PDF amb la plantilla de l'empresa.",
    studio: 'Estudi de Mallorca que crea ToolDeck i desenvolupa webs, aplicacions i solucions a mida amb Intel·ligència Artificial.',
  },
  en: {
    title: 'ToolDeck: AI tools for your whole team | balearSTUDIO',
    description:
      'ToolDeck turns the prompts your company repeats into form-based tools that deliver Word, Excel, PowerPoint or PDF files in your template. Data in the EU.',
    ogTitle: 'ToolDeck, by balearSTUDIO',
    ogDescription: "From one person's prompt to a tool for the whole company.",
    imageAlt: "ToolDeck, by balearSTUDIO — From one person's prompt to a tool for the whole company.",
    app: "A web platform that turns the AI prompts a company repeats into form-based tools that deliver Word, Excel, PowerPoint or PDF documents in the company's template.",
    studio: 'Studio in Mallorca that makes ToolDeck and builds custom websites, apps and AI solutions.',
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
  const { description, studio, app } = meta[lang]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode,
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_ORIGIN}/#business`,
        name: 'balearSTUDIO',
        url: `${SITE_ORIGIN}/`,
        image: OG_IMAGES[lang],
        logo: `${SITE_ORIGIN}/icon-512.png`,
        email: 'info@balearstudio.com',
        description: studio,
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
      // No offers, prices or ratings on purpose: prices aren't set yet and
      // there are no public reviews.
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_ORIGIN}/#tooldeck`,
        name: 'ToolDeck',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: app,
        url: langUrl(lang),
        creator: { '@id': `${SITE_ORIGIN}/#organization` },
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
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
        about: { '@id': `${SITE_ORIGIN}/#tooldeck` },
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
  const { title, description, imageAlt, image, ogTitle = title, ogDescription = description } =
    project
      ? projectMeta(lang, project)
      : { ...meta[lang], image: { url: OG_IMAGES[lang], width: 1200, height: 630 } }
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
    `<meta property="og:title" content="${esc(ogTitle)}" />`,
    `<meta property="og:description" content="${esc(ogDescription)}" />`,
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
