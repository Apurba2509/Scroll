import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const QUOTE = `We are made of starstuff. We are a way for the universe to know itself. Every atom in your body was once inside a star that exploded. You are the universe experiencing itself.`

const HIGHLIGHT_WORDS = new Set([
  'starstuff', 'universe', 'itself', 'atom', 'star', 'exploded', 'experiencing',
])

export default function RevealSection() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const charsRef = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const chars = charsRef.current.filter(Boolean)

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        const litCount = Math.floor(p * chars.length * 1.3)

        chars.forEach((char, i) => {
          if (i < litCount) {
            char.classList.add('lit')
            if (char.classList.contains('is-highlight')) {
              char.classList.add('highlight-brutal')
            }
          } else {
            char.classList.remove('lit')
            char.classList.remove('highlight-brutal')
          }
        })
      },
    })

    const attrTween = gsap.fromTo(section.querySelector('.reveal-attr'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, scrollTrigger: { trigger: section, start: '80% bottom', end: '90% bottom', scrub: 1 } }
    )

    return () => {
      st.kill()
      if (attrTween.scrollTrigger) attrTween.scrollTrigger.kill()
      attrTween.kill()
    }
  }, [])

  const words = QUOTE.split(' ')
  let charIndex = 0

  return (
    <section
      ref={sectionRef}
      className="relative tech-grid-bg border-y border-white/20"
      style={{ height: '300vh', background: '#000000' }}
    >
      <div
        ref={textRef}
        className="sticky top-0 h-screen flex flex-col items-start justify-center px-8 md:px-24 z-10"
      >
        <div className="absolute top-12 left-8 border-l border-white/30 pl-4">
          <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
            AUTHOR.ID: C.SAGAN
          </p>
          <p className="text-xs font-mono text-white mt-1">
            RECORD_0492
          </p>
        </div>

        <p className="text-[clamp(1.5rem,4vw,3.5rem)] font-black leading-[1.3] tracking-tighter max-w-6xl uppercase">
          {words.map((word, wi) => {
            const cleanWord = word.toLowerCase().replace(/[.,]/g, '')
            const isHighlight = HIGHLIGHT_WORDS.has(cleanWord)
            const chars = word.split('').map((c, ci) => {
              const idx = charIndex++
              return (
                <span
                  key={idx}
                  ref={(el) => (charsRef.current[idx] = el)}
                  className={`reveal-char-brutal ${isHighlight ? 'is-highlight' : ''}`}
                >
                  {c}
                </span>
              )
            })
            charIndex++
            return (
              <span key={wi} className="inline-block mr-[0.4em]">
                {chars}
              </span>
            )
          })}
        </p>
        
        <div className="reveal-attr mt-16 border border-white/20 px-6 py-3 tech-panel inline-flex items-center gap-4">
          <span className="w-2 h-2 bg-white rounded-none block" />
          <p className="text-xs font-mono text-white tracking-widest uppercase">
            SOURCE: COSMOS
          </p>
        </div>
      </div>
    </section>
  )
}
