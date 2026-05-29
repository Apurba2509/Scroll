import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function RevealSection() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2])
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 flex flex-col items-center justify-center tech-grid-bg border-y border-white/20"
      style={{ background: '#000000' }}
    >
      <div className="absolute top-8 left-8 border-l border-white/30 pl-3">
        <p className="text-[10px] tracking-widest text-white/50 uppercase font-mono mb-1">
          SYS.DECRYPT // LOG_402
        </p>
        <p className="text-xs font-mono text-nebula-cyan tracking-widest uppercase">
          SAGAN_TRANSMISSION
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2 
          className="text-[clamp(2.5rem,7vw,6rem)] font-black uppercase leading-[0.9] tracking-tighter"
          style={{ scale, opacity }}
        >
          <span className="block text-white">THE COSMOS IS</span>
          <span className="block text-transparent" style={{ WebkitTextStroke: '2px white' }}>WITHIN US.</span>
          <span className="block text-white mt-4">WE ARE MADE OF</span>
          <span className="block text-transparent" style={{ WebkitTextStroke: '2px white' }}>STAR-STUFF.</span>
        </motion.h2>
      </div>
    </section>
  )
}
