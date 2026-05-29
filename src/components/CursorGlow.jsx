import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Spring configurations for super smooth tracking
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const mouseX = useSpring(cursorX, springConfig)
  const mouseY = useSpring(cursorY, springConfig)

  // Slower spring for the outer targeting reticle
  const reticleX = useSpring(cursorX, { damping: 30, stiffness: 200, mass: 1 })
  const reticleY = useSpring(cursorY, { damping: 30, stiffness: 200, mass: 1 })

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Only show custom cursor on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', moveCursor)
      window.addEventListener('mouseenter', handleMouseEnter)
      window.addEventListener('mouseleave', handleMouseLeave)
      setIsVisible(true)
    }

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cursorX, cursorY])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden mix-blend-difference">
      {/* Center sharp dot */}
      <motion.div
        className="absolute w-1.5 h-1.5 bg-white rounded-full translate-x-[-50%] translate-y-[-50%]"
        style={{ x: mouseX, y: mouseY }}
      />
      
      {/* Brutalist targeting reticle */}
      <motion.div
        className="absolute w-12 h-12 border border-white/40 translate-x-[-50%] translate-y-[-50%] flex items-center justify-center"
        style={{ x: reticleX, y: reticleY }}
      >
        {/* Crosshair lines */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/30 h-full" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/30 w-full" />
        
        {/* Corner ticks */}
        <div className="absolute top-[-4px] left-[-4px] w-2 h-2 border-t border-l border-white" />
        <div className="absolute top-[-4px] right-[-4px] w-2 h-2 border-t border-right border-white" />
        <div className="absolute bottom-[-4px] left-[-4px] w-2 h-2 border-b border-l border-white" />
        <div className="absolute bottom-[-4px] right-[-4px] w-2 h-2 border-b border-right border-white" />
      </motion.div>
    </div>
  )
}
