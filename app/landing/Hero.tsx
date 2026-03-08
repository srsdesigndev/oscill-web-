'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { t, accent, OpenClipsLogo, ArrowIcon } from './shared'

// ── Types ─────────────────────────────────────────────────────────────────────
type Clip = { id: number; color: string; title: string; body: string; new?: boolean }
type Message = { role: 'user' | 'ai'; text: string }

const PROJECTS = [
  { color: accent.primary,  label: 'AI Research 2025', active: true },
  { color: '#4ACFD2', label: 'Product Teardowns' },
  { color: '#F0B400', label: 'Reading List' },
  { color: '#E23E2B', label: 'Design Refs' },
]

const BASE_CLIPS: Clip[] = [
  { id: 1, color: '#7965F6', title: 'The Transformer Architecture Explained', body: 'Self-attention mechanisms allow models to weigh relevance across input sequences…' },
  { id: 2, color: '#5177F6', title: 'Scaling Laws for Neural Language Models', body: 'Performance improves predictably with model size, dataset size, and compute…' },
]

const INCOMING_CLIPS: Clip[] = [
  { id: 3, color: '#9B8CF8', title: 'Chain-of-thought prompting elicits reasoning', body: 'A simple prompting strategy that dramatically improves multi-step reasoning tasks…' },
  { id: 4, color: '#A78BFA', title: 'Emergent abilities of large language models', body: 'Abilities that appear suddenly at certain scales — not present in smaller models…' },
]

const CHAT_SEQUENCE: Message[] = [
  { role: 'user', text: 'Summarise the key themes' },
  { role: 'ai',   text: 'Central theme: **scaling & emergent behaviour** in LLMs — from architecture to training dynamics.' },
  { role: 'user', text: 'What connects all these papers?' },
  { role: 'ai',   text: 'All four explore how **scale unlocks capability** — larger models behave qualitatively differently, not just quantitatively.' },
]

const MOCKUP_CSS = `
  @keyframes clip-in {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes msg-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes typing {
    0%,100% { opacity: 0.3; } 50% { opacity: 1; }
  }
  .clip-new  { animation: clip-in 0.35s cubic-bezier(0.34,1.2,0.64,1) both; }
  .msg-new   { animation: msg-in  0.3s ease both; }
  .dot-pulse { animation: typing 1s ease-in-out infinite; }
  .dot-pulse:nth-child(2) { animation-delay: 0.15s; }
  .dot-pulse:nth-child(3) { animation-delay: 0.30s; }
  .mockup-scrollbar::-webkit-scrollbar { width: 4px; }
  .mockup-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .mockup-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
`

// ── Animated App Mockup ───────────────────────────────────────────────────────
function AppMockup() {
  const [clips, setClips]       = useState<Clip[]>(BASE_CLIPS)
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping]     = useState(false)
  const [phase, setPhase]       = useState(0)
  const chatRef = useRef<HTMLDivElement>(null)
  const uidRef  = useRef(100) // always-incrementing id to avoid key collisions on reset

  // Orchestrated animation sequence
  useEffect(() => {
    const seq = [
      // Phase 1 — add clip 3 after 1.8s
      () => setTimeout(() => {
        setClips(c => [...c, { ...INCOMING_CLIPS[0], id: ++uidRef.current, new: true }])
        setPhase(1)
      }, 1800),
      // Phase 2 — add clip 4 after 3.2s
      () => setTimeout(() => {
        setClips(c => [...c, { ...INCOMING_CLIPS[1], id: ++uidRef.current, new: true }])
        setPhase(2)
      }, 3200),
      // Phase 3 — user sends first message at 4.6s
      () => setTimeout(() => {
        setMessages([CHAT_SEQUENCE[0]])
        setTyping(true)
        setPhase(3)
      }, 4600),
      // Phase 4 — AI replies at 6.0s
      () => setTimeout(() => {
        setTyping(false)
        setMessages([CHAT_SEQUENCE[0], CHAT_SEQUENCE[1]])
        setPhase(4)
      }, 6000),
      // Phase 5 — user sends second message at 7.8s
      () => setTimeout(() => {
        setMessages(m => [...m, CHAT_SEQUENCE[2]])
        setTyping(true)
        setPhase(5)
      }, 7800),
      // Phase 6 — AI replies at 9.4s
      () => setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, CHAT_SEQUENCE[3]])
        setPhase(6)
      }, 9400),
      // Reset at 13s
      () => setTimeout(() => {
        setClips(BASE_CLIPS)
        setMessages([])
        setTyping(false)
        setPhase(0)
      }, 13000),
    ]

    const timers = seq.map(fn => fn())
    return () => timers.forEach(id => clearTimeout(id as ReturnType<typeof setTimeout>))
  }, [phase === 0 ? phase : undefined]) // re-run when reset to 0

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, typing])

  const renderText = (text: string) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    )

  return (
    <div style={{
      background: '#141414',
      borderRadius: 20, border: `1px solid ${t.border}`,
      boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 32px 100px rgba(0,0,0,0.7), 0 8px 32px rgba(121,101,246,0.08)`,
      overflow: 'hidden',
      fontFamily: 'inherit',
    }}>
      <style>{MOCKUP_CSS}</style>

      {/* Titlebar */}
      <div style={{ height: 42, background: '#1a1a1a', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 7 }}>
        {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, flexShrink: 0 }} />
        ))}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: '#252525', borderRadius: 6, height: 23, width: 260, display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary, flexShrink: 0 }} />
            <span style={{ fontSize: 10.5, color: t.fgLow }}>app.openclips.io/dashboard</span>
          </div>
        </div>
        {/* live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, background: 'rgba(121,101,246,0.1)', border: `1px solid ${accent.border}` }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary, boxShadow: `0 0 6px ${accent.primary}` }} />
          <span style={{ fontSize: 9.5, color: accent.primary, fontWeight: 600, letterSpacing: '0.5px' }}>LIVE</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', height: 460 }}>

        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0, background: '#0d0d0d', borderRight: `1px solid ${t.border}`, padding: '14px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 8px', marginBottom: 12 }}>
            <OpenClipsLogo size={15} color={accent.primary} />
            <span style={{ fontFamily: "'Michroma',sans-serif", fontSize: 10.5, color: t.fg, fontWeight: 400 }}>Open<strong>Clips</strong></span>
          </div>

          <span style={{ fontSize: 9, fontWeight: 600, color: t.fgLow, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px 4px' }}>Workspace</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 6, fontSize: 11, color: t.fgMid }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: '#333' }} />Home
          </div>

          <span style={{ fontSize: 9, fontWeight: 600, color: t.fgLow, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 8px 4px' }}>Projects</span>
          {PROJECTS.map(({ color, label, active }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 6, fontSize: 11,
              background: active ? `${accent.primary}18` : 'transparent',
              border: active ? `1px solid ${accent.primary}30` : '1px solid transparent',
              color: active ? t.fg : t.fgMid, fontWeight: active ? 500 : 400,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: 2, background: color, flexShrink: 0 }} />{label}
            </div>
          ))}

          {/* New project button */}
          <div style={{ marginTop: 'auto', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 8px', borderRadius: 6, fontSize: 10.5, color: t.fgLow, border: '1px dashed rgba(255,255,255,0.1)', cursor: 'pointer' }}>
              <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> New project
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden', minWidth: 0 }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexShrink: 0 }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.fg }}>AI Research 2025</span>
              <span style={{ fontSize: 10.5, color: t.fgLow, marginLeft: 8 }}>{clips.length} clips</span>
            </div>
            <button style={{
              background: accent.gradient, color: '#fff',
              fontSize: 10.5, fontWeight: 600, padding: '5px 12px',
              borderRadius: 6, border: 'none', boxShadow: accent.glow,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> New clip
            </button>
          </div>

          {/* Clip cards */}
          <div className="mockup-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1 }}>
            {clips.map((clip, i) => (
              <div key={clip.id} className={i >= BASE_CLIPS.length ? 'clip-new' : ''} style={{
                background: 'rgba(255,255,255,0.03)', border: `1px solid ${t.border}`,
                borderRadius: 10, padding: '11px 14px', display: 'flex', gap: 10,
                borderLeft: `2px solid ${clip.color}60`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: t.fg, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{clip.title}</div>
                  <div style={{ fontSize: 10.5, color: t.fgMid, lineHeight: 1.5 }}>{clip.body}</div>
                </div>
                {i >= BASE_CLIPS.length && (
                  <div style={{ fontSize: 9, fontWeight: 600, color: accent.primary, background: `${accent.primary}15`, border: `1px solid ${accent.border}`, borderRadius: 4, padding: '2px 6px', alignSelf: 'flex-start', flexShrink: 0 }}>NEW</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Pane */}
        <div style={{ width: 248, flexShrink: 0, borderLeft: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', background: '#0d0d0d' }}>
          {/* Pane header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: accent.gradientSubtle, border: `1px solid ${accent.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: accent.gradient }} />
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: t.fg }}>Ask AI</span>
            <span style={{ marginLeft: 'auto', fontSize: 9.5, color: t.fgLow, background: 'rgba(255,255,255,0.05)', borderRadius: 4, padding: '2px 6px' }}>{clips.length} clips</span>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="mockup-scrollbar" style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
            {messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, opacity: 0.4 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: accent.gradientSubtle, border: `1px solid ${accent.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: accent.gradient }} />
                </div>
                <span style={{ fontSize: 10.5, color: t.fgLow, textAlign: 'center', lineHeight: 1.5 }}>Ask anything about<br />your clips</span>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className="msg-new" style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                fontSize: 10.5, lineHeight: 1.55,
                padding: '8px 11px',
                borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                background: msg.role === 'user' ? accent.gradient : 'rgba(255,255,255,0.07)',
                color: t.fg,
                boxShadow: msg.role === 'user' ? accent.glow : 'none',
              }}>
                {renderText(msg.text)}
              </div>
            ))}
            {typing && (
              <div className="msg-new" style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '10px 10px 10px 2px', background: 'rgba(255,255,255,0.07)', display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => (
                  <div key={i} className="dot-pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary }} />
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ margin: '0 10px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', border: `1px solid ${t.border}` }}>
            <span style={{ fontSize: 10.5, color: t.fgLow }}>Ask about your clips…</span>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: accent.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 4h6M4 1l3 3-3 3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export function Hero() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '130px 24px 80px', position: 'relative', overflow: 'hidden' }}>
      {/* Gradient orbs */}
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(121,101,246,0.1) 0%, transparent 60%)', top: -300, left: -250, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(81,119,246,0.08) 0%, transparent 60%)', bottom: -150, right: -200, pointerEvents: 'none' }} />

      {/* Eyebrow */}
      <div className="fade-up-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(121,101,246,0.1)', border: `1px solid ${accent.border}`, borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 500, color: accent.primary, marginBottom: 32 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent.gradient, flexShrink: 0, boxShadow: `0 0 8px ${accent.primary}` }} />
        Now in early access — free to try
      </div>

      {/* Headline */}
      <h1 className="fade-up-2" style={{ fontSize: 'clamp(56px,8vw,96px)', lineHeight: 1.02, letterSpacing: '-3px', fontWeight: 800, color: '#ffffff', maxWidth: 900, marginBottom: 28, fontFamily: 'inherit' }}>
        Clip the open web.<br />
        Think Deeper.
      </h1>

      <p className="fade-up-3" style={{ fontSize: 18, color: t.fgMid, lineHeight: 1.72, maxWidth: 480, fontWeight: 300, marginBottom: 44 }}>
        Save anything from the internet into your workspace — articles, links, images, notes. Let AI find connections, generate insights, and help you think.
      </p>

      {/* CTAs */}
      <div className="fade-up-4" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 100 }}>
        <Link href="/login" className="grad" style={{
          color: '#fff', fontSize: 14, fontWeight: 600, padding: '14px 32px',
          borderRadius: 10, textDecoration: 'none',
          boxShadow: accent.glow,
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'opacity 0.15s, box-shadow 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.boxShadow = accent.glowLg }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.boxShadow = accent.glow }}>
          Start for free <ArrowIcon />
        </Link>
        <a href="#how-it-works" style={{
          fontSize: 14, fontWeight: 500, color: t.fgMid,
          border: `1px solid ${t.border}`, borderRadius: 10,
          padding: '14px 28px', textDecoration: 'none', transition: 'color 0.15s, border-color 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = t.fg; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
          onMouseLeave={e => { e.currentTarget.style.color = t.fgMid; e.currentTarget.style.borderColor = t.border }}>
          See how it works
        </a>
      </div>

      {/* Mockup */}
      <div className="fade-up-5" style={{ width: '100%', maxWidth: 1020, padding: '0 16px' }}>
        <AppMockup />
      </div>
    </section>
  )
}