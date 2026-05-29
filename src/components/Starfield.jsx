import { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const stars = []
    const shootingStars = []
    const STAR_COUNT = 500
    const SHOOTING_INTERVAL = 4000

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create stars with depth layers
    for (let i = 0; i < STAR_COUNT; i++) {
      const depth = Math.random() // 0 = far, 1 = close
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: depth * 2 + 0.2,
        depth,
        baseOpacity: 0.2 + depth * 0.6,
        flickerSpeed: 0.5 + Math.random() * 2,
        flickerPhase: Math.random() * Math.PI * 2,
        hue: 200 + Math.random() * 60, // blue to purple range
      })
    }

    // Spawn shooting star
    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.4,
        angle: Math.PI / 4 + Math.random() * 0.3,
        speed: 8 + Math.random() * 6,
        length: 60 + Math.random() * 80,
        life: 1,
        decay: 0.015 + Math.random() * 0.01,
      })
    }

    let shootingTimer = setInterval(spawnShootingStar, SHOOTING_INTERVAL)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = performance.now() * 0.001
      const scrollY = window.scrollY

      // Draw stars
      stars.forEach((s) => {
        const flicker = 0.5 + 0.5 * Math.sin(t * s.flickerSpeed + s.flickerPhase)
        const alpha = s.baseOpacity * (0.4 + 0.6 * flicker)
        const parallaxY = (s.y - scrollY * s.depth * 0.15) % canvas.height
        const adjY = parallaxY < 0 ? parallaxY + canvas.height : parallaxY

        ctx.beginPath()
        ctx.arc(s.x, adjY, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${s.hue}, 70%, 85%, ${alpha})`
        ctx.fill()

        // Glow for bright stars
        if (s.depth > 0.7) {
          ctx.beginPath()
          ctx.arc(s.x, adjY, s.r * 3, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${s.hue}, 80%, 80%, ${alpha * 0.15})`
          ctx.fill()
        }
      })

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]
        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y += Math.sin(ss.angle) * ss.speed
        ss.life -= ss.decay

        if (ss.life <= 0) {
          shootingStars.splice(i, 1)
          continue
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length
        const tailY = ss.y - Math.sin(ss.angle) * ss.length
        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y)
        grad.addColorStop(0, `rgba(255,255,255,0)`)
        grad.addColorStop(1, `rgba(200,220,255,${ss.life * 0.8})`)

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(ss.x, ss.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Head glow
        ctx.beginPath()
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,230,255,${ss.life})`
        ctx.fill()
      }

      requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      clearInterval(shootingTimer)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" />
}
