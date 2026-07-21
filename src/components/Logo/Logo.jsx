import './Logo.css'

/**
 * balearSTUDIO wordmark.
 * "balear" lowercase + "STUDIO" uppercase bold, wide letter-spacing.
 */
export default function Logo({ onClick, className = '' }) {
  return (
    <a
      href="#top"
      onClick={onClick}
      className={`logo ${className}`}
      aria-label="balearSTUDIO — inicio"
    >
      <span className="logo__balear">balear</span>
      <span className="logo__studio">STUDIO</span>
    </a>
  )
}
