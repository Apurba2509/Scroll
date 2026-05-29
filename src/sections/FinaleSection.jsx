import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

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
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
          viewport={{ once: false, amount: 0.5 }}
        >
          <div className="inline-block border border-red-500/50 bg-red-500/10 px-6 py-2 mb-8">
            <span className="text-red-500 font-mono text-sm tracking-widest uppercase">
              SYS.HALT // END OF TRANSMISSION
            </span>
          </div>

          <h2 className="finale-text text-[clamp(2.5rem,8vw,7rem)] font-black uppercase leading-none tracking-tighter text-white">
            THE VOID
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>AWAITS</span>
          </h2>
        </motion.div>

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
