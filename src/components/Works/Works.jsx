import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { projects } from '../../data/projects'
import Lightbox from '../Lightbox/Lightbox'
import './Works.css'

export default function Works() {
  const { t } = useLanguage()
  const ref = useScrollReveal({ stagger: 0.12 })
  const [openKey, setOpenKey] = useState(null)
  const [openIndex, setOpenIndex] = useState(0)

  const openGallery = (key, index = 0) => {
    setOpenKey(key)
    setOpenIndex(index)
  }
  const closeGallery = () => setOpenKey(null)

  const activeProject = projects.find((p) => p.key === openKey)

  return (
    <section className="works section" id="work" ref={ref}>
      <div className="container">
        <header className="works__head reveal" data-reveal-group>
          <span className="eyebrow">{t('work.eyebrow')}</span>
          <h2 className="works__title">{t('work.title')}</h2>
          <p className="works__intro">{t('work.intro')}</p>
        </header>

        <ul className="works__list">
          {projects.map((p) => {
            const name = t(`work.items.${p.key}.name`)
            const cat = t(`work.items.${p.key}.category`)
            const desc = t(`work.items.${p.key}.desc`)
            const hasGallery = p.images.length > 1

            return (
              <li className="works__item reveal" key={p.key}>
                <div className="project">
                  <div className="project__index">{p.index}</div>

                  <div className="project__main">
                    <div className="project__heading">
                      <h3 className="project__name">
                        {p.url ? (
                          <a href={p.url} target="_blank" rel="noopener noreferrer">
                            {name}
                          </a>
                        ) : (
                          name
                        )}
                      </h3>
                      <span className="project__year">{p.year}</span>
                    </div>
                    <p className="project__desc">{desc}</p>

                    <div className="project__meta">
                      <span className="project__category">{cat}</span>

                      {p.private ? (
                        <span className="project__lock" tabIndex={0}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
                          </svg>
                          {t('work.privateLabel')}
                          <span className="project__tooltip" role="tooltip">
                            {t('work.privateHint')}
                          </span>
                        </span>
                      ) : (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project__visit"
                        >
                          {t('work.visit')}
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M4 12L12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      )}

                      {hasGallery && (
                        <button
                          type="button"
                          className="project__gallery-btn"
                          onClick={() => openGallery(p.key, 0)}
                        >
                          {t('work.gallery')}
                          <span className="project__gallery-count">{p.images.length}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="project__media"
                    onClick={() => openGallery(p.key, 0)}
                    aria-label={`${t('work.gallery')} — ${name}`}
                  >
                    <span className="project__media-box">
                      <img
                        src={p.images[0]}
                        alt={name}
                        loading="lazy"
                        className="project__media-img"
                      />
                    </span>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {activeProject && (
        <Lightbox
          images={activeProject.images}
          name={t(`work.items.${activeProject.key}.name`)}
          index={openIndex}
          onClose={closeGallery}
          onPrev={() =>
            setOpenIndex((i) => (i - 1 + activeProject.images.length) % activeProject.images.length)
          }
          onNext={() => setOpenIndex((i) => (i + 1) % activeProject.images.length)}
        />
      )}
    </section>
  )
}
