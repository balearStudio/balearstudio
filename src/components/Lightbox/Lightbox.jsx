import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../../i18n/LanguageContext'
import './Lightbox.css'

const SWIPE_THRESHOLD = 80
const CLOSE_DURATION = 0.45

function directionBetween(from, to, length) {
  if (from === length - 1 && to === 0) return 1
  if (from === 0 && to === length - 1) return -1
  return to > from ? 1 : -1
}

/**
 * Full-screen screenshot gallery. Opens/closes with a FLIP transition
 * from the clicked thumbnail (originRect), slides between images (via
 * arrows, keyboard, or drag), and supports pointer-drag swiping that
 * continues seamlessly into the slide transition.
 */
export default function Lightbox({ images, name, index, originRect, onClose, onPrev, onNext }) {
  const { t } = useLanguage()
  const rootRef = useRef(null)
  const backdropRef = useRef(null)
  const stageRef = useRef(null)
  const mainImgRef = useRef(null)
  const incomingImgRef = useRef(null)
  const uiRef = useRef(null)

  const [display, setDisplay] = useState({ index, src: images[index] })
  const [transition, setTransition] = useState(null) // { index, src, direction, startX }
  const dragXRef = useRef(0)
  const draggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const closingRef = useRef(false)
  const hasOpenedRef = useRef(false)

  // Preload the rest of the gallery so navigation never shows a loading flash.
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [images])

  // Opening FLIP: grow from the clicked thumbnail into the stage's place.
  // useLayoutEffect (not useEffect) so the hidden starting state is set
  // before the browser paints — otherwise the full-size stage flashes
  // for one frame before the animation kicks in.
  //
  // Guarded with hasOpenedRef because React StrictMode double-invokes
  // effects on mount: gsap.fromTo's "from" state is applied synchronously,
  // so a second invocation would re-measure the stage AFTER it's already
  // been shrunk by the first one, producing a near-identity (invisible)
  // animation. The guard ensures only the first, correct measurement runs.
  useLayoutEffect(() => {
    if (hasOpenedRef.current) return
    hasOpenedRef.current = true
    const stage = stageRef.current

    if (originRect && stage) {
      const rect = stage.getBoundingClientRect()
      const scaleX = originRect.width / rect.width
      const scaleY = originRect.height / rect.height
      const x = originRect.left + originRect.width / 2 - (rect.left + rect.width / 2)
      const y = originRect.top + originRect.height / 2 - (rect.top + rect.height / 2)

      gsap.set(backdropRef.current, { autoAlpha: 0 })
      gsap.set(uiRef.current, { autoAlpha: 0 })
      gsap.fromTo(
        stage,
        { x, y, scaleX, scaleY, borderRadius: 8 },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 4, duration: 0.6, ease: 'power4.out' },
      )
      gsap.to(backdropRef.current, { autoAlpha: 1, duration: 0.45 })
      gsap.to(uiRef.current, { autoAlpha: 1, duration: 0.4, delay: 0.15 })
    } else {
      gsap.set(stage, { transformOrigin: '50% 50%' })
      gsap.from(stage, { scale: 0.94, opacity: 0, duration: 0.4, ease: 'power3.out' })
      gsap.from(backdropRef.current, { autoAlpha: 0, duration: 0.35 })
      gsap.from(uiRef.current, { autoAlpha: 0, duration: 0.35, delay: 0.1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const requestClose = () => {
    if (closingRef.current) return
    closingRef.current = true
    const stage = stageRef.current

    if (originRect && stage) {
      const rect = stage.getBoundingClientRect()
      const scaleX = originRect.width / rect.width
      const scaleY = originRect.height / rect.height
      const x = originRect.left + originRect.width / 2 - (rect.left + rect.width / 2)
      const y = originRect.top + originRect.height / 2 - (rect.top + rect.height / 2)

      gsap.to(stage, { x, y, scaleX, scaleY, borderRadius: 8, duration: CLOSE_DURATION, ease: 'power3.inOut' })
      gsap.to(backdropRef.current, { autoAlpha: 0, duration: CLOSE_DURATION * 0.8 })
      gsap.to(uiRef.current, { autoAlpha: 0, duration: 0.2 })
      gsap.delayedCall(CLOSE_DURATION, onClose)
    } else {
      gsap.to(rootRef.current, { autoAlpha: 0, duration: 0.25, onComplete: onClose })
    }
  }

  // React to index changes from the parent (arrow clicks, keyboard, or a
  // committed drag) by sliding the old image out and the new one in.
  useEffect(() => {
    if (index === display.index) return
    const direction = directionBetween(display.index, index, images.length)
    setTransition({ index, src: images[index], direction, startX: dragXRef.current })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  useEffect(() => {
    if (!transition) return
    const stageW = stageRef.current?.offsetWidth || 400
    const startX = transition.startX || 0

    gsap.set(mainImgRef.current, { x: startX, opacity: 1 - Math.min(Math.abs(startX) / stageW, 0.5) })
    gsap.set(incomingImgRef.current, { x: transition.direction * stageW * 0.4, opacity: 0 })

    const tl = gsap.timeline({
      onComplete: () => {
        // The incoming <img> unmounts once `transition` clears, handing
        // control back to mainImgRef — reset its inline styles first, or
        // it's left showing the new src at the old exit tween's
        // opacity:0/offset, i.e. permanently invisible.
        gsap.set(mainImgRef.current, { x: 0, opacity: 1 })
        setDisplay({ index: transition.index, src: transition.src })
        setTransition(null)
        dragXRef.current = 0
      },
    })
    tl.to(mainImgRef.current, {
      x: startX + transition.direction * stageW * 0.55,
      opacity: 0,
      duration: 0.24,
      ease: 'power2.in',
    }, 0)
    tl.to(incomingImgRef.current, { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, 0.05)
  }, [transition])

  // Guard against overlapping tweens from rapid double-clicks/key-repeats.
  const handlePrev = () => { if (!transition) onPrev() }
  const handleNext = () => { if (!transition) onNext() }

  // Body scroll lock — runs once for the lifetime of the modal.
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Keyboard nav — re-subscribes when `transition` changes so the guard
  // above always sees fresh state instead of a stale closure.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') requestClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transition])

  // Drag-to-swipe -----------------------------------------------------
  const onPointerDown = (e) => {
    if (transition) return
    draggingRef.current = true
    dragStartXRef.current = e.clientX
    gsap.killTweensOf(mainImgRef.current)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    const delta = e.clientX - dragStartXRef.current
    dragXRef.current = delta
    const stageW = stageRef.current?.offsetWidth || 400
    gsap.set(mainImgRef.current, {
      x: delta,
      opacity: 1 - Math.min(Math.abs(delta) / stageW, 1) * 0.45,
    })
  }

  const endDrag = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    const delta = dragXRef.current

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0) onNext()
      else onPrev()
    } else {
      dragXRef.current = 0
      gsap.to(mainImgRef.current, { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out' })
    }
  }

  const showIncoming = !!transition

  return (
    <div className="lightbox" ref={rootRef}>
      <div className="lightbox__backdrop" ref={backdropRef} onClick={requestClose} />

      <div className="lightbox__ui" ref={uiRef}>
        <button className="lightbox__close" onClick={requestClose} aria-label={t('work.galleryClose')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <button className="lightbox__nav lightbox__nav--prev" onClick={handlePrev} aria-label={t('work.galleryPrev')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="lightbox__nav lightbox__nav--next" onClick={handleNext} aria-label={t('work.galleryNext')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="lightbox__caption">
          <span>{name}</span>
          <span className="lightbox__count">{index + 1} / {images.length}</span>
        </div>
      </div>

      <div
        className="lightbox__stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => { if (e.buttons === 1) endDrag() }}
      >
        <img
          ref={mainImgRef}
          src={display.src}
          alt={`${name} — ${display.index + 1}/${images.length}`}
          className="lightbox__img"
          draggable={false}
        />
        {showIncoming && (
          <img
            ref={incomingImgRef}
            src={transition.src}
            alt=""
            aria-hidden="true"
            className="lightbox__img"
            draggable={false}
          />
        )}
      </div>
    </div>
  )
}
