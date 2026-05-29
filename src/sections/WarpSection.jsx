import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function WarpSection() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const triggers = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Brutalist data lines
    const lines = []
    const LINE_COUNT = 150
    for (let i = 0; i < LINE_COUNT; i++) {
      lines.push({
        y: Math.random() * window.innerHeight,
        length: 10 + Math.random() * 50,
        speed: 5 + Math.random() * 15,
        opacity: Math.random(),
      })
    }

    let progress = { value: 0 }

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: '.warp-pinned',
      scrub: true,
      onUpdate: (self) => {
        progress.value = self.progress
      },
    })
    triggers.push(st)

    // Heading chars animation
    const headingChars = headingRef.current.querySelectorAll('.warp-char')
    gsap.set(headingChars, { opacity: 0, scale: 0.8, x: 20 })

    const headingTween = gsap.to(headingChars, {
      opacity: 1,
      scale: 1,
      x: 0,
      stagger: { each: 0.05 },
      ease: 'steps(3)', // robotic stepping ease
      scrollTrigger: {
        trigger: section,
        start: '10% top',
        end: '50% top',
        scrub: 1,
      },
    })
    triggers.push(headingTween.scrollTrigger)

    let raf
    let frame = 0
    const draw = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const p = progress.value
      
      // Draw mechanical scanning lines based on scroll progress
      const warpSpeed = p * 40
      
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      lines.forEach(line => {
        // Move lines horizontally
        line.x = ((frame * (line.speed + warpSpeed)) % (canvas.width + 100)) - 100
        
        // Draw strict 1px rectangles (no glow, no gradients)
        ctx.fillStyle = `rgba(255, 255, 255, ${line.opacity * (0.2 + p * 0.8)})`
        ctx.fillRect(line.x, line.y, line.length + p * 200, 1)
        
        // occasional data blocks
        if (Math.random() > 0.99) {
          ctx.fillStyle = '#00e5ff'
          ctx.fillRect(line.x, line.y - 2, 5, 5)
        }
      })

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
      triggers.forEach((t) => t && t.kill && t.kill())
      st.kill()
    }
  }, [])

  const splitText = (text) =>
    text.split('').map((c, i) => (
      <span key={i} className="warp-char inline-block">
        {c === ' ' ? '\u00A0' : c}
      </span>
    ))

  return (
    <section
      ref={sectionRef}
      className="relative tech-grid-bg border-y border-white/20"
      style={{ height: '300vh', background: '#000000' }}
    >
      <div className="warp-pinned relative w-full h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        <div className="absolute top-8 left-8 border-l border-white/30 pl-3 z-20">
          <p className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
            SYS.OVERRIDE
          </p>
          <p className="text-xs font-mono text-nebula-cyan">ACCELERATION_PROTO</p>
        </div>

        <div
          ref={headingRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 mix-blend-difference px-4"
        >
          <h2 className="text-[clamp(2rem,8vw,10rem)] font-black leading-none tracking-tighter text-center uppercase whitespace-nowrap">
            <span className="block text-white">{splitText('ACCELERATE')}</span>
            <span className="block text-transparent mt-[-0.1em]" style={{ WebkitTextStroke: '2px white' }}>
              {splitText('BEYOND')}
            </span>
          </h2>
        </div>
        
        {/* Crosshairs overlay */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 z-20" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10 z-20" />
      </div>
    </section>
  )
}
