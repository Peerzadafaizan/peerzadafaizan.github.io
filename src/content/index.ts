/**
 * Single entry point for all portfolio content.
 * The object below lists content in the current site's page order; scripts/content-parity.mjs
 * walks it to prove every word of the existing site is preserved.
 */
import { about, hero, identity } from './profile.ts'
import { availability } from './availability.ts'
import { caseStudies } from './caseStudies.ts'
import { contact, footer, resume } from './contact.ts'
import { experience } from './experience.ts'
import { expertise } from './expertise.ts'
import { site } from './site.ts'
import { tools } from './tools.ts'
import { howIWork } from './workflow.ts'

export { about, availability, caseStudies, contact, experience, expertise, footer, hero, howIWork, identity, resume, site, tools }
export type { Fact, Link, SectionHeading } from './types.ts'

export const content = {
  identity,
  site,
  hero,
  about,
  expertise,
  caseStudies,
  howIWork,
  experience,
  tools,
  availability,
  resume,
  contact,
  footer,
} as const

/**
 * Section anchor ids in page order.
 * Approved change (2026-09-24, Stage 4): Case Studies moved directly after the Hero; final order
 * Hero → Case Studies → How I Work → Expertise → India + UAE → Experience → CV + Contact.
 * Approved change (2026-09-24, structural cleanup): Tools is merged into Expertise and About into
 * Experience (see sectionMerges). Their ids stay in this reading order so every existing #tools /
 * #about link still resolves, now to a part inside the parent section.
 * Recorded in scripts/approved-changes.json.
 */
export const sectionOrder = [
  hero.id,
  caseStudies.heading.id,
  howIWork.heading.id,
  expertise.heading.id,
  tools.heading.id,
  availability.heading.id,
  experience.heading.id,
  about.heading.id,
  resume.heading.id,
  contact.heading.id,
] as const

/**
 * Sections rendered as a part of another section (child id → parent id). The child keeps its id,
 * heading and all of its content; it is no longer a separate top-level section.
 */
export const sectionMerges = {
  [tools.heading.id]: expertise.heading.id,
  [about.heading.id]: experience.heading.id,
} as const satisfies Record<string, string>

/** Top-level page sections in order (sectionOrder without the merged parts). */
export const topLevelSections = sectionOrder.filter((id) => !(id in sectionMerges))
