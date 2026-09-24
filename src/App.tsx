import { useEffect, useState } from 'react'
import { Footer } from './components/layout/Footer.tsx'
import { Header } from './components/layout/Header.tsx'
import { SkipLink } from './components/layout/SkipLink.tsx'
import { CaseStudies } from './sections/CaseStudies.tsx'
import { Contact } from './sections/Contact.tsx'
import { Experience } from './sections/Experience.tsx'
import { Expertise } from './sections/Expertise.tsx'
import { Hero } from './sections/Hero.tsx'
import { HowIWork } from './sections/HowIWork.tsx'
import { IndiaUae } from './sections/IndiaUae.tsx'
import { Resume } from './sections/Resume.tsx'
import { site } from './content/index.ts'

/**
 * Site shell (skip link, header, navigation, theme toggle, footer) plus all page sections, in the
 * approved order (`sectionOrder` / `topLevelSections` in src/content/index.ts): Hero, Case Studies,
 * How I Work, Expertise (+ Tools part), India + UAE, Experience (+ About part), CV, Contact.
 * Every word comes from src/content.
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
        <Experience />
        <Resume />
        <Contact />
      </main>
      <Footer inert={menuOpen} />
    </>
  )
}
