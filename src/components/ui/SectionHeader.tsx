import type { SectionHeading } from '../../content/index.ts'

/**
 * Shared section heading: mono eyebrow with a short rule, serif H2, optional subtitle.
 * The H2 id is `${heading.id}-title` so the section can be labelled by it.
 * The header reveals as a short stagger (eyebrow → title → subtitle) when scrolled into view.
 * `accent="gold"` is reserved for the India + UAE section (design-system rule).
 */
export function SectionHeader({ heading, accent = 'teal' }: { heading: SectionHeading; accent?: 'teal' | 'gold' }) {
  const tone = accent === 'gold' ? 'text-gold before:bg-gold-dot' : 'text-accent before:bg-icon'
  return (
    <header data-reveal-group className="max-w-[46rem]">
      <p data-reveal-item className={`flex items-center gap-2.5 font-mono text-label font-semibold uppercase tracking-[0.1em] before:h-px before:w-[22px] before:shrink-0 before:content-[''] ${tone}`}>
        {heading.eyebrow}
      </p>
      <h2 data-reveal-item id={`${heading.id}-title`} className="mt-3 font-display text-h2 font-semibold tracking-[-0.01em] text-ink">
        {heading.title}
      </h2>
      {heading.subtitle && <p data-reveal-item className="mt-3 text-body text-ink-muted">{heading.subtitle}</p>}
    </header>
  )
}
