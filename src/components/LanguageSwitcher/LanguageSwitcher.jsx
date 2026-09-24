import { useLanguage } from '../../i18n/LanguageContext'
import { savePreference } from '../../i18n/preference'
import { pagePath } from '../../routes'
import './LanguageSwitcher.css'

// Each language lives at its own URL, so these are plain links (crawlable, and
// they work without JS). The current language is shown, not linked; on a case
// study the links lead to the same project in the other language.
export default function LanguageSwitcher() {
  const { lang, slug, languages, t } = useLanguage()

  return (
    <div className="lang-switch" role="group" aria-label={t('a11y.language')}>
      {languages.map((l, i) => (
        <span key={l.code} className="lang-switch__item">
          {i > 0 && <span className="lang-switch__sep" aria-hidden="true">/</span>}
          {lang === l.code ? (
            <span className="lang-switch__btn is-active" aria-current="true" title={l.name}>
              {l.label}
            </span>
          ) : (
            <a
              className="lang-switch__btn"
              href={pagePath(l.code, slug)}
              hrefLang={l.code}
              lang={l.code}
              title={l.name}
              onClick={() => savePreference(l.code)}
            >
              {l.label}
            </a>
          )}
        </span>
      ))}
    </div>
  )
}
