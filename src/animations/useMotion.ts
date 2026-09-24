/**
 * useMotion — the single place where the motion system attaches to the page.
 *
 * - Runs in a layout effect, so hidden starting states are applied before the first paint
 *   (no flash of content, no layout shift: only opacity/transform change).
 * - Everything runs inside gsap.matchMedia(): with prefers-reduced-motion: reduce nothing is
 *   hidden or moved at all, and switching that setting on while the page is open reverts every
 *   animation and ScrollTrigger immediately (content shown as-is).
 * - Intensity (desktop vs. phone) is chosen once on load, so resizing never replays anything.
 * - The hero's 3D ledger stage (stage3d.ts) runs in the same context.
 * - Safety nets: content that receives keyboard focus before it has scrolled into view is shown
 *   instantly, and everything is shown before printing.
 * - Cleanup reverts all tweens, ScrollTriggers and listeners (unmount / React StrictMode).
 */
import { useLayoutEffect, type RefObject } from 'react'
import { gsap, MEDIA, motionScale, ScrollTrigger } from './gsap.ts'
import { isPending, release, settle, settleAll } from './reveal.ts'
import { playIntro, setupScrollReveals } from './scroll.ts'
import { setupLedgerStage } from './stage3d.ts'

export function useMotion(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const scale = motionScale(window.matchMedia(MEDIA.desktop).matches)
    const mm = gsap.matchMedia()
    mm.add(MEDIA.motionOk, (context) => {
      // Tweens started later (in ScrollTrigger callbacks) are recorded in this context too, so a
      // revert also stops anything still in flight.
      const add = <A extends unknown[]>(fn: (...args: A) => void) => (...args: A) => {
        context.add(() => fn(...args))
      }
      playIntro(root, scale)
      setupScrollReveals(root, scale, add)
      const stopStage = setupLedgerStage(root, scale, add)
      // Reverted (reduced motion switched on, or unmount): GSAP restores what it changed; release()
      // then removes any leftover inline transform (GSAP folds Tailwind's `translate` into its own
      // transform while an element is hidden) so everything is exactly as the markup defines it.
      return () => {
        stopStage?.()
        queueMicrotask(() => release(root))
      }
    })

    // Keyboard focus lands on something not yet revealed → show it (and its hidden parents) now.
    const onFocusIn = (event: FocusEvent) => {
      for (let el = event.target instanceof Element ? event.target : null; el && el !== root; el = el.parentElement) {
        if (isPending(el)) settle(el)
      }
    }
    const onBeforePrint = () => settleAll(root)
    root.addEventListener('focusin', onFocusIn)
    window.addEventListener('beforeprint', onBeforePrint)

    // Web fonts change text height; re-measure trigger positions once they are in.
    let active = true
    void document.fonts?.ready.then(() => {
      if (active) ScrollTrigger.refresh()
    })

    return () => {
      active = false
      root.removeEventListener('focusin', onFocusIn)
      window.removeEventListener('beforeprint', onBeforePrint)
      mm.revert()
    }
  }, [rootRef])
}
