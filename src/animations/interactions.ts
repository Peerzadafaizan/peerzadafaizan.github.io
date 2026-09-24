/**
 * Micro-interactions. These are deliberately CSS-only (Tailwind classes, no JavaScript per hover):
 * they cost nothing at runtime, never fight the GSAP reveals (GSAP animates `transform`/`opacity`,
 * these use the separate `translate` property, colours and decoration), and they fall away
 * automatically for reduced motion (`motion-safe:` plus the global reduced-motion rule).
 * `hover:` only applies on devices that can hover, so touch screens never get stuck states.
 * Focus styles are untouched: the global :focus-visible outline stays in charge.
 */

/** Buttons: lift by 1px on hover, settle back when pressed. Pair with `group` for arrows. */
export const buttonLift =
  'group transition-[color,background-color,border-color,box-shadow,text-decoration-color,translate] duration-200 ease-out ' +
  'motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0'

/** A trailing "→" that nudges forward when its button/link is hovered or focused. */
export const arrowNudge =
  'inline-block transition-[translate] duration-200 ease-out motion-safe:group-hover:translate-x-[3px] motion-safe:group-focus-visible:translate-x-[3px]'

/** Text links: the underline fades in rather than snapping on. */
export const linkUnderline =
  'underline decoration-transparent decoration-1 underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:decoration-current'

/** Same underline behaviour, driven by a parent with `group` (e.g. a whole contact row). */
export const groupLinkUnderline =
  'underline decoration-transparent decoration-1 underline-offset-4 transition-[text-decoration-color] duration-200 group-hover:decoration-current'

/** Content cards: the border firms up slightly on hover. No lift — the cards are not clickable. */
export const cardHover = 'transition-[border-color] duration-200 hover:border-line-strong/60'
