import { Fragment } from 'react'
import { hero, identity } from '../content/index.ts'
import type { Link } from '../content/index.ts'
import { focusHashTarget } from '../hooks/focusTarget.ts'
import { BriefcaseIcon, ClockIcon, DownloadIcon, PinIcon } from '../components/icons/Icons.tsx'
import { ArrowLabel } from '../components/ui/ArrowLabel.tsx'
import { buttonClasses } from '../components/ui/button.ts'
import { LedgerStage } from '../components/visual/LedgerStage.tsx'

const TITLE_ID = 'hero-title'
const metaIcons = [PinIcon, BriefcaseIcon, ClockIcon]
const ctaVariants = ['primary', 'outline', 'ghost'] as const

function linkProps(link: Link) {
  return {
    href: link.href,
    ...(link.download ? { download: true } : {}),
    ...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    onClick: () => focusHashTarget(link.href),
  }
}

function Photo({ className }: { className: string }) {
  return (
    <img
      src={identity.photo.src}
      alt={identity.photo.alt}
      width={identity.photo.width}
      height={identity.photo.height}
      loading="eager"
      decoding="async"
      className={`shrink-0 rounded-lg bg-navy-900 object-cover ring-1 ring-line ${className}`}
    />
  )
}

/**
 * Hero (#top). Every word comes from src/content/profile.ts (hero). The H1 headline and the removal of
 * the card's "Profile Record · REC-001" row are approved changes (scripts/approved-changes.json).
 * Layout: mobile-first single column (photo first); from 900px a two-column split with the
 * profile card on the right. The faint ruled lines are the hero-only "ledger" motif.
 * Motion: a short entrance on load (data-intro order: eyebrow → headline → name → roles/lede →
 * CTAs → availability/meta → profile card). Wording and layout are unaffected.
 * 3D stage: a decorative stack of ledger sheets (LedgerStage) sits behind the profile card; it can
 * be turned through 360° by dragging, tilts slightly with the pointer, and deepens on scroll
 * (src/animations/stage3d.ts). It is aria-hidden and never covers the text or controls.
 */
export function Hero() {
  return (
    <section
      id={hero.id}
      tabIndex={-1}
      aria-labelledby={TITLE_ID}
      className="hero-ledger relative overflow-hidden outline-none md:flex md:min-h-[calc(100svh-var(--header-h))] md:items-center"
    >
      <div className="container-page relative grid gap-10 py-8 sm:py-14 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] md:items-center md:gap-12 md:py-16 lg:gap-16">
        {/* Main column (above the decorative 3D stage wherever they overlap) */}
        <div className="relative z-10 min-w-0">
          <div data-intro="1" className="flex items-center gap-4">
            <Photo className="size-14 md:hidden" />
            <p className="flex items-start gap-2.5 font-mono text-label font-semibold uppercase tracking-[0.1em] text-accent">
              <span aria-hidden="true" className="mt-[5px] size-1.5 shrink-0 rounded-full bg-icon ring-3 ring-icon/20" />
              <span>{hero.eyebrow}</span>
            </p>
          </div>

          <h1
            data-intro="2"
            id={TITLE_ID}
            className="mt-4 max-w-[20ch] font-display text-[1.875rem] leading-[1.12] font-semibold tracking-[-0.015em] text-ink sm:text-[2.5rem] lg:text-[3.25rem] lg:leading-[1.06]"
          >
            {hero.headline}
          </h1>

          <p data-intro="3" className="mt-4 font-display text-[1.375rem] leading-tight font-semibold text-ink sm:text-2xl">
            {hero.name.lead} <span className="text-accent">{hero.name.accent}</span>
          </p>

          <p data-intro="4" className="mt-4 max-w-measure text-[0.9375rem] leading-relaxed text-ink-body sm:text-lg">
            {/* Each separator stays on the line of the role before it, so no line starts with "/". */}
            {hero.roles.map((role, i) => (
              <Fragment key={role}>
                <span className="whitespace-nowrap max-[359px]:whitespace-normal">
                  {role}
                  {i < hero.roles.length - 1 && (
                    <span aria-hidden="true" className="mr-1 ml-2 text-line-strong">
                      {hero.roleSeparator}
                    </span>
                  )}
                </span>{' '}
              </Fragment>
            ))}
          </p>

          <p data-intro="4" className="mt-5 max-w-[36rem] text-base/relaxed text-ink-muted sm:mt-6 sm:text-body">{hero.lede}</p>

          <div data-intro="5" className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            {hero.ctas.map((cta, i) => (
              <a key={cta.label} {...linkProps(cta)} className={buttonClasses(ctaVariants[i] ?? 'ghost')}>
                {cta.download && <DownloadIcon className="size-4" />}
                <ArrowLabel label={cta.label} />
              </a>
            ))}
          </div>

          <div data-intro="6" className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              {...linkProps(hero.availability.pill)}
              className="inline-flex min-h-tap items-center gap-2 rounded-full border border-line-strong bg-gold-500/10 px-3.5 font-mono text-[0.78rem] font-semibold tracking-[0.02em] text-ink transition-colors duration-150 hover:border-gold-dot motion-reduce:transition-none"
            >
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-gold-dot" />
              {hero.availability.pill.label}
            </a>
            <span className="text-small text-ink-muted">{hero.availability.note}</span>
          </div>

          <ul data-intro="6" className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-small text-ink-muted sm:flex-row sm:flex-wrap sm:gap-x-6">
            {hero.meta.map((item, i) => {
              const Icon = metaIcons[i] ?? PinIcon
              return (
                <li key={item} className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0 text-icon" />
                  {item}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Profile card, in front of the decorative 3D ledger stage (the card and portrait never move with it) */}
        <div data-stage-anchor className="relative min-w-0 pt-[208px] sm:pt-[236px] md:pt-[232px] lg:pt-[262px]">
          <LedgerStage />
          <aside data-intro="7 scale" aria-label={hero.card.name} className="@container relative z-10 min-w-0 rounded-lg border border-line bg-surface shadow-lg">
            <div className="flex items-center gap-4 border-b border-line p-5 sm:p-6">
              <Photo className="size-16 max-md:hidden lg:size-24" />
              <div className="min-w-0">
                <p className="font-semibold text-ink">{hero.card.name}</p>
                <p className="mt-0.5 text-small text-ink-muted">{hero.card.subtitle}</p>
              </div>
            </div>
            <div className="px-5 pt-2 pb-5 sm:px-6 sm:pb-6">
              <dl>
                {hero.card.stats.map((stat) => (
                  <div
                    key={stat.key}
                    className="flex flex-col gap-0.5 border-b border-line py-3 last:border-b-0 last:pb-0 @sm:flex-row @sm:items-baseline @sm:justify-between @sm:gap-4"
                  >
                    <dt className="shrink-0 text-small text-ink-muted">{stat.key}</dt>
                    <dd className="font-mono text-[0.84rem] font-semibold text-ink @sm:text-right">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
