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

/** Section anchor ids in the current site's page order. */
export const sectionOrder = [
  hero.id,
  about.heading.id,
  expertise.heading.id,
  caseStudies.heading.id,
  howIWork.heading.id,
  experience.heading.id,
  tools.heading.id,
  availability.heading.id,
  resume.heading.id,
  contact.heading.id,
] as const
