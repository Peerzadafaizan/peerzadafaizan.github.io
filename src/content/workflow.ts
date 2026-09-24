/**
 * How I Work (section #workflow): the eight process steps and the four data-flow diagrams.
 * Copied word for word from index.html on main @ bd1dab3.
 */
import type { SectionHeading } from './types.ts'

export const howIWork = {
  heading: {
    id: 'workflow',
    eyebrow: 'Process',
    title: 'How I Work',
    subtitle: 'A consistent approach applied to GST, Amazon and import reconciliation alike.',
  } satisfies SectionHeading,
  steps: [
    { number: '01', title: 'Collect source data', text: 'Pull GST portal downloads, Tally exports and Amazon reports for the period in question.' },
    { number: '02', title: 'Clean & structure', text: 'Normalize formats and separate portal-reported data from internal ledger data.' },
    { number: '03', title: 'Reconcile', text: 'Match on a strict key — typically GSTIN + Invoice Number — using formula-driven or Python-scripted logic.' },
    { number: '04', title: 'Resolve exceptions', text: 'Apply a probable-match layer, then investigate true mismatches individually.' },
    { number: '05', title: 'Flag discrepancies', text: 'Use conditional formatting to make match status visually clear at a glance.' },
    { number: '06', title: 'Correct & document', text: 'Account for genuine differences and document the reasoning behind each correction.' },
    { number: '07', title: 'Prepare final reports', text: 'Produce reconciliation summaries ready for filing or internal review.' },
    { number: '08', title: 'Maintain audit trail', text: 'Keep working files structured so the reconciliation can be re-verified later.' },
  ],
  flowIntro: 'A simplified view of how data actually moves through this process, from source to reconciled books:',
  flows: [
    { caption: 'GST reconciliation', nodes: ['GST Portal', 'Tally Prime', 'Excel Workbook', 'Reconciliation'] },
    { caption: 'E-commerce (Amazon FBA) accounting', nodes: ['Amazon Reports', 'Sales Register', 'TCS / GST', 'Books'] },
    { caption: 'Invoice-level matching', nodes: ['Invoice', 'Matching', 'Exception', 'Correction'] },
    { caption: 'Import & customs duty accounting', nodes: ['Bill of Entry', 'Customs Duty', 'Inventory Cost', 'Tally Prime', 'Accounting Records'] },
  ],
}
