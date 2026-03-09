'use client'

import { useEffect, useRef, useState } from 'react'
import { Zap, FolderOpen, BrainCircuit, NotebookPen } from 'lucide-react'
import { t, accent } from './shared'

const PILLARS = [
  {
    Icon: Zap,
    iconColor: '#7965F6',
    iconBg: 'rgba(121,101,246,0.12)',
    glowA: [121, 101, 246],
    glowB: [ 56, 189, 248],
    title: 'Clip the internet',
    body: 'Save articles, tweets, research papers, docs — anything on the web — with one click via the browser extension. No copying, no tab-switching.',
  },
  {
    Icon: FolderOpen,
    iconColor: '#5177F6',
    iconBg: 'rgba(81,119,246,0.12)',
    glowA: [ 81, 119, 246],
    glowB: [121, 101, 246],
    title: 'Turn clips into projects',
    body: 'Organise everything into focused workspaces. Keep your AI research separate from your product teardowns, reading list, and design refs.',
  },
  {
    Icon: BrainCircuit,
    iconColor: '#A78BFA',
    iconBg: 'rgba(167,139,250,0.12)',
    glowA: [167, 139, 250],
    glowB: [ 52, 211, 153],
    title: 'AI understands your knowledge',
    body: 'Ask questions, get summaries, and surface connections across your clips. Answers are grounded in your research — zero hallucinations.',
  },
  {
    Icon: NotebookPen,
    iconColor: '#818CF8',
    iconBg: 'rgba(129,140,248,0.12)',
    glowA: [129, 140, 248],
    glowB: [251, 146,  60],
    title: 'Fast, friction-free notes',
    body: 'Write ideas the moment they happen. Notes live alongside your clips in each project — no context-switching, no separate app.',
  },
]

const FEATURES_CSS = `
  @keyframes feat-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .feat-header { animation: feat-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) both; }
  .feat-card   { animation: feat-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) both; }
  .feat-card:nth-child(1) { animation-delay: 0.08s; }
  .feat-card:nth-child(2) { animation-delay: 0.16s; }
  .feat-card:nth-child(3) { animation-delay: 0.24s; }
  .feat-card:nth-child(4) { animation-delay: 0.32s; }

  /* Icon box glow on hover, driven by CSS var */
  .feat-icon-box {
    transition: box-shadow 0.4s ease, background 0.4s ease, transform 0.35s cubic-bezier(0.34,1.3,0.64,1);
  }

  /* Eyebrow */
  @keyframes feat-eyebrow-dot {
    0%, 100% { box-shadow: 0 0 0px rgba(121,101,246,0.5); }
    50%       { box-shadow: 0 0 8px rgba(121,101,246,0.9), 0 0 14px rgba(121,101,246,0.4); }
  }
  .feat-eyebrow-dot { animation: feat-eyebrow-dot 2.4s ease-in-out infinite; }
`

// ── Per-card gradient border canvas ──────────────────────────────────────────
function CardBorder({
  radius,
  colorA,
  colorB,
  active,
}: {
  radius: number
  colorA: number[]
  colorB: number[]
  active: boolean
}) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rafRef      = useRef<number>(0)
  const progressRef = useRef(0)
  const tRef        = useRef(0)
  // Keep a ref so the RAF loop always reads the latest value without a remount
  const activeRef   = useRef(active)
  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    // Retry mount in case canvas isn't ready on first paint (SSR / Strict Mode)
    let canvas = canvasRef.current
    if (!canvas) return
    
    let ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (!ctx) return

    function lerp(a: number[], b: number[], f: number) {
      return a.map((v, i) => Math.round(v + (b[i] - v) * f))
    }
    function colorAt(p: number) {
      const w = ((p % 1) + 1) % 1
      const [r, g, b] = lerp(colorA, colorB, w)
      return `rgb(${r},${g},${b})`
    }

    function resize() {
      canvas = canvasRef.current
      if (!canvas) return
      ctx = canvas.getContext('2d')
      if (!ctx) return
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width  = rect.width  * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    function perimeter(w: number, h: number, r: number) {
      return 2 * (w + h) - 8 * r + 2 * Math.PI * r
    }

    function pointAt(d: number, w: number, h: number, r: number): [number, number] {
      const P = perimeter(w, h, r)
      d = ((d % P) + P) % P
      const arc = (Math.PI / 2) * r
      const segs = [
        { len: w - 2*r, fn: (s: number): [number,number] => [r + s, 0] },
        { len: arc,     fn: (s: number): [number,number] => [w-r+Math.sin(s/r)*r, r-Math.cos(s/r)*r] },
        { len: h - 2*r, fn: (s: number): [number,number] => [w, r + s] },
        { len: arc,     fn: (s: number): [number,number] => [w-r+Math.cos(s/r)*r, h-r+Math.sin(s/r)*r] },
        { len: w - 2*r, fn: (s: number): [number,number] => [w-r-s, h] },
        { len: arc,     fn: (s: number): [number,number] => [r-Math.sin(s/r)*r, h-r+Math.cos(s/r)*r] },
        { len: h - 2*r, fn: (s: number): [number,number] => [0, h-r-s] },
        { len: arc,     fn: (s: number): [number,number] => [r-Math.cos(s/r)*r, r-Math.sin(s/r)*r] },
      ]
      for (const seg of segs) {
        if (d <= seg.len) return seg.fn(d)
        d -= seg.len
      }
      return [r, 0]
    }

    function draw() {
      // Guard: canvas may unmount during a long RAF queue
      if (!canvas || !ctx) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const dpr = window.devicePixelRatio || 1
      const W   = canvas.width  / dpr
      const H   = canvas.height / dpr
      ctx.clearRect(0, 0, W, H)

      // Read live active value from ref — no stale closure
      const target = activeRef.current ? 1 : 0
      progressRef.current += (target - progressRef.current) * 0.07
      const p = progressRef.current

      if (p < 0.005) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const P        = perimeter(W, H, radius)
      const GLOW_LEN = P * 0.30
      const STEPS    = 80

      // dim static base ring — fades in with progress
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(radius, 0)
      ctx.lineTo(W-radius, 0); ctx.arcTo(W, 0, W, radius, radius)
      ctx.lineTo(W, H-radius); ctx.arcTo(W, H, W-radius, H, radius)
      ctx.lineTo(radius, H);   ctx.arcTo(0, H, 0, H-radius, radius)
      ctx.lineTo(0, radius);   ctx.arcTo(0, 0, radius, 0, radius)
      ctx.closePath()
      ctx.strokeStyle = `rgba(${colorA[0]},${colorA[1]},${colorA[2]},${0.18 * p})`
      ctx.lineWidth   = 1
      ctx.stroke()
      ctx.restore()

      // travelling glow tail
      for (let i = 0; i <= STEPS; i++) {
        const frac  = i / STEPS
        const dist  = ((tRef.current * P) + frac * GLOW_LEN) % P
        const [x,y] = pointAt(dist, W, H, radius)
        const cf    = (tRef.current + frac * 0.3) % 1
        const alpha = Math.sin(frac * Math.PI) * 0.9 * p

        ctx.beginPath()
        ctx.arc(x, y, 1.8 * 2.2, 0, Math.PI * 2)
        ctx.fillStyle = colorAt(cf).replace('rgb', 'rgba').replace(')', `,${alpha})`)
        ctx.fill()
      }

      // bright leading dot
      const ld      = (tRef.current * P) % P
      const [lx,ly] = pointAt(ld, W, H, radius)
      const lg      = ctx.createRadialGradient(lx, ly, 0, lx, ly, 8)
      lg.addColorStop(0, colorAt(tRef.current).replace('rgb','rgba').replace(')', `,${0.95 * p})`))
      lg.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(lx, ly, 8, 0, Math.PI * 2)
      ctx.fillStyle = lg
      ctx.fill()

      tRef.current = (tRef.current + 0.0022) % 1
      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, []) // mount once — active changes are read live via activeRef

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', borderRadius: radius, zIndex: 2 }}
    />
  )
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  Icon, iconColor, iconBg, glowA, glowB, title, body,
}: typeof PILLARS[number]) {
  const [hovered, setHovered] = useState(false)

  const rgb = glowA.join(',')

  return (
    <div
      className="feat-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:     'relative',
        background:   hovered ? `rgba(${rgb},0.05)` : t.cardBg,
        border:       `1px solid ${hovered ? `rgba(${rgb},0.22)` : t.border}`,
        borderRadius: 20,
        padding:      '44px 40px',
        // Smooth everything together
        transition:   'background 0.45s cubic-bezier(0.22,1,0.36,1), border-color 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s cubic-bezier(0.22,1,0.36,1)',
        transform:    hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow:    hovered
          ? `0 16px 48px rgba(${rgb},0.12), 0 4px 16px rgba(0,0,0,0.3)`
          : '0 2px 8px rgba(0,0,0,0.15)',
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* Gradient border canvas */}
      <CardBorder radius={20} colorA={glowA} colorB={glowB} active={hovered} />

      {/* Corner ambient glow */}
      <div style={{
        position: 'absolute', top: -60, left: -60, width: 200, height: 200,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${rgb},0.1) 0%, transparent 70%)`,
        pointerEvents: 'none', zIndex: 0,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Icon */}
        <div
          className="feat-icon-box"
          style={{
            width: 60, height: 60, borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 28,
            background: hovered ? `rgba(${rgb},0.18)` : iconBg,
            border: `1px solid rgba(${rgb},${hovered ? 0.35 : 0.18})`,
            boxShadow: hovered ? `0 0 20px rgba(${rgb},0.25), inset 0 0 12px rgba(${rgb},0.1)` : 'none',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          <Icon
            size={26}
            color={iconColor}
            strokeWidth={1.6}
            fill={hovered ? iconColor + '45' : iconColor + '25'}
            style={{ transition: 'fill 0.3s ease' }}
          />
        </div>

        {/* Title */}
        <div style={{
          fontSize: 19, fontWeight: 700,
          color: hovered ? '#fff' : t.fg,
          marginBottom: 12, letterSpacing: '-0.4px', lineHeight: 1.2,
          transition: 'color 0.3s ease',
        }}>
          {title}
        </div>

        {/* Body */}
        <div style={{
          fontSize: 14.5, color: hovered ? 'rgba(255,255,255,0.55)' : t.fgMid,
          lineHeight: 1.75, fontWeight: 300,
          transition: 'color 0.3s ease',
        }}>
          {body}
        </div>
      </div>
    </div>
  )
}

// ── Features section ──────────────────────────────────────────────────────────
export function Features() {
  return (
    <>
      <style>{FEATURES_CSS}</style>
      <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 40px' }}>

        {/* Header */}
        <div className="feat-header" style={{ marginBottom: 72 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11, fontWeight: 600, letterSpacing: '2px',
            textTransform: 'uppercase', color: accent.primary,
            background: 'rgba(121,101,246,0.1)',
            border: '1px solid rgba(121,101,246,0.2)',
            borderRadius: 100, padding: '5px 14px',
            marginBottom: 24,
          }}>
            <span className="feat-eyebrow-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary, display: 'inline-block' }} />
            Features
          </div>

          <h2 style={{
            fontSize: 'clamp(42px,5vw,68px)',
            lineHeight: 1.04, letterSpacing: '-2.5px',
            fontWeight: 800, color: t.fg,
            margin: '0 0 20px 0',
          }}>
            Everything you need.<br />Nothing you don't.
          </h2>

          <p style={{
            fontSize: 17, color: t.fgMid,
            lineHeight: 1.75, fontWeight: 300,
            margin: 0, maxWidth: 520,
          }}>
            Built for researchers, students, and curious minds who want to think — not manage tabs.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
          {PILLARS.map(pillar => (
            <FeatureCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </section>
    </>
  )
}