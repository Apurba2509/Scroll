import { useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Sphere, Ring } from '@react-three/drei'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const PLANETS = [
  { id: '01', name: 'MERCURY', desc: 'SCORCHED CRATERED WORLD. 88-DAY ORBIT.', stat: '430°C PEAK', color: '#8a7d6b', moons: 0, hasRing: false, radius: 0.4 },
  { id: '02', name: 'VENUS', desc: 'CRUSHING PRESSURE. ACID CLOUDS.', stat: 'TOXIC ATMOSPHERE', color: '#e65100', moons: 0, hasRing: false, radius: 0.6 },
  { id: '03', name: 'EARTH', desc: 'PALE BLUE DOT. ONLY KNOWN HARBOR OF LIFE.', stat: '7.9B HUMANS', color: '#27ae60', moons: 1, hasRing: false, radius: 0.6 },
  { id: '04', name: 'MARS', desc: 'THE RED PLANET. HOME TO OLYMPUS MONS.', stat: '72,000 FT VOLCANO', color: '#c0392b', moons: 2, hasRing: false, radius: 0.5 },
  { id: '05', name: 'JUPITER', desc: 'GAS GIANT. IMMENSE GRAVITY WELL.', stat: '350YR STORM', color: '#d4a24e', moons: 4, hasRing: true, radius: 1.2 },
  { id: '06', name: 'SATURN', desc: 'JEWEL OF THE SYSTEM. BILLIONS OF ICE PARTICLES.', stat: 'LOW DENSITY', color: '#daa520', moons: 7, hasRing: true, radius: 1.0 },
  { id: '07', name: 'URANUS', desc: 'THE SIDEWAYS PLANET. 98° TILT.', stat: 'ICE GIANT', color: '#26c6da', moons: 5, hasRing: true, radius: 0.8 },
  { id: '08', name: 'NEPTUNE', desc: 'EDGE ICE GIANT. 2,100 KM/H WINDS.', stat: '165YR ORBIT', color: '#1565c0', moons: 3, hasRing: true, radius: 0.8 },
]

const SPACING = 15
const scrollState = { progress: 0 }

function Planet3D({ data }) {
  const pointsRef = useRef()
  const wireRef = useRef()
  
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.15
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -clock.getElapsedTime() * 0.05
      wireRef.current.rotation.x = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <group>
      {/* Dark inner core to block stars behind it */}
      <mesh>
        <sphereGeometry args={[data.radius * 0.98, 32, 32]} />
        <meshBasicMaterial color="#020010" />
      </mesh>

      {/* Holographic Particle Cloud */}
      <points ref={pointsRef}>
        <sphereGeometry args={[data.radius, 64, 64]} />
        <pointsMaterial 
          color={data.color} 
          size={0.02} 
          sizeAttenuation={true} 
          transparent 
          opacity={0.9} 
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Sparse Outer Wireframe Grid */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[data.radius * 1.15, 12, 12]} />
        <meshBasicMaterial 
          color={data.color} 
          wireframe 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate={false}
      />

      {data.hasRing && (
        <points rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[data.radius * 1.5, data.radius * 2.5, 128, 8]} />
          <pointsMaterial 
            color={data.color} 
            size={0.015} 
            transparent 
            opacity={0.6} 
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Moons */}
      {Array.from({ length: data.moons }).map((_, mIdx) => {
        const orbitRadius = data.radius * 2.5 + mIdx * 0.6
        const speed = 0.5 + Math.random()
        const angleOffset = Math.random() * Math.PI * 2
        return (
          <Moon 
            key={mIdx} 
            orbitRadius={orbitRadius} 
            speed={speed} 
            angleOffset={angleOffset} 
            color={data.color}
          />
        )
      })}
    </group>
  )
}

function Moon({ orbitRadius, speed, angleOffset, color }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + angleOffset
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * orbitRadius
      ref.current.position.z = Math.sin(t) * orbitRadius
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color="#ffffff" />
      {/* Orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.01, orbitRadius + 0.01, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </mesh>
  )
}

function CameraController() {
  useFrame((state) => {
    // 8 planets + 1 intro = 9 items. Gap is SPACING.
    // The intro is at x=0, Mercury is at x=SPACING, etc.
    const targetX = scrollState.progress * PLANETS.length * SPACING
    state.camera.position.x = targetX
    state.camera.lookAt(targetX, 0, 0)
  })
  return null
}

export default function PlanetSection() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current

    // GSAP ScrollTrigger for horizontal pinned scrolling
    const t = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + (track.scrollWidth - window.innerWidth),
        pin: true,
        anticipatePin: 1,
        scrub: 1,
        snap: {
          snapTo: 1 / PLANETS.length,
          duration: { min: 0.2, max: 0.6 },
          ease: 'power2.inOut'
        },
        onUpdate: (self) => {
          scrollState.progress = self.progress
        }
      }
    })

    return () => {
      if (t.scrollTrigger) t.scrollTrigger.kill()
      t.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-transparent tech-grid-bg border-y border-white/20">
      
      {/* 3D WebGL Background Layer (Interactive) */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
          <CameraController />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          
          {/* We skip x=0 for the intro text. Planets start at x = SPACING */}
          {PLANETS.map((p, i) => (
            <group key={p.id} position={[(i + 1) * SPACING, 0, 0]}>
              <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Planet3D data={p} />
              </Float>
            </group>
          ))}
        </Canvas>
      </div>

      {/* DOM Foreground Layer (Pointer Events None so Canvas receives clicks) */}
      <div className="absolute top-8 left-8 z-20 border-l border-white/30 pl-3 pointer-events-none mix-blend-difference">
        <p className="text-[10px] tracking-widest uppercase text-white/50 font-mono mb-1">
          SYS.TOUR
        </p>
        <p className="text-xs font-mono text-white tracking-widest uppercase">ORBITAL_BODIES</p>
      </div>

      <div
        ref={trackRef}
        className="flex h-full will-change-transform z-10 relative flex-nowrap pointer-events-none"
        style={{ width: `${(PLANETS.length + 1) * 100}vw` }}
      >
        {/* Intro Slide */}
        <div className="w-screen h-screen flex items-center justify-center px-8 shrink-0 border-r border-white/20">
          <div className="text-left w-full max-w-5xl mix-blend-difference">
            <h2 className="text-[clamp(3rem,8vw,8rem)] font-black uppercase leading-[0.9] tracking-tighter text-white">
              LOCAL<br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>SYSTEM</span>
            </h2>
            <div className="mt-8 flex items-center gap-4 border-t border-white/20 pt-4 max-w-sm">
              <span className="text-xs font-mono bg-white text-black px-2 py-1">SCROLL →</span>
            </div>
          </div>
        </div>

        {/* Planet Slides */}
        {PLANETS.map((p) => (
          <div
            key={p.name}
            className="w-screen h-screen shrink-0 flex items-center justify-start md:justify-end px-8 md:px-24 border-r border-white/20 relative"
          >
            {/* Info panel aligned to the right or left so it doesn't block the 3D planet in the center */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false, amount: 0.5 }}
              className="text-left max-w-md w-full border-l-2 pl-8 mix-blend-difference" 
              style={{ borderColor: p.color }}
            >
              <span className="text-xs font-mono tracking-widest text-white/40 uppercase mb-2 block">
                INDEX // {p.id}
              </span>
              <h3 className="text-[clamp(2.5rem,6vw,5rem)] font-black uppercase leading-none tracking-tighter mb-4 text-white">
                {p.name}
              </h3>
              <p className="text-white/70 font-mono text-sm uppercase max-w-md mb-6 leading-relaxed">
                {p.desc}
              </p>
              <div className="inline-flex flex-wrap gap-4">
                <div className="border border-white/30 px-4 py-2 bg-white/5 text-xs font-mono text-white tracking-widest uppercase">
                  STATUS: {p.stat}
                </div>
                {p.hasRing && (
                  <div className="border border-white/30 px-4 py-2 bg-white/5 text-xs font-mono text-white tracking-widest uppercase">
                    RINGS DETECTED
                  </div>
                )}
                {p.moons > 0 && (
                  <div className="border border-white/30 px-4 py-2 bg-white/5 text-xs font-mono text-white tracking-widest uppercase">
                    SATELLITES: {p.moons}
                  </div>
                )}
              </div>
              
              <div className="mt-8 text-[10px] font-mono text-white/40">
                [ DRAG TO ROTATE 3D MESH ]
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}
