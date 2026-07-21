import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations, DEFAULT_LANG, LANGUAGES } from './translations'

const STORAGE_KEY = 'balearstudio-lang'
const LanguageContext = createContext(null)

function getInitialLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && translations[stored]) return stored
  const browser = window.navigator.language?.slice(0, 2)
  if (browser && translations[browser]) return browser
  return DEFAULT_LANG
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

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
    return { lang, setLang, t, languages: LANGUAGES }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
