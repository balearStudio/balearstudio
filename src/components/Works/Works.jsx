import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { responsiveImage } from '../../data/asset'
import { projects } from '../../data/projects'
import Lightbox from '../Lightbox/Lightbox'
import './Works.css'

const IMAGE_SIZES = {
  lead: '(min-width: 900px) 680px, 100vw',
  featured: '(min-width: 900px) 560px, 100vw',
  compact: '(min-width: 1000px) 280px, (min-width: 600px) 45vw, 100vw',
}

/**
 * Card thumbnail. The optimised <picture> (AVIF → WebP) is always the base
 * layer, so the card never has an empty state. If the project has a video it
 * is laid over the image: it loads nothing until scrolled into view
 * (preload="none"), plays while at least half visible and pauses when it
 * leaves, and only fades in once frames are actually playing.
 */
function ProjectMedia({ media, name, sizes }) {
  const { cover, coverSize, video, poster } = media
  const img = responsiveImage(cover, coverSize[0])
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  // Read after mount: the prerendered HTML can't know the visitor's preference,
  // and reading it during render would mismatch on hydration.
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  const showVideo = video && !reducedMotion

  useEffect(() => {
    const el = videoRef.current
    if (!showVideo || !el) return
    // React doesn't set the `muted` property on hydrated elements, and autoplay
    // is only allowed for muted media.
    el.muted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [showVideo])

  return (
    <>
      <picture>
        <source type="image/avif" srcSet={img.avifSrcSet} sizes={sizes} />
        <source type="image/webp" srcSet={img.webpSrcSet} sizes={sizes} />
        <img
          src={img.src}
          alt={name}
          width={coverSize[0]}
          height={coverSize[1]}
          loading="lazy"
          decoding="async"
          className="project__media-img"
        />
      </picture>
      {showVideo && (
        <video
          ref={videoRef}
          className={`project__media-img project__media-video${playing ? ' is-playing' : ''}`}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
        >
          <source src={video.replace(/\.mp4$/, '.webm')} type="video/webm" />
          <source src={video} type="video/mp4" />
        </video>
      )}
    </>
  )
}

function VisitArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 12L12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Status decides the call to action (D1): live → link, preview → "Coming soon"
// badge and never a link, private → lock with tooltip.
function ProjectStatus({ project, t }) {
  if (project.status === 'private') {
    return (
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
    )
  }
  if (project.status === 'live') {
    return (
      <a href={project.url} target="_blank" rel="noopener noreferrer" className="project__visit">
        {t('work.visit')}
        <VisitArrow />
      </a>
    )
  }
  return <span className="project__soon">{t('work.comingSoon')}</span>
}

function ProjectCard({ project, variant, index, sizes, onOpen }) {
  const { t, lang } = useLanguage()
  const { name, category, description, summary } = project.copy[lang]
  const hasGallery = project.media.gallery.length > 1
  const isCompact = variant === 'compact'

  return (
    <li className="works__item reveal">
      <article className={`project project--${variant}`}>
        <button
          type="button"
          className="project__media"
          onClick={(e) => onOpen(project.slug, 0, e.currentTarget)}
          aria-label={`${t('work.gallery')} — ${name}`}
        >
          <span className="project__media-box">
            <ProjectMedia media={project.media} name={name} sizes={sizes} />
          </span>
        </button>

        <div className="project__main">
          <div className="project__heading">
            {!isCompact && (
              <span className="project__index">{String(index + 1).padStart(2, '0')}</span>
            )}
            <h3 className="project__name">
              {project.status === 'live' ? (
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              ) : (
                name
              )}
            </h3>
            <span className="project__year">{project.year}</span>
          </div>
          <p className="project__desc">{isCompact ? summary : description}</p>

          <div className="project__meta">
            <span className="project__category">{category}</span>
            <ProjectStatus project={project} t={t} />
            {hasGallery && (
              <button
                type="button"
                className="project__gallery-btn"
                onClick={(e) => onOpen(project.slug, 0, e.currentTarget)}
              >
                {t('work.gallery')}
                <span className="project__gallery-count">{project.media.gallery.length}</span>
              </button>
            )}
          </div>
        </div>
      </article>
    </li>
  )
}

// Projects without media can't be shown; the rest are split by the `featured` flag.
const shown = projects.filter((p) => p.media.gallery.length > 0)
const featured = shown.filter((p) => p.featured)
const others = shown.filter((p) => !p.featured)

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

  const activeProject = shown.find((p) => p.slug === openKey)
  const gallery = activeProject?.media.gallery

  return (
    <section className="works section" id="work" ref={ref}>
      <div className="container">
        <header className="works__head reveal" data-reveal-group>
          <span className="eyebrow">{t('work.eyebrow')}</span>
          <h2 className="works__title">{t('work.title')}</h2>
          <p className="works__intro">{t('work.intro')}</p>
        </header>

        <ul className="works__featured">
          {featured.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              variant={i === 0 ? 'lead' : 'featured'}
              index={i}
              sizes={i === 0 ? IMAGE_SIZES.lead : IMAGE_SIZES.featured}
              onOpen={openGallery}
            />
          ))}
        </ul>

        {others.length > 0 && (
          <>
            <h3 className="works__more reveal">{t('work.moreTitle')}</h3>
            <ul className="works__grid">
              {others.map((p, i) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  variant="compact"
                  index={featured.length + i}
                  sizes={IMAGE_SIZES.compact}
                  onOpen={openGallery}
                />
              ))}
            </ul>
          </>
        )}
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
