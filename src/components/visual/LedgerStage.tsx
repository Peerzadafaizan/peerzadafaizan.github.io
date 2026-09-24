/**
 * LedgerStage — the hero's decorative 3D object: a stack of ledger sheets in real CSS 3D space.
 *
 *  - Base sheet: a ruled ledger grid (the "source data").
 *  - Middle sheets: working papers, each ruled and slightly offset.
 *  - Top sheet: the reconciled record — teal edge, a thin gold margin rule, two matched rows.
 *  - Teal reconciliation lines run straight up through the stack, joining each matched row on the
 *    top sheet to the same row on the base sheet.
 *
 * There is no text, no figure and no chart in it — nothing that could read as a claim.
 * It sits behind the profile card (the card and portrait never move) and is purely decorative:
 * aria-hidden, no focusable parts, pointer input only (see src/animations/stage3d.ts).
 * Its resting pose is defined in CSS, so with reduced motion it is shown still, in 3D.
 */

/** Sheet order is bottom → top. `i` is the height in the stack; hidden sheets thin the stack on phones. */
const SHEETS = [
  { i: 0, kind: 'base', className: '[--i:0] inset-0' },
  { i: 1, kind: 'paper', className: '[--i:1] inset-[6%_10%_14%_4%] max-sm:hidden' },
  { i: 2, kind: 'paper', className: '[--i:2] inset-[12%_4%_6%_14%]' },
  { i: 3, kind: 'paper', className: '[--i:3] inset-[4%_14%_16%_8%] max-sm:hidden' },
  { i: 4, kind: 'top', className: '[--i:4] inset-[10%_8%_10%_10%]' },
] as const

/** Matched rows: same position on the base and the top sheet, joined by a reconciliation line. */
const MATCHES = ['top-[37%] left-[27%]', 'top-[59%] left-[63%]'] as const

export function LedgerStage() {
  return (
    <div aria-hidden="true" data-stage className="ledger-stage">
      <div data-stage-tilt className="ledger-tilt">
        <div data-stage-spin className="ledger-spin">
          <div data-stage-depth className="ledger-depth">
            {SHEETS.map((sheet) => (
              <div key={sheet.i} className={`ledger-sheet ledger-sheet--${sheet.kind} ${sheet.className}`}>
                {sheet.kind === 'base' && MATCHES.map((pos) => <span key={pos} className={`ledger-mark ${pos}`} />)}
                {sheet.kind === 'top' && (
                  <>
                    <span className="ledger-margin" />
                    <span className="ledger-row top-[30%]" />
                    <span className="ledger-row top-[58%]" />
                  </>
                )}
              </div>
            ))}
            {MATCHES.map((pos) => (
              <span key={pos} className={`ledger-link ${pos}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
