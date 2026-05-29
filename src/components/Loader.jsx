import { useEffect, useState } from 'react'

export default function Loader({ visible }) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    if (!visible) return
    let frame = 0
    let current = 0
    
    const update = () => {
      frame++
      // Fast, choppy, mechanical progress
      if (frame % 4 === 0) {
        current += Math.random() * 15
        if (current > 100) current = 100
        setPercent(Math.floor(current))
      }
      
      if (current < 100) {
        requestAnimationFrame(update)
      }
    }
    
    requestAnimationFrame(update)
  }, [visible])

  return (
    <div className={`fixed inset-0 z-[9999] bg-black flex flex-col justify-between p-8 transition-all duration-700 tech-grid-bg ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Top Bar */}
      <div className="flex justify-between items-start font-mono text-[10px] text-white/50 uppercase tracking-widest border-b border-white/20 pb-4">
        <div>
          <p>SYS.INIT // SEQ_01</p>
          <p>COSMIC_SCROLL_V2</p>
        </div>
        <div className="text-right">
          <p>AUTHORIZATION: GRANTED</p>
          <p>STATUS: BOOTING</p>
        </div>
      </div>

      {/* Center huge percentage */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-[clamp(6rem,20vw,15rem)] font-black text-white leading-none tracking-tighter">
          {percent}
          <span className="text-3xl text-nebula-cyan align-top">%</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-full max-w-sm mt-8 border border-white/30 h-8 p-1">
          {/* Progress fill */}
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${percent}%` }}
          />
        </div>
        
        <p className="mt-4 text-xs font-mono tracking-[0.25em] uppercase text-white/40">
          MOUNTING ASSETS... {percent === 100 ? 'DONE' : ''}
        </p>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end font-mono text-[10px] text-white/50 uppercase tracking-widest border-t border-white/20 pt-4">
        <div>
          <p className="animate-pulse text-nebula-cyan">AWAITING CONNECTION_</p>
        </div>
        <div className="text-right">
          <p>LATENCY: 12ms</p>
        </div>
      </div>
    </div>
  )
}
