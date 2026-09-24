/**
 * Site chrome: skip link, brand, primary navigation, header action and accessible labels.
 * Copied word for word from index.html on main @ bd1dab3.
 */
import type { Link } from './types.ts'

export const site = {
  mainId: 'main',
  skipLink: { label: 'Skip to content', href: '#main' } satisfies Link,
  brand: { mark: 'PFA', name: 'Faizan Ahmad', href: '#top' },
  nav: {
    ariaLabel: 'Primary',
    // Same 7 links and labels as the live site, ordered to follow the new page order
    // (approved change 2026-09-24, recorded in scripts/approved-changes.json).
    links: [
      { label: 'Projects', href: '#projects' },
      { label: 'Expertise', href: '#expertise' },
      { label: 'Tools', href: '#tools' },
      { label: 'Experience', href: '#experience' },
      { label: 'About', href: '#about' },
      { label: 'Resume', href: '#resume' },
      { label: 'Contact', href: '#contact' },
    ] satisfies Link[],
  },
  headerCta: { label: 'Contact Me', href: '#contact' } satisfies Link,
  labels: {
    themeToggle: 'Toggle dark mode',
    menuOpen: 'Open menu',
  },
}
