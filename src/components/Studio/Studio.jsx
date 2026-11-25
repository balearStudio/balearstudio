import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './Studio.css'

export default function Studio() {
  const { t } = useLanguage()
  const ref = useScrollReveal({ stagger: 0.1 })
  const services = t('studio.services')

  return (
    <section className="studio section" id="studio" ref={ref}>
      <div className="container">
        <span className="eyebrow reveal">{t('studio.eyebrow')}</span>

        <div className="studio__grid">
          {/* Who we are */}
          <div>
            <h2 className="studio__statement reveal">{t('studio.title')}</h2>
            <p className="studio__body reveal">{t('studio.body')}</p>
          </div>

          {/* Custom work, kept short and secondary to ToolDeck */}
          <div className="studio__do reveal">
            <h3 className="studio__do-title">{t('studio.customTitle')}</h3>
            <ul className="studio__services">
              {services.map((s) => (
                <li key={s} className="studio__service">
                  <span className="studio__service-dot" aria-hidden="true"></span>
                  {s}
                </li>
              ))}
            </ul>
            <a href="#work" className="studio__works-link">
              {t('studio.worksLink')}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
