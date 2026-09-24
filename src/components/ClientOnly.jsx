import { useEffect, useState } from 'react'

/** Renders children only in the browser, after hydration. Keeps widgets that
 *  are no use to crawlers (the chat launcher) out of the prerendered HTML. */
export default function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted ? children : null
}
