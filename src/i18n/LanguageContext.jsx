import { createContext, useContext, useMemo } from 'react'
import { translations, DEFAULT_LANG, LANGUAGES } from './translations'

const LanguageContext = createContext(null)

/** The language is fixed per URL (/, /ca/, /en/), so it arrives as a prop from
 *  the entry point instead of living in state — switching is a page navigation. */
export function LanguageProvider({ lang = DEFAULT_LANG, children }) {
  const value = useMemo(() => {
    // t('a.b.c') — dot-path lookup into the active language dictionary.
    const t = (path) => {
      const segments = path.split('.')
      let node = translations[lang]
      for (const seg of segments) {
        node = node?.[seg]
        if (node === undefined) return path
      }
      return node
    }
    return { lang, t, languages: LANGUAGES }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
