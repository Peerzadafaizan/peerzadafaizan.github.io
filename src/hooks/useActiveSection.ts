import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently crossing the middle of the viewport (same band as the
 * live site: rootMargin -45% top / -50% bottom), limited to the ids passed in. Null when none.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const wanted = new Set(key.split('|'))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          setActive(wanted.has(id) ? id : null)
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    document.querySelectorAll('main section[id]').forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [key])

  return active
}
