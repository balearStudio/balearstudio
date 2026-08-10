import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import './Chat.css'

// Cloudflare Worker backing the assistant. It is CORS-locked to an allowlist of
// origins held in the Worker itself: the balearstudio.com apex and www, plus
// http://localhost:5173 for `npm run dev`. Requests from any other origin are
// blocked by the browser, so a new preview URL or dev port needs adding there.
const WORKER_URL = 'https://icy-sunset-3812.spanishairsoft.workers.dev'

/* The Worker's success shape isn't guaranteed, so pull the reply text out of
   whatever common shape comes back (plain string, {reply|response|content|
   message}, or an OpenAI/Anthropic-style body). Returns '' if nothing usable. */
function extractReply(data) {
  if (typeof data === 'string') return data
  if (!data || typeof data !== 'object') return ''
  const direct = data.reply ?? data.response ?? data.message ?? data.content ?? data.text
  if (typeof direct === 'string') return direct
  // Anthropic-style: content is an array of blocks with `.text`.
  if (Array.isArray(direct)) {
    const joined = direct.map((b) => b?.text ?? '').join('').trim()
    if (joined) return joined
  }
  // OpenAI-style: choices[0].message.content
  const choice = data.choices?.[0]?.message?.content
  if (typeof choice === 'string') return choice
  return ''
}

export default function Chat() {
  const { t, lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([]) // { role: 'user' | 'assistant', content }
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const listRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to the newest message and keep focus on the input.
  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Close on Escape while the panel is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Lock body scroll while open — the panel goes full-screen on mobile,
  // so the page scrolling underneath would otherwise fight it.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  async function send(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Worker contract: each message is { role: 'user' | 'model', text },
        // plus the active UI language so it can default replies accordingly.
        body: JSON.stringify({
          lang,
          messages: nextMessages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            text: m.content,
          })),
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json().catch(() => null)
      const reply = extractReply(data)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply || t('chat.error') },
      ])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: t('chat.error') }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat">
      {/* Panel */}
      <div
        className={`chat__panel${open ? ' is-open' : ''}`}
        role="dialog"
        aria-label={t('chat.title')}
        aria-hidden={!open}
      >
        <header className="chat__head">
          <div className="chat__head-text">
            <span className="chat__title">{t('chat.title')}</span>
            <span className="chat__subtitle">
              <span className="chat__dot" aria-hidden="true" />
              {t('chat.subtitle')}
            </span>
          </div>
          <button
            type="button"
            className="chat__icon-btn"
            onClick={() => setOpen(false)}
            aria-label={t('chat.close')}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="chat__log" ref={listRef}>
          <div className="chat__msg chat__msg--bot">{t('chat.greeting')}</div>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`chat__msg ${m.role === 'user' ? 'chat__msg--user' : 'chat__msg--bot'}`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="chat__msg chat__msg--bot chat__typing" aria-label="…">
              <span></span><span></span><span></span>
            </div>
          )}
        </div>

        <form className="chat__form" onSubmit={send}>
          <input
            ref={inputRef}
            type="text"
            className="chat__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.placeholder')}
            aria-label={t('chat.placeholder')}
            autoComplete="off"
          />
          <button
            type="submit"
            className="chat__send"
            disabled={loading || !input.trim()}
            aria-label={t('chat.send')}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 9h12M9 4l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>

      {/* Launcher */}
      <button
        type="button"
        className={`chat__launch${open ? ' is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
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
