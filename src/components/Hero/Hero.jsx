import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../../i18n/LanguageContext'
import './Hero.css'

export default function Hero() {
  const { t } = useLanguage()
  const root = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('[data-hero-line] > span', {
        yPercent: 120,
        duration: 1.05,
        stagger: 0.09,
      })
        .from(
          '[data-hero-fade]',
          { autoAlpha: 0, y: 22, duration: 0.9, stagger: 0.12 },
          '-=0.6',
        )
        .from(
          '.hero__scroll',
          { autoAlpha: 0, y: 12, duration: 0.8 },
          '-=0.5',
        )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={root}>
      <div className="container hero__inner">
        <span className="eyebrow hero__eyebrow" data-hero-fade>
          {t('hero.location')}
        </span>

        <h1 className="hero__title">
          <span className="hero__line" data-hero-line>
            <span>{t('hero.titleLine1')}</span>
          </span>
          <span className="hero__line" data-hero-line>
            <span>{t('hero.titleLine2')}</span>
          </span>
          <span className="hero__line hero__line--accent" data-hero-line>
            <span>{t('hero.titleAccent')}</span>
          </span>
        </h1>

        <div className="hero__bottom">
          <p className="hero__lead" data-hero-fade>
            {t('hero.lead')}
          </p>
          <a href="#contact" className="hero__cta btn-primary" data-hero-fade>
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
