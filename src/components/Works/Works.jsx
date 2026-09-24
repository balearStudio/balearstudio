import { useEffect, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { projects } from '../../data/projects'
import Lightbox from '../Lightbox/Lightbox'
import './Works.css'


/**
 * Card thumbnail. Plays `video` if the project has one and it loads
 * successfully; otherwise falls back to the static image. The video's
 * own `poster` shows the same image until real frames are ready, so
 * there's no separate loading state to juggle — only a genuine load
 * failure (onError) switches to the plain <img>.
 */
function ProjectMedia({ video, image, name }) {
  const [videoFailed, setVideoFailed] = useState(false)
  // Read after mount: the prerendered HTML can't know the visitor's preference,
  // and reading it during render would mismatch on hydration.
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  const showVideo = video && !reducedMotion && !videoFailed

  return showVideo ? (
    <video
      className="project__media-img"
      src={video}
      poster={image}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onError={() => setVideoFailed(true)}
    />
  ) : (
    <img src={image} alt={name} loading="lazy" className="project__media-img" />
  )
}

// Placeholder projects have no media yet (P2); keep them out of the list until they do.
const visibleProjects = projects.filter((p) => p.media.gallery.length > 0)

export default function Works() {
  const { t, lang } = useLanguage()
  const ref = useScrollReveal({ stagger: 0.12 })
  const [openKey, setOpenKey] = useState(null)
  const [openIndex, setOpenIndex] = useState(0)
  const [originRect, setOriginRect] = useState(null)

  // The lightbox always grows from the thumbnail image, whether the click
  // came from the image itself or the "Ver capturas" text button.
  const openGallery = (slug, index, triggerEl) => {
    const box = triggerEl?.closest('.project')?.querySelector('.project__media-box')
    setOriginRect(box ? box.getBoundingClientRect() : null)
    setOpenKey(slug)
    setOpenIndex(index)
  }
  const closeGallery = () => setOpenKey(null)

  const activeProject = visibleProjects.find((p) => p.slug === openKey)
  const gallery = activeProject?.media.gallery

  return (
    <section className="works section" id="work" ref={ref}>
      <div className="container">
        <header className="works__head reveal" data-reveal-group>
          <span className="eyebrow">{t('work.eyebrow')}</span>
          <h2 className="works__title">{t('work.title')}</h2>
          <p className="works__intro">{t('work.intro')}</p>
        </header>

        <ul className="works__list">
          {visibleProjects.map((p, i) => {
            const { name, category: cat, description: desc } = p.copy[lang]
            const hasGallery = p.media.gallery.length > 1

            return (
              <li className="works__item reveal" key={p.slug}>
                <div className="project">
                  <div className="project__index">{String(i + 1).padStart(2, '0')}</div>

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

                      {p.status === 'private' ? (
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
                      ) : p.status === 'live' ? (
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
                      ) : null}

                      {hasGallery && (
                        <button
                          type="button"
                          className="project__gallery-btn"
                          onClick={(e) => openGallery(p.slug, 0, e.currentTarget)}
                        >
                          {t('work.gallery')}
                          <span className="project__gallery-count">{p.media.gallery.length}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="project__media"
                    onClick={(e) => openGallery(p.slug, 0, e.currentTarget)}
                    aria-label={`${t('work.gallery')} — ${name}`}
                  >
                    <span className="project__media-box">
                      <ProjectMedia
                        video={p.media.video}
                        image={p.media.poster ?? p.media.cover}
                        name={name}
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
          images={gallery}
          name={activeProject.copy[lang].name}
          index={openIndex}
          originRect={originRect}
          onClose={closeGallery}
          onPrev={() => setOpenIndex((i) => (i - 1 + gallery.length) % gallery.length)}
          onNext={() => setOpenIndex((i) => (i + 1) % gallery.length)}
        />
      )}
    </section>
  )
}
