import { howIWork } from '../content/index.ts'
import { ArrowRightIcon } from '../components/icons/Icons.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'

const lastIndex = howIWork.steps.length - 1

/**
 * Connector classes for step i. Phones: a vertical rail to the next step. From 768px (2 columns)
 * a horizontal rule after steps 1/3/5/7; from 1024px (4 columns) after every step except the last
 * in each row. Purely decorative (aria-hidden); the order itself is carried by the <ol>.
 */
function connectorClasses(i: number) {
  const md = i % 2 === 0 ? 'md:block' : 'md:hidden'
  const lg = i % 4 !== 3 && i !== lastIndex ? 'lg:block' : 'lg:hidden'
  return { horizontal: `hidden ${md} ${lg}`, vertical: i === lastIndex ? 'hidden' : 'md:hidden' }
}

/**
 * How I Work (#workflow). The eight steps, the flow intro and the four data-flow diagrams come
 * unchanged from src/content/workflow.ts. No motion; the sequence is shown with numbered markers
 * and connectors.
 */
export function HowIWork() {
  const { heading } = howIWork
  return (
    <section
      id={heading.id}
      tabIndex={-1}
      aria-labelledby={`${heading.id}-title`}
      className="border-t border-line bg-surface py-section outline-none"
    >
      <div className="container-page">
        <SectionHeader heading={heading} />

        {/* Eight-step process */}
        <ol className="mt-10 grid gap-x-8 sm:mt-12 md:grid-cols-2 md:gap-y-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
          {howIWork.steps.map((step, i) => {
            const c = connectorClasses(i)
            return (
              <li key={step.number} className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 pb-8 md:block md:pb-0">
                {/* Marker + connectors */}
                <div className="relative md:flex md:items-center md:gap-3">
                  <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-accent/50 bg-surface font-mono text-[0.8125rem] font-semibold text-accent">
                    {step.number}
                  </span>
                  <span aria-hidden="true" className={`h-px flex-1 bg-line-strong/50 ${c.horizontal}`} />
                  <span aria-hidden="true" className={`absolute top-11 bottom-[-2rem] left-[1.375rem] w-px -translate-x-1/2 bg-line-strong/50 ${c.vertical}`} />
                </div>
                <div className="pt-2 md:mt-5 md:pt-0 md:pr-2">
                  <h3 className="text-h3 font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{step.text}</p>
                </div>
              </li>
            )
          })}
        </ol>

        {/* Data flows */}
        <div className="mt-14 border-t border-line pt-10 sm:mt-16 sm:pt-12">
          <p className="max-w-[40rem] text-body text-ink-body">{howIWork.flowIntro}</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-5">
            {howIWork.flows.map((flow, f) => {
              const captionId = `flow-${f + 1}-caption`
              const last = flow.nodes.length - 1
              return (
                <div key={flow.caption} className="rounded-lg border border-line bg-bg p-5 sm:p-6">
                  <p id={captionId} className="font-mono text-label font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                    {flow.caption}
                  </p>
                  <ol aria-labelledby={captionId} className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3">
                    {flow.nodes.map((node, n) => (
                      <li key={node} className="flex items-center gap-2">
                        <span
                          className={
                            'rounded-md border px-3 py-1.5 text-[0.875rem] leading-snug ' +
                            (n === last
                              ? 'border-accent/40 bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] font-semibold text-ink'
                              : 'border-line bg-surface text-ink-body')
                          }
                        >
                          {node}
                        </span>
                        {n < last && <ArrowRightIcon className="size-4 shrink-0 text-icon" />}
                      </li>
                    ))}
                  </ol>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
