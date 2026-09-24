/**
 * Professional experience (section #experience).
 * Copied word for word from index.html on main @ bd1dab3. Both roles, every bullet and tag, unchanged.
 */
import type { SectionHeading } from './types.ts'

export interface Role {
  period: string
  /** Status badge shown next to the period (current role only). */
  status?: string
  title: string
  organisation: string
  /** Rendered after the organisation, preceded by a "·" separator on the current site. */
  location?: string
  responsibilities: string[]
  tags: string[]
}

export const experience = {
  heading: {
    id: 'experience',
    eyebrow: 'Experience',
    title: 'Professional Experience',
    subtitle: 'Roles, responsibilities, and the systems used in each.',
  } satisfies SectionHeading,
  roles: [
    {
      period: 'Apr 2025 — Present',
      status: 'Current',
      title: 'Accountant',
      organisation: 'Weltherm Home Appliances Pvt. Ltd.',
      location: 'Srinagar, Jammu & Kashmir',
      responsibilities: [
        'Maintain state-wise GST registrations — Kashmir as the Principal Place of Business / main GST registration (GSTIN), and separate GST registrations with Amazon FBA warehouse/hub operations in Haryana, Karnataka, Maharashtra and West Bengal — with additional GST registrations and Amazon FBA warehouse locations that may be added in the future as the business expands.',
        'Handle GSTIN-wise bookkeeping, accounting records and GST reconciliation separately for each state registration, including multi-state Amazon FBA operations.',
        'Reconcile GSTR-8 TCS data against Tally sales records for e-commerce sales, and GSTR-2A/2B supplier data against Tally purchase registers for ITC utilisation and GST set-off under Rule 88A.',
        'Prepare and file monthly GST returns — GSTR-1 and GSTR-3B — for the applicable GST registrations.',
        'Maintain day-to-day Tally Prime bookkeeping — sales, purchases, ledgers and inventory.',
        'Handle import accounting — costing Basic Customs Duty and Social Welfare Surcharge into stock item values in Tally Prime, in line with AS-2 and Section 145A.',
        'Generate E-Way Bills for import shipments, including multi-leg transport with Part-B updates.',
        'Build Excel and Python (openpyxl) reconciliation workbooks with formula-driven summaries and conditional-formatting match-status flags.',
      ],
      tags: ['Tally Prime 7.0', 'GSTR-1 / GSTR-3B / GSTR-2A/2B', 'Amazon FBA', 'Excel + Python', 'E-Way Bill'],
    },
    {
      period: 'Jun 2023 — Apr 2025',
      title: 'Accountant & Data Entry Team Leader',
      organisation: 'Alrit and Associates',
      responsibilities: [
        'Handled core accounting and data entry operations, and led a data entry team.',
        'Built the foundational bookkeeping and GST filing experience carried into the current role.',
      ],
      tags: ['Bookkeeping', 'Data Entry Leadership', 'GST Filing'],
    },
  ] satisfies Role[],
}
