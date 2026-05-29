import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const EVENTS = [
  { year: '13.8B BC', title: 'THE BIG BANG', desc: 'ALL MATTER, ENERGY, SPACE, AND TIME EMERGE FROM AN INFINITELY DENSE SINGULARITY.' },
  { year: '13.6B BC', title: 'FIRST STARS', desc: 'HYDROGEN CLOUDS COLLAPSE TO FORM THE FIRST MASSIVE, LUMINOUS STARS.' },
  { year: '4.6B BC', title: 'SOLAR SYSTEM FORMS', desc: 'A SWIRLING CLOUD OF GAS AND DUST COLLAPSES TO BIRTH OUR SUN AND PLANETS.' },
  { year: '3.8B BC', title: 'LIFE BEGINS', desc: 'SIMPLE SINGLE-CELLED ORGANISMS EMERGE IN EARTHS PRIMORDIAL OCEANS.' },
  { year: '66M BC', title: 'ASTEROID IMPACT', desc: 'A 10KM ASTEROID STRIKES EARTH, ENDING THE REIGN OF THE DINOSAURS.' },
  { year: '1969 AD', title: 'MOON LANDING', desc: 'HUMANITY TAKES ITS FIRST STEPS ON ANOTHER WORLD. "ONE SMALL STEP…"' },
]

export default function TimelineSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const items = section.querySelectorAll('.timeline-item')
    const lineFill = section.querySelector('.timeline-line-fill')
    const tweens = []

    const t0 = gsap.fromTo(lineFill,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top center',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      }
    )
    tweens.push(t0)

    items.forEach((item, i) => {
      const isLeft = i % 2 === 0
      const card = item.querySelector('.timeline-card')
      const dot = item.querySelector('.timeline-dot')

      if (card) {
        const t = gsap.fromTo(card,
          { x: isLeft ? -50 : 50, opacity: 0, clipPath: isLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
          {
            x: 0, opacity: 1, clipPath: 'inset(0 0 0 0)',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        )
        tweens.push(t)
      }

      if (dot) {
        const t = gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1,
            scrollTrigger: {
              trigger: item,
              start: 'top 70%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        )
        tweens.push(t)
      }
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
      className="relative py-32 px-4 tech-grid-bg border-t border-white/20"
      style={{ background: '#000000' }}
    >
      <div className="text-center mb-32 border-b border-white/20 pb-8 max-w-6xl mx-auto">
        <p className="text-[10px] font-mono tracking-widest uppercase text-white/50 mb-2">
          SYS.NAV // TEMPORAL
        </p>
        <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black uppercase tracking-tighter leading-none text-white">
          COSMIC <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>TIMELINE</span>
        </h2>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Strict center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-white/10">
          <div className="timeline-line-fill absolute inset-0 bg-white" />
        </div>

        <div className="flex flex-col gap-0">
          {EVENTS.map((event, i) => {
            const isLeft = i % 2 === 0
            return (
              <div
                key={i}
                className={`timeline-item relative flex items-stretch min-h-[250px] ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Connector line */}
                <div className={`absolute top-1/2 ${isLeft ? 'right-1/2 left-[25%]' : 'left-1/2 right-[25%]'} h-[1px] bg-white/20 -translate-y-1/2 z-0`} />

                <div className={`timeline-card w-1/2 flex items-center ${isLeft ? 'justify-end pr-16' : 'justify-start pl-16'} z-10`}>
                  <div className={`tech-panel p-8 w-full max-w-md ${isLeft ? 'border-r-4 border-r-white' : 'border-l-4 border-l-white'} bg-black`}>
                    <span className="timeline-year font-mono text-white text-sm tracking-widest uppercase block mb-4 border-b border-white/20 pb-2">
                      T-MINUS // {event.year}
                    </span>
                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{event.title}</h3>
                    <p className="text-white/60 text-xs font-mono leading-relaxed uppercase">{event.desc}</p>
                  </div>
                </div>

                {/* Center marker */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20">
                  <div className="timeline-dot w-6 h-6 border-2 border-white bg-black transform rotate-45" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
