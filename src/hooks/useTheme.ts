import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

/** Same storage key as the current live site, so visitors keep their saved choice. */
export const THEME_STORAGE_KEY = 'pfa-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

const isBrowser = typeof window !== 'undefined'

function readChosenTheme(): Theme | null {
  if (!isBrowser) return null
  // public/theme-init.js has already applied a saved choice to <html data-theme> before first paint.
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

/**
 * Theme state with the live site's behaviour: follow the OS until the visitor picks a theme,
 * then remember the pick in localStorage["pfa-theme"] and on <html data-theme>.
 */
export function useTheme() {
  const [chosen, setChosen] = useState<Theme | null>(readChosenTheme)
  const [systemDark, setSystemDark] = useState(() => isBrowser && window.matchMedia(DARK_QUERY).matches)

  useEffect(() => {
    const mq = window.matchMedia(DARK_QUERY)
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const theme: Theme = chosen ?? (systemDark ? 'dark' : 'light')

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      /* storage unavailable (private mode) — the choice still applies for this page view */
    }
    setChosen(next)
  }, [theme])

  return { theme, toggle }
}
