'use client'

import Link from 'next/link'
import { t, accent, ArrowIcon } from './shared'

// ── Extension ─────────────────────────────────────────────────────────────────
export function Extension() {
  return (
    <section id="extension" style={{ background: t.surfaceBg, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, padding: '112px 40px', position: 'relative', overflow: 'hidden' }}>
      {/* Orb */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(81,119,246,0.08) 0%, transparent 70%)', top: -200, right: -100, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative' }}>

        {/* Left */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, marginBottom: 20 }}>Browser Extension</div>
          <h2 style={{ fontSize: 'clamp(34px,3.5vw,52px)', lineHeight: 1.08, letterSpacing: '-1.5px', fontWeight: 800, color: t.fg, marginBottom: 20 }}>
            Your second brain,<br />built into your browser.
          </h2>
          <p style={{ fontSize: 16, color: t.fgMid, lineHeight: 1.75, fontWeight: 300, marginBottom: 40, maxWidth: 420 }}>
            Highlight text, images, or entire pages. One click sends it straight to your OpenClips project. Never lose a source again.
          </p>

          {/* Browser buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
            {[
              { label: 'Chrome',  color: '#4285F4' },
              { label: 'Edge',    color: '#0078D4' },
              { label: 'Firefox', color: '#FF7139' },
            ].map(({ label, color }) => (
              <button key={label} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 9,
                background: t.cardBg, border: `1px solid ${t.border}`,
                color: t.fg, fontSize: 13, fontWeight: 500,
                transition: 'border-color 0.15s, background 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}12` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.cardBg }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
                {label}
              </button>
            ))}
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { n: '1', text: 'Install the extension — takes 10 seconds' },
              { n: '2', text: 'Highlight anything on any page' },
              { n: '3', text: 'Choose a project and save' },
            ].map(({ n, text }) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: accent.primary,
                  background: accent.gradientSubtle,
                  border: `1px solid ${accent.border}`,
                }}>{n}</div>
                <span style={{ fontSize: 14, color: t.fgMid, fontWeight: 300 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Extension popup mockup */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '100%', maxWidth: 320,
            background: '#1a1a1a', borderRadius: 16,
            border: `1px solid rgba(121,101,246,0.2)`,
            boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(121,101,246,0.1)`,
            padding: '20px',
            backdropFilter: 'blur(20px)',
          }}>
            {/* Popup header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 16, borderBottom: `1px solid ${t.border}` }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: accent.gradient, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: accent.glow }}>
                <svg width="12" height="12" viewBox="0 0 31 31" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M22.3889 25.8333H6.88889C6.43213 25.8333 5.99407 25.6519 5.67109 25.3289C5.34811 25.0059 5.16667 24.5679 5.16667 24.1111V8.61111H0V5.16667H5.16667V0H8.61111V5.16667H24.1111C24.5679 5.16667 25.0059 5.34811 25.3289 5.67109C25.6519 5.99407 25.8333 6.43213 25.8333 6.88889V22.3889H31V25.8333H25.8333V31H22.3889V25.8333ZM22.3889 22.3889V8.61111H8.61111V22.3889H22.3889Z" fill="white"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.fg, fontFamily: "'Michroma',sans-serif" }}>OpenClips</div>
                <div style={{ fontSize: 10, color: t.fgLow }}>Save to your workspace</div>
              </div>
            </div>

            {/* Clipping from */}
            <div style={{ fontSize: 10.5, color: t.fgLow, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Clipping from</div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: t.fg, marginBottom: 18, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: `1px solid ${t.border}`, lineHeight: 1.4 }}>
              "The Transformer Architecture Explained"
            </div>

            {/* Project list */}
            <div style={{ fontSize: 10.5, color: t.fgLow, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Save to project</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 18 }}>
              {[
                { label: 'AI Research 2025', color: accent.primary, active: true },
                { label: 'Reading List',      color: '#F0B400',      active: false },
                { label: 'Product Teardowns', color: '#4ACFD2',      active: false },
              ].map(({ label, color, active }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                  background: active ? accent.gradientSubtle : 'transparent',
                  border: active ? `1px solid ${accent.border}` : '1px solid transparent',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: active ? '#fff' : t.fgMid, fontWeight: active ? 500 : 400, flex: 1 }}>{label}</span>
                  {active && <span style={{ fontSize: 11, color: accent.primary }}>✓</span>}
                </div>
              ))}
            </div>

            {/* Save button */}
            <button style={{
              width: '100%', padding: '11px', borderRadius: 9, border: 'none',
              background: accent.gradient, color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: accent.glow,
            }}>
              Save clip
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const QUOTES = [
  { init: 'A', name: 'Arjun M.',  role: 'PhD Researcher, NLP',    quote: 'I used to have 60 open tabs for every project. Now I clip as I go and actually revisit things. The AI summary across clips is genuinely useful.' },
  { init: 'S', name: 'Sofia K.',  role: 'Product Designer',        quote: 'The inline ask command changed my workflow completely. I can query my own research without leaving my notes. It finally thinks the way I do.' },
  { init: 'T', name: 'Tom R.',    role: 'Independent Analyst',     quote: "Clean, fast, sidebar stays put between projects. Sounds small — makes a huge difference when you're switching context constantly." },
]

export function Testimonials() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '112px 40px' }}>
      <div style={{ marginBottom: 72 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, marginBottom: 20 }}>Early users</div>
        <h2 style={{ fontSize: 'clamp(36px,4vw,56px)', lineHeight: 1.04, letterSpacing: '-2px', fontWeight: 800, color: t.fg, margin: '0 0 20px 0' }}>
          Researchers who<br />made the switch.
        </h2>
        <p style={{ fontSize: 17, color: t.fgMid, fontWeight: 300, maxWidth: 480, margin: 0, lineHeight: 1.75 }}>
          Early access users across research, design, and analysis.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {QUOTES.map((q, i) => (
          <div key={q.name} className="card-hover" style={{
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: 20, padding: '36px 32px',
            display: 'flex', flexDirection: 'column', gap: 0,
            transition: 'border-color 0.2s, background 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent.border; e.currentTarget.style.background = `${accent.primary}06` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.cardBg }}>

            {/* Stars */}
            <div style={{ display: 'flex', gap: 3, marginBottom: 24 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F0B400">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>

            {/* Quote */}
            <p style={{ fontSize: 14.5, lineHeight: 1.72, color: t.fg, fontWeight: 300, marginBottom: 28, flex: 1 }}>
              "{q.quote}"
            </p>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 24, borderTop: `1px solid ${t.border}` }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: '#fff',
                background: accent.gradient,
                boxShadow: `0 4px 12px ${accent.primary}40`,
              }}>{q.init}</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: t.fg }}>{q.name}</div>
                <div style={{ fontSize: 11.5, color: t.fgLow, marginTop: 2 }}>{q.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
export function CTABanner() {
  return (
    <div style={{ margin: '0 40px 96px', borderRadius: 28, background: '#080808', padding: '100px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden', border: `1px solid rgba(121,101,246,0.15)` }}>
      <div className="dot-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      {/* Orbs */}
      <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(121,101,246,0.12) 0%, transparent 60%)', top: -300, left: -150, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(81,119,246,0.1) 0%, transparent 60%)', bottom: -250, right: -100, pointerEvents: 'none' }} />
      {/* Inset highlight */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 28, background: 'linear-gradient(135deg, rgba(121,101,246,0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, marginBottom: 20 }}>Get started today</div>
        <h2 style={{ fontSize: 'clamp(40px,5vw,68px)', lineHeight: 1.04, letterSpacing: '-2.5px', fontWeight: 800, color: '#fff', marginBottom: 20 }}>
          Build your personal<br />knowledge system.
        </h2>
        <p style={{ fontSize: 17, color: t.fgMid, fontWeight: 300, marginBottom: 48, maxWidth: 400, margin: '0 auto 48px' }}>
          Free to use. No credit card required.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/login" style={{
            background: accent.gradient, color: '#fff',
            fontSize: 14, fontWeight: 600, padding: '14px 32px',
            borderRadius: 10, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: accent.glowLg,
            transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Create free account <ArrowIcon />
          </Link>
          <a href="#extension" style={{
            fontSize: 14, fontWeight: 500, color: t.fgMid,
            border: `1px solid ${t.border}`, borderRadius: 10,
            padding: '14px 28px', textDecoration: 'none',
            transition: 'color 0.15s, border-color 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = t.fg; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={e => { e.currentTarget.style.color = t.fgMid; e.currentTarget.style.borderColor = t.border }}>
            Install extension
          </a>
        </div>
      </div>
    </div>
  )
}