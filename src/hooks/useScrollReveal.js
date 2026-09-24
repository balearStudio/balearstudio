import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Reveals every `.reveal` element inside the returned ref as it scrolls
 * into view — a soft fade + rise, staggered for grouped items.
 *
 * Uses an IntersectionObserver rather than GSAP's ScrollTrigger plugin: the
 * plugin cost ~15 kB of JavaScript on every page for what is a one-shot reveal.
 *
 * @param {object} [opts]
 * @param {number} [opts.y=28]        starting vertical offset (px)
 * @param {number} [opts.stagger=0.08] delay between grouped children
 * @param {number} [opts.start=82]    how far down the viewport (%) an element's
 *                                    top must reach before it reveals
 */
export function useScrollReveal(opts = {}) {
  const ref = useRef(null)
  const { y = 28, stagger = 0.08, start = 82 } = opts

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) {
      gsap.set(root.querySelectorAll('.reveal'), { opacity: 1, y: 0 })
      gsap.set(root.querySelectorAll('[data-reveal-group] > *'), { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.reveal', root)
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            observer.unobserve(entry.target)
            // ctx.add keeps the tween inside the context, so ctx.revert() cleans it up.
            ctx.add(() => play(entry.target))
          })
        },
        // Shrinking the bottom edge makes "enters the viewport" mean "reaches
        // `start`% down it", like ScrollTrigger's 'top 82%'.
        { rootMargin: `0px 0px -${100 - start}% 0px` },
      )

      function play(el) {
        // Grouped items (data-reveal-group) share a staggered timeline.
        const groupItems = el.hasAttribute('data-reveal-group')
          ? gsap.utils.toArray(':scope > *', el)
          : null
        gsap.to(groupItems || el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: groupItems ? stagger : 0,
        })
      }

      // Hide everything up front, then reveal on entry.
      targets.forEach((el) => {
        const groupItems = el.hasAttribute('data-reveal-group')
          ? gsap.utils.toArray(':scope > *', el)
          : null
        gsap.set(groupItems || el, { autoAlpha: 0, y })
        observer.observe(el)
      })

      return () => observer.disconnect()
    }, root)

    return () => ctx.revert()
  }, [y, stagger, start])

  return ref
}
