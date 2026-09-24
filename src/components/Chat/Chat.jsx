import { lazy, Suspense, useCallback, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import './Chat.css'

// The chat window (message state, Worker call) is a separate chunk: only the
// launcher button ships with the page. The chunk is fetched when the launcher
// is hovered, focused or clicked, whichever comes first.
const loadPanel = () => import('./ChatPanel')
const ChatPanel = lazy(loadPanel)

export default function Chat() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  // Stays true after the first open so the conversation survives closing.
  const [everOpened, setEverOpened] = useState(false)

  const close = useCallback(() => setOpen(false), [])
  const toggle = () => {
    setEverOpened(true)
    setOpen((v) => !v)
  }

  return (
    <div className="chat">
      {everOpened && (
        <Suspense fallback={null}>
          <ChatPanel open={open} onClose={close} />
        </Suspense>
      )}

      <button
        type="button"
        className={`chat__launch${open ? ' is-open' : ''}`}
        onClick={toggle}
        onPointerEnter={loadPanel}
        onFocus={loadPanel}
        aria-label={open ? t('chat.close') : t('chat.launch')}
        aria-expanded={open}
      >
        <svg className="chat__launch-open" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4 3.5V16H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <svg className="chat__launch-close" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
