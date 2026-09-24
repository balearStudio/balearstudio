const done = new Set()

/** Hints the browser to fetch a page it is likely to open next. Called on
 *  hover / focus of a link, so the case-study HTML is usually cached by the
 *  time it is clicked. Each URL is only hinted once. */
export function prefetch(href) {
  if (typeof document === 'undefined' || done.has(href)) return
  done.add(href)
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}
