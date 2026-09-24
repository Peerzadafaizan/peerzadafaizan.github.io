/**
 * GSAP setup — the only module that imports GSAP directly.
 * Registers ScrollTrigger once and holds the shared motion tokens (easing, distances, timing),
 * so every animation in the site uses the same restrained vocabulary.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Mobile browsers resize the viewport when the address bar shows/hides; don't recalculate
// every trigger for that (avoids jank while scrolling on phones).
ScrollTrigger.config({ ignoreMobileResize: true })

/** One calm deceleration curve for everything: no bounce, no overshoot. */
export const EASE = 'power3.out'
gsap.defaults({ ease: EASE })

/** Media queries the motion system responds to. */
export const MEDIA = {
  /** Motion runs only when the visitor has not asked the OS to reduce it. */
  motionOk: '(prefers-reduced-motion: no-preference)',
  /** Matches the md breakpoint (900px): full intensity from here up. */
  desktop: '(min-width: 900px)',
} as const

/**
 * When a block reveals: from the moment its top edge passes 88% of the viewport height…
 * …until the very end of the page. The open-ended range matters: if the page is opened (or
 * restored) already scrolled past a block — a #hash link, reload, back button — the block is
 * "inside" its range and reveals at once, so nothing above the viewport is left hidden.
 * clamp() keeps the start within the scrollable range, so blocks at the very bottom of the page
 * (which can never reach the 88% line) still reveal when the page is scrolled to the end.
 */
export const REVEAL_RANGE = { start: 'clamp(top 88%)', end: 'max' } as const

/** Motion intensity. Small screens get shorter distances, faster timing and no sideways movement. */
export interface MotionScale {
  /** Vertical travel for entrances, px. */
  distance: number
  /** Horizontal travel for the paired India / UAE cards, px (0 = vertical only). */
  shift: number
  /** Default entrance duration, s. */
  duration: number
  /** Delay between siblings in a staggered group, s. */
  stagger: number
  /** Reveal the inside of large cards progressively (desktop only). */
  inner: boolean
}

export function motionScale(desktop: boolean): MotionScale {
  return desktop
    ? { distance: 28, shift: 20, duration: 0.8, stagger: 0.08, inner: true }
    : { distance: 16, shift: 0, duration: 0.6, stagger: 0.06, inner: false }
}

export { gsap, ScrollTrigger }
