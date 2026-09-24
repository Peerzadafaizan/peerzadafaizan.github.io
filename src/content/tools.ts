/**
 * Software & Tools (section #tools).
 * Copied word for word from index.html on main @ bd1dab3. All six tools, unchanged.
 */
import type { SectionHeading } from './types.ts'

export interface Tool {
  /** Short badge text shown in the tool icon on the current site. */
  abbr: string
  name: string
  use: string
}

export const tools = {
  heading: {
    id: 'tools',
    eyebrow: 'Software & Tools',
    title: 'Technology I work in daily',
  } satisfies SectionHeading,
  items: [
    { abbr: 'TP', name: 'Tally Prime 7.0', use: 'Bookkeeping, inventory & import costing' },
    { abbr: 'XL', name: 'Microsoft Excel', use: 'SUMIF/COUNTIFS, conditional formatting' },
    { abbr: 'PY', name: 'Python (openpyxl)', use: 'Reconciliation workbook automation' },
    { abbr: 'GST', name: 'GST Portal', use: 'GSTR-1/3B filings; GSTR-2A/2B & GSTR-8 downloads' },
    { abbr: 'EWB', name: 'E-Way Bill Portal', use: 'Multi-leg import transport' },
    { abbr: 'AZ', name: 'Amazon Seller Central', use: 'FBA reports & TCS reconciliation' },
  ] satisfies Tool[],
}
