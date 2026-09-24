/**
 * Accounting & Finance Expertise (section #expertise).
 * Copied word for word from index.html on main @ bd1dab3. All four disciplines and every item, unchanged.
 */
import type { SectionHeading } from './types.ts'

export interface ExpertiseArea {
  title: string
  items: string[]
}

export const expertise = {
  heading: {
    id: 'expertise',
    eyebrow: 'Accounting & Finance Expertise',
    title: 'Where I add value',
    subtitle: "Organized by discipline — every item below reflects work I've actually done.",
  } satisfies SectionHeading,
  areas: [
    {
      title: 'Accounting',
      items: [
        'Bookkeeping in Tally Prime',
        'Sales & purchase accounting',
        'Ledger management',
        'Multi-state GSTIN management',
        'Import cost accounting (AS-2 / Sec 145A)',
      ],
    },
    {
      title: 'GST',
      items: [
        'GSTR-1 & GSTR-3B filing',
        'GSTR-2A/2B reconciliation',
        'E-commerce TCS / GSTR-8 data reconciliation',
        'ITC utilisation & GST set-off (Rule 88A)',
        'HSN classification',
        'E-Way Bill workflows',
      ],
    },
    {
      title: 'Reconciliation',
      items: [
        'GSTR-2A vs. Tally purchase register',
        'GSTR-8 TCS vs. Tally sales register',
        'Amazon reports vs. books',
        'Bidirectional invoice-level matching',
        'Probable-match fallback logic',
      ],
    },
    {
      title: 'E-Commerce Accounting',
      items: [
        'Amazon FBA multi-state compliance',
        'Amazon settlement & report analysis',
        'TCS reconciliation',
        'E-commerce sales reconciliation',
      ],
    },
  ] satisfies ExpertiseArea[],
}
