import type { SectionHeading } from '../../content/index.ts'

const eyebrowClass =
  "flex items-center gap-2.5 font-mono text-label font-semibold uppercase tracking-[0.1em] text-accent before:h-px before:w-[22px] before:shrink-0 before:bg-icon before:content-['']"

/**
 * Placeholder for a page section that is not built yet: its real anchor (id), its existing eyebrow
 * and title from src/content, and nothing else. Section bodies are built in Stage 4.
 *
 * `parts` are former sections merged into this one (approved structural merge): each keeps its id
 * (so #tools / #about links still work) and its heading, as an h3 inside this section.
 */
export function SectionAnchor({ heading, parts = [], alt = false }: { heading: SectionHeading; parts?: SectionHeading[]; alt?: boolean }) {
  const titleId = `${heading.id}-title`
  return (
    <section
      id={heading.id}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={`border-t border-line py-section outline-none ${alt ? 'bg-surface' : ''}`}
    >
      <div className="container-page">
        <div className="min-h-[50vh]">
          <p className={eyebrowClass}>{heading.eyebrow}</p>
          <h2 id={titleId} className="mt-3 max-w-measure font-display text-h2 font-semibold tracking-[-0.01em] text-ink">
            {heading.title}
          </h2>
        </div>
        {parts.map((part) => (
          <section
            key={part.id}
            id={part.id}
            tabIndex={-1}
            aria-labelledby={`${part.id}-title`}
            className="mt-12 min-h-[40vh] border-t border-dashed border-line pt-10 outline-none sm:mt-16 sm:pt-12"
          >
            <p className={eyebrowClass}>{part.eyebrow}</p>
            <h3 id={`${part.id}-title`} className="mt-3 max-w-measure font-display text-[1.5rem] leading-tight font-semibold text-ink sm:text-[1.75rem]">
              {part.title}
            </h3>
          </section>
        ))}
      </div>
    </section>
  )
}
