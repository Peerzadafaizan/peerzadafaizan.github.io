import { site } from '../../content/index.ts'
import { focusHashTarget } from '../../hooks/focusTarget.ts'

/** First focusable element on the page; visible only while focused. */
export function SkipLink() {
  return (
    <a
      href={site.skipLink.href}
      onClick={() => focusHashTarget(site.skipLink.href)}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:inline-flex focus:min-h-tap focus:items-center focus:rounded-md focus:bg-accent-fill focus:px-4 focus:py-3 focus:font-semibold focus:text-on-accent focus:shadow-lg"
    >
      {site.skipLink.label}
    </a>
  )
}
