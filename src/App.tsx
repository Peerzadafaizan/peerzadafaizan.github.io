import { useEffect, useState } from 'react'
import { SectionAnchor } from './components/layout/SectionAnchor.tsx'
import { Footer } from './components/layout/Footer.tsx'
import { Header } from './components/layout/Header.tsx'
import { SkipLink } from './components/layout/SkipLink.tsx'
import {
  about,
  availability,
  caseStudies,
  contact,
  experience,
  expertise,
  hero,
  howIWork,
  resume,
  site,
  tools,
} from './content/index.ts'

/**
 * Stage 3: site shell (skip link, header, desktop + mobile navigation, theme toggle, footer).
 * Sections are placeholders carrying only their existing id, eyebrow and title from src/content;
 * their bodies are built in Stage 4. The page order matches the current live site.
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
        <section id={hero.id} tabIndex={-1} aria-labelledby="top-title" className="relative flex min-h-[calc(100svh-var(--header-h))] items-center py-section outline-none">
          <div className="container-page">
            <p className="font-mono text-label font-semibold uppercase tracking-[0.1em] text-accent">{hero.eyebrow}</p>
            <h1 id="top-title" className="mt-4 font-display text-display font-semibold tracking-[-0.015em] text-ink">
              {hero.name.lead} <span className="text-accent">{hero.name.accent}</span>
            </h1>
          </div>
        </section>
        <SectionAnchor heading={about.heading} />
        <SectionAnchor heading={expertise.heading} alt />
        <SectionAnchor heading={caseStudies.heading} />
        <SectionAnchor heading={howIWork.heading} alt />
        <SectionAnchor heading={experience.heading} />
        <SectionAnchor heading={tools.heading} alt />
        <SectionAnchor heading={availability.heading} />
        <SectionAnchor heading={resume.heading} alt />
        <SectionAnchor heading={contact.heading} />
      </main>
      <Footer inert={menuOpen} />
    </>
  )
}
