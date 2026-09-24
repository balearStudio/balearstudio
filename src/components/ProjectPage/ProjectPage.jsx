import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { responsiveImage } from '../../data/asset'
import { publicProjects } from '../../data/projects'
import { homePath, projectPath } from '../../routes'
import Lightbox from '../Lightbox/Lightbox'
import ProjectMedia from '../ProjectMedia/ProjectMedia'
import VisitArrow from '../VisitArrow/VisitArrow'
import Contact from '../Contact/Contact'
import './ProjectPage.css'

const HERO_SIZES = '(min-width: 1280px) 1184px, 100vw'
const SHOT_SIZES = '(min-width: 900px) 520px, 100vw'

/** Case-study page for one project: hero media, facts, challenge → solution →
 *  result (when written), gallery, the next project and the contact block. */
export default function ProjectPage({ slug }) {
  const { t, lang } = useLanguage()
  const ref = useScrollReveal({ stagger: 0.1 })
  const [openIndex, setOpenIndex] = useState(null)
  const [originRect, setOriginRect] = useState(null)

  const project = publicProjects.find((p) => p.slug === slug)
  const position = publicProjects.indexOf(project)
  const next = publicProjects[(position + 1) % publicProjects.length]

  const { name, category, summary, description, challenge, solution, result } = project.copy[lang]
  const { gallery, gallerySizes } = project.media
  const story = [
    ['challenge', challenge],
    ['solution', solution],
    ['result', result],
  ].filter(([, text]) => text)

  const facts = [
    ['sector', t(`work.case.sectors.${project.sector}`)],
    ['year', project.year],
    ['servicesLabel', project.services.map((s) => t(`work.services.${s}`)).join(', ')],
    ['stackLabel', project.stack.join(', ')],
  ].filter(([, value]) => value)

  // The lightbox grows from the image that was clicked.
  const openGallery = (index, triggerEl) => {
    const img = triggerEl.querySelector('img')
    setOriginRect(img ? img.getBoundingClientRect() : null)
    setOpenIndex(index)
  }

  return (
    <article className="case" ref={ref}>
      <div className="container">
        <nav className="case__crumbs" aria-label={t('work.case.breadcrumb')}>
          <ol>
            <li>
              <a href={homePath(lang)}>balearSTUDIO</a>
            </li>
            <li>
              <a href={`${homePath(lang)}#work`}>{t('nav.work')}</a>
            </li>
            <li aria-current="page">{name}</li>
          </ol>
        </nav>

        <header className="case__head">
          <span className="eyebrow">{category}</span>
          <h1 className="case__title">{name}</h1>
          <p className="case__lead">{summary}</p>
          <div className="case__status">
            {project.status === 'live' && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="case__visit">
                {t('work.visit')}
                <VisitArrow />
              </a>
            )}
            {project.status === 'preview' && <span className="case__soon">{t('work.comingSoon')}</span>}
          </div>
        </header>

        <button
          type="button"
          className="case__media"
          onClick={(e) => openGallery(0, e.currentTarget)}
          aria-label={`${t('work.gallery')} — ${name}`}
        >
          <span className="project__media-box">
            <ProjectMedia media={project.media} name={name} sizes={HERO_SIZES} priority />
          </span>
        </button>

        <div className="case__intro reveal">
          <p className="case__desc">{description}</p>
          <dl className="case__facts">
            {facts.map(([key, value]) => (
              <div key={key} className="case__fact">
                <dt>{t(`work.case.${key}`)}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {story.length > 0 && (
          <div className="case__story">
            {story.map(([key, text]) => (
              <section key={key} className="case__step reveal">
                <h2 className="case__step-title">{t(`work.case.${key}`)}</h2>
                <p>{text}</p>
              </section>
            ))}
          </div>
        )}

        {gallery.length > 1 && (
          <section className="case__screens reveal">
            <h2 className="eyebrow">{t('work.case.screens')}</h2>
            <ul className="case__shots">
              {gallery.slice(1).map((src, i) => {
                const index = i + 1
                const [width, height] = gallerySizes[index]
                const img = responsiveImage(src, width)
                return (
                  <li
                    key={src}
                    className={`case__shot${height > width ? ' case__shot--tall' : ''}`}
                    style={{ flexGrow: width / height }}
                  >
                    <button
                      type="button"
                      onClick={(e) => openGallery(index, e.currentTarget)}
                      aria-label={`${t('work.gallery')} — ${name} ${index + 1}/${gallery.length}`}
                    >
                      <picture>
                        <source type="image/avif" srcSet={img.avifSrcSet} sizes={SHOT_SIZES} />
                        <source type="image/webp" srcSet={img.webpSrcSet} sizes={SHOT_SIZES} />
                        <img
                          src={img.src}
                          alt={`${name} — ${index + 1}/${gallery.length}`}
                          width={width}
                          height={height}
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {next && next.slug !== project.slug && (
          <a href={projectPath(lang, next.slug)} className="case__next reveal">
            <span className="eyebrow">{t('work.case.next')}</span>
            <span className="case__next-name">
              {next.copy[lang].name}
              <svg width="28" height="28" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="case__next-cat">{next.copy[lang].category}</span>
          </a>
        )}
      </div>

      <Contact />

      {openIndex !== null && (
        <Lightbox
          images={gallery}
          name={name}
          index={openIndex}
          originRect={originRect}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((i) => (i - 1 + gallery.length) % gallery.length)}
          onNext={() => setOpenIndex((i) => (i + 1) % gallery.length)}
        />
      )}
    </article>
  )
}
