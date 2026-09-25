import { useState, type FormEvent } from 'react'
import { contact } from '../content/index.ts'
import { LinkedInIcon, MailIcon, PinIcon } from '../components/icons/Icons.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { buttonClasses } from '../components/ui/button.ts'
import { cardHover, groupLinkUnderline } from '../animations/interactions.ts'

const rowIcons = [MailIcon, LinkedInIcon, PinIcon]
/** Browser autofill hints (no new fields; helps mobile keyboards and autofill). */
const autocomplete: Record<string, string> = { name: 'name', email: 'email', subject: 'off', message: 'off' }

/**
 * Opens the visitor's email client with a pre-filled draft — the live site's behaviour.
 * Uses a temporary link click (equivalent to setting location.href to a mailto: URL).
 */
function openMailto(href: string) {
  const a = document.createElement('a')
  a.href = href
  a.click()
}

const fieldClass =
  'block w-full min-h-tap rounded-md border border-line-strong bg-surface px-3.5 py-3 text-base text-ink ' +
  'transition-colors duration-150 motion-reduce:transition-none placeholder:text-ink-subtle ' +
  'focus:border-accent user-invalid:border-[#b3261e] dark:user-invalid:border-[#f2b8b5]'

/**
 * Contact (#contact). All copy, the direct contact rows, the form fields/labels/messages and the
 * mailto behaviour come unchanged from src/content/contact.ts:
 *  - native `required` validation (as on the live site), then
 *  - if any field is only whitespace → "Please fill in every field before sending."
 *  - otherwise open mailto:<recipient>?subject=…&body=Name: …\nEmail: …\n\n<message>
 *    and show "Opening your email client to send this message…".
 * The status line is announced to screen readers (role="status").
 * Motion (once, on scroll): heading, audience tags, then the contact card and the form (as whole
 * blocks — fields never move individually). Form behaviour is unchanged.
 */
export function Contact() {
  const { heading, audiences, direct, form } = contact
  const [status, setStatus] = useState<string | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const value = (name: string) => String(data.get(name) ?? '').trim()
    const [name, email, subject, message] = ['name', 'email', 'subject', 'message'].map(value)
    if (!name || !email || !subject || !message) {
      setStatus(form.messages.incomplete)
      return
    }
    const body = `${form.bodyLabels.name}${name}\n${form.bodyLabels.email}${email}\n\n${message}`
    openMailto(`mailto:${form.recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    setStatus(form.messages.opening)
  }

  return (
    <section id={heading.id} tabIndex={-1} aria-labelledby={`${heading.id}-title`} className="border-t border-line py-section outline-none">
      <div className="container-page">
        <SectionHeader heading={heading} />
        <ul data-reveal="fade" className="mt-5 flex flex-wrap gap-2">
          {audiences.map((a) => (
            <li key={a} className="rounded-sm border border-line bg-surface px-2.5 py-1 font-mono text-[0.76rem] text-ink-muted">
              {a}
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
          {/* Direct contact */}
          <div data-reveal className={`self-start rounded-lg border border-line bg-surface p-6 sm:p-7 ${cardHover}`}>
            <h3 className="text-h3 font-semibold text-ink">{direct.title}</h3>
            <ul className="mt-3">
              {direct.rows.map((row, i) => {
                const Icon = rowIcons[i] ?? PinIcon
                const inner = (
                  <>
                    <Icon className="mt-0.5 size-[18px] shrink-0 text-icon" />
                    <span className="min-w-0">
                      <span className="block text-[0.72rem] font-semibold tracking-[0.06em] text-ink-muted uppercase">{row.key}</span>
                      <span className={`block text-ink [overflow-wrap:anywhere] ${row.href ? groupLinkUnderline : ''}`}>{row.value}</span>
                    </span>
                  </>
                )
                return (
                  <li key={row.key} className="border-b border-line last:border-b-0">
                    {row.href ? (
                      <a
                        href={row.href}
                        {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="group flex min-h-tap items-start gap-3 py-3.5 transition-colors duration-150 hover:text-accent motion-reduce:transition-none [&_span.text-ink]:group-hover:text-accent"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-start gap-3 py-3.5">{inner}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Form */}
          <form
            id={form.id}
            data-reveal
            onSubmit={onSubmit}
            aria-labelledby="contact-form-title"
            className={`rounded-lg border border-line bg-surface p-6 sm:p-7 ${cardHover}`}
          >
            <h3 id="contact-form-title" className="text-h3 font-semibold text-ink">
              {form.title}
            </h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {form.fields.map((f) => (
                <div key={f.id} className={f.type === 'textarea' || f.name === 'subject' ? 'sm:col-span-2' : ''}>
                  <label htmlFor={f.id} className="mb-2 block text-[0.8125rem] font-semibold text-ink-body">
                    {f.label}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea id={f.id} name={f.name} rows={f.rows} required={f.required} autoComplete={autocomplete[f.name]} className={`${fieldClass} resize-y`} />
                  ) : (
                    <input id={f.id} name={f.name} type={f.type} required={f.required} autoComplete={autocomplete[f.name]} className={fieldClass} />
                  )}
                </div>
              ))}
            </div>
            <button type="submit" className={`${buttonClasses('primary')} mt-6 w-full`}>
              {form.submit}
            </button>
            <p className="mt-3 text-[0.8125rem] leading-snug text-ink-subtle">{form.note}</p>
            <p role="status" aria-live="polite" className="mt-3 min-h-[1.5em] text-small font-semibold text-ink-body">
              {status}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
