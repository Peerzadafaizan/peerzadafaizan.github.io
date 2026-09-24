/**
 * Shared content types.
 *
 * Content rule: every user-facing string in src/content/ is copied WORD FOR WORD from the
 * existing site (index.html on main @ bd1dab3). scripts/content-parity.mjs enforces this in CI.
 * Keys listed in NON_TEXT_KEYS of that script (id, href, src, …) hold identifiers/URLs, not copy.
 */

/** A link exactly as it exists on the current site. */
export interface Link {
  label: string
  href: string
  /** Opens in a new tab with rel="noopener noreferrer" (as on the current site). */
  external?: true
  /** Has the `download` attribute (as on the current site). */
  download?: true
}

/** A label/value row, e.g. the About facts table or the hero profile card. */
export interface Fact {
  key: string
  value: string
  /** Present when the value is itself a link on the current site. */
  href?: string
  external?: true
}

export interface SectionHeading {
  /** Anchor id of the section on the current site. */
  id: string
  eyebrow: string
  title: string
  subtitle?: string
}
