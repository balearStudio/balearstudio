import { useLanguage } from '../../i18n/LanguageContext'
import './Hero.css'

// The entrance animation is pure CSS (see the end of Hero.css), so it starts at
// first paint of the prerendered HTML instead of waiting for JS to load and hydrate.
export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <span className="eyebrow hero__eyebrow">
          {t('hero.location')}
        </span>

        <h1 className="hero__title">
          <span className="hero__line">
            <span>{t('hero.titleLine1')}</span>
          </span>
          <span className="hero__line">
            <span>{t('hero.titleLine2')}</span>
          </span>
          <span className="hero__line hero__line--accent">
            <span>{t('hero.titleAccent')}</span>
          </span>
        </h1>

        <div className="hero__bottom">
          <p className="hero__lead">
            {t('hero.lead')}
          </p>
          <a href="#contact" className="hero__cta btn-primary">
            <span>{t('hero.cta')}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <a href="#work" className="hero__scroll" aria-label={t('hero.scroll')}>
        <span>{t('hero.scroll')}</span>
        <span className="hero__scroll-line" aria-hidden="true"></span>
      </a>
    </section>
  )
}
