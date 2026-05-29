import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    gsap.to(barRef.current, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    })
  }, [])

  return <div ref={barRef} className="scroll-progress-bar" />
}
