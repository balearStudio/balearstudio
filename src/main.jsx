import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import { redirectToStoredLanguage } from './i18n/preference.js'
import { pageFromPath } from './routes.js'
import './styles/index.css'

redirectToStoredLanguage()

const { lang, slug } = pageFromPath(window.location.pathname)
document.documentElement.lang = lang

const app = (
  <React.StrictMode>
    <LanguageProvider lang={lang} slug={slug}>
      <App />
    </LanguageProvider>
  </React.StrictMode>
)

const root = document.getElementById('root')

// Built pages arrive prerendered, so attach to the existing markup. `vite dev`
// serves the bare template, where there is nothing to hydrate yet.
if (root.firstElementChild) {
  ReactDOM.hydrateRoot(root, app)
} else {
  ReactDOM.createRoot(root).render(app)
}
