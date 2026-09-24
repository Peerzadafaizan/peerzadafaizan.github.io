import { arrowNudge } from '../../animations/interactions.ts'

/**
 * Renders a label unchanged; a trailing "→" (e.g. "Contact Me →") is wrapped so it can nudge
 * forward on hover/focus. The text (and accessible name) stays exactly the same.
 */
export function ArrowLabel({ label }: { label: string }) {
  const match = /^(.*?)(\s*)→$/.exec(label)
  if (!match) return <>{label}</>
  return (
    <>
      {match[1]}
      {match[2]}
      <span className={arrowNudge}>→</span>
    </>
  )
}
