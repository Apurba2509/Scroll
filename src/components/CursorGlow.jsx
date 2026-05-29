import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ dot: { x: 0, y: 0 }, ring: { x: 0, y: 0 } })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    let raf
    const animate = () => {
      // Dot follows tightly
      pos.current.dot.x += (mouse.current.x - pos.current.dot.x) * 0.25
      pos.current.dot.y += (mouse.current.y - pos.current.dot.y) * 0.25
      // Ring follows loosely
      pos.current.ring.x += (mouse.current.x - pos.current.ring.x) * 0.1
      pos.current.ring.y += (mouse.current.y - pos.current.ring.y) * 0.1

      if (dotRef.current) {
        dotRef.current.style.left = pos.current.dot.x + 'px'
        dotRef.current.style.top = pos.current.dot.y + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.ring.x + 'px'
        ringRef.current.style.top = pos.current.ring.y + 'px'
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
