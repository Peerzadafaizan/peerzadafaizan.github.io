/**
 * Hero 3D ledger stage — motion for the decorative CSS-3D object in LedgerStage.tsx.
 * Part of the GSAP motion system: it is set up by useMotion inside the same gsap.matchMedia()
 * context, so with prefers-reduced-motion: reduce none of this runs and the stage keeps its still
 * resting pose from CSS. No render loop: GSAP only runs while something is actually moving.
 *
 *  - Entrance: the stack opens up from flat and turns into place.
 *  - 360° turn: drag (mouse, pen or a horizontal swipe on touch) spins the stack a full 360° and
 *    further; on release it carries on with the flick's momentum and settles on its resting angle.
 *    Pitch (the viewing angle) is clamped so the sheets are never seen edge-on.
 *  - Pointer tilt (devices that can hover): the stack leans slightly towards the pointer.
 *  - Scroll: the sheets spread a little further apart as the hero scrolls away.
 * Only the tilt/spin/depth wrappers move. The profile card and portrait are never touched.
 */
import { gsap, type MotionScale } from './gsap.ts'

type Add = <A extends unknown[]>(fn: (...args: A) => void) => (...args: A) => void

/** Resting pose (keep in sync with .ledger-tilt / .ledger-spin in index.css). */
const REST = { pitch: 60, yaw: -38 } as const
/** Viewing-angle limits: never flatter than 46° or steeper than 72° (sheets stay readable). */
const PITCH = { min: 46, max: 72 } as const
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function setupLedgerStage(root: ParentNode, s: MotionScale, add: Add): (() => void) | undefined {
  const stage = root.querySelector<HTMLElement>('[data-stage]')
  const tilt = stage?.querySelector<HTMLElement>('[data-stage-tilt]')
  const spin = stage?.querySelector<HTMLElement>('[data-stage-spin]')
  const depth = stage?.querySelector<HTMLElement>('[data-stage-depth]')
  const hero = stage?.closest<HTMLElement>('section')
  if (!stage || !tilt || !spin || !depth || !hero) return undefined

  // One pose object drives both wrappers; quickSetters write it with no per-frame allocations.
  const pose: { pitch: number; yaw: number } = { pitch: REST.pitch, yaw: REST.yaw }
  const setPitch = gsap.quickSetter(tilt, 'rotationX', 'deg')
  const setYaw = gsap.quickSetter(spin, 'rotation', 'deg')
  const render = () => {
    setPitch(pose.pitch)
    setYaw(pose.yaw)
  }
  const moveTo = add((pitch: number, yaw: number, duration: number, onComplete?: () => void) => {
    gsap.to(pose, { pitch, yaw, duration, ease: 'power3.out', overwrite: 'auto', onUpdate: render, onComplete })
  })

  // Entrance: fade in, stack opens from flat, and the stack turns into its resting angle.
  gsap.set(depth, { '--enter': 0.04 })
  gsap.set(tilt, { opacity: 0 })
  pose.yaw = REST.yaw - (s.inner ? 70 : 40)
  render()
  const intro = gsap.timeline({ delay: 0.35 })
  intro.to(tilt, { opacity: 1, duration: 0.8 }, 0)
  intro.to(depth, { '--enter': 1, duration: 1.4, ease: 'power3.out' }, 0.1)
  intro.to(pose, { yaw: REST.yaw, duration: 1.8, ease: 'power3.out', onUpdate: render }, 0)

  // Scroll: sheets spread slightly as the hero leaves the viewport (scrubbed, no loop).
  gsap.to(depth, {
    '--scroll': 1.35,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.5 },
  })

  // ---- Drag: full 360° turn with momentum, then settle on the resting angle -------------------
  let drag: { id: number; x: number; y: number; yaw: number; pitch: number; mouse: boolean } | null = null
  let samples: { t: number; yaw: number }[] = []

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0) return
    intro.progress(1)
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: pose.yaw, pitch: pose.pitch, mouse: e.pointerType === 'mouse' }
    samples = [{ t: e.timeStamp, yaw: pose.yaw }]
    stage.setPointerCapture(e.pointerId)
    stage.setAttribute('data-dragging', '')
  }
  const onMove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return
    const yaw = drag.yaw + (e.clientX - drag.x) * 0.5
    // Touch uses vertical movement for page scrolling, so only mouse/pen change the pitch.
    const pitch = drag.mouse ? clamp(drag.pitch - (e.clientY - drag.y) * 0.15, PITCH.min, PITCH.max) : drag.pitch
    samples.push({ t: e.timeStamp, yaw })
    samples = samples.filter((p) => e.timeStamp - p.t < 120)
    moveTo(pitch, yaw, 0.3)
  }
  const onUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return
    drag = null
    stage.removeAttribute('data-dragging')
    if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId)
    const first = samples[0]
    const last = samples[samples.length - 1]
    const dt = first && last ? (last.t - first.t) / 1000 : 0
    const velocity = first && last && dt > 0 ? (last.yaw - first.yaw) / dt : 0 // deg/s
    const current = last?.yaw ?? pose.yaw
    // Carry on with the flick, then come to rest on the nearest whole turn of the resting angle.
    const projected = current + clamp(velocity, -1400, 1400) * 0.35
    const target = REST.yaw + 360 * Math.round((projected - REST.yaw) / 360)
    const duration = clamp(0.9 + (Math.abs(target - current) / 360) * 1.1, 0.9, 2.4)
    moveTo(REST.pitch, target, duration, () => {
      pose.yaw = REST.yaw // same angle, un-wound
      render()
    })
  }

  // ---- Pointer tilt (hover-capable devices only) ----------------------------------------------
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const onHover = (e: PointerEvent) => {
    if (drag || e.pointerType !== 'mouse') return
    const box = stage.getBoundingClientRect()
    const nx = clamp((e.clientX - (box.left + box.width / 2)) / (hero.clientWidth / 2), -1, 1)
    const ny = clamp((e.clientY - (box.top + box.height / 2)) / (hero.clientHeight / 2), -1, 1)
    moveTo(clamp(REST.pitch - ny * 6, PITCH.min, PITCH.max), REST.yaw + nx * 14, 1)
  }
  const onLeave = () => {
    if (!drag) moveTo(REST.pitch, REST.yaw, 1.2)
  }

  stage.addEventListener('pointerdown', onDown)
  stage.addEventListener('pointermove', onMove)
  stage.addEventListener('pointerup', onUp)
  stage.addEventListener('pointercancel', onUp)
  if (canHover) {
    hero.addEventListener('pointermove', onHover, { passive: true })
    hero.addEventListener('pointerleave', onLeave)
  }

  return () => {
    stage.removeEventListener('pointerdown', onDown)
    stage.removeEventListener('pointermove', onMove)
    stage.removeEventListener('pointerup', onUp)
    stage.removeEventListener('pointercancel', onUp)
    hero.removeEventListener('pointermove', onHover)
    hero.removeEventListener('pointerleave', onLeave)
    stage.removeAttribute('data-dragging')
    // After GSAP's own revert, drop anything the quickSetters wrote so the CSS resting pose applies.
    queueMicrotask(() => {
      for (const el of [tilt, spin, depth]) gsap.set(el, { clearProps: 'all' })
    })
  }
}
