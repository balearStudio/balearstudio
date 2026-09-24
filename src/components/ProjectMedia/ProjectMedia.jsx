import { useEffect, useRef, useState } from 'react'
import { responsiveImage } from '../../data/asset'
import './ProjectMedia.css'

/**
 * Project cover. The optimised <picture> (AVIF → WebP) is always the base
 * layer, so the box never has an empty state. If the project has a video it
 * is laid over the image: it loads nothing until scrolled into view
 * (preload="none"), plays while at least half visible and pauses when it
 * leaves, and only fades in once frames are actually playing.
 *
 * `priority` marks the image as the page's likely LCP element: eager instead
 * of lazy, and fetched first.
 */
export default function ProjectMedia({ media, name, sizes, priority = false }) {
  const { cover, coverSize, video, poster } = media
  const img = responsiveImage(cover, coverSize[0])
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  // Read after mount: the prerendered HTML can't know the visitor's preference,
  // and reading it during render would mismatch on hydration.
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  const showVideo = video && !reducedMotion

  useEffect(() => {
    const el = videoRef.current
    if (!showVideo || !el) return
    // React doesn't set the `muted` property on hydrated elements, and autoplay
    // is only allowed for muted media.
    el.muted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [showVideo])

  return (
    <>
      <picture>
        <source type="image/avif" srcSet={img.avifSrcSet} sizes={sizes} />
        <source type="image/webp" srcSet={img.webpSrcSet} sizes={sizes} />
        <img
          src={img.src}
          alt={name}
          width={coverSize[0]}
          height={coverSize[1]}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : undefined}
          decoding="async"
          className="project__media-img"
        />
      </picture>
      {showVideo && (
        <video
          ref={videoRef}
          className={`project__media-img project__media-video${playing ? ' is-playing' : ''}`}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
        >
          <source src={video.replace(/\.mp4$/, '.webm')} type="video/webm" />
          <source src={video} type="video/mp4" />
        </video>
      )}
    </>
  )
}
