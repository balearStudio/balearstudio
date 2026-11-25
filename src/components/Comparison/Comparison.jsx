import { useLanguage } from '../../i18n/LanguageContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './Comparison.css'

/**
 * Chat vs ToolDeck. A real <table> on desktop; under 700px each row
 * becomes a card and the column names come from data-label.
 */
export default function Comparison() {
  const { t } = useLanguage()
  const ref = useScrollReveal({ stagger: 0.08 })
  const rows = t('compare.rows')
  const colChat = t('compare.colChat')
  const colTool = t('compare.colTool')

  return (
    <section className="compare section" id="comparativa" ref={ref}>
      <div className="container">
        <span className="eyebrow reveal">{t('compare.eyebrow')}</span>
        <h2 className="compare__title reveal">{t('compare.title')}</h2>

        <table className="compare__table reveal">
          <thead>
            <tr>
              <td></td>
              <th scope="col">{colChat}</th>
              <th scope="col" className="compare__tool">{colTool}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                <td data-label={colChat}>{r.chat}</td>
                <td data-label={colTool} className="compare__tool">{r.tool}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="compare__note reveal">{t('compare.note')}</p>
      </div>
    </section>
  )
}
