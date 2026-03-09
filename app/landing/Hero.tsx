'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { t, accent, ClippxLogo, ArrowIcon } from './shared'
import { AppMockup } from './Mockup'

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

// ── Rotating words ─────────────────────────────────────────────────────────────
const ROTATING_WORDS = ['Think Deeper.', 'Build Notes.', 'Organize Ideas.', 'Fast Access.', 'Save Bookmarks.']

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

const HERO_CSS = `
  /* ── Entry animations ── */
  @keyframes hero-fade-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up-1 { animation: hero-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .fade-up-2 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
  .fade-up-3 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
  .fade-up-4 { animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
  .fade-up-5 { animation: hero-fade-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.50s both; }

  /* ── Rotating word ── */
  /* Incoming word slides up from below */
  @keyframes word-in {
    from { opacity: 0; transform: translateY(100%) skewY(2deg); }
    to   { opacity: 1; transform: translateY(0)    skewY(0deg); }
  }
  /* Outgoing word slides up and out */
  @keyframes word-out {
    from { opacity: 1; transform: translateY(0)     skewY(0deg); }
    to   { opacity: 0; transform: translateY(-60%)  skewY(-2deg); }
  }
  .word-enter { animation: word-in  0.52s cubic-bezier(0.22,1,0.36,1) both; }
  .word-exit  { animation: word-out 0.38s cubic-bezier(0.4,0,1,1) both; }

  /* ── Eyebrow pulse dot ── */
  @keyframes eyebrow-dot {
    0%, 100% { box-shadow: 0 0 0px rgba(121,101,246,0.6), 0 0 0px rgba(121,101,246,0.3); }
    50%       { box-shadow: 0 0 8px rgba(121,101,246,0.9), 0 0 16px rgba(121,101,246,0.4); }
  }
  .eyebrow-dot { animation: eyebrow-dot 2.4s ease-in-out infinite; }

  /* ── Orb slow drift ── */
  @keyframes orb-drift-1 {
    0%, 100% { transform: translate(0px, 0px); }
    50%       { transform: translate(30px, -20px); }
  }
  @keyframes orb-drift-2 {
    0%, 100% { transform: translate(0px, 0px); }
    50%       { transform: translate(-20px, 25px); }
  }
  .orb-1 { animation: orb-drift-1 12s ease-in-out infinite; }
  .orb-2 { animation: orb-drift-2 14s ease-in-out 1s infinite; }

  /* ── Mockup subtle float ── */
  @keyframes mockup-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  .mockup-float { animation: mockup-float 6s ease-in-out infinite; }

  /* ── Primary button shimmer ── */
  @keyframes btn-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .hero-primary-btn {
    position: relative; overflow: hidden;
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.15s;
  }
  .hero-primary-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
    background-size: 200% 100%;
    opacity: 0; transition: opacity 0.2s;
  }
  .hero-primary-btn:hover { transform: translateY(-2px); }
  .hero-primary-btn:hover::after { opacity: 1; animation: btn-shimmer 0.55s linear; }
  .hero-primary-btn:active { transform: translateY(0px); }

  .hero-ghost-btn {
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }
  .hero-ghost-btn:hover {
    color: #fff !important;
    border-color: rgba(255,255,255,0.22) !important;
    background: rgba(255,255,255,0.04) !important;
  }

  /* ── Stat counter fade ── */
  @keyframes stat-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .stat-item { animation: stat-in 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .stat-item:nth-child(1) { animation-delay: 0.7s; }
  .stat-item:nth-child(2) { animation-delay: 0.85s; }
  .stat-item:nth-child(3) { animation-delay: 1.0s; }
`

// ── Rotating Word Component ────────────────────────────────────────────────────
function RotatingWord() {
  const [index, setIndex]   = useState(0)
  const [phase, setPhase]   = useState<'idle' | 'exit' | 'enter'>('idle')
  const [shown, setShown]   = useState(0) // which word is currently rendered

  useEffect(() => {
    const idle = setTimeout(() => {
      setPhase('exit')
    }, 2800)
    return () => clearTimeout(idle)
  }, [index])

  useEffect(() => {
    if (phase === 'exit') {
      const t = setTimeout(() => {
        const next = (index + 1) % ROTATING_WORDS.length
        setIndex(next)
        setShown(next)
        setPhase('enter')
      }, 380) // match word-out duration
      return () => clearTimeout(t)
    }
    if (phase === 'enter') {
      const t = setTimeout(() => setPhase('idle'), 520)
      return () => clearTimeout(t)
    }
  }, [phase])

  const cls = phase === 'exit' ? 'word-exit' : phase === 'enter' ? 'word-enter' : ''

  return (
    // Clip overflow so exiting word doesn't show above/below
    <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
      <span
        key={shown}
        className={cls}
        style={{
          display: 'inline-block',
          background: 'linear-gradient(90deg, #a78bfa, #38bdf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {ROTATING_WORDS[shown]}
      </span>
    </span>
  )
}
// ── Hero ──────────────────────────────────────────────────────────────────────
export function Hero() {
  return (
    <>
      <style>{HERO_CSS}</style>
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '130px 24px 80px', position: 'relative', overflow: 'hidden' }}>

        {/* Gradient orbs — now animated */}
        <div className="orb-1" style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(121,101,246,0.1) 0%, transparent 60%)', top: -300, left: -250, pointerEvents: 'none' }} />
        <div className="orb-2" style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(81,119,246,0.08) 0%, transparent 60%)', bottom: -150, right: -200, pointerEvents: 'none' }} />

        {/* Eyebrow */}
        <div className="fade-up-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(121,101,246,0.1)', border: `1px solid ${accent.border}`, borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 500, color: accent.primary, marginBottom: 32 }}>
          <div className="eyebrow-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: accent.gradient, flexShrink: 0 }} />
          Now in early access — free to try
        </div>

        {/* Headline — line 2 rotates */}
        <h1
          className="fade-up-2"
          style={{
            fontSize: 'clamp(56px,8vw,96px)',
            lineHeight: 1.02,
            letterSpacing: '-3px',
            fontWeight: 800,
            color: '#ffffff',
            maxWidth: 900,
            marginBottom: 28,
            fontFamily: 'inherit',
          }}
        >
          Clip the open web.<br />
          <RotatingWord />
        </h1>

        <p className="fade-up-3" style={{ fontSize: 18, color: t.fgMid, lineHeight: 1.72, maxWidth: 480, fontWeight: 300, marginBottom: 44 }}>
          Save anything from the internet into your workspace — articles, links, images, notes. Let AI find connections, generate insights, and help you think.
        </p>

        {/* CTAs */}
        <div className="fade-up-4" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 56 }}>
          <Link
            href="/login"
            className="hero-primary-btn grad"
            style={{
              color: '#fff', fontSize: 14, fontWeight: 600, padding: '14px 32px',
              borderRadius: 10, textDecoration: 'none',
              boxShadow: accent.glow,
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            Start for free <ArrowIcon />
          </Link>
          <a
            href="#how-it-works"
            className="hero-ghost-btn"
            style={{
              fontSize: 14, fontWeight: 500, color: t.fgMid,
              border: `1px solid ${t.border}`, borderRadius: 10,
              padding: '14px 28px', textDecoration: 'none',
              background: 'transparent',
            }}
          >
            See how it works
          </a>
        </div>

        {/* Social proof stats */}
        <div className="fade-up-4" style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 64, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '12k+', label: 'Early users' },
            { value: '4.9★', label: 'Extension rating' },
            { value: '2M+', label: 'Clips saved' },
          ].map(({ value, label }) => (
            <div key={label} className="stat-item" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>{value}</div>
              <div style={{ fontSize: 11.5, color: t.fgLow, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
        {/* Mockup */}
        <div className="fade-up-5" style={{ width: '100%', maxWidth: 1020, padding: '0 16px' }}>
          <AppMockup />
        </div>
      </section>
    </>
  )
}