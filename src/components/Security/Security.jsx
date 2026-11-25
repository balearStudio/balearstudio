import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { usageShot } from '../../data/tooldeck'
import Screenshot from '../Screenshot/Screenshot'
import './Security.css'

export default function Security() {
  const { t } = useLanguage()
  const ref = useScrollReveal({ stagger: 0.08 })
  const items = t('security.items')

  return (
    <section className="security section" id="seguridad" ref={ref}>
      <div className="container">
        <span className="eyebrow reveal">{t('security.eyebrow')}</span>
        <h2 className="security__title reveal">{t('security.title')}</h2>

        <div className="security__grid">
          <ul className="security__list reveal" data-reveal-group>
            {items.map((item) => (
              <li key={item.t} className="security__item">
                <h3 className="security__item-t">{item.t}</h3>
                <p className="security__item-d">{item.d}</p>
              </li>
            ))}
          </ul>

          <div className="security__shot reveal">
            <Screenshot
              src={usageShot}
              alt={t('security.alt')}
              caption={t('security.caption')}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
