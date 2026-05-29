import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const PLANETS = [
  { id: '01', name: 'MERCURY', desc: 'SCORCHED CRATERED WORLD. 88-DAY ORBIT.', stat: '430°C PEAK', color: '#8a7d6b', moons: 0, hasRing: false },
  { id: '02', name: 'VENUS', desc: 'CRUSHING PRESSURE. ACID CLOUDS.', stat: 'TOXIC ATMOSPHERE', color: '#e65100', moons: 0, hasRing: false },
  { id: '03', name: 'EARTH', desc: 'PALE BLUE DOT. ONLY KNOWN HARBOR OF LIFE.', stat: '7.9B HUMANS', color: '#27ae60', moons: 1, hasRing: false },
  { id: '04', name: 'MARS', desc: 'THE RED PLANET. HOME TO OLYMPUS MONS.', stat: '72,000 FT VOLCANO', color: '#c0392b', moons: 2, hasRing: false },
  { id: '05', name: 'JUPITER', desc: 'GAS GIANT. IMMENSE GRAVITY WELL.', stat: '350YR STORM', color: '#d4a24e', moons: 4, hasRing: true }, // Showing 4 Galilean moons
  { id: '06', name: 'SATURN', desc: 'JEWEL OF THE SYSTEM. BILLIONS OF ICE PARTICLES.', stat: 'LOW DENSITY', color: '#daa520', moons: 7, hasRing: true },
  { id: '07', name: 'URANUS', desc: 'THE SIDEWAYS PLANET. 98° TILT.', stat: 'ICE GIANT', color: '#26c6da', moons: 5, hasRing: true },
  { id: '08', name: 'NEPTUNE', desc: 'EDGE ICE GIANT. 2,100 KM/H WINDS.', stat: '165YR ORBIT', color: '#1565c0', moons: 3, hasRing: true },
]

export default function PlanetSection() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const cards = track.querySelectorAll('.planet-slide')
    const tweens = []

    const rafId = requestAnimationFrame(() => {
      const scrollTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + (track.scrollWidth - window.innerWidth),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      tweens.push(scrollTween)

      cards.forEach((card, i) => {
        if (i === 0) return // skip intro

        const graphic = card.querySelector('.planet-graphic')
        const info = card.querySelector('.planet-info')
        const moons = card.querySelectorAll('.moon-orbit')

        if (graphic) {
          const t = gsap.fromTo(graphic,
            { scale: 0.8, opacity: 0, rotation: -45 },
            {
              scale: 1, opacity: 1, rotation: 0,
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left 85%',
                end: 'left 50%',
                scrub: 1,
              },
            }
          )
          tweens.push(t)
        }

        if (moons.length > 0) {
          moons.forEach((moon, idx) => {
             const t = gsap.fromTo(moon,
                { opacity: 0, scale: 0 },
                {
                  opacity: 1, scale: 1,
                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: scrollTween,
                    start: 'left 70%',
                    end: 'left 40%',
                    scrub: 1,
                  },
                }
              )
              tweens.push(t)
          })
        }

        if (info) {
          const t = gsap.fromTo(info,
            { opacity: 0, x: 50 },
            {
              opacity: 1, x: 0,
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left 75%',
                end: 'left 45%',
                scrub: 1,
              },
            }
          )
          tweens.push(t)
        }
      })
    })

    return () => {
      cancelAnimationFrame(rafId)
      tweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill()
        t.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden tech-grid-bg border-y border-white/20"
      style={{ background: '#000000' }}
    >
      <div className="absolute top-8 left-8 z-10 border-l border-white/30 pl-3">
        <p className="text-[10px] tracking-widest uppercase text-white/50 font-mono mb-1">
          SYS.TOUR
        </p>
        <p className="text-xs font-mono text-white tracking-widest uppercase">ORBITAL_BODIES</p>
      </div>

      <div
        ref={trackRef}
        className="flex items-center will-change-transform"
        style={{ width: 'max-content' }}
      >
        {/* Intro */}
        <div className="planet-slide w-screen h-screen flex items-center justify-center px-8 shrink-0 border-r border-white/20">
          <div className="text-left w-full max-w-5xl">
            <h2 className="text-[clamp(3rem,8vw,8rem)] font-black uppercase leading-[0.9] tracking-tighter text-white">
              LOCAL<br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>SYSTEM</span>
            </h2>
            <div className="mt-8 flex items-center gap-4 border-t border-white/20 pt-4 max-w-sm">
              <span className="text-xs font-mono bg-white text-black px-2 py-1">SCROLL →</span>
            </div>
          </div>
        </div>

        {/* Planet cards */}
        {PLANETS.map((p) => (
          <div
            key={p.name}
            className="planet-slide w-screen h-screen flex items-center justify-center px-8 shrink-0 border-r border-white/20"
          >
            <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl w-full">
              
              {/* Brutalist Planet Graphic */}
              <div className="planet-graphic relative w-48 h-48 md:w-80 md:h-80 border border-white/20 flex items-center justify-center flex-shrink-0 tech-panel">
                
                {/* Rings (if applicable) */}
                {p.hasRing && (
                  <>
                    <div className="absolute w-[140%] h-[140%] border border-white/30 rounded-full" style={{ transform: 'rotateX(75deg)' }} />
                    <div className="absolute w-[160%] h-[160%] border border-dashed border-white/20 rounded-full" style={{ transform: 'rotateX(75deg)' }} />
                  </>
                )}

                {/* Moons */}
                {Array.from({ length: p.moons }).map((_, mIdx) => {
                  const orbitSize = 120 + mIdx * 25
                  const duration = 10 + mIdx * 5
                  const offset = Math.random() * 360
                  return (
                    <div 
                      key={mIdx} 
                      className="moon-orbit absolute rounded-full border border-white/10"
                      style={{ 
                        width: `${orbitSize}%`, 
                        height: `${orbitSize}%`,
                        animation: `spin ${duration}s linear infinite`,
                        animationDelay: `-${offset}s`
                      }}
                    >
                      <div className="absolute top-0 left-1/2 w-2 h-2 bg-white -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  )
                })}

                {/* Main Planet Body */}
                <div 
                  className="w-1/2 h-1/2 rounded-full relative z-10"
                  style={{ background: p.color, boxShadow: `0 0 50px ${p.color}40` }}
                >
                  <div className="absolute inset-0 border border-white/50 rounded-full" />
                </div>
                
                {/* Crosshairs & tech marks */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/10 z-0" />
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/10 z-0" />
                
                <div className="absolute top-4 right-4 text-[10px] font-mono text-white/50 bg-black px-1 z-20">
                  Ø{(Math.random() * 100000).toFixed(0)}KM
                </div>
                
                {p.moons > 0 && (
                  <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/50 bg-black px-1 z-20">
                    SATELLITES: {p.moons}
                  </div>
                )}
              </div>

              {/* Info panel */}
              <div className="planet-info text-left flex-1 border-l-2 pl-8" style={{ borderColor: p.color }}>
                <span className="text-xs font-mono tracking-widest text-white/40 uppercase mb-2 block">
                  INDEX // {p.id}
                </span>
                <h3 className="text-[clamp(2.5rem,6vw,5rem)] font-black uppercase leading-none tracking-tighter mb-4 text-white">
                  {p.name}
                </h3>
                <p className="text-white/70 font-mono text-sm uppercase max-w-md mb-6 leading-relaxed">
                  {p.desc}
                </p>
                <div className="inline-flex gap-4">
                  <div className="border border-white/30 px-4 py-2 bg-white/5 text-xs font-mono text-white tracking-widest uppercase">
                    STATUS: {p.stat}
                  </div>
                  {p.hasRing && (
                    <div className="border border-white/30 px-4 py-2 bg-white/5 text-xs font-mono text-white tracking-widest uppercase">
                      RINGS DETECTED
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
