import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const ITEMS = [
  { id: '01', title: 'ANDROMEDA', desc: '2.5M LY AWAY. COLLISION IMMINENT.', hue: 220 },
  { id: '02', title: 'SATURN_RINGS', desc: 'BILLIONS OF ICE PARTICLES. INDEPENDENT ORBITS.', hue: 45 },
  { id: '03', title: 'SOLAR_FLARES', desc: 'MAGNETIC ERUPTIONS. MASSIVE ENERGY YIELD.', hue: 30 },
  { id: '04', title: 'BLACK_HOLE', desc: 'EXTREME GRAVITY. LIGHT ESCAPE IMPOSSIBLE.', hue: 270 },
  { id: '05', title: 'NEUTRON_STAR', desc: '6B TONS/TEASPOON. 716 RPM SPIN RATE.', hue: 190 },
  { id: '06', title: 'EXOPLANETS', desc: '5500+ CONFIRMED WORLDS DETECTED.', hue: 150 },
  { id: '07', title: 'WEBB_SCOPE', desc: 'OBSERVING 13.5B YEAR OLD PHOTONS.', hue: 310 },
]

export default function GallerySection() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const cards = track.querySelectorAll('.gallery-card')
    const tweens = []

    const rafId = requestAnimationFrame(() => {
      // Horizontal scroll
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

      // Cards animate in sequentially
      cards.forEach((card) => {
        const t = gsap.fromTo(card,
          { opacity: 0, scale: 0.95, filter: 'grayscale(100%) blur(10px)' },
          {
            opacity: 1, scale: 1, filter: 'grayscale(0%) blur(0px)',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: 'left 90%',
              end: 'left 50%',
              scrub: 1,
            },
          }
        )
        tweens.push(t)
      })
    })

    return () => {
      cancelAnimationFrame(rafId)
      tweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill()
        if (t.kill) t.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden tech-grid-bg"
      style={{ background: '#000000' }}
    >
      <div className="absolute top-8 left-8 z-10 border-l-2 border-nebula-cyan pl-3">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50">
          SYS.GALLERY
        </p>
        <p className="text-sm font-mono tracking-widest uppercase text-white">
          COSMIC_ANOMALIES
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex items-center will-change-transform h-screen"
        style={{ width: 'max-content' }}
      >
        <div className="w-screen h-screen flex items-center justify-center shrink-0 px-8 border-r border-white/20">
          <div className="text-left w-full max-w-5xl">
            <h2 className="text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-none tracking-tighter">
              OBSERVED<br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>PHENOMENA</span>
            </h2>
            <div className="mt-8 flex items-center gap-4 border-t border-white/20 pt-4 max-w-sm">
              <span className="text-xs font-mono bg-white text-black px-2 py-1">SCROLL →</span>
              <span className="text-xs font-mono text-white/50">ENGAGE HORIZONTAL DRIVE</span>
            </div>
          </div>
        </div>

        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            className="gallery-card shrink-0 flex items-center justify-center border-r border-white/20 h-full px-16 relative group"
            style={{ width: '450px' }}
          >
            <div className="absolute top-8 left-8 text-[10px] font-mono text-white/30">
              ENTRY_{item.id}
            </div>
            
            <div className="w-full">
              <div 
                className="w-full aspect-square mb-8 relative overflow-hidden bg-white/5 border border-white/10 tech-panel transition-colors duration-300 group-hover:bg-white/10"
                style={{ '--card-hue': item.hue }}
              >
                {/* Abstract geometric representation instead of emojis */}
                <div className="absolute inset-0 flex items-center justify-center mix-blend-screen">
                  <div 
                    className="w-1/2 h-1/2"
                    style={{ 
                      background: `linear-gradient(135deg, hsla(${item.hue}, 80%, 60%, 0.8), transparent)`,
                      filter: 'blur(30px)',
                      borderRadius: i % 2 === 0 ? '50%' : '0%'
                    }}
                  />
                  <div 
                    className="absolute w-1/4 h-1/4 border-2 border-white/80"
                    style={{ transform: `rotate(${i * 15}deg)` }}
                  />
                </div>
                
                {/* Crosshairs */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10" />
              </div>

              <div className="border-l-2 pl-4" style={{ borderColor: `hsl(${item.hue}, 80%, 60%)` }}>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{item.title}</h3>
                <p className="text-xs font-mono text-white/60 uppercase">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="w-screen shrink-0 border-l border-white/20 h-full flex items-center justify-center">
          <div className="text-center font-mono text-white/40 tracking-widest text-sm">
            [ END OF RECORD ]
          </div>
        </div>
      </div>
    </section>
  )
}
