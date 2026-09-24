import { expertise, tools } from '../content/index.ts'
import { KeepTerms } from '../components/ui/KeepTerms.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { cardHover } from '../animations/interactions.ts'

const eyebrowClass =
  "flex items-center gap-2.5 font-mono text-label font-semibold uppercase tracking-[0.1em] text-accent before:h-px before:w-[22px] before:shrink-0 before:bg-icon before:content-['']"

/**
 * Expertise + Tools (#expertise, with #tools as a part inside it — approved merge).
 * The four disciplines, every item, and all six tools come unchanged from src/content/expertise.ts
 * and src/content/tools.ts. No ratings, no percentages. Motion (once, on scroll): the four
 * discipline cards and then the six tools arrive in a short stagger.
 */
export function Expertise() {
  const { heading } = expertise
  const toolsHeading = tools.heading
  return (
    <section
      id={heading.id}
      tabIndex={-1}
      aria-labelledby={`${heading.id}-title`}
      className="border-t border-line py-section outline-none"
    >
      <div className="container-page">
        <SectionHeader heading={heading} />

        {/* Disciplines: ruled lists, like ledger rows */}
        <ul data-reveal-group className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {expertise.areas.map((area) => (
            <li key={area.title} data-reveal-item className={`flex flex-col rounded-lg border border-line bg-surface p-5 sm:p-6 ${cardHover}`}>
              <h3 className="border-b-2 border-accent/60 pb-3 text-h3 font-semibold text-ink">{area.title}</h3>
              <ul className="mt-1">
                {area.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-b border-line py-2.5 text-[0.9375rem] leading-snug text-ink-body last:border-b-0 last:pb-0"
                  >
                    <span aria-hidden="true" className="mt-[0.55em] h-px w-2.5 shrink-0 bg-icon" />
                    <span>
                      <KeepTerms text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* Tools — part of this section, keeps the #tools anchor */}
        <section
          id={toolsHeading.id}
          tabIndex={-1}
          aria-labelledby={`${toolsHeading.id}-title`}
          className="mt-14 border-t border-line pt-10 outline-none sm:mt-16 sm:pt-12"
        >
          <div data-reveal-group>
            <p data-reveal-item className={eyebrowClass}>
              {toolsHeading.eyebrow}
            </p>
            <h3
              data-reveal-item
              id={`${toolsHeading.id}-title`}
              className="mt-3 font-display text-[1.5rem] leading-tight font-semibold tracking-[-0.01em] text-ink sm:text-[1.75rem]"
            >
              {toolsHeading.title}
            </h3>
          </div>

          <ul data-reveal-group="0.75" className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {tools.items.map((tool) => (
              <li key={tool.name} className="bg-surface p-5">
                {/* The tile background stays put (it draws the grid lines); only its content arrives. */}
                <div data-reveal-item className="flex items-start gap-4">
                  <span className="flex h-10 min-w-10 shrink-0 items-center justify-center rounded-md border border-line bg-bg px-1.5 font-mono text-[0.75rem] font-semibold text-accent">
                    {tool.abbr}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{tool.name}</p>
                    <p className="mt-1 text-[0.9375rem] leading-snug text-ink-muted">
                      <KeepTerms text={tool.use} />
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  )
}
