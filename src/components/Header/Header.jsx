import { useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import { useLanguage } from '../../i18n/LanguageContext'
import { homePath } from '../../routes'
import './Header.css'

export default function Header() {
  const { t, lang, slug } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // On a case study the sections live on the home page.
  const base = slug ? homePath(lang) : ''
  const links = [
    { href: `${base}#work`, label: t('nav.work') },
    { href: `${base}#studio`, label: t('nav.studio') },
    { href: `${base}#contact`, label: t('nav.contact') },
  ]

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`header ${scrolled || menuOpen ? 'header--scrolled' : ''}`}>
      <div className="header__inner container">
        <Logo onClick={closeMenu} />

        <nav className="header__nav" aria-label={t('a11y.navMain')}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="header__link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header__right">
          <LanguageSwitcher />
          <button
            className={`header__burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t('a11y.menuClose') : t('a11y.menuOpen')}
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <div className={`header__mobile ${menuOpen ? 'is-open' : ''}`}>
        <nav className="header__mobile-nav" aria-label={t('a11y.navMobile')}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={closeMenu}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="header__mobile-lang">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
