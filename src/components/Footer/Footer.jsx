import Logo from '../Logo/Logo'
import { useLanguage } from '../../i18n/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()
  const year = 2026 // update on release; keep static to avoid runtime Date calls

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo className="logo--lg" />
          <p className="footer__tagline">{t('footer.tagline')}</p>
        </div>

        <div className="footer__right">
          <a href="mailto:info@balearstudio.com" className="footer__mail">
            info@balearstudio.com
          </a>
          <a href="#top" className="footer__top">
            {t('footer.backTop')}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {year} balearSTUDIO. {t('footer.rights')}</span>
        <span>Mallorca · España</span>
      </div>
    </footer>
  )
}
