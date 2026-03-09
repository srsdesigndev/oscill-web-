'use client'

import { t, accent } from './shared'

const STEPS = [
  { n: '01', title: 'Install the extension', body: "Add ProductName to Chrome in seconds. One click clips any text, image, or URL from any page you're browsing — no interruption to your flow." },
  { n: '02', title: 'Organise into projects', body: 'Create a project for each topic. Clips drop straight in. The sidebar stays with you as you switch between research sessions.' },
  { n: '03', title: 'Ask AI anything',        body: 'Select clips and ask questions. Get answers grounded entirely in your own saved research — not the open web, not guesswork.' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" style={{ position: 'relative', background: t.surfaceBg, padding: '104px 40px', overflow: 'hidden' }}>
      <div className="dot-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(81,119,246,0.1) 0%, transparent 60%)', top: -200, right: -150, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, marginBottom: 14 }}>How it works</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, marginBottom: 72, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 'clamp(36px,4vw,54px)', lineHeight: 1.08, letterSpacing: '-1.5px', fontWeight: 700, color: t.fg, maxWidth: 500 }}>
            From scattered tabs<br />to structured thinking.
          </h2>
          <p style={{ fontSize: 15.5, color: t.fgMid, lineHeight: 1.72, maxWidth: 320, fontWeight: 300 }}>
            Three steps. No learning curve. No new habit to build.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ border: `1px solid ${t.border}`, borderRadius: 16, padding: '36px 32px', background: t.cardBg, transition: 'border-color 0.2s, background 0.2s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = accent.border; e.currentTarget.style.background = 'rgba(121,101,246,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border;      e.currentTarget.style.background = t.cardBg }}>
              {/* Watermark */}
              <div style={{ position: 'absolute', top: 16, right: 20, fontSize: 64, lineHeight: 1, color: 'rgba(255,255,255,0.04)', fontWeight: 700, pointerEvents: 'none', userSelect: 'none' }}>{s.n}</div>
              {/* Step number */}
              <div className="grad-text" style={{ fontSize: 52, lineHeight: 1, marginBottom: 24, fontWeight: 700 }}>{s.n}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: t.fg, marginBottom: 12, letterSpacing: '-0.3px' }}>{s.title}</div>
              <div style={{ fontSize: 13.5, color: t.fgMid, lineHeight: 1.68, fontWeight: 300 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}