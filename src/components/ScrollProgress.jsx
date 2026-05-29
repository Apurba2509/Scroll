import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const [percent, setPercent] = useState('00.00')

  useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      setPercent((latest * 100).toFixed(2))
    })
  }, [smoothProgress])

  return (
    <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 mix-blend-difference pointer-events-none">
      <div className="text-[10px] font-mono text-white/50 tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
        SYS.SCROLL // VOYAGE
      </div>
      
      <div className="relative w-[2px] h-32 sm:h-64 bg-white/20">
        <motion.div 
          className="absolute top-0 w-full bg-nebula-cyan"
          style={{ height: useTransform(smoothProgress, [0, 1], ['0%', '100%']) }}
        />
        <motion.div 
          className="absolute w-4 h-1 bg-white -left-1"
          style={{ top: useTransform(smoothProgress, [0, 1], ['0%', '100%']) }}
        />
      </div>

      <div className="font-mono text-xs text-white">
        {percent}%
      </div>
    </div>
  )
}
