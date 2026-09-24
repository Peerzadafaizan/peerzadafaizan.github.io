/**
 * Case studies ("Work Showcase", section #projects).
 * Copied word for word from index.html on main @ bd1dab3. All four case studies, unchanged.
 */
import type { SectionHeading } from './types.ts'

export interface CaseStudy {
  index: string
  title: string
  challenge: string
  process: string
  tools: string
  outcome: string
  tags: string[]
}

export const caseStudies = {
  heading: {
    id: 'projects',
    eyebrow: 'Work Showcase',
    title: 'Reconciliation & Compliance Work',
    subtitle: 'Company and client identities are withheld for confidentiality; the process and tools shown are real.',
  } satisfies SectionHeading,
  /** Block labels used inside every case-study card. */
  labels: { challenge: 'Challenge', process: 'Process', tools: 'Tools', outcome: 'Outcome' },
  items: [
    {
      index: '01',
      title: 'GSTR-2A vs. Tally Purchase Reconciliation',
      challenge:
        "Supplier-reported GSTR-2A data frequently didn't line up cleanly with Tally purchase registers — some suppliers' invoices were recorded under internal prefix/suffix codes rather than their bare invoice numbers.",
      process:
        'Built a bidirectional match on GSTIN + Invoice Number as the strict key, then added a supplementary probable-match layer (GSTIN + amount, or digit-only comparison) to resolve the remaining unmatched pairs.',
      tools: 'Excel, Python (openpyxl), GST portal exports, Tally purchase register exports.',
      outcome:
        'A structured workbook, prepared for audit and internal review, that separates cleanly matched invoices from probable matches and true exceptions, with conditional-formatting status flags.',
      tags: ['GSTR-2A', 'Invoice Matching', 'Excel'],
    },
    {
      index: '02',
      title: 'Multi-State Amazon FBA / GSTR-8 TCS Reconciliation',
      challenge:
        'E-commerce sales spread across multiple state GSTINs needed TCS collected by Amazon reconciled against Tally sales records, state by state.',
      process:
        'Used GSTIN-to-state-code lookups to segment transactions, then reconciled GSTR-8 TCS figures against Tally sales ledgers with IGST/CGST/SGST columns separated for GSTR-1 Table 14 reporting.',
      tools: 'Excel, Tally Prime exports, GST portal (GSTR-8) data.',
      outcome: 'A repeatable state-wise reconciliation structure that keeps TCS reporting consistent across GSTINs.',
      tags: ['GSTR-8', 'Amazon FBA', 'Multi-State GST'],
    },
    {
      index: '03',
      title: 'Import & Customs Duty Accounting',
      challenge:
        'Customs duty on imported goods (including Basic Customs Duty and Social Welfare Surcharge) needed to be correctly incorporated into stock costing, while separately accounting for applicable import IGST/ITC to avoid double-counting.',
      process:
        'Reviewed Bills of Entry against HSN classifications and applicable notification references, and audited duty rates for consistency across shipments over time.',
      tools: 'Tally Prime 7.0, Bill of Entry documentation, HSN/notification references.',
      outcome:
        'Duty costing aligned with AS-2 / Section 145A requirements, and a documented rate audit across a series of import shipments.',
      tags: ['Customs Duty', 'HSN Classification', 'Tally Prime'],
    },
    {
      index: '04',
      title: 'Consolidated Annual Reconciliation Workbooks',
      challenge:
        'Month-by-month GSTR-2A downloads needed consolidating into a single, navigable annual view for ITC reconciliation.',
      process:
        'Wrote Python (openpyxl) scripts to build multi-sheet master workbooks covering all document types across a full financial year, with GSTIN-to-state lookups and formula-driven summaries.',
      tools: 'Python, openpyxl, Excel, GST portal exports.',
      outcome:
        'Consolidated, structured annual reconciliation masters, prepared for audit and internal review, that replace scattered monthly files with one reliable reference.',
      tags: ['Python', 'openpyxl', 'ITC Reconciliation'],
    },
  ] satisfies CaseStudy[],
  note: 'Note: entity names and financial figures are withheld to protect confidential business information. Reconciliation logic, tools, and outcomes described above reflect actual work performed.',
}
