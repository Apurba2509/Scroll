import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function GalaxySection() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const tweens = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    let progress = { value: 0 }

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
      onUpdate: (self) => { progress.value = self.progress },
    })
    tweens.push({ kill: () => st.kill(), scrollTrigger: st })

    // Generate brutalist sharp particles
    const ARMS = 2
    const PARTICLES_PER_ARM = 300
    const particles = []

    for (let arm = 0; arm < ARMS; arm++) {
      const baseAngle = (arm / ARMS) * Math.PI * 2
      for (let i = 0; i < PARTICLES_PER_ARM; i++) {
        const t = i / PARTICLES_PER_ARM
        const angle = baseAngle + t * Math.PI * 4
        const radius = 10 + t * 200
        const spread = (Math.random() - 0.5) * (5 + t * 40)
        const spreadAngle = angle + Math.PI / 2
        const x = Math.cos(angle) * radius + Math.cos(spreadAngle) * spread
        const y = Math.sin(angle) * radius + Math.sin(spreadAngle) * spread
        
        // binary size for sharp look
        const size = Math.random() > 0.8 ? 2 : 1
        particles.push({ x, y, size })
      }
    }

    // Core cluster
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 30
      particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: Math.random() > 0.9 ? 2 : 1
      })
    }

    let raf
    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const cx = w / 2
      const cy = h * 0.5
      const p = progress.value
      const rotation = p * Math.PI * 4
      const scale = 0.5 + p * 0.5

      // No soft glow, just sharp white center
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(cx - 2, cy - 2, 4, 4)

      particles.forEach((pt, i) => {
        const rx = pt.x * Math.cos(rotation) - pt.y * Math.sin(rotation)
        const ry = pt.x * Math.sin(rotation) + pt.y * Math.cos(rotation)
        const sx = cx + rx * scale
        const sy = cy + ry * scale * 0.3 // highly flattened perspective

        if (sx < 0 || sx > w || sy < 0 || sy > h) return

        ctx.fillStyle = i % 5 === 0 ? '#00e5ff' : '#ffffff'
        ctx.fillRect(Math.floor(sx), Math.floor(sy), pt.size, pt.size)
      })

      // draw crosshairs on canvas
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, cy)
      ctx.lineTo(w, cy)
      ctx.moveTo(cx, 0)
      ctx.lineTo(cx, h)
      ctx.stroke()

      raf = requestAnimationFrame(draw)
    }
    draw()

    // Title + sub
    const titleEl = section.querySelector('.galaxy-title')
    const subEl = section.querySelector('.galaxy-sub')

    const t3 = gsap.fromTo(titleEl,
      { y: 40, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
      { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', scrollTrigger: { trigger: section, start: 'top 50%', end: 'top 15%', scrub: 1 } }
    )
    tweens.push(t3)

    const t4 = gsap.fromTo(subEl,
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, scrollTrigger: { trigger: section, start: 'top 40%', end: 'top 10%', scrub: 1 } }
    )
    tweens.push(t4)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
      tweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill()
        if (t.kill) t.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-32 tech-grid-bg border-y border-white/20"
      
    >
      <div className="absolute top-8 left-8 border-l border-white/30 pl-3">
        <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase mb-1">SYS.LOC</p>
        <p className="text-xs font-mono text-white tracking-widest uppercase">MILKY_WAY</p>
      </div>

      {/* Galaxy canvas */}
      <div className="relative mb-16 tech-panel border border-white/20" style={{ width: 'clamp(300px, 80vw, 800px)', height: 'clamp(250px, 50vw, 500px)' }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute top-4 left-4 text-[10px] font-mono text-white/40">VIEW: TOP-DOWN.SCANNED</div>
        <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/40">Z-INDEX: FLATTENED</div>
      </div>

      {/* Title */}
      <h2 className="galaxy-title text-[clamp(2.5rem,9vw,8rem)] font-black leading-none tracking-tighter uppercase text-center w-full max-w-6xl">
        <span className="text-white block">THE MILKY WAY</span>
      </h2>
      <div className="galaxy-sub mt-8 border-t border-white/20 pt-4 flex gap-8">
        <span className="text-xs font-mono text-white/60">DIA: 100,000 LY</span>
        <span className="text-xs font-mono text-nebula-cyan">TYPE: SPIRAL</span>
      </div>
    </section>
  )
}
