import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

const DATA = [
  { target: 200_000_000_000, label: 'STARS.IN.MILKY_WAY', prefix: '01' },
  { target: 93_000_000, label: 'MILES.TO.SUN', prefix: '02' },
  { target: 13_800_000_000, label: 'YEARS.SINCE.BIG_BANG', prefix: '03' },
  { target: 2_000_000_000_000, label: 'GALAXIES.OBSERVABLE', prefix: '04' },
  { target: 670_616_629, label: 'MPH.SPEED_OF_LIGHT', prefix: '05' },
  { target: -270, label: 'CELSIUS.TEMP_OF_SPACE', prefix: '06' },
]

function formatNumber(n) {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1e12) return sign + (abs / 1e12).toFixed(1) + 'T'
  if (abs >= 1e9) return sign + (abs / 1e9).toFixed(1) + 'B'
  if (abs >= 1e6) return sign + (abs / 1e6).toFixed(1) + 'M'
  if (abs >= 1e3) return sign + (abs / 1e3).toFixed(1) + 'K'
  return sign + abs.toString()
}

export default function DataSection() {
  const sectionRef = useRef(null)
  const numberRefs = useRef([])
  const labelRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const heading = section.querySelector('.data-heading')
    const cards = section.querySelectorAll('.data-card')
    const tweens = []

    const t0 = gsap.fromTo(heading,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 45%', scrub: 1 } }
    )
    tweens.push(t0)

    cards.forEach((card) => {
      const t = gsap.fromTo(card,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 70%', scrub: 1 } }
      )
      tweens.push(t)
    })

    numberRefs.current.forEach((el, i) => {
      if (!el) return
      const target = DATA[i].target
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = formatNumber(Math.round(this.targets()[0].val))
            },
          })
        },
      })
      tweens.push({ kill: () => st.kill(), scrollTrigger: st })
    })

    labelRefs.current.forEach((el, i) => {
      if (!el) return
      const finalText = DATA[i].label
      el.textContent = '...'
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            duration: 1,
            text: { value: finalText, delimiter: '' },
            ease: 'none',
            delay: 0.2,
          })
        },
      })
      tweens.push({ kill: () => st.kill(), scrollTrigger: st })
    })

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
      className="relative min-h-screen flex flex-col items-center justify-center py-32 px-4 tech-grid-bg"
      
    >
      <div className="absolute top-8 left-8">
        <p className="text-xs font-mono text-nebula-cyan uppercase tracking-widest">
          [ SYSTEM.METRICS ]
        </p>
      </div>

      <div className="data-heading w-full max-w-6xl mb-12 border-b border-white/20 pb-4">
        <h2 className="text-[clamp(1.5rem,5vw,4rem)] font-black uppercase tracking-tight text-white m-0 leading-none">
          UNIVERSE<span className="text-nebula-cyan">_DATA</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 max-w-6xl w-full border border-white/20">
        {DATA.map((d, i) => (
          <div
            key={i}
            className="data-card tech-panel p-8 flex flex-col justify-between min-h-[200px]"
            style={{
              borderRight: (i + 1) % 3 !== 0 ? '1px solid rgba(255,255,255,0.15)' : 'none',
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none',
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-mono text-white/40">SYS_{d.prefix}</span>
              <span className="text-xs font-mono text-nebula-cyan">ACTV</span>
            </div>
            
            <div>
              <span
                ref={(el) => (numberRefs.current[i] = el)}
                className="counter-value block text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter"
              >
                0
              </span>
              <span
                ref={(el) => (labelRefs.current[i] = el)}
                className="text-xs text-nebula-cyan/80 tracking-[0.1em] uppercase font-mono block min-h-[2.5em]"
              >
                ...
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
