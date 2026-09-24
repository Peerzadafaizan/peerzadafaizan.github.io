/**
 * India + UAE availability (section #focus).
 * Copied word for word from index.html on main @ bd1dab3.
 *
 * Factual guard: nothing here claims UAE work experience, UAE VAT/Corporate Tax filing, IFRS or
 * UAE software experience. The only UAE statements are the existing "open to" lines and the existing
 * sentence describing GST experience as a transferable foundation.
 */
import type { Link, SectionHeading } from './types.ts'

export interface Market {
  title: string
  items: string[]
  /** Highlighted note shown under the list (UAE card only on the current site). */
  highlight?: string
}

export const availability = {
  heading: {
    id: 'focus',
    eyebrow: 'Availability',
    title: 'India + UAE accounting & bookkeeping opportunities',
    subtitle:
      'Open to accounting and bookkeeping roles in India and the UAE, and to remote accounting/bookkeeping support engagements for businesses in both markets.',
  } satisfies SectionHeading,
  markets: [
    {
      title: 'India',
      items: [
        'Accounting & bookkeeping jobs',
        'Accounts-support roles',
        'GST, reconciliation & Tally Prime engagements',
        'Remote bookkeeping support for Indian businesses',
      ],
    },
    {
      title: 'UAE',
      items: [
        'Open to UAE accounting & bookkeeping opportunities',
        'Open to UAE-based client engagements',
        'Remote accounting support for UAE businesses',
      ],
      highlight:
        'GST-based reconciliation experience provides a transferable foundation for UAE VAT bookkeeping and reconciliation workflows.',
    },
    {
      title: 'Remote Support',
      items: [
        'Bookkeeping & ledger maintenance',
        'GST, bank & marketplace reconciliations',
        'Excel & Python-based reporting',
        'Inventory & e-commerce accounting support',
      ],
    },
  ] satisfies Market[],
  ctas: [
    { label: 'Discuss an Opportunity', href: '#contact' },
    { label: 'Discuss Remote Accounting Support', href: '#contact' },
  ] satisfies Link[],
}
