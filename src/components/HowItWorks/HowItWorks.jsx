import { useRef, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { stepShots } from '../../data/tooldeck'
import Screenshot from '../Screenshot/Screenshot'
import './HowItWorks.css'

const PANEL_ID = 'como-funciona-captura'

/**
 * Three steps that double as tabs: the selected step shows its
 * screenshot in the frame below (arrow keys move between steps).
 */
export default function HowItWorks() {
  const { t } = useLanguage()
  const ref = useScrollReveal({ stagger: 0.1 })
  const [active, setActive] = useState(0)
  const tabs = useRef([])
  const steps = t('how.steps')

  const onKeyDown = (e) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!delta) return
    e.preventDefault()
    const next = (active + delta + steps.length) % steps.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <section className="how section" id="como-funciona" ref={ref}>
      <div className="container">
        <span className="eyebrow reveal">{t('how.eyebrow')}</span>
        <h2 className="how__title reveal">{t('how.title')}</h2>

        <div
          className="how__steps reveal"
          data-reveal-group
          role="tablist"
          aria-label={t('how.eyebrow')}
          onKeyDown={onKeyDown}
        >
          {steps.map((step, i) => (
            <button
              key={step.t}
              ref={(el) => (tabs.current[i] = el)}
              type="button"
              role="tab"
              id={`como-funciona-paso-${i + 1}`}
              aria-selected={i === active}
              aria-controls={PANEL_ID}
              tabIndex={i === active ? 0 : -1}
              className={`how__step ${i === active ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              <span className="how__step-k">{String(i + 1).padStart(2, '0')}</span>
              <span className="how__step-t">{step.t}</span>
              <span className="how__step-d">{step.d}</span>
            </button>
          ))}
        </div>

        <div
          className="how__shot reveal"
          role="tabpanel"
          id={PANEL_ID}
          aria-labelledby={`como-funciona-paso-${active + 1}`}
        >
          <Screenshot
            images={stepShots.map((src, i) => ({ src, alt: steps[i].alt }))}
            active={active}
            caption={t('how.caption')}
          />
        </div>
      </div>
    </section>
  )
}
