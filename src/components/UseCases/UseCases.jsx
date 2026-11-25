import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './UseCases.css'

export default function UseCases() {
  const { t } = useLanguage()
  const ref = useScrollReveal({ stagger: 0.08 })
  const departments = t('cases.departments')
  const packs = t('cases.packs')

  return (
    <section className="cases section" id="casos" ref={ref}>
      <div className="container">
        <span className="eyebrow reveal">{t('cases.eyebrow')}</span>
        <h2 className="cases__title reveal">{t('cases.title')}</h2>

        {/* By department — ruled rows, like the Works list */}
        <ul className="cases__depts reveal" data-reveal-group>
          {departments.map((d) => (
            <li key={d.name} className="cases__dept">
              <h3 className="cases__dept-name">{d.name}</h3>
              <p className="cases__dept-text">{d.text}</p>
            </li>
          ))}
        </ul>

        {/* ToolBox packs */}
        <div className="cases__packs-head reveal">
          <h3 className="cases__packs-title">{t('cases.packsTitle')}</h3>
          <p className="cases__packs-body">{t('cases.packsBody')}</p>
        </div>

        <ul className="cases__packs reveal" data-reveal-group>
          {packs.map((p) => (
            <li key={p.name} className="cases__pack">
              <span className="cases__pack-label">Pack</span>
              <h4 className="cases__pack-name">{p.name}</h4>
              <ul className="cases__pack-tools">
                {p.tools.map((tool) => (
                  <li key={tool}>
                    <span className="cases__dot" aria-hidden="true"></span>
                    {tool}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="cases__own reveal">{t('cases.own')}</p>
      </div>
    </section>
  )
}
