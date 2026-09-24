/* Remembers a language the visitor picked explicitly, so a later visit to the
   root URL can send them back to it. Browser-side only (guarded for SSR), and
   deliberately NOT based on navigator.language: crawlers report en-US, and
   redirecting on that would hide the Spanish page from them. */
import { LANGUAGES, DEFAULT_LANG } from './translations'

const STORAGE_KEY = 'balearstudio-lang'

export function savePreference(code) {
  try {
    window.localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // Storage can be blocked (private mode); the preference is a nicety.
  }
}

/** Language code for a pathname: /ca/… → 'ca', /en/… → 'en', else the default. */
export function langFromPath(pathname) {
  const match = LANGUAGES.find(
    (l) => l.code !== DEFAULT_LANG && pathname.startsWith(l.path),
  )
  return match ? match.code : DEFAULT_LANG
}

/** If the visitor previously chose another language and lands on the bare root,
 *  go to it. Only ever fires on "/" and only for a stored, explicit choice. */
export function redirectToStoredLanguage() {
  if (window.location.pathname !== '/') return
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const target = LANGUAGES.find((l) => l.code === stored)
    if (target && target.code !== DEFAULT_LANG) {
      window.location.replace(target.path + window.location.search + window.location.hash)
    }
  } catch {
    // ignore
  }
}
