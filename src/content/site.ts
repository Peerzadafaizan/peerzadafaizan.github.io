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
    links: [
      { label: 'About', href: '#about' },
      { label: 'Expertise', href: '#expertise' },
      { label: 'Projects', href: '#projects' },
      { label: 'Experience', href: '#experience' },
      { label: 'Tools', href: '#tools' },
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
