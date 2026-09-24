/**
 * Profile: identity, contact constants, hero and About content.
 * Copied word for word from index.html on main @ bd1dab3 (hero section #top and About section #about).
 */
import type { Fact, Link, SectionHeading } from './types.ts'

export const identity = {
  fullName: 'Peerzada Faizan Ahmad',
  email: 'peerfaizan2388@gmail.com',
  emailHref: 'mailto:peerfaizan2388@gmail.com',
  linkedinUrl: 'https://linkedin.com/in/peerzada-faizan-ahmad',
  cvHref: 'Peerzada-Faizan-Ahmad-Resume.pdf',
  photo: { src: 'profile-photo.jpg', alt: 'Peerzada Faizan Ahmad', width: 52, height: 52 },
} as const

export const hero = {
  id: 'top',
  eyebrow: 'Available for accounting & bookkeeping engagements',
  /** The H1 renders as "Peerzada Faizan" + accented "Ahmad". */
  name: { lead: 'Peerzada Faizan', accent: 'Ahmad' },
  roleSeparator: '/',
  roles: ['Accountant', 'Tally Prime', 'GST', 'Reconciliation', 'E-Commerce (Amazon FBA) Accounting'],
  availability: {
    pill: { label: 'India + UAE Accounting Opportunities', href: '#focus' } satisfies Link,
    note: 'Remote Bookkeeping & Accounting Support',
  },
  lede: 'I handle GST compliance, multi-state GSTIN reconciliation, and Tally Prime bookkeeping for a home appliances manufacturer with e-commerce operations — building Excel and Python-driven reconciliation workbooks structured for audit and internal review.',
  ctas: [
    { label: 'Contact Me', href: '#contact' },
    { label: 'View My Work', href: '#projects' },
    { label: 'Download CV', href: identity.cvHref, download: true },
  ] satisfies Link[],
  meta: ['Sopore, Jammu & Kashmir, India', 'Weltherm Home Appliances Pvt. Ltd.', '3+ Years Experience'],
  card: {
    name: 'Peerzada Faizan Ahmad',
    subtitle: 'Accountant · Srinagar / Sopore, J&K',
    recordLabel: 'Profile Record',
    recordId: 'REC‑001',
    stats: [
      { key: 'Core system', value: 'Tally Prime 7.0' },
      { key: 'GST filings', value: 'GSTR-1 · GSTR-3B' },
      { key: 'GSTIN coverage', value: 'Kashmir · Haryana · Karnataka · Maharashtra · West Bengal' },
      { key: 'Reconciliation', value: 'Excel + Python (openpyxl)' },
      { key: 'Education', value: 'B.A. Economics, Univ. of Kashmir' },
    ] satisfies Fact[],
  },
}

export const about = {
  heading: {
    id: 'about',
    eyebrow: 'About',
    title: 'A reconciliation-first accountant',
  } satisfies SectionHeading,
  statTiles: [
    { index: 'REC‑01', value: '3+ Yrs', caption: 'Accounting & GST compliance experience' },
    { index: 'REC‑02', value: 'Multi-State', caption: 'GSTIN & Amazon FBA Accounting' },
    { index: 'REC‑03', value: 'Bidirectional', caption: 'GSTIN + invoice-level reconciliation logic' },
    { index: 'REC‑04', value: '7.0', caption: 'Tally Prime — import & inventory cost accounting' },
  ],
  paragraphs: [
    "I'm an accountant based in Sopore, Jammu & Kashmir, currently working with Weltherm Home Appliances Pvt. Ltd. in Srinagar, where I handle GST compliance, multi-state GSTIN management, Tally Prime bookkeeping, and accounting for the company's e-commerce (Amazon FBA) operations.",
    'My work centers on reconciliation: matching GST portal data against Tally records, tracing Amazon settlement and TCS reports back to the books, and building the Excel and Python-based workbooks that make discrepancies visible instead of buried. I pay close attention to the difference between what a supplier or a marketplace reports and what actually sits in the ledger — and to documenting that difference in a way that stands up to review.',
    'Alongside GST and reconciliation work, I handle import accounting in Tally Prime — costing customs duty (BCD, SWS) into stock items correctly under AS-2 and Section 145A — and E-Way Bill generation for multi-leg import shipments.',
    "I hold a Bachelor's degree in Economics from the University of Kashmir, and before Weltherm, I worked as an Accountant and Data Entry Team Leader at Alrit and Associates.",
  ],
  facts: [
    { key: 'Location', value: 'Sopore, J&K, India' },
    { key: 'Current role', value: 'Accountant, Weltherm Home Appliances' },
    { key: 'Since', value: 'April 2025' },
    { key: 'Education', value: 'B.A. Economics, University of Kashmir' },
    { key: 'Core system', value: 'Tally Prime' },
    { key: 'Specialization', value: 'GST & e-commerce reconciliation' },
    { key: 'Open to', value: 'India & UAE opportunities' },
    { key: 'LinkedIn', value: '/peerzada-faizan-ahmad', href: identity.linkedinUrl, external: true },
  ] satisfies Fact[],
}
