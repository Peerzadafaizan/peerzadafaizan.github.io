import { footer } from '../../content/index.ts'
import { focusHashTarget } from '../../hooks/focusTarget.ts'

export function Footer({ inert }: { inert?: boolean }) {
  const year = new Date().getFullYear()
  return (
    <footer inert={inert} className="border-t border-line py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="container-page flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-small text-ink-subtle">
          {footer.copyrightMark} {year} {footer.copyrightText}
        </p>
        <ul className="-mx-2 flex flex-wrap items-center">
          {footer.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => focusHashTarget(link.href)}
                className="inline-flex min-h-tap items-center px-2 text-small text-ink-muted transition-colors duration-150 hover:text-accent motion-reduce:transition-none"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
