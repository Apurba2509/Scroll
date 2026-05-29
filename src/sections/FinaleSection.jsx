import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function FinaleSection({ onRestart }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const tweens = []

    const title = section.querySelector('.finale-title')
    const sub = section.querySelector('.finale-sub')
    const btn = section.querySelector('.finale-btn')
    const badge = section.querySelector('.finale-badge')

    if (title) {
      const t = gsap.fromTo(title,
        { opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', scrollTrigger: { trigger: section, start: 'top 60%', end: 'top 20%', scrub: 1 } }
      )
      tweens.push(t)
    }
    if (badge) {
      const t = gsap.fromTo(badge,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, scrollTrigger: { trigger: section, start: 'top 50%', end: 'top 30%', scrub: 1 } }
      )
      tweens.push(t)
    }
    if (sub) {
      const t = gsap.fromTo(sub,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, scrollTrigger: { trigger: section, start: 'top 40%', end: 'top 10%', scrub: 1 } }
      )
      tweens.push(t)
    }
    if (btn) {
      const t = gsap.fromTo(btn,
        { opacity: 0 },
        { opacity: 1, scrollTrigger: { trigger: section, start: 'top 30%', end: 'top 10%', scrub: 1 } }
      )
      tweens.push(t)
    }

    return () => {
      tweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill()
        if (t.kill) t.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden tech-grid-bg border-t border-white/20"
      style={{ background: '#000000' }}
    >
      <div className="relative z-10 w-full max-w-7xl px-8 flex flex-col items-center">
        
        <div className="finale-badge mb-12 border border-white/30 px-6 py-2 tech-panel">
          <span className="font-mono text-xs tracking-widest uppercase text-white">
            SYS.HALT // END OF TRANSMISSION
          </span>
        </div>

        <h2 className="finale-title text-[clamp(3rem,10vw,9rem)] font-black leading-none tracking-tighter uppercase text-center w-full border-y border-white/20 py-8">
          <span className="block text-white">THE JOURNEY</span>
          <span className="block text-transparent" style={{ WebkitTextStroke: '2px white' }}>NEVER ENDS</span>
        </h2>

        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-12 gap-8 border-b border-white/20 pb-12">
          <p className="finale-sub font-mono text-xs md:text-sm text-white/60 max-w-md leading-relaxed uppercase">
            "The cosmos is all that is, or ever was, or ever will be."
            <span className="block mt-4 text-nebula-cyan">LOG.AUTHOR: C.SAGAN</span>
          </p>

          <button
            onClick={onRestart}
            className="finale-btn tech-panel group flex items-center gap-4 px-8 py-4 font-mono text-xs tracking-widest uppercase text-white cursor-pointer hover:bg-white hover:text-black transition-colors duration-300"
          >
            <span>SYSTEM.REBOOT</span>
            <span className="group-hover:-translate-y-1 transition-transform">↑</span>
          </button>
        </div>
      </div>
    </section>
  )
}
