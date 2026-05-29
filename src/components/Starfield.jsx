import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function StarParticles() {
  const ref = useRef()
  
  // Create 5000 stars in a massive 3D volume
  const sphere = useMemo(() => {
    const p = new Float32Array(5000 * 3)
    for (let i = 0; i < 5000; i++) {
      // Random position in a large cube
      p[i * 3] = (Math.random() - 0.5) * 100
      p[i * 3 + 1] = (Math.random() - 0.5) * 100
      p[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    return p
  }, [])

  useFrame((state, delta) => {
    if (ref.current) {
      // Extremely slow rotation of the entire starfield
      ref.current.rotation.x -= delta / 50
      ref.current.rotation.y -= delta / 70
      
      // Tie the Z position (forward flight) to the window scroll
      // As user scrolls down, the starfield flies past them
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = scrollY / (maxScroll || 1)
      
      // Fly forward on Z axis based on scroll (up to 50 units)
      ref.current.position.z = scrollProgress * 50
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial 
          transparent 
          color="#ffffff" 
          size={0.1} 
          sizeAttenuation={true} 
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  )
}

export default function Starfield() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-[-1] bg-black pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <fog attach="fog" args={['#000000', 5, 30]} />
        <StarParticles />
      </Canvas>
    </div>
  )
}
