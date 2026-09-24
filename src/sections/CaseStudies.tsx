import { caseStudies } from '../content/index.ts'
import type { CaseStudy } from '../content/caseStudies.ts'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'

type BlockKey = keyof typeof caseStudies.labels
const BLOCKS: readonly BlockKey[] = ['challenge', 'process', 'tools', 'outcome']

function CaseStudyCard({ item }: { item: CaseStudy }) {
  const titleId = `case-${item.index}-title`
  return (
    <article
      aria-labelledby={titleId}
      className="@container rounded-lg border border-line bg-surface p-5 shadow-sm sm:p-7 lg:p-8"
    >
      {/* From ~720px of card width: title + tags on the left, the four blocks on the right. */}
      <div className="grid gap-6 @3xl:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] @3xl:grid-rows-[auto_1fr] @3xl:gap-x-10 @3xl:gap-y-6">
        <div className="@3xl:col-start-1 @3xl:row-start-1">
          <p className="font-mono text-[1.75rem] leading-none font-semibold tracking-tight text-accent/80">{item.index}</p>
          <h3 id={titleId} className="mt-3 font-display text-[1.3125rem] leading-snug font-semibold text-ink sm:text-[1.5rem]">
            {item.title}
          </h3>
        </div>

        <dl className="grid gap-px overflow-hidden rounded-md border border-line bg-line @xl:grid-cols-2 @3xl:col-start-2 @3xl:row-span-2 @3xl:row-start-1">
          {BLOCKS.map((key) => (
            <div key={key} className={`flex flex-col gap-1.5 p-4 sm:p-5 ${key === 'outcome' ? 'bg-[color-mix(in_srgb,var(--accent)_7%,var(--surface))]' : 'bg-surface'}`}>
              <dt className="font-mono text-label font-semibold uppercase tracking-[0.08em] text-accent">{caseStudies.labels[key]}</dt>
              <dd className="text-[0.9375rem] leading-relaxed text-ink-body">{item[key]}</dd>
            </div>
          ))}
        </dl>

        <ul className="flex flex-wrap gap-2 @3xl:col-start-1 @3xl:row-start-2 @3xl:self-end">
          {item.tags.map((tag) => (
            <li key={tag} className="rounded-sm border border-line bg-bg px-2.5 py-1 font-mono text-[0.76rem] text-ink-muted">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/**
 * Case studies (#projects, "Work Showcase"). All four case studies, their Challenge / Process /
 * Tools / Outcome text, tags and the confidentiality note come unchanged from src/content/caseStudies.ts.
 * Cards are not interactive, so they have no hover state.
 */
export function CaseStudies() {
  const { heading } = caseStudies
  return (
    <section
      id={heading.id}
      tabIndex={-1}
      aria-labelledby={`${heading.id}-title`}
      className="border-t border-line py-section outline-none"
    >
      <div className="container-page">
        <SectionHeader heading={heading} />
        <ol className="mt-10 flex flex-col gap-6 sm:mt-12 lg:gap-8">
          {caseStudies.items.map((item) => (
            <li key={item.index}>
              <CaseStudyCard item={item} />
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-[46rem] border-t border-dashed border-line pt-5 text-small text-ink-subtle italic">
          {caseStudies.note}
        </p>
      </div>
    </section>
  )
}
