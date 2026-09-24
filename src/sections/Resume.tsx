import { resume } from '../content/index.ts'
import type { Link } from '../content/index.ts'
import { DownloadIcon, LinkedInIcon } from '../components/icons/Icons.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { ArrowLabel } from '../components/ui/ArrowLabel.tsx'
import { buttonClasses } from '../components/ui/button.ts'
import { focusHashTarget } from '../hooks/focusTarget.ts'

const variants = ['primary', 'outline', 'ghost'] as const

function linkProps(link: Link) {
  return {
    href: link.href,
    ...(link.download ? { download: true } : {}),
    ...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    onClick: () => focusHashTarget(link.href),
  }
}

/**
 * CV (#resume). Text, links and the existing PDF (public/Peerzada-Faizan-Ahmad-Resume.pdf) are
 * unchanged from src/content/contact.ts. No preview image or invented file details: the only file
 * facts shown are the existing "Updated September 2026 · 1 page · PDF" line.
 * Motion (once, on scroll): the card rises in, then its text and actions follow on desktop.
 * The PDF itself is never animated.
 */
export function Resume() {
  const { heading } = resume
  return (
    <section
      id={heading.id}
      tabIndex={-1}
      aria-labelledby={`${heading.id}-title`}
      className="border-t border-line bg-surface py-section outline-none"
    >
      <div className="container-page">
        <SectionHeader heading={heading} />
        <div data-reveal className="mt-10 grid gap-8 rounded-lg border border-line bg-bg p-6 sm:mt-12 sm:p-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center md:gap-12 lg:p-10">
          <div data-reveal-inner>
            <h3 className="font-display text-[1.375rem] leading-snug font-semibold text-ink sm:text-[1.5rem]">{resume.title}</h3>
            <p className="mt-3 max-w-measure text-body leading-relaxed text-ink-muted">{resume.text}</p>
          </div>
          <div data-reveal-inner="fade" className="flex flex-col gap-4 md:border-l md:border-line md:pl-12">
            <div className="flex flex-wrap items-center gap-3">
              {resume.actions.map((action, i) => (
                <a key={action.label} {...linkProps(action)} className={buttonClasses(variants[i] ?? 'ghost')}>
                  {action.download && <DownloadIcon className="size-4" />}
                  {action.external && <LinkedInIcon className="size-4" />}
                  <ArrowLabel label={action.label} />
                </a>
              ))}
            </div>
            <p className="font-mono text-[0.78rem] text-ink-subtle">{resume.meta}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
