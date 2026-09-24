/**
 * Reveal primitives: how a single element is hidden before it enters, and how it arrives.
 *
 * Components never call these directly. They only *declare* motion with data attributes
 * (see scroll.ts for the vocabulary); this module turns a declaration into GSAP tweens.
 *
 * Rules that keep content safe:
 *  - Only opacity and transforms are animated (no layout properties, no filters, no visibility),
 *    so hidden-for-now content stays focusable, readable by screen readers and findable.
 *  - Every hidden element carries data-motion="pending" until it has fully arrived, then
 *    "done"; inline styles are cleared on completion so CSS (hover states etc.) owns the element again.
 *  - settle() shows an element instantly — used when it receives keyboard focus before it has
 *    scrolled into view, and before printing.
 */
import { gsap, type MotionScale } from './gsap.ts'

export type RevealKind = 'up' | 'left' | 'right' | 'fade' | 'scale' | 'draw-x' | 'draw-y' | 'pop'

const KINDS: readonly RevealKind[] = ['up', 'left', 'right', 'fade', 'scale', 'draw-x', 'draw-y', 'pop']
const CLEAR = 'opacity,transform,transformOrigin'
export const STATE_ATTR = 'data-motion'

/** Read a kind from an attribute value; anything unknown (or empty) means 'up'. */
export function kindOf(value: string | null | undefined): RevealKind {
  return KINDS.find((k) => k === value) ?? 'up'
}

/** The starting (hidden) state for a kind. */
function fromVars(kind: RevealKind, s: MotionScale): gsap.TweenVars {
  switch (kind) {
    case 'left':
    case 'right':
      // Sideways only on desktop; phones use the same vertical entrance as everything else.
      return s.shift > 0 ? { opacity: 0, x: kind === 'left' ? -s.shift : s.shift } : { opacity: 0, y: s.distance }
    case 'fade':
      return { opacity: 0 }
    case 'scale':
      return { opacity: 0, y: Math.round(s.distance * 0.6), scale: 0.985, transformOrigin: '50% 100%' }
    case 'draw-x':
      return { scaleX: 0, transformOrigin: '0% 50%' }
    case 'draw-y':
      return { scaleY: 0, transformOrigin: '50% 0%' }
    case 'pop':
      return { opacity: 0, scale: 0.4 }
    default:
      return { opacity: 0, y: s.distance }
  }
}

/** The resting state for a kind (only the properties its hidden state changed). */
function toVars(kind: RevealKind): gsap.TweenVars {
  switch (kind) {
    case 'left':
    case 'right':
      return { opacity: 1, x: 0, y: 0 }
    case 'fade':
      return { opacity: 1 }
    case 'scale':
      return { opacity: 1, y: 0, scale: 1 }
    case 'draw-x':
      return { scaleX: 1 }
    case 'draw-y':
      return { scaleY: 1 }
    case 'pop':
      return { opacity: 1, scale: 1 }
    default:
      return { opacity: 1, y: 0 }
  }
}

function durationOf(kind: RevealKind, s: MotionScale) {
  if (kind === 'draw-x' || kind === 'draw-y') return s.duration * 1.15
  if (kind === 'pop') return s.duration * 0.6
  return s.duration
}

export function isPending(el: Element) {
  return el.getAttribute(STATE_ATTR) === 'pending'
}

/** Put an element in its hidden state (unless it has already been revealed). */
export function hide(el: Element, kind: RevealKind, s: MotionScale): boolean {
  if (el.getAttribute(STATE_ATTR) === 'done') return false
  gsap.set(el, fromVars(kind, s))
  el.setAttribute(STATE_ATTR, 'pending')
  return true
}

function finish(el: Element) {
  gsap.set(el, { clearProps: CLEAR })
  el.setAttribute(STATE_ATTR, 'done')
}

/** Tween one element to rest. Returns the tween so callers can place it on a timeline. */
export function arrive(el: Element, kind: RevealKind, s: MotionScale): gsap.core.Tween {
  return gsap.to(el, {
    ...toVars(kind),
    duration: durationOf(kind, s),
    overwrite: 'auto',
    onComplete: () => finish(el),
  })
}

/** Show an element (and anything still hidden inside it) immediately, cancelling its tweens. */
export function settle(el: Element) {
  const targets = [el, ...el.querySelectorAll(`[${STATE_ATTR}="pending"]`)].filter(isPending)
  for (const t of targets) {
    gsap.killTweensOf(t)
    finish(t)
  }
}

/**
 * Undo the hidden state without animating (motion switched off, or unmount): clear inline styles
 * and the pending marker so the element is exactly as the markup and CSS define it.
 */
export function release(root: ParentNode) {
  for (const el of root.querySelectorAll(`[${STATE_ATTR}="pending"]`)) {
    gsap.killTweensOf(el)
    gsap.set(el, { clearProps: CLEAR })
    el.removeAttribute(STATE_ATTR)
  }
}

/** Show everything still hidden inside root. */
export function settleAll(root: ParentNode) {
  for (const el of root.querySelectorAll(`[${STATE_ATTR}="pending"]`)) {
    gsap.killTweensOf(el)
    finish(el)
  }
}
