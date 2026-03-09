'use client'

import { useState, useEffect } from 'react'
import { Bookmark, LayoutGrid, Globe, Bot, FolderOpen, Layers, BrainCircuit, Search } from 'lucide-react'
import { t, accent } from './shared'

const before = [
  { icon: Bookmark,   text: 'Bookmarks you never revisit' },
  { icon: LayoutGrid, text: 'Scattered notes across 5 apps' },
  { icon: Globe,      text: 'Research lost in browser tabs' },
  { icon: Bot,        text: "AI that doesn't know your work" },
]

const after = [
  { icon: FolderOpen,   text: 'Organised clips by project' },
  { icon: Layers,       text: 'Notes + web saves in one place' },
  { icon: BrainCircuit, text: 'AI that thinks with your research' },
  { icon: Search,       text: 'Insights you can actually find' },
]

const GLASS_CSS = `
  .prob-card {
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
  }
  .prob-item {
    transition: opacity 0.45s ease, transform 0.45s ease;
  }
  .prob-item.entering { opacity: 0; transform: translateY(12px); }
  .prob-item.visible  { opacity: 1; transform: translateY(0); }
  .toggle-pill { transition: all 0.25s ease; }
  .toggle-pill.active {
    background: linear-gradient(135deg, rgba(121,101,246,0.22) 0%, rgba(81,119,246,0.22) 100%) !important;
    color: #fff !important;
    border-color: rgba(121,101,246,0.4) !important;
  }
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }
`

function AnimatedList({ items, showCheck }: { items: typeof before; showCheck: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const timer = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(timer)
  }, [items])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(({ icon: Icon, text }, i) => (
        <div
          key={text}
          className={`prob-item ${visible ? 'visible' : 'entering'}`}
          style={{
            transitionDelay: `${i * 70}ms`,
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 20px', borderRadius: 14,
            background: showCheck ? 'rgba(121,101,246,0.07)' : 'rgba(255,255,255,0.025)',
            border: showCheck ? `1px solid ${accent.border}` : '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Icon bubble */}
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: showCheck ? accent.gradientSubtle : 'rgba(255,255,255,0.04)',
            border: showCheck ? `1px solid ${accent.border}` : '1px solid rgba(255,255,255,0.08)',
          }}>
            <Icon
              size={17}
              strokeWidth={1.6}
              color={showCheck ? accent.primary : 'rgba(255,255,255,0.3)'}
              fill={showCheck ? accent.primary + '25' : 'none'}
            />
          </div>

          <span style={{ fontSize: 14.5, color: showCheck ? t.fg : t.fgMid, fontWeight: showCheck ? 500 : 300, lineHeight: 1.4, flex: 1 }}>
            {text}
          </span>

          {/* Status dot */}
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: showCheck ? accent.gradient : 'rgba(255,255,255,0.12)',
            boxShadow: showCheck ? `0 0 8px ${accent.primary}80` : 'none',
            transition: 'all 0.3s ease',
          }} />
        </div>
      ))}
    </div>
  )
}

export function Problem() {
  const [isAfter, setIsAfter] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setIsAfter(v => !v), 3400)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{ background: t.surfaceBg, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, padding: '120px 40px', position: 'relative', overflow: 'hidden' }}>
      <style>{GLASS_CSS}</style>

      {/* Glow orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(121,101,246,0.09) 0%, transparent 70%)', top: -250, left: '5%', animation: 'glow-pulse 5s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(81,119,246,0.07) 0%, transparent 70%)', bottom: -200, right: '5%', animation: 'glow-pulse 5s ease-in-out infinite', animationDelay: '2.5s' }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>

        {/* Full-width header */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, marginBottom: 20 }}>The problem</div>
          <h2 style={{ fontSize: 'clamp(42px,5vw,68px)', lineHeight: 1.04, letterSpacing: '-2.5px', fontWeight: 800, color: t.fg, margin: '0 0 20px 0' }}>
            The internet is messy.<br />Your knowledge doesn't have to be.
          </h2>
          <p style={{ fontSize: 17, color: t.fgMid, fontWeight: 300, maxWidth: 520, margin: 0, lineHeight: 1.75 }}>
            ProductName turns scattered web research into an organised, AI-powered knowledge base — built the way your brain works.
          </p>
        </div>

        {/* Main glass card */}
        <div className="prob-card" style={{
          borderRadius: 28,
          border: `1px solid rgba(121,101,246,0.18)`,
          background: 'rgba(255,255,255,0.02)',
          padding: '48px',
          boxShadow: `0 12px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(121,101,246,0.12)`,
        }}>

          {/* Toggle + state label row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>

            {/* Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                className={`toggle-pill ${!isAfter ? 'active' : ''}`}
                onClick={() => setIsAfter(false)}
                style={{ fontSize: 13, fontWeight: 500, padding: '9px 22px', borderRadius: 9, border: '1px solid transparent', background: 'transparent', color: t.fgMid, cursor: 'pointer' }}>
                Before
              </button>
              <button
                className={`toggle-pill ${isAfter ? 'active' : ''}`}
                onClick={() => setIsAfter(true)}
                style={{ fontSize: 13, fontWeight: 500, padding: '9px 22px', borderRadius: 9, border: '1px solid transparent', background: 'transparent', color: t.fgMid, cursor: 'pointer' }}>
                After ProductName
              </button>
            </div>

            {/* Live state badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 100,
              background: isAfter ? accent.gradientSubtle : 'rgba(255,255,255,0.04)',
              border: isAfter ? `1px solid ${accent.border}` : '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.35s ease',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: isAfter ? accent.gradient : 'rgba(255,255,255,0.25)',
                boxShadow: isAfter ? `0 0 8px ${accent.primary}` : 'none',
                transition: 'all 0.35s ease',
              }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: isAfter ? accent.primary : t.fgLow, transition: 'color 0.35s ease' }}>
                {isAfter ? 'With ProductName' : 'Without ProductName'}
              </span>
            </div>
          </div>

          <AnimatedList items={isAfter ? after : before} showCheck={isAfter} />
        </div>

        {/* Progress pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
          {[false, true].map((state) => (
            <div key={String(state)} style={{
              width: isAfter === state ? 28 : 6,
              height: 6, borderRadius: 3,
              background: isAfter === state ? accent.primary : 'rgba(255,255,255,0.15)',
              transition: 'all 0.35s ease',
            }} />
          ))}
        </div>

      </div>
    </section>
  )
}