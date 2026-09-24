import predicasa from './predicasa'
import darrodTennis from './darrod-tennis'
import a2Dental from './a2-dental'
import rmelendi from './rmelendi'
import panesPatagonia from './panes-patagonia'
import melani from './melani'
import finai from './finai'

/* Portfolio projects, sorted by `order`. Copy lives next to the data in
   `copy.<lang>`; UI labels stay in src/i18n/translations.js.

   status: 'live'    — public site, `url` is linked
           'preview' — unreleased; never link the preview URL, show "Coming soon"
           'private' — not shown publicly (client request), lock badge instead of a link
   sector: 'web' | 'ecommerce' | 'ai-app'
   media:  cover = card thumbnail, video/poster = optional card video,
           gallery = full lightbox set (may include the cover as its first entry). */
export const projects = [
  predicasa,
  darrodTennis,
  a2Dental,
  rmelendi,
  panesPatagonia,
  melani,
  finai,
].sort((a, b) => a.order - b.order)

// Projects that get a case-study page of their own. Private ones (client
// request) are never linked, prerendered or listed in the sitemap.
export const publicProjects = projects.filter((p) => p.status !== 'private')
