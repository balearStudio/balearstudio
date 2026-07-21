import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Reveals every `.reveal` element inside the returned ref as it scrolls
 * into view — a soft fade + rise, staggered for grouped items.
 *
 * @param {object} [opts]
 * @param {number} [opts.y=28]        starting vertical offset (px)
 * @param {number} [opts.stagger=0.08] delay between grouped children
 * @param {string} [opts.start]       ScrollTrigger start position
 */
export function useScrollReveal(opts = {}) {
  const ref = useRef(null)
  const { y = 28, stagger = 0.08, start = 'top 82%' } = opts

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) {
      gsap.set(root.querySelectorAll('.reveal'), { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.reveal', root)
      targets.forEach((el) => {
        // Grouped items (data-reveal-group) share a staggered timeline.
        const groupItems = el.hasAttribute('data-reveal-group')
          ? gsap.utils.toArray(':scope > *', el)
          : null

        gsap.fromTo(
          groupItems || el,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: groupItems ? stagger : 0,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: 'play none none none',
            },
          },
        )
      })
    }, root)

    return () => ctx.revert()
  }, [y, stagger, start])

  return ref
}
