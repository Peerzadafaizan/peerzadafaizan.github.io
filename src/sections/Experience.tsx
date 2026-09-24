import { about, experience } from '../content/index.ts'
import type { Role } from '../content/experience.ts'
import { KeepTerms } from '../components/ui/KeepTerms.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { linkUnderline } from '../animations/interactions.ts'

const eyebrowClass =
  "flex items-center gap-2.5 font-mono text-label font-semibold uppercase tracking-[0.1em] text-accent before:h-px before:w-[22px] before:shrink-0 before:bg-icon before:content-['']"

function RoleEntry({ role, index, last }: { role: Role; index: number; last: boolean }) {
  const titleId = `role-${index + 1}-title`
  return (
    <li data-reveal-group className="relative pl-8 md:grid md:grid-cols-[11rem_minmax(0,1fr)] md:gap-x-10 md:pl-0">
      {/* Timeline rail + node (decorative) */}
      <span data-reveal-item="pop" aria-hidden="true" className="absolute top-2 left-0 size-3 rounded-full border-2 border-accent bg-bg md:left-[calc(11rem+1.25rem)] md:-translate-x-1/2" />
      {!last && (
        <span data-reveal-item="draw-y" aria-hidden="true" className="absolute top-6 -bottom-10 left-[5px] w-px bg-line-strong/50 md:left-[calc(11rem+1.25rem)]" />
      )}

      <div data-reveal-item="fade" className="flex flex-wrap items-center gap-x-3 gap-y-2 md:flex-col md:items-start md:pt-0.5">
        <p className="font-mono text-[0.8125rem] font-semibold text-accent">{role.period}</p>
        {role.status && (
          <p className="rounded-full border border-accent/40 bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] px-2.5 py-0.5 text-[0.75rem] font-semibold tracking-[0.03em] text-accent">
            {role.status}
          </p>
        )}
      </div>

      <article data-reveal-item aria-labelledby={titleId} className="mt-3 md:mt-0 md:pl-8">
        <h3 id={titleId} className="font-display text-[1.375rem] leading-snug font-semibold text-ink sm:text-[1.5rem]">
          {role.title}
        </h3>
        <p className="mt-1 text-body text-ink-muted">
          <span className="font-semibold text-ink-body">{role.organisation}</span>
          {role.location && (
            <>
              {/* The live site's "·" separator, drawn by CSS so it is not part of the text */}
              <span aria-hidden="true" className="mx-1.5 before:content-['·']" />
              {role.location}
            </>
          )}
        </p>
        <ul className="mt-5 flex flex-col gap-3">
          {role.responsibilities.map((item) => (
            <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-body">
              <span aria-hidden="true" className="mt-[0.7em] h-px w-2.5 shrink-0 bg-icon" />
              <span>
                <KeepTerms text={item} />
              </span>
            </li>
          ))}
        </ul>
        <ul className="mt-5 flex flex-wrap gap-2">
          {role.tags.map((tag) => (
            <li key={tag} className="rounded-sm border border-line bg-surface px-2.5 py-1 font-mono text-[0.76rem] text-ink-muted">
              {tag}
            </li>
          ))}
        </ul>
      </article>
    </li>
  )
}

/**
 * Experience + About (#experience, with #about as a part inside it — approved merge).
 * Both roles, every responsibility and tag, and all About content (stat tiles, paragraphs, facts)
 * come unchanged from src/content/experience.ts and src/content/profile.ts.
 * Motion (once, on scroll): each role's timeline dot activates, its rail draws and the role
 * arrives; in About the four figures arrive in sequence, then the paragraphs and facts.
 */
export function Experience() {
  const { heading, roles } = experience
  const aboutHeading = about.heading
  return (
    <section
      id={heading.id}
      tabIndex={-1}
      aria-labelledby={`${heading.id}-title`}
      className="border-t border-line py-section outline-none"
    >
      <div className="container-page">
        <SectionHeader heading={heading} />

        {/* Timeline */}
        <ol className="mt-10 flex flex-col gap-10 sm:mt-12 md:gap-12">
          {roles.map((role, i) => (
            <RoleEntry key={role.period} role={role} index={i} last={i === roles.length - 1} />
          ))}
        </ol>

        {/* About — part of this section, keeps the #about anchor */}
        <section
          id={aboutHeading.id}
          tabIndex={-1}
          aria-labelledby={`${aboutHeading.id}-title`}
          className="mt-14 rounded-lg border border-line bg-surface p-6 outline-none sm:mt-16 sm:p-8 lg:p-10"
        >
          <div data-reveal-group>
            <p data-reveal-item className={eyebrowClass}>
              {aboutHeading.eyebrow}
            </p>
            <h3
              data-reveal-item
              id={`${aboutHeading.id}-title`}
              className="mt-3 font-display text-[1.5rem] leading-tight font-semibold tracking-[-0.01em] text-ink sm:text-[1.75rem]"
            >
              {aboutHeading.title}
            </h3>
          </div>

          <ul data-reveal-group className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line min-[400px]:grid-cols-2 lg:grid-cols-4">
            {about.statTiles.map((tile) => (
              <li key={tile.value} className="bg-surface p-5">
                {/* The tile background stays put (it draws the grid lines); only the figure arrives. */}
                <div data-reveal-item>
                  <p className="font-display text-[1.375rem] leading-tight font-semibold text-accent">{tile.value}</p>
                  <p className="mt-1.5 text-[0.84rem] leading-snug text-ink-muted">{tile.caption}</p>
                </div>
              </li>
            ))}
          </ul>

          <div data-reveal-group="1.5" className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
            <div className="flex max-w-measure flex-col gap-4">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 32)} data-reveal-item className="text-body leading-relaxed text-ink-body">
                  <KeepTerms text={p} />
                </p>
              ))}
            </div>

            <dl data-reveal-item className="self-start rounded-md border border-line bg-bg px-5">
              {about.facts.map((fact) => (
                <div
                  key={fact.key}
                  className="flex flex-col gap-0.5 border-b border-line py-3 last:border-b-0 min-[400px]:flex-row min-[400px]:items-baseline min-[400px]:justify-between min-[400px]:gap-4"
                >
                  <dt className="shrink-0 text-small text-ink-muted">{fact.key}</dt>
                  <dd className="text-small font-semibold text-ink min-[400px]:text-right">
                    {fact.href ? (
                      <a
                        href={fact.href}
                        {...(fact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className={`inline-flex min-h-tap items-center text-accent ${linkUnderline}`}
                      >
                        {fact.value}
                      </a>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>
    </section>
  )
}
