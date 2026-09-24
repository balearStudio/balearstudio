import { useLanguage } from '../../i18n/LanguageContext'
import { homePath } from '../../routes'
import './Logo.css'

/**
 * balearSTUDIO wordmark.
 * "balear" lowercase + "STUDIO" uppercase bold, wide letter-spacing.
 */
export default function Logo({ onClick, className = '' }) {
  const { t, lang, slug } = useLanguage()
  return (
    <a
      href={slug ? homePath(lang) : '#top'}
      onClick={onClick}
      className={`logo ${className}`}
      aria-label={t('a11y.home')}
    >
      <span className="logo__balear">balear</span>
      <span className="logo__studio">STUDIO</span>
    </a>
  )
}
