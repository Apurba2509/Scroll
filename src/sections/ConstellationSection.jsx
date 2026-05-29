import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const CONSTELLATIONS = [
  {
    name: 'ORION',
    subtitle: 'THE_HUNTER',
    viewBox: '0 0 200 260',
    lines: [
      // Shoulders
      { x1: 50, y1: 50, x2: 150, y2: 60 },
      // Belt
      { x1: 70, y1: 130, x2: 100, y2: 125 },
      { x1: 100, y1: 125, x2: 130, y2: 120 },
      // Shoulder to Belt
      { x1: 50, y1: 50, x2: 70, y2: 130 },
      { x1: 150, y1: 60, x2: 130, y2: 120 },
      // Belt to Feet
      { x1: 70, y1: 130, x2: 60, y2: 230 },
      { x1: 130, y1: 120, x2: 140, y2: 210 },
    ],
    stars: [
      { x: 50, y: 50, label: 'BETELGEUSE', highlight: true },
      { x: 150, y: 60, label: 'BELLATRIX' },
      { x: 70, y: 130, label: 'ALNITAK' },
      { x: 100, y: 125, label: 'ALNILAM' },
      { x: 130, y: 120, label: 'MINTAKA' },
      { x: 60, y: 230, label: 'SAIPH' },
      { x: 140, y: 210, label: 'RIGEL', highlight: true },
    ]
  },
  {
    name: 'URSA_MAJOR',
    subtitle: 'THE_BIG_DIPPER',
    viewBox: '0 0 200 200',
    lines: [
      // Handle
      { x1: 20, y1: 140, x2: 50, y2: 110 },
      { x1: 50, y1: 110, x2: 80, y2: 90 },
      { x1: 80, y1: 90, x2: 110, y2: 80 },
      // Bowl
      { x1: 110, y1: 80, x2: 150, y2: 140 },
      { x1: 150, y1: 140, x2: 180, y2: 120 },
      { x1: 180, y1: 120, x2: 130, y2: 50 },
      { x1: 130, y1: 50, x2: 110, y2: 80 },
    ],
    stars: [
      { x: 20, y: 140, label: 'ALKAID' },
      { x: 50, y: 110, label: 'MIZAR' },
      { x: 80, y: 90, label: 'ALIOTH' },
      { x: 110, y: 80, label: 'MEGREZ' },
      { x: 150, y: 140, label: 'PHECDA' },
      { x: 180, y: 120, label: 'MERAK' },
      { x: 130, y: 50, label: 'DUBHE', highlight: true },
    ]
  },
  {
    name: 'CASSIOPEIA',
    subtitle: 'THE_QUEEN',
    viewBox: '0 0 200 150',
    lines: [
      { x1: 20, y1: 100, x2: 60, y2: 40 },
      { x1: 60, y1: 40, x2: 100, y2: 90 },
      { x1: 100, y1: 90, x2: 140, y2: 30 },
      { x1: 140, y1: 30, x2: 180, y2: 80 },
    ],
    stars: [
      { x: 20, y: 100, label: 'CAPH' },
      { x: 60, y: 40, label: 'SCHEDAR', highlight: true },
      { x: 100, y: 90, label: 'GAMMA_CAS' },
      { x: 140, y: 30, label: 'RUCHBAH', highlight: true },
      { x: 180, y: 80, label: 'SEGIN' },
    ]
  }
]

export default function ConstellationSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const cards = section.querySelectorAll('.const-card')
    const tweens = []

    cards.forEach((card, i) => {
      // Card entrance
      const t = gsap.fromTo(card,
        { opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' },
        {
          opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 1,
          },
        }
      )
      tweens.push(t)

      // Draw SVG lines (brutalist strict drawing)
      const lines = card.querySelectorAll('line')
      const stars = card.querySelectorAll('circle')
      
      lines.forEach((line) => {
        const length = line.getTotalLength ? line.getTotalLength() : 200
        gsap.fromTo(line,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            scrollTrigger: {
              trigger: card,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 1,
            },
          }
        )
      })

      // Pop stars in
      gsap.fromTo(stars,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, stagger: 0.1, transformOrigin: 'center',
          scrollTrigger: {
            trigger: card,
            start: 'top 50%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      )
    })

    return () => {
      tweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill()
        t.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-4 tech-grid-bg border-t border-white/20"
      style={{ background: '#000000' }}
    >
      <div className="absolute top-8 left-8 border-l border-white/30 pl-3">
        <p className="text-[10px] tracking-widest text-white/50 uppercase font-mono mb-1">
          SYS.SCAN // CARTOGRAPHY
        </p>
        <p className="text-xs font-mono text-white tracking-widest uppercase">
          STAR_PATTERNS
        </p>
      </div>

      <div className="text-center mb-24 max-w-5xl mx-auto">
        <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-black uppercase tracking-tighter leading-none text-white">
          <span className="block text-transparent" style={{ WebkitTextStroke: '2px white' }}>CONSTELLATION</span>
          <span className="block">MAPPING</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-6xl mx-auto border border-white/20">
        {CONSTELLATIONS.map((c, i) => (
          <div
            key={c.name}
            className="const-card tech-panel p-8 flex flex-col items-center min-h-[400px]"
            style={{
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              borderBottom: 'none'
            }}
          >
            <div className="w-full flex justify-between mb-8 border-b border-white/20 pb-4">
              <span className="text-xs font-mono text-white/50 tracking-widest uppercase">ID_{i+1}</span>
              <span className="text-xs font-mono text-nebula-cyan uppercase">{c.name}</span>
            </div>

            <svg
              viewBox={c.viewBox}
              className="w-full max-w-[240px] h-auto mb-8 flex-1"
            >
              {/* Lines */}
              {c.lines.map((l, idx) => (
                <line
                  key={`line-${idx}`}
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="transition-all duration-300"
                />
              ))}

              {/* Stars */}
              {c.stars.map((s, idx) => (
                <g key={`star-${idx}`}>
                  {s.highlight ? (
                    <rect x={s.x - 4} y={s.y - 4} width="8" height="8" fill="#00e5ff" />
                  ) : (
                    <rect x={s.x - 2} y={s.y - 2} width="4" height="4" fill="#ffffff" />
                  )}
                  <text
                    x={s.x + 8}
                    y={s.y + 3}
                    fill="rgba(255,255,255,0.5)"
                    fontSize="6"
                    fontFamily="monospace"
                    className="uppercase tracking-widest"
                  >
                    {s.label}
                  </text>
                </g>
              ))}
            </svg>

            <div className="w-full pt-4 border-t border-white/20 text-center">
              <p className="text-sm font-mono text-white/70 uppercase tracking-widest">
                {c.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
