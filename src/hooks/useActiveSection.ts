import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently crossing the middle of the viewport (same band as the
 * live site: rootMargin -45% top / -50% bottom), limited to the ids passed in. Null when none.
 *
 * Sections can contain merged parts (e.g. #tools inside #expertise). All intersecting sections are
 * tracked and the innermost / last one in document order wins, so the part is active while it is in
 * the band and its parent is active for the rest of the parent section.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const wanted = new Set(key.split('|'))
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
    const inBand = new Set<HTMLElement>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) inBand.add(el)
          else inBand.delete(el)
        }
        const current = sections.filter((s) => inBand.has(s)).pop()
        setActive(current && wanted.has(current.id) ? current.id : null)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [key])

  return active
}
