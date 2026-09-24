import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import { buildHead, buildSitemap, robotsTxt } from './seo.js'

// Re-exported so scripts/prerender.mjs (a plain Node script) has one source of
// truth for which URLs exist.
export { PAGES } from './routes.js'
export { buildSitemap, robotsTxt }

export function render(lang, slug = null) {
  const appHtml = renderToString(
    <React.StrictMode>
      <LanguageProvider lang={lang} slug={slug}>
        <App />
      </LanguageProvider>
    </React.StrictMode>,
  )
  return { appHtml, headHtml: buildHead(lang, slug) }
}
