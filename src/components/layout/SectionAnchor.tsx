import type { ReactNode } from 'react'
import type { SectionHeading } from '../../content/index.ts'

/**
 * Stage 3 placeholder for a page section: the real anchor (id), the section's existing eyebrow and
 * title from src/content, and nothing else. It exists so the shell's skip link, navigation and
 * active-section highlighting can be built and tested. Section bodies are built in Stage 4.
 */
export function SectionAnchor({ heading, alt = false, children }: { heading: SectionHeading; alt?: boolean; children?: ReactNode }) {
  const titleId = `${heading.id}-title`
  return (
    <section
      id={heading.id}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={`min-h-[70vh] border-t border-line py-section outline-none ${alt ? 'bg-surface' : ''}`}
    >
      <div className="container-page">
        <p className="flex items-center gap-2.5 font-mono text-label font-semibold uppercase tracking-[0.1em] text-accent before:h-px before:w-[22px] before:bg-icon before:content-['']">
          {heading.eyebrow}
        </p>
        <h2 id={titleId} className="mt-3 max-w-measure font-display text-h2 font-semibold tracking-[-0.01em] text-ink">
          {heading.title}
        </h2>
        {children}
      </div>
    </section>
  )
}
