import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { TextPlugin } from 'gsap/TextPlugin'
import { Observer } from 'gsap/Observer'
import { CustomEase } from 'gsap/CustomEase'

import Loader from './components/Loader'
import CursorGlow from './components/CursorGlow'
import ScrollProgress from './components/ScrollProgress'
import Starfield from './components/Starfield'
import Hero from './sections/Hero'
import WarpSection from './sections/WarpSection'
import PlanetSection from './sections/PlanetSection'
import ConstellationSection from './sections/ConstellationSection'
import DataSection from './sections/DataSection'
import RevealSection from './sections/RevealSection'
import GalaxySection from './sections/GalaxySection'
import GallerySection from './sections/GallerySection'
import FinaleSection from './sections/FinaleSection'

// Register ALL plugins ONCE at module level
gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin,
  MotionPathPlugin,
  TextPlugin,
  Observer,
  CustomEase,
)

// Custom eases
CustomEase.create('cosmicIn', 'M0,0 C0.11,0.494 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1')
CustomEase.create('rubberBand', 'M0,0 C0.16,0.54 0.22,1.2 0.4,1.2 0.54,1.2 0.58,0.92 0.68,0.92 0.78,0.92 0.82,1.04 0.88,1.04 0.94,1.04 0.96,1 1,1')

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // NO Lenis — native scroll works perfectly with ScrollTrigger
    // Lenis was hijacking scroll and breaking pins/scrub
    const timer = setTimeout(() => setLoaded(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (loaded) {
      // Give everything time to mount & measure, then refresh all triggers
      const t = setTimeout(() => {
        ScrollTrigger.refresh(true)
      }, 400)
      return () => clearTimeout(t)
    }
  }, [loaded])

  const scrollToTop = () => {
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 2.5,
      ease: 'cosmicIn',
    })
  }

  return (
    <>
      <Loader visible={!loaded} />
      <CursorGlow />
      <ScrollProgress />
      <Starfield />

      {loaded && (
        <main className="relative z-[1]">
          <Hero />
          <WarpSection />
          <PlanetSection />
          <ConstellationSection />
          <DataSection />
          <RevealSection />
          <GalaxySection />
          <GallerySection />
          <FinaleSection onRestart={scrollToTop} />
        </main>
      )}
    </>
  )
}
