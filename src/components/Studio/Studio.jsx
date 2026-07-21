import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './Studio.css'

export default function Studio() {
  const { t } = useLanguage()
  const ref = useScrollReveal({ stagger: 0.1 })
  const services = t('studio.services')
  const values = t('studio.values')

  return (
    <section className="studio section" id="studio" ref={ref}>
      <div className="container">
        <span className="eyebrow reveal">{t('studio.eyebrow')}</span>

        {/* Who we are — big statement */}
        <h2 className="studio__statement reveal">{t('studio.whoTitle')}</h2>
        <p className="studio__body reveal">{t('studio.whoBody')}</p>

        {/* What we do + services */}
        <div className="studio__do">
          <div className="studio__do-text reveal" data-reveal-group>
            <h3 className="studio__do-title">{t('studio.doTitle')}</h3>
            <p className="studio__do-body">{t('studio.doBody')}</p>
          </div>
          <ul className="studio__services reveal" data-reveal-group>
            {services.map((s) => (
              <li key={s} className="studio__service">
                <span className="studio__service-dot" aria-hidden="true"></span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Values grid */}
        <ul className="studio__values reveal" data-reveal-group>
          {values.map((v) => (
            <li key={v.k} className="studio__value">
              <span className="studio__value-k">{v.k}</span>
              <h4 className="studio__value-t">{v.t}</h4>
              <p className="studio__value-d">{v.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
