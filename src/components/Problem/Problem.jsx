import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './Problem.css'

export default function Problem() {
  const { t } = useLanguage()
  const ref = useScrollReveal({ stagger: 0.1 })
  const items = t('problem.items')

  return (
    <section className="problem section" id="problema" ref={ref}>
      <div className="container">
        <span className="eyebrow reveal">{t('problem.eyebrow')}</span>
        <h2 className="problem__title reveal">{t('problem.title')}</h2>

        <ol className="problem__list reveal" data-reveal-group>
          {items.map((item, i) => (
            <li key={item.t} className="problem__item">
              <span className="problem__k">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="problem__item-t">{item.t}</h3>
              <p className="problem__item-d">{item.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
