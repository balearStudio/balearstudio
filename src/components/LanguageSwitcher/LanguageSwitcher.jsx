import { useLanguage } from '../../i18n/LanguageContext'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { lang, setLang, languages, t } = useLanguage()

  return (
    <div className="lang-switch" role="group" aria-label={t('a11y.language')}>
      {languages.map((l, i) => (
        <span key={l.code} className="lang-switch__item">
          {i > 0 && <span className="lang-switch__sep" aria-hidden="true">/</span>}
          <button
            className={`lang-switch__btn ${lang === l.code ? 'is-active' : ''}`}
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
            title={l.name}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  )
}
