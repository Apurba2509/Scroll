import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

export default function Hero() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const line1 = section.querySelector('.hero-line-1')
    const line2 = section.querySelector('.hero-line-2')
    const metadata = section.querySelectorAll('.hero-meta')
    
    const tl = gsap.timeline({ delay: 0.2 })
    
    // Sharp typography intro
    tl.fromTo(line1,
      { y: 100, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
      { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power4.out' }
    )
    .fromTo(line2,
      { y: 100, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
      { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power4.out' },
      '-=0.8'
    )
    .fromTo(metadata,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.5 },
      '-=0.5'
    )

    // Scroll parallax
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

    scrollTl
      .to(line1, { y: -150, opacity: 0, scale: 0.95 }, 0)
      .to(line2, { y: -100, opacity: 0, scale: 0.95 }, 0)
      .to(metadata, { opacity: 0, x: -50 }, 0)

    return () => {
      tl.kill()
      scrollTl.scrollTrigger?.kill()
      scrollTl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 tech-grid-bg"
      style={{ background: '#000000' }}
    >
      {/* Corner crosshairs */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t border-left border-white/30" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t border-right border-white/30" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-left border-white/30" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-right border-white/30" />

      {/* Metadata sidebar */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-8 hidden md:flex">
        <div className="hero-meta">
          <p className="text-[10px] font-mono text-white/40 mb-1">LAT / LNG</p>
          <p className="text-xs font-mono text-nebula-cyan">00.0000° N<br/>00.0000° W</p>
        </div>
        <div className="hero-meta">
          <p className="text-[10px] font-mono text-white/40 mb-1">STATUS</p>
          <p className="text-xs font-mono text-white">ONLINE <span className="inline-block w-2 h-2 bg-nebula-cyan rounded-none ml-1 animate-pulse" /></p>
        </div>
        <div className="hero-meta">
          <p className="text-[10px] font-mono text-white/40 mb-1">SYSTEM</p>
          <p className="text-xs font-mono text-white border border-white/20 px-2 py-1 inline-block">INIT</p>
        </div>
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto md:ml-32">
        <h1 className="text-[clamp(3.5rem,12vw,12rem)] font-black uppercase tracking-tighter leading-[0.85]">
          <motion.span 
            className="hero-line-1 block text-white"
            initial={{ y: 100, opacity: 0, rotateX: 90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ type: 'spring', bounce: 0.6, duration: 1.5, delay: 0.2 }}
          >
            COSMIC
          </motion.span>
          <motion.span 
            className="hero-line-2 block text-transparent" 
            style={{ WebkitTextStroke: '2px white' }}
            initial={{ y: 100, opacity: 0, rotateX: -90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ type: 'spring', bounce: 0.6, duration: 1.5, delay: 0.4 }}
          >
            SCROLL
          </motion.span>
        </h1>

        <div className="hero-meta mt-12 max-w-sm">
          <p className="text-sm font-mono tracking-widest text-white/60 border-l-2 border-nebula-cyan pl-4">
            INITIATING VOYAGE SEQUENCE...<br/>
            PLEASE SCROLL DOWN
          </p>
        </div>
      </div>
    </section>
  )
}
