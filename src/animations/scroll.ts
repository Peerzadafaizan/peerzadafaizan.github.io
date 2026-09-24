/**
 * Scroll-driven reveals (ScrollTrigger) and the hero entrance, built from data attributes that
 * components declare. Markup vocabulary:
 *
 *   data-reveal="kind"          A block that reveals itself when it scrolls into view. Blocks that
 *                               enter together are staggered (ScrollTrigger.batch).
 *     data-reveal-inner="kind"  Inside a data-reveal block: parts revealed progressively after the
 *                               block itself (desktop only; on phones they arrive with the block).
 *
 *   data-reveal-group="n"       A container with one trigger; its members arrive in DOM order,
 *                               `n` × the base stagger apart (default 1).
 *     data-reveal-item="kind"   A member of the nearest group.
 *
 *   data-intro="step [kind]"    Hero entrance order on page load (1 = first).
 *
 * kind: up (default) · left · right · fade · scale · draw-x · draw-y · pop — see reveal.ts.
 * Every animation plays once; nothing loops or reverses.
 */
import { gsap, REVEAL_RANGE, ScrollTrigger, type MotionScale } from './gsap.ts'
import { arrive, hide, kindOf, settle } from './reveal.ts'

/** Longest wait before a block in a batch starts (in stagger steps), however many enter at once. */
const MAX_BATCH_STEPS = 4

/**
 * True when an element is entirely above the viewport — i.e. it was jumped past (a #hash link, a
 * restored scroll position). Such content is shown instantly rather than animated out of sight.
 */
function passed(el: Element) {
  return el.getBoundingClientRect().bottom <= 0
}

/** display:none (e.g. a connector used only at another breakpoint): leave it alone. */
function rendered(el: Element) {
  return el.getClientRects().length > 0
}

/** Wraps a callback so animations it creates belong to the active gsap.matchMedia() context. */
type Add = <A extends unknown[]>(fn: (...args: A) => void) => (...args: A) => void

/** Members of a group, excluding those that belong to a nested group or block. */
function membersOf(group: Element) {
  return [...group.querySelectorAll('[data-reveal-item]')].filter((el) => el.parentElement?.closest('[data-reveal-group]') === group)
}

/** Hero entrance: a short, restrained sequence on page load (no scroll trigger). */
export function playIntro(root: ParentNode, s: MotionScale) {
  const steps = [...root.querySelectorAll('[data-intro]')]
    .map((el) => {
      const [step = '1', kind] = (el.getAttribute('data-intro') ?? '').split(/\s+/)
      return { el, step: Number(step) || 1, kind: kindOf(kind) }
    })
    .filter(({ el, kind }) => hide(el, kind, s))
  if (!steps.length) return
  const gap = s.stagger * 1.35
  const tl = gsap.timeline({ delay: 0.08 })
  for (const { el, step, kind } of steps) tl.add(arrive(el, kind, s), (step - 1) * gap)
}

/** Blocks (data-reveal) and groups (data-reveal-group) below the fold. */
export function setupScrollReveals(root: ParentNode, s: MotionScale, add: Add) {
  // Groups: one trigger per container, members in DOM order.
  for (const group of root.querySelectorAll('[data-reveal-group]')) {
    const factor = Number(group.getAttribute('data-reveal-group')) || 1
    const members = membersOf(group)
      .map((el) => ({ el, kind: kindOf(el.getAttribute('data-reveal-item')) }))
      .filter(({ el, kind }) => rendered(el) && hide(el, kind, s))
    if (!members.length) continue
    ScrollTrigger.create({
      trigger: group,
      ...REVEAL_RANGE,
      once: true,
      onEnter: add(() => {
        if (passed(group)) return members.forEach(({ el }) => settle(el))
        const tl = gsap.timeline()
        members.forEach(({ el, kind }, i) => tl.add(arrive(el, kind, s), i * s.stagger * factor))
      }),
    })
  }

  // Blocks: batched so blocks entering together are staggered.
  const blocks = [...root.querySelectorAll('[data-reveal]')].filter((el) => {
    const shown = rendered(el) && hide(el, kindOf(el.getAttribute('data-reveal')), s)
    if (shown && s.inner) {
      for (const part of el.querySelectorAll('[data-reveal-inner]')) if (rendered(part)) hide(part, kindOf(part.getAttribute('data-reveal-inner')), s)
    }
    return shown
  })
  if (!blocks.length) return
  ScrollTrigger.batch(blocks, {
    ...REVEAL_RANGE,
    once: true,
    onEnter: add((batch: Element[]) => {
      const inView = batch.filter((el) => {
        if (!passed(el)) return true
        settle(el)
        return false
      })
      inView.forEach((el, i) => {
        const tl = gsap.timeline({ delay: Math.min(i, MAX_BATCH_STEPS) * s.stagger * 1.5 })
        tl.add(arrive(el, kindOf(el.getAttribute('data-reveal')), s))
        if (s.inner) {
          const parts = [...el.querySelectorAll('[data-reveal-inner]')].filter((part) => part.getAttribute('data-motion') === 'pending')
          parts.forEach((part, j) => tl.add(arrive(part, kindOf(part.getAttribute('data-reveal-inner')), s), 0.15 + j * s.stagger))
        }
      })
    }),
  })
}
