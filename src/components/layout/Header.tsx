import { useCallback, useEffect, useRef } from 'react'
import { site } from '../../content/index.ts'
import { focusHashTarget } from '../../hooks/focusTarget.ts'
import { useActiveSection } from '../../hooks/useActiveSection.ts'
import { CloseIcon, MenuIcon } from '../icons/Icons.tsx'
import { buttonClasses } from '../ui/button.ts'
import { ThemeToggle } from './ThemeToggle.tsx'

const MENU_ID = 'mobile-menu'
/** Desktop navigation from the `md` breakpoint (900px); the menu button below it. */
const DESKTOP_QUERY = '(min-width: 900px)'
const navIds = site.nav.links.map((l) => l.href.slice(1))

interface HeaderProps {
  menuOpen: boolean
  onMenuOpenChange: (open: boolean) => void
}

export function Header({ menuOpen, onMenuOpenChange }: HeaderProps) {
  const active = useActiveSection(navIds)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(
    (returnFocus: boolean) => {
      onMenuOpenChange(false)
      if (returnFocus) menuButtonRef.current?.focus()
    },
    [onMenuOpenChange],
  )

  // While the menu is open: move focus into it, trap Tab, close on Escape / outside click /
  // switching to the desktop layout, and stop the page behind from scrolling.
  useEffect(() => {
    if (!menuOpen) return
    const sheet = sheetRef.current
    const button = menuButtonRef.current
    if (!sheet || !button) return

    const focusables = () => [button, ...Array.from(sheet.querySelectorAll<HTMLElement>('a[href], button'))]
    focusables()[1]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMenu(true)
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      const current = document.activeElement
      if (e.shiftKey && current === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && current === last) {
        e.preventDefault()
        first.focus()
      } else if (!items.includes(current as HTMLElement)) {
        e.preventDefault()
        first.focus()
      }
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (sheet.contains(target) || button.contains(target)) return
      closeMenu(false)
      // Let the browser finish its own mousedown focus handling, then return focus to the button.
      window.setTimeout(() => button.focus(), 0)
    }
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const onDesktop = (e: MediaQueryListEvent) => {
      if (e.matches) closeMenu(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    desktop.addEventListener('change', onDesktop)
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      desktop.removeEventListener('change', onDesktop)
      document.documentElement.style.overflow = previousOverflow
    }
  }, [menuOpen, closeMenu])

  const onNavClick = (href: string) => {
    if (menuOpen) closeMenu(false)
    focusHashTarget(href)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 pt-[env(safe-area-inset-top)] backdrop-blur-md backdrop-saturate-150">
      <div className="container-page flex h-header items-center justify-between gap-4">
        <a
          href={site.brand.href}
          onClick={() => onNavClick(site.brand.href)}
          className="inline-flex min-h-tap shrink-0 items-center gap-2.5 font-semibold text-ink"
        >
          <span className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-linear-155 from-navy-900 to-teal-600 font-mono text-[12.5px] font-semibold text-white">
            {site.brand.mark}
          </span>
          <span className="text-[1.02rem]">{site.brand.name}</span>
        </a>

        <nav aria-label={site.nav.ariaLabel} className="hidden md:block">
          <ul className="flex items-center gap-0.5 lg:gap-2">
            {site.nav.links.map((link) => {
              const isActive = active === link.href.slice(1)
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => onNavClick(link.href)}
                    className={
                      'inline-flex min-h-tap min-w-tap items-center justify-center border-y-2 border-t-transparent px-2.5 text-small transition-colors duration-150 motion-reduce:transition-none ' +
                      (isActive ? 'border-icon text-ink' : 'border-transparent text-ink-body hover:text-accent')
                    }
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <ThemeToggle />
          <a
            href={site.headerCta.href}
            onClick={() => onNavClick(site.headerCta.href)}
            className={`${buttonClasses('outline', 'sm')} max-lg:hidden`}
          >
            {site.headerCta.label}
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={site.labels.menuOpen}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            onClick={() => onMenuOpenChange(!menuOpen)}
            className="inline-flex size-tap items-center justify-center rounded-md border border-line-strong bg-surface text-ink md:hidden"
          >
            {menuOpen ? <CloseIcon className="size-[18px]" /> : <MenuIcon className="size-[18px]" />}
          </button>
        </div>
      </div>

      <div
        id={MENU_ID}
        ref={sheetRef}
        hidden={!menuOpen}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-line bg-surface shadow-lg motion-safe:animate-sheet-in md:hidden"
      >
        <nav aria-label={site.nav.ariaLabel}>
          <ul className="container-page flex flex-col py-2">
            {site.nav.links.map((link) => {
              const isActive = active === link.href.slice(1)
              return (
                <li key={link.href} className="border-b border-line last:border-b-0">
                  <a
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => onNavClick(link.href)}
                    className={
                      'flex min-h-12 items-center text-body ' +
                      (isActive ? 'font-semibold text-accent' : 'text-ink hover:text-accent')
                    }
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
