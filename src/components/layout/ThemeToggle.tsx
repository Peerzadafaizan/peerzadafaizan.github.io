import { site } from '../../content/index.ts'
import { useTheme } from '../../hooks/useTheme.ts'
import { MoonIcon, SunIcon } from '../icons/Icons.tsx'

/**
 * Keeps the live site's label ("Toggle dark mode") and exposes the current state with
 * aria-pressed: true while the dark theme is showing.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={site.labels.themeToggle}
      aria-pressed={isDark}
      className="inline-flex size-tap shrink-0 items-center justify-center rounded-md border border-line-strong bg-surface text-ink-body transition-colors duration-150 hover:border-accent hover:text-accent motion-reduce:transition-none"
    >
      {isDark ? <SunIcon className="size-[18px]" /> : <MoonIcon className="size-[18px]" />}
    </button>
  )
}
