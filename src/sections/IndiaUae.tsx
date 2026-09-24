import { availability } from '../content/index.ts'
import type { Market } from '../content/availability.ts'
import { KeepTerms } from '../components/ui/KeepTerms.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { ArrowLabel } from '../components/ui/ArrowLabel.tsx'
import { buttonClasses } from '../components/ui/button.ts'
import { cardHover } from '../animations/interactions.ts'
import { focusHashTarget } from '../hooks/focusTarget.ts'

/**
 * India + UAE (#focus). Every word comes unchanged from src/content/availability.ts.
 * This is the only section that uses the gold accent (eyebrow, UAE card rule and note, and the
 * decorative connector between the two markets). Nothing here states UAE work experience: the UAE
 * card uses the existing "Open to …" lines and the existing transferable-foundation sentence.
 * Motion (once, on scroll, a little more deliberate than elsewhere): heading, then the India card,
 * the gold connector drawing across, the UAE card, then remote support and the actions. On desktop
 * the two cards arrive from their own side; on phones everything rises vertically. No flags or maps.
 */
function MarketCard({ market, tone }: { market: Market; tone: 'india' | 'uae' }) {
  const isUae = tone === 'uae'
  const titleId = `market-${market.title.toLowerCase().replace(/[^a-z]+/g, '-')}-title`
  return (
    <article
      data-reveal-item={isUae ? 'right' : 'left'}
      aria-labelledby={titleId}
      className={`flex h-full flex-col rounded-lg border bg-surface p-6 transition-[border-color] duration-200 sm:p-7 ${isUae ? 'border-gold-dot/50 hover:border-gold-dot/80' : 'border-line hover:border-line-strong/60'}`}
    >
      <h3 id={titleId} className="font-display text-[1.75rem] leading-none font-semibold tracking-[-0.01em] text-ink sm:text-[2rem]">
        {market.title}
      </h3>
      <span data-reveal-item="draw-x" aria-hidden="true" className={`mt-4 block h-0.5 w-10 ${isUae ? 'bg-gold-dot' : 'bg-icon'}`} />
      <ul className="mt-5 flex flex-col gap-3">
        {market.items.map((item) => (
          <li key={item} className="flex gap-3 text-[0.9375rem] leading-snug text-ink-body">
            <span aria-hidden="true" className={`mt-[0.45em] size-1.5 shrink-0 rounded-full ${isUae ? 'bg-gold-dot' : 'bg-icon'}`} />
            <span>
              <KeepTerms text={item} />
            </span>
          </li>
        ))}
      </ul>
      {market.highlight && (
        <p className="mt-6 border-l-2 border-gold-dot pl-4 text-[0.9375rem] leading-relaxed text-ink-muted">{market.highlight}</p>
      )}
    </article>
  )
}

export function IndiaUae() {
  const { heading, markets, ctas } = availability
  const [india, uae, remote] = markets
  return (
    <section
      id={heading.id}
      tabIndex={-1}
      aria-labelledby={`${heading.id}-title`}
      className="overflow-x-clip border-t border-line bg-surface py-section outline-none"
    >
      <div className="container-page">
        <SectionHeader heading={heading} accent="gold" />

        {/* India ⟷ UAE: two balanced cards joined by a thin decorative gold connector */}
        <div data-reveal-group="1.8" className="mt-10 grid gap-0 sm:mt-12 md:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] md:items-stretch">
          {india && <MarketCard market={india} tone="india" />}
          <div aria-hidden="true" className="flex items-center justify-center py-2 md:py-0">
            <span data-reveal-item="draw-y" className="h-8 w-px bg-[repeating-linear-gradient(to_bottom,var(--gold-dot)_0_4px,transparent_4px_8px)] md:hidden" />
            <span className="hidden h-px w-full items-center md:flex">
              <span className="size-1.5 shrink-0 rounded-full bg-gold-dot" />
              <span data-reveal-item="draw-x" className="h-px flex-1 bg-[repeating-linear-gradient(to_right,var(--gold-dot)_0_4px,transparent_4px_8px)]" />
              <span className="size-1.5 shrink-0 rounded-full bg-gold-dot" />
            </span>
          </div>
          {uae && <MarketCard market={uae} tone="uae" />}
        </div>

        {/* Remote support: spans both markets */}
        {remote && (
          <article data-reveal aria-labelledby="market-remote-title" className={`mt-5 rounded-lg border border-line bg-bg p-6 sm:p-7 md:mt-6 ${cardHover}`}>
            <h3 id="market-remote-title" className="text-h3 font-semibold text-ink">
              {remote.title}
            </h3>
            <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
              {remote.items.map((item) => (
                <li key={item} className="flex gap-3 text-[0.9375rem] leading-snug text-ink-body">
                  <span aria-hidden="true" className="mt-[0.55em] h-px w-2.5 shrink-0 bg-icon" />
                  <span>
                    <KeepTerms text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </article>
        )}

        <div data-reveal="fade" className="mt-8 flex flex-wrap items-center gap-3">
          {ctas.map((cta, i) => (
            <a key={cta.label} href={cta.href} onClick={() => focusHashTarget(cta.href)} className={buttonClasses(i === 0 ? 'outline' : 'ghost')}>
              <ArrowLabel label={cta.label} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
