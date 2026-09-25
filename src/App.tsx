import { useEffect, useRef, useState } from 'react'
import { useMotion } from './animations/useMotion.ts'
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
 * Every word comes from src/content. Motion (GSAP + ScrollTrigger) attaches to <main> through
 * useMotion — see src/animations/. The header, mobile menu and footer are not animated by GSAP.
 */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  useMotion(mainRef)

  // The page is rendered by JavaScript, so a URL opened with a #section hash arrives before that
  // section exists. Jump to it once after the first render (prerendering in a later stage makes
  // this native again; the effect is then a harmless no-op). The jump is instant, like a browser's
  // own hash landing — a smooth scroll here would be cut short by ScrollTrigger's load-time refresh.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    const target = id ? document.getElementById(id) : null
    if (!target) return
    const jump = () => target.scrollIntoView({ block: 'start', behavior: 'instant' })
    jump()
    // The web fonts (display=swap) can arrive just after this jump and re-wrap the text above the
    // target. Re-align once they are ready — unless the visitor has already scrolled or navigated.
    let userMoved = false
    let active = true
    const onUserInput = () => {
      userMoved = true
    }
    const inputs = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const
    for (const type of inputs) window.addEventListener(type, onUserInput, { passive: true, once: true })
    void document.fonts?.ready.then(() => {
      if (active && !userMoved && decodeURIComponent(window.location.hash.slice(1)) === id) jump()
    })
    return () => {
      active = false
      for (const type of inputs) window.removeEventListener(type, onUserInput)
    }
  }, [])

  return (
    <>
      <SkipLink />
      <Header menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
      <main ref={mainRef} id={site.mainId} tabIndex={-1} inert={menuOpen} className="outline-none">
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
