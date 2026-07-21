import { useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import './Lightbox.css'

/**
 * Full-screen screenshot gallery. Controlled by the parent: receives the
 * active project's images/name/index and calls back to change/close.
 */
export default function Lightbox({ images, name, index, onClose, onPrev, onNext }) {
  const { t } = useLanguage()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div className="lightbox" onClick={onClose}>
      <button
        className="lightbox__close"
        onClick={onClose}
        aria-label={t('work.galleryClose')}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <button
        className="lightbox__nav lightbox__nav--prev"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label={t('work.galleryPrev')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <figure className="lightbox__stage" onClick={(e) => e.stopPropagation()}>
        <img src={images[index]} alt={`${name} — ${index + 1}/${images.length}`} className="lightbox__img" />
        <figcaption className="lightbox__caption">
          <span>{name}</span>
          <span className="lightbox__count">{index + 1} / {images.length}</span>
        </figcaption>
      </figure>

      <button
        className="lightbox__nav lightbox__nav--next"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label={t('work.galleryNext')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
