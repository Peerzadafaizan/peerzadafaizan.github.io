import type { SectionHeading } from '../../content/index.ts'

/**
 * Shared section heading: mono eyebrow with a short rule, serif H2, optional subtitle.
 * The H2 id is `${heading.id}-title` so the section can be labelled by it.
 */
export function SectionHeader({ heading }: { heading: SectionHeading }) {
  return (
    <header className="max-w-[46rem]">
      <p className="flex items-center gap-2.5 font-mono text-label font-semibold uppercase tracking-[0.1em] text-accent before:h-px before:w-[22px] before:shrink-0 before:bg-icon before:content-['']">
        {heading.eyebrow}
      </p>
      <h2 id={`${heading.id}-title`} className="mt-3 font-display text-h2 font-semibold tracking-[-0.01em] text-ink">
        {heading.title}
      </h2>
      {heading.subtitle && <p className="mt-3 text-body text-ink-muted">{heading.subtitle}</p>}
    </header>
  )
}
