import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { EMAIL, demoMailto } from '../../data/tooldeck'
import './Contact.css'

/* Demo request. No backend: both links open the visitor's mail client
   with the subject and a short template already filled in. */
export default function Contact() {
  const { t } = useLanguage()
  const ref = useScrollReveal({ stagger: 0.1 })
  const mailto = demoMailto(t)

  return (
    <section className="contact section" id="contact" ref={ref}>
      <div className="container contact__inner">
        <span className="eyebrow reveal">{t('contact.eyebrow')}</span>

        <h2 className="contact__title reveal">{t('contact.title')}</h2>
        <p className="contact__body reveal">{t('contact.body')}</p>

        <a href={mailto} className="btn-primary contact__cta reveal">
          <span>{t('contact.cta')}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <p className="contact__or reveal">
          {t('contact.or')}{' '}
          <a href={mailto} className="contact__mail">
            <span className="contact__mail-text">{EMAIL}</span>
            <span className="contact__mail-underline" aria-hidden="true"></span>
          </a>
        </p>
      </div>
    </section>
  )
}
