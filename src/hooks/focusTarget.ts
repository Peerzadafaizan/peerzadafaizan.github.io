/**
 * After an in-page link is followed, move keyboard focus to the target section so the next Tab
 * continues from there (screen readers also announce the new position). Scrolling is left to the
 * browser's normal hash navigation (smooth, or instant with reduced motion).
 */
export function focusHashTarget(href: string) {
  if (!href.startsWith('#') || href.length < 2) return
  const target = document.getElementById(href.slice(1))
  if (!target) return
  window.requestAnimationFrame(() => {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  })
}
