import { useEffect, useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Shared state to link GSAP scroll with R3F
const scrollState = { progress: 0 }

const ITEMS = [
  { id: '01', title: 'ANDROMEDA', desc: '2.5M LY AWAY. COLLISION IMMINENT.' },
  { id: '02', title: 'SATURN_RINGS', desc: 'BILLIONS OF ICE PARTICLES.' },
  { id: '03', title: 'SOLAR_FLARES', desc: 'MAGNETIC ERUPTIONS. MASSIVE YIELD.' },
  { id: '04', title: 'BLACK_HOLE', desc: 'EXTREME GRAVITY. LIGHT ESCAPE IMPOSSIBLE.' },
  { id: '05', title: 'NEUTRON_STAR', desc: '716 RPM SPIN RATE. PULSAR EMISSION.' },
  { id: '06', title: 'EXOPLANETS', desc: '5500+ CONFIRMED WORLDS DETECTED.' },
  { id: '07', title: 'WEBB_SCOPE', desc: 'OBSERVING 13.5B YEAR OLD PHOTONS.' },
]

// --- 3D SCENES ---

function AndromedaScene() {
  const particles = useMemo(() => {
    const p = new Float32Array(5000 * 3)
    for (let i = 0; i < 5000; i++) {
      const r = 2 * Math.sqrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      p[i * 3] = r * Math.cos(theta) * (1 + Math.random() * 0.2)
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.2
      p[i * 3 + 2] = r * Math.sin(theta) * (1 + Math.random() * 0.2)
    }
    return p
  }, [])
  
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.1
      ref.current.rotation.z = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <group rotation={[Math.PI / 4, 0, 0]}>
      <Points ref={ref} positions={particles} stride={3}>
        <PointMaterial transparent color="#00e5ff" size={0.015} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  )
}

function SaturnScene() {
  const rings = useMemo(() => {
    const p = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000; i++) {
      const r = 1.2 + Math.random() * 1.5
      const theta = Math.random() * 2 * Math.PI
      p[i * 3] = r * Math.cos(theta)
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      p[i * 3 + 2] = r * Math.sin(theta)
    }
    return p
  }, [])

  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * -0.2
  })

  return (
    <group rotation={[Math.PI / 6, 0, 0]}>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#daa520" wireframe />
      </mesh>
      <Points ref={ref} positions={rings} stride={3}>
        <PointMaterial transparent color="#ffffff" size={0.02} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  )
}

// Custom Shader for Solar Flare
const solarVertex = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  
  // Classic Perlin 3D Noise 
  // by Stefan Gustavson
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float cnoise(vec3 P){
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;
    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);
    vec3 fade_xyz = Pf0 * Pf0 * (3.0 - 2.0 * Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
  }

  void main() {
    vUv = uv;
    vPosition = position;
    float noise = cnoise(position * 2.0 + uTime * 0.5);
    vec3 newPosition = position + normal * noise * 0.3;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`
const solarFragment = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  void main() {
    float intensity = abs(sin(vPosition.y * 5.0 + uTime)) * 0.5 + 0.5;
    gl_FragColor = vec4(1.0, 0.3 * intensity, 0.0, 1.0);
  }
`

function SolarFlareScene() {
  const materialRef = useRef()
  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
  })
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial 
        ref={materialRef}
        vertexShader={solarVertex}
        fragmentShader={solarFragment}
        uniforms={{ uTime: { value: 0 } }}
        wireframe
      />
    </mesh>
  )
}

function BlackHoleScene() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * -2
  })
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh ref={ref} rotation={[Math.PI/2.5, 0, 0]}>
        <torusGeometry args={[1, 0.05, 16, 100]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
    </group>
  )
}

function NeutronStarScene() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 10 // incredibly fast spin
      const scale = 1 + Math.sin(clock.getElapsedTime() * 20) * 0.2
      ref.current.scale.set(scale, scale, scale)
    }
  })
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#00e5ff" wireframe />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.01, 0.5, 3, 8]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.3} wireframe />
      </mesh>
      <mesh position={[0, -1.5, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.5, 3, 8]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  )
}

function ExoplanetScene() {
  const ref1 = useRef()
  const ref2 = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref1.current) {
      ref1.current.position.x = Math.cos(t) * 1.5
      ref1.current.position.z = Math.sin(t) * 1.5
    }
    if (ref2.current) {
      ref2.current.position.x = Math.cos(t * 1.5 + Math.PI) * 1
      ref2.current.position.y = Math.sin(t * 1.5 + Math.PI) * 1
    }
  })
  return (
    <group>
      <mesh><sphereGeometry args={[0.6, 16, 16]}/><meshBasicMaterial color="#ff0055" wireframe/></mesh>
      <mesh ref={ref1}><sphereGeometry args={[0.2, 8, 8]}/><meshBasicMaterial color="#ffffff" wireframe/></mesh>
      <mesh ref={ref2}><sphereGeometry args={[0.1, 8, 8]}/><meshBasicMaterial color="#00e5ff" wireframe/></mesh>
    </group>
  )
}

function WebbScene() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.2
      ref.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })
  return (
    <group ref={ref}>
      {Array.from({ length: 18 }).map((_, i) => {
        const row = Math.floor(i / 5)
        const col = i % 5
        return (
          <mesh key={i} position={[(col - 2) * 0.45, (row - 1.5) * 0.4, 0]} rotation={[0,0,Math.PI/2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 6]} />
            <meshBasicMaterial color="#d4af37" wireframe />
          </mesh>
        )
      })}
    </group>
  )
}

// Global Camera Controller
function CameraController() {
  useFrame((state) => {
    // Scroll progress maps to X position. 
    // Gap between scenes is 10 units. Total width is (ITEMS.length - 1) * 10
    const targetX = scrollState.progress * (ITEMS.length - 1) * 10
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.1)
    state.camera.lookAt(state.camera.position.x, 0, 0)
  })
  return null
}

export default function GallerySection() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current

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
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black tech-grid-bg">
      
      {/* 3D WebGL Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <CameraController />
          <ambientLight intensity={0.5} />
          
          <group position={[0 * 10, 0, 0]}><Float><AndromedaScene /></Float></group>
          <group position={[1 * 10, 0, 0]}><Float><SaturnScene /></Float></group>
          <group position={[2 * 10, 0, 0]}><Float><SolarFlareScene /></Float></group>
          <group position={[3 * 10, 0, 0]}><Float><BlackHoleScene /></Float></group>
          <group position={[4 * 10, 0, 0]}><Float><NeutronStarScene /></Float></group>
          <group position={[5 * 10, 0, 0]}><Float><ExoplanetScene /></Float></group>
          <group position={[6 * 10, 0, 0]}><Float><WebbScene /></Float></group>
        </Canvas>
      </div>

      {/* Brutalist DOM Foreground Layer */}
      <div className="absolute top-8 left-8 z-20 border-l-2 border-nebula-cyan pl-3 mix-blend-difference">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white">SYS.GALLERY</p>
        <p className="text-sm font-mono tracking-widest uppercase text-white">COSMIC_ANOMALIES</p>
      </div>

      <div
        ref={trackRef}
        className="flex items-center h-full will-change-transform z-10 relative"
        style={{ width: 'max-content' }}
      >
        <div className="w-screen h-screen shrink-0 border-r border-white/20 pointer-events-none" />

        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            className="w-screen h-screen shrink-0 flex flex-col justify-between p-16 border-r border-white/20 relative"
          >
            {/* Framer Motion for crazy kinetic typography per card */}
            <motion.div 
              initial={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
              viewport={{ once: false, amount: 0.5 }}
              className="mt-16"
            >
              <h3 className="text-[clamp(3rem,8vw,7rem)] font-black uppercase tracking-tighter leading-none text-transparent" style={{ WebkitTextStroke: '2px white' }}>
                {item.title}
              </h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: false, amount: 0.5 }}
              className="border-l-4 border-nebula-cyan pl-6 mb-16 max-w-lg bg-black/50 backdrop-blur-md p-4"
            >
              <span className="text-[10px] font-mono text-white/40 block mb-2">ENTRY_{item.id} // WEBGL_ACTIVE</span>
              <p className="text-sm font-mono text-white uppercase tracking-widest leading-relaxed">
                {item.desc}
              </p>
            </motion.div>

            {/* Corner tech lines */}
            <div className="absolute top-1/2 left-0 w-8 h-[1px] bg-white/50" />
            <div className="absolute top-1/2 right-0 w-8 h-[1px] bg-white/50" />
          </div>
        ))}
        
        <div className="w-screen h-screen shrink-0 flex items-center justify-center">
           <p className="font-mono text-white/50 uppercase tracking-widest text-xs">[ END OF RENDER BUFFER ]</p>
        </div>
      </div>
    </section>
  )
}
