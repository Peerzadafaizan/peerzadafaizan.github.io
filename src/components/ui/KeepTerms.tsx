import { Fragment } from 'react'

/** Hyphenated terms such as "GSTR-8", "GSTR-2A/2B", "AS-2" or "E-commerce". */
const HYPHENATED = /(\S*[A-Za-z0-9]-[A-Za-z0-9]\S*)/g

/**
 * Renders text unchanged, but keeps hyphenated terms on one line so codes like "GSTR-8" never
 * break as "GSTR-" / "8". Presentation only: the text content is identical to the input.
 */
export function KeepTerms({ text }: { text: string }) {
  const parts = text.split(HYPHENATED)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} data-term="" className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
