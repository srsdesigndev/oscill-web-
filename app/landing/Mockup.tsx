'use client'

import { useState, useEffect, useRef } from 'react'
import { t, accent, ClippxLogo } from './shared'

// ── Types ─────────────────────────────────────────────────────────────────────
type Clip    = { id: number; color: string; title: string; body: string; new?: boolean }
type Message = { role: 'user' | 'ai'; text: string }

const PROJECTS = [
  { color: accent.primary, label: 'AI Research 2025', active: true },
  { color: '#4ACFD2',      label: 'Product Teardowns' },
  { color: '#F0B400',      label: 'Reading List' },
  { color: '#E23E2B',      label: 'Design Refs' },
]

const BASE_CLIPS: Clip[] = [
  { id: 1, color: '#7965F6', title: 'The Transformer Architecture Explained',   body: 'Self-attention mechanisms allow models to weigh relevance across input sequences…' },
  { id: 2, color: '#5177F6', title: 'Scaling Laws for Neural Language Models',  body: 'Performance improves predictably with model size, dataset size, and compute…' },
]

const INCOMING_CLIPS: Clip[] = [
  { id: 3, color: '#9B8CF8', title: 'Chain-of-thought prompting elicits reasoning', body: 'A simple prompting strategy that dramatically improves multi-step reasoning…' },
  { id: 4, color: '#A78BFA', title: 'Emergent abilities of large language models',  body: 'Abilities that appear suddenly at certain scales — not present in smaller models…' },
]

const CHAT_SEQUENCE: Message[] = [
  { role: 'user', text: 'Summarise the key themes' },
  { role: 'ai',   text: 'Central theme: **scaling & emergent behaviour** in LLMs — from architecture to training dynamics.' },
  { role: 'user', text: 'What connects all these papers?' },
  { role: 'ai',   text: 'All four explore how **scale unlocks capability** — larger models behave qualitatively differently, not just quantitatively.' },
]

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  /* Clip card entrance */
  @keyframes clip-in {
    from { opacity: 0; transform: translateY(-10px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  /* Chat message entrance */
  @keyframes msg-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  /* Typing dots */
  @keyframes typing {
    0%, 100% { opacity: 0.25; transform: translateY(0); }
    50%       { opacity: 1;    transform: translateY(-2px); }
  }
  /* Sidebar project row hover */
  @keyframes row-glow {
    from { box-shadow: none; }
    to   { box-shadow: inset 0 0 12px rgba(121,101,246,0.08); }
  }
  /* NEW badge pulse */
  @keyframes new-badge-pulse {
    0%, 100% { box-shadow: 0 0 0px rgba(121,101,246,0.4); }
    50%       { box-shadow: 0 0 8px rgba(121,101,246,0.7); }
  }
  /* Send button micro-scale */
  @keyframes send-pop {
    0%   { transform: scale(1); }
    40%  { transform: scale(0.88); }
    100% { transform: scale(1); }
  }
  /* Scrollbar */
  .mk-scroll::-webkit-scrollbar       { width: 3px; }
  .mk-scroll::-webkit-scrollbar-track { background: transparent; }
  .mk-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

  .clip-new   { animation: clip-in 0.42s cubic-bezier(0.34,1.2,0.64,1) both; }
  .msg-new    { animation: msg-in  0.32s cubic-bezier(0.22,1,0.36,1) both; }
  .dot-pulse  { animation: typing 1.1s ease-in-out infinite; }
  .dot-pulse:nth-child(2) { animation-delay: 0.18s; }
  .dot-pulse:nth-child(3) { animation-delay: 0.36s; }
  .new-badge  { animation: new-badge-pulse 2s ease-in-out infinite; }

  /* Clip card hover */
  .clip-card {
    transition: background 0.18s, border-color 0.18s, transform 0.18s;
    cursor: default;
  }
  .clip-card:hover {
    background: rgba(255,255,255,0.055) !important;
    transform: translateX(2px);
  }

  /* Sidebar row hover */
  .sidebar-row {
    transition: background 0.15s, color 0.15s;
    cursor: pointer;
  }
  .sidebar-row:hover { background: rgba(255,255,255,0.04) !important; }

  /* Live dot beacon */
  @keyframes beacon {
    0%   { box-shadow: 0 0 0 0   rgba(121,101,246,0.6); }
    70%  { box-shadow: 0 0 0 5px rgba(121,101,246,0); }
    100% { box-shadow: 0 0 0 0   rgba(121,101,246,0); }
  }
  .live-dot { animation: beacon 1.8s ease-out infinite; }

  /* Titlebar URL bar subtle shimmer */
  @keyframes url-shimmer {
    0%   { opacity: 0.5; }
    50%  { opacity: 0.75; }
    100% { opacity: 0.5; }
  }
  .url-text { animation: url-shimmer 3s ease-in-out infinite; }

  /* AI icon spin on new message */
  @keyframes ai-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .ai-icon-active { animation: ai-spin 0.6s cubic-bezier(0.22,1,0.36,1); }

  /* Empty state float */
  @keyframes empty-float {
    0%, 100% { transform: translateY(0px); opacity: 0.4; }
    50%       { transform: translateY(-4px); opacity: 0.55; }
  }
  .empty-float { animation: empty-float 3s ease-in-out infinite; }
`

// ── Canvas gradient border (same engine as CTABanner) ─────────────────────────
function GradientBorder({ radius = 20 }: { radius?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let t = 0

    const stops = [
      { pos: 0,    color: [121, 101, 246] },
      { pos: 0.25, color: [ 56, 189, 248] },
      { pos: 0.5,  color: [ 52, 211, 153] },
      { pos: 0.75, color: [251, 146,  60] },
      { pos: 1,    color: [121, 101, 246] },
    ]

    function lerp(a: number[], b: number[], f: number) {
      return a.map((v, i) => Math.round(v + (b[i] - v) * f))
    }
    function colorAt(p: number) {
      const w = ((p % 1) + 1) % 1
      for (let i = 0; i < stops.length - 1; i++) {
        const s = stops[i], e = stops[i + 1]
        if (w >= s.pos && w <= e.pos) {
          const f = (w - s.pos) / (e.pos - s.pos)
          const [r, g, b] = lerp(s.color, e.color, f)
          return `rgb(${r},${g},${b})`
        }
      }
      return 'rgb(121,101,246)'
    }

    function resize() {
      if (!canvas) return
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
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      const W   = canvas.width  / dpr
      const H   = canvas.height / dpr
      ctx.clearRect(0, 0, W, H)

      const P        = perimeter(W, H, radius)
      const GLOW_LEN = P * 0.22
      const STEPS    = 100
      const B        = 1.2

      // dim base ring
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(radius, 0)
      ctx.lineTo(W-radius, 0); ctx.arcTo(W, 0, W, radius, radius)
      ctx.lineTo(W, H-radius); ctx.arcTo(W, H, W-radius, H, radius)
      ctx.lineTo(radius, H);   ctx.arcTo(0, H, 0, H-radius, radius)
      ctx.lineTo(0, radius);   ctx.arcTo(0, 0, radius, 0, radius)
      ctx.closePath()
      ctx.strokeStyle = 'rgba(121,101,246,0.1)'
      ctx.lineWidth   = B
      ctx.stroke()
      ctx.restore()

      // travelling glow tail
      for (let i = 0; i <= STEPS; i++) {
        const frac  = i / STEPS
        const dist  = ((t * P) + frac * GLOW_LEN) % P
        const [x,y] = pointAt(dist, W, H, radius)
        const cf    = (t + frac * 0.22) % 1
        const alpha = Math.sin(frac * Math.PI) * 0.85
        ctx.beginPath()
        ctx.arc(x, y, B * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = colorAt(cf).replace('rgb','rgba').replace(')', `,${alpha})`)
        ctx.fill()
      }

      // bright leading dot
      const ld  = (t * P) % P
      const [lx,ly] = pointAt(ld, W, H, radius)
      const lg  = ctx.createRadialGradient(lx, ly, 0, lx, ly, 9)
      lg.addColorStop(0, colorAt(t).replace('rgb','rgba').replace(')', ',0.9)'))
      lg.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(lx, ly, 9, 0, Math.PI * 2)
      ctx.fillStyle = lg
      ctx.fill()

      t = (t + 0.0016) % 1
      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [radius])

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', borderRadius:radius, zIndex:10 }}
    />
  )
}

// ── AppMockup ─────────────────────────────────────────────────────────────────
export function AppMockup() {
  const [clips,    setClips]    = useState<Clip[]>(BASE_CLIPS)
  const [messages, setMessages] = useState<Message[]>([])
  const [typing,   setTyping]   = useState(false)
  const [phase,    setPhase]    = useState(0)
  const [aiActive, setAiActive] = useState(false)
  const chatRef  = useRef<HTMLDivElement>(null)
  const uidRef   = useRef(100)

  useEffect(() => {
    const seq = [
      () => setTimeout(() => { setClips(c => [...c, { ...INCOMING_CLIPS[0], id: ++uidRef.current, new: true }]); setPhase(1) }, 1800),
      () => setTimeout(() => { setClips(c => [...c, { ...INCOMING_CLIPS[1], id: ++uidRef.current, new: true }]); setPhase(2) }, 3200),
      () => setTimeout(() => { setMessages([CHAT_SEQUENCE[0]]); setTyping(true); setPhase(3) }, 4600),
      () => setTimeout(() => { setTyping(false); setMessages([CHAT_SEQUENCE[0], CHAT_SEQUENCE[1]]); setAiActive(true); setPhase(4) }, 6000),
      () => setTimeout(() => { setAiActive(false) }, 6600),
      () => setTimeout(() => { setMessages(m => [...m, CHAT_SEQUENCE[2]]); setTyping(true); setPhase(5) }, 7800),
      () => setTimeout(() => { setTyping(false); setMessages(m => [...m, CHAT_SEQUENCE[3]]); setAiActive(true); setPhase(6) }, 9400),
      () => setTimeout(() => { setAiActive(false) }, 10000),
      () => setTimeout(() => { setClips(BASE_CLIPS); setMessages([]); setTyping(false); setPhase(0) }, 13000),
    ]
    const timers = seq.map(fn => fn())
    return () => timers.forEach(id => clearTimeout(id as ReturnType<typeof setTimeout>))
  }, [phase === 0 ? phase : undefined])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, typing])

  const renderText = (text: string) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i} style={{ color: '#fff', fontWeight: 700 }}>{part}</strong> : part
    )

  return (
    <div style={{ position: 'relative' }}>
      <style>{CSS}</style>

      {/* ── Outer glow halo ── */}
      <div style={{
        position: 'absolute', inset: -1, borderRadius: 22, zIndex: 0, pointerEvents: 'none',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 120px rgba(0,0,0,0.8), 0 12px 48px rgba(121,101,246,0.12)',
      }} />

      {/* ── Main shell ── */}
      <div style={{
        position: 'relative',
        background: '#111113',
        borderRadius: 20,
        border: '1px solid transparent',
        overflow: 'hidden',
        fontFamily: 'inherit',
        zIndex: 1,
      }}>

        {/* Travelling gradient border */}
        <GradientBorder radius={20} />

        {/* Top inset sheen */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:180, background:'linear-gradient(180deg, rgba(121,101,246,0.05) 0%, transparent 100%)', pointerEvents:'none', zIndex:2 }} />

        {/* ── Titlebar ── */}
        <div style={{ height:44, background:'#161618', borderBottom:`1px solid rgba(255,255,255,0.07)`, display:'flex', alignItems:'center', padding:'0 18px', gap:8, position:'relative', zIndex:3 }}>
          {/* Traffic lights */}
          {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
            <div key={c} style={{ width:11, height:11, borderRadius:'50%', background:c, flexShrink:0, boxShadow:`0 0 6px ${c}60` }} />
          ))}
          {/* URL bar */}
          <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
            <div style={{ background:'#1e1e21', borderRadius:7, height:24, width:270, display:'flex', alignItems:'center', gap:7, padding:'0 11px', border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:accent.primary, flexShrink:0, boxShadow:`0 0 5px ${accent.primary}` }} />
              <span className="url-text" style={{ fontSize:10.5, color:'rgba(255,255,255,0.38)', letterSpacing:'0.01em' }}>app.clippx.io/dashboard</span>
            </div>
          </div>
          {/* Live pill */}
          <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:100, background:'rgba(121,101,246,0.1)', border:`1px solid rgba(121,101,246,0.25)` }}>
            <div className="live-dot" style={{ width:5, height:5, borderRadius:'50%', background:accent.primary }} />
            <span style={{ fontSize:9.5, color:accent.primary, fontWeight:700, letterSpacing:'0.6px' }}>LIVE</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ display:'flex', height:464, position:'relative', zIndex:3 }}>

          {/* ── Sidebar ── */}
          <div style={{ width:196, flexShrink:0, background:'#0c0c0e', borderRight:`1px solid rgba(255,255,255,0.06)`, padding:'14px 8px', display:'flex', flexDirection:'column', gap:2 }}>
            {/* Brand */}
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 8px', marginBottom:14 }}>
              <ClippxLogo size={15} color={accent.primary} />
              <span style={{ fontFamily:"'Michroma',sans-serif", fontSize:10.5, color:'rgba(255,255,255,0.9)', fontWeight:400 }}>
                Open<strong>Clips</strong>
              </span>
            </div>

            <span style={{ fontSize:9, fontWeight:600, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'0 8px 4px' }}>Workspace</span>
            <div className="sidebar-row" style={{ display:'flex', alignItems:'center', gap:7, padding:'6px 8px', borderRadius:7, fontSize:11, color:'rgba(255,255,255,0.38)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Home
            </div>

            <span style={{ fontSize:9, fontWeight:600, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'10px 8px 5px' }}>Projects</span>
            {PROJECTS.map(({ color, label, active }) => (
              <div key={label} className="sidebar-row" style={{
                display:'flex', alignItems:'center', gap:7, padding:'7px 8px', borderRadius:7, fontSize:11,
                background: active ? `rgba(121,101,246,0.12)` : 'transparent',
                border:     active ? `1px solid rgba(121,101,246,0.22)` : '1px solid transparent',
                color:      active ? '#fff' : 'rgba(255,255,255,0.42)',
                fontWeight: active ? 500 : 400,
              }}>
                <div style={{ width:7, height:7, borderRadius:2, background:color, flexShrink:0, boxShadow: active ? `0 0 6px ${color}80` : 'none' }} />
                {label}
              </div>
            ))}

            <div style={{ marginTop:'auto', padding:'0 4px' }}>
              <div className="sidebar-row" style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 8px', borderRadius:7, fontSize:10.5, color:'rgba(255,255,255,0.25)', border:'1px dashed rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize:13, lineHeight:1 }}>+</span> New project
              </div>
            </div>
          </div>

          {/* ── Clips panel ── */}
          <div style={{ flex:1, padding:'16px 16px', display:'flex', flexDirection:'column', gap:10, overflow:'hidden', minWidth:0, background:'#111113' }}>
            {/* Panel header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:12.5, fontWeight:700, color:'#fff' }}>AI Research 2025</span>
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.28)', background:'rgba(255,255,255,0.05)', borderRadius:4, padding:'2px 7px', border:'1px solid rgba(255,255,255,0.08)' }}>
                  {clips.length} clips
                </span>
              </div>
              <button style={{
                background: accent.gradient, color:'#fff',
                fontSize:10.5, fontWeight:600, padding:'5px 12px',
                borderRadius:6, border:'none', boxShadow: accent.glow,
                display:'flex', alignItems:'center', gap:4, cursor:'pointer',
                transition:'opacity 0.15s',
              }}>
                <span style={{ fontSize:13, lineHeight:1 }}>+</span> New clip
              </button>
            </div>

            {/* Divider */}
            <div style={{ height:1, background:'linear-gradient(90deg, rgba(121,101,246,0.2), transparent)', flexShrink:0 }} />

            {/* Clip cards */}
            <div className="mk-scroll" style={{ display:'flex', flexDirection:'column', gap:7, overflowY:'auto', flex:1 }}>
              {clips.map((clip, i) => (
                <div
                  key={clip.id}
                  className={`clip-card${i >= BASE_CLIPS.length ? ' clip-new' : ''}`}
                  style={{
                    background:'rgba(255,255,255,0.03)',
                    border:`1px solid rgba(255,255,255,0.07)`,
                    borderRadius:10,
                    padding:'11px 13px',
                    display:'flex', gap:10,
                    borderLeft:`2px solid ${clip.color}70`,
                    position:'relative', overflow:'hidden',
                  }}
                >
                  {/* Subtle left glow on new cards */}
                  {i >= BASE_CLIPS.length && (
                    <div style={{ position:'absolute', left:0, top:0, bottom:0, width:60, background:`linear-gradient(90deg, ${clip.color}12, transparent)`, pointerEvents:'none' }} />
                  )}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11.5, fontWeight:600, color:'rgba(255,255,255,0.9)', marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {clip.title}
                    </div>
                    <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.4)', lineHeight:1.55 }}>{clip.body}</div>
                  </div>
                  {i >= BASE_CLIPS.length && (
                    <div className="new-badge" style={{ fontSize:8.5, fontWeight:700, color:accent.primary, background:`${accent.primary}15`, border:`1px solid rgba(121,101,246,0.35)`, borderRadius:4, padding:'2px 6px', alignSelf:'flex-start', flexShrink:0, letterSpacing:'0.5px' }}>
                      NEW
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── AI Pane ── */}
          <div style={{ width:244, flexShrink:0, borderLeft:`1px solid rgba(255,255,255,0.06)`, display:'flex', flexDirection:'column', background:'#0c0c0e' }}>
            {/* Pane header */}
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 14px', borderBottom:`1px solid rgba(255,255,255,0.06)` }}>
              <div style={{
                width:22, height:22, borderRadius:7,
                background: 'linear-gradient(135deg, rgba(121,101,246,0.3), rgba(56,189,248,0.2))',
                border:`1px solid rgba(121,101,246,0.3)`,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>
                <svg
                  className={aiActive ? 'ai-icon-active' : ''}
                  width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke={accent.primary} strokeWidth="2.2" strokeLinecap="round"
                >
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                </svg>
              </div>
              <span style={{ fontSize:11.5, fontWeight:700, color:'rgba(255,255,255,0.9)' }}>Ask AI</span>
              <span style={{ marginLeft:'auto', fontSize:9.5, color:'rgba(255,255,255,0.28)', background:'rgba(255,255,255,0.05)', borderRadius:4, padding:'2px 6px', border:'1px solid rgba(255,255,255,0.07)' }}>
                {clips.length} clips
              </span>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="mk-scroll" style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:8, overflowY:'auto' }}>
              {messages.length === 0 && (
                <div className="empty-float" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:'rgba(121,101,246,0.1)', border:`1px solid rgba(121,101,246,0.2)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent.primary} strokeWidth="2" strokeLinecap="round">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                    </svg>
                  </div>
                  <span style={{ fontSize:10.5, color:'rgba(255,255,255,0.28)', textAlign:'center', lineHeight:1.6 }}>
                    Ask anything about<br />your clips
                  </span>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className="msg-new" style={{
                  alignSelf:   msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth:    '90%',
                  fontSize:    10.5,
                  lineHeight:  1.6,
                  padding:     '8px 11px',
                  borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                  background:  msg.role === 'user'
                    ? accent.gradient
                    : 'rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.88)',
                  boxShadow: msg.role === 'user' ? accent.glow : 'none',
                  border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}>
                  {renderText(msg.text)}
                </div>
              ))}

              {typing && (
                <div className="msg-new" style={{ alignSelf:'flex-start', padding:'10px 14px', borderRadius:'10px 10px 10px 2px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:5 }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="dot-pulse" style={{ width:5, height:5, borderRadius:'50%', background:accent.primary }} />
                  ))}
                </div>
              )}
            </div>

            {/* Input bar */}
            <div style={{ margin:'0 10px 10px' }}>
              <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:9, height:36, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 10px', border:`1px solid rgba(255,255,255,0.09)`, gap:8 }}>
                <span style={{ fontSize:10.5, color:'rgba(255,255,255,0.22)', flex:1 }}>Ask about your clips…</span>
                <div style={{ width:20, height:20, borderRadius:6, background:accent.gradient, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:accent.glow }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4h6M4 1l3 3-3 3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}