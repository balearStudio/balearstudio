/* ============================================================
   URL scheme. Pure JS (no React, no browser APIs) so the prerender
   build, the SSR entry and the browser all share one source of truth.

     home          /            /ca/               /en/
     case study    /proyectos/<slug>/   /ca/projectes/<slug>/   /en/work/<slug>/

   Every page exists in every language, so a page is identified by
   { lang, slug } where `slug` is null for the home page.
   ============================================================ */
import { LANGUAGES } from './i18n/translations'
import { langFromPath } from './i18n/preference'
import { publicProjects } from './data/projects'

const language = (code) => LANGUAGES.find((l) => l.code === code)

export const homePath = (lang) => language(lang).path
export const projectPath = (lang, slug) => `${language(lang).projectsPath}${slug}/`
export const pagePath = (lang, slug) => (slug ? projectPath(lang, slug) : homePath(lang))

/** Every page to prerender: the home page and each public case study, per language. */
export const PAGES = [
  ...LANGUAGES.map((l) => ({ lang: l.code, slug: null, path: homePath(l.code) })),
  ...publicProjects.flatMap((p) =>
    LANGUAGES.map((l) => ({ lang: l.code, slug: p.slug, path: projectPath(l.code, p.slug) })),
  ),
]

/** { lang, slug } for a pathname; unknown paths fall back to the home page. */
export function pageFromPath(pathname) {
  for (const l of LANGUAGES) {
    if (!pathname.startsWith(l.projectsPath)) continue
    const slug = pathname.slice(l.projectsPath.length).split('/')[0]
    if (publicProjects.some((p) => p.slug === slug)) return { lang: l.code, slug }
  }
  return { lang: langFromPath(pathname), slug: null }
}
