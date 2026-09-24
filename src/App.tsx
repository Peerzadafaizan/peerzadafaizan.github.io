import { useEffect, useState } from 'react'
import { SectionAnchor } from './components/layout/SectionAnchor.tsx'
import { Footer } from './components/layout/Footer.tsx'
import { Header } from './components/layout/Header.tsx'
import { SkipLink } from './components/layout/SkipLink.tsx'
import { CaseStudies } from './sections/CaseStudies.tsx'
import { Expertise } from './sections/Expertise.tsx'
import { Hero } from './sections/Hero.tsx'
import { HowIWork } from './sections/HowIWork.tsx'
import { IndiaUae } from './sections/IndiaUae.tsx'
import {
  about,
  contact,
  experience,
  resume,
  site,
} from './content/index.ts'

/**
 * Site shell (skip link, header, navigation, theme toggle, footer) plus the page sections.
 * Stage 4 builds the sections one at a time (Hero, Case Studies, How I Work, Expertise + Tools, India + UAE done); the rest are still placeholders carrying
 * only their existing id, eyebrow and title from src/content. Page order follows `sectionOrder` in src/content/index.ts (approved reorder); Tools is a part of
 * Expertise and About a part of Experience (approved merges, `sectionMerges`).
 */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  // The page is rendered by JavaScript, so a URL opened with a #section hash arrives before that
  // section exists. Jump to it once after the first render (prerendering in a later stage makes
  // this native again; the effect is then a harmless no-op).
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' })
  }, [])

  return (
    <>
      <SkipLink />
      <Header menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
      <main id={site.mainId} tabIndex={-1} inert={menuOpen} className="outline-none">
        <Hero />
        <CaseStudies />
        <HowIWork />
        <Expertise />
        <IndiaUae />
        <SectionAnchor heading={experience.heading} parts={[about.heading]} />
        <SectionAnchor heading={resume.heading} alt />
        <SectionAnchor heading={contact.heading} />
      </main>
      <Footer inert={menuOpen} />
    </>
  )
}
