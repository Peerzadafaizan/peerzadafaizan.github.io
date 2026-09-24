/**
 * CV / resume (section #resume), Contact (section #contact) and footer.
 * Copied word for word from index.html on main @ bd1dab3, including the contact-form messages
 * that the current site's script shows at runtime.
 */
import { identity } from './profile.ts'
import type { Link, SectionHeading } from './types.ts'

export const resume = {
  heading: {
    id: 'resume',
    eyebrow: 'Resume',
    title: 'Download My CV',
  } satisfies SectionHeading,
  title: 'A concise, one-page summary',
  text: 'My resume covers current and prior experience, education, and the core accounting and GST skill set outlined on this page — generated directly from the same verified information.',
  actions: [
    { label: 'Open CV (PDF)', href: identity.cvHref, download: true },
    { label: 'View LinkedIn', href: identity.linkedinUrl, external: true },
    { label: 'Contact Me →', href: '#contact' },
  ] satisfies Link[],
  meta: 'Updated September 2026 · 1 page · PDF',
}

export const contact = {
  heading: {
    id: 'contact',
    eyebrow: 'Get In Touch',
    title: 'Contact',
    subtitle: 'Open to accounting & bookkeeping roles and remote engagements.',
  } satisfies SectionHeading,
  audiences: [
    'Employers → Accounting roles',
    'Employers → Bookkeeping roles',
    'Businesses → Remote accounting support',
    'Businesses → Remote bookkeeping support',
  ],
  direct: {
    title: 'Direct Contact',
    rows: [
      { key: 'Email', value: identity.email, href: identity.emailHref },
      { key: 'LinkedIn', value: '/in/peerzada-faizan-ahmad', href: identity.linkedinUrl, external: true },
      { key: 'Location', value: 'Sopore, Jammu & Kashmir, India' },
    ],
  },
  form: {
    id: 'contactForm',
    title: 'Send a Message',
    fields: [
      { id: 'cf-name', name: 'name', type: 'text', label: 'Name', required: true },
      { id: 'cf-email', name: 'email', type: 'email', label: 'Email', required: true },
      { id: 'cf-subject', name: 'subject', type: 'text', label: 'Subject', required: true },
      { id: 'cf-message', name: 'message', type: 'textarea', label: 'Message', rows: 5, required: true },
    ],
    submit: 'Send Message',
    note: 'This opens your email client with the message pre-filled — no data is stored or sent to a server.',
    /** The form opens a mailto: draft to this address (no server, nothing stored). */
    recipient: identity.email,
    /** Labels used in the pre-filled email body: "Name: …\nEmail: …\n\n<message>". */
    bodyLabels: { name: 'Name: ', email: 'Email: ' },
    messages: {
      incomplete: 'Please fill in every field before sending.',
      opening: 'Opening your email client to send this message…',
    },
  },
}

export const footer = {
  copyrightMark: '©',
  /** Rendered as "© <current year> " followed by this text. */
  copyrightText: 'Peerzada Faizan Ahmad. All rights reserved. · Open to India + UAE accounting opportunities.',
  links: [
    { label: 'Email', href: identity.emailHref },
    { label: 'LinkedIn', href: identity.linkedinUrl, external: true },
    { label: 'Back to top ↑', href: '#top' },
  ] satisfies Link[],
}
