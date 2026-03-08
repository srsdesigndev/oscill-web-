'use client'

import Link from 'next/link'
import { t, accent, ArrowIcon } from './shared'
import { Zap, BookOpen, FlaskConical, CheckCircle2 } from 'lucide-react'

const FEATURES = [
  'Unlimited clips',
  'Unlimited projects',
  'AI-powered Q&A on your clips',
  'Browser extension (Chrome, Edge, Firefox)',
  'Notes alongside your clips',
  'Cross-clip AI insights',
  'Early access to new features',
  'Direct feedback line to the builder',
]

export function Pricing() {
  return (
    <section id="pricing" style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 40px', position: 'relative' }}>

      {/* Subtle orb */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(121,101,246,0.07) 0%, transparent 70%)', top: -100, right: -200, pointerEvents: 'none' }} />

      {/* Full-width header */}
      <div style={{ marginBottom: 72, position: 'relative' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, marginBottom: 20 }}>Pricing</div>
        <h2 style={{ fontSize: 'clamp(42px,5vw,68px)', lineHeight: 1.04, letterSpacing: '-2.5px', fontWeight: 800, color: t.fg, margin: '0 0 20px 0' }}>
          Simple pricing.<br />Completely free.
        </h2>
        <p style={{ fontSize: 17, color: t.fgMid, fontWeight: 300, maxWidth: 480, margin: 0, lineHeight: 1.75 }}>
          OpenClips is in early experimental stage. Everything is free while we build and learn together.
        </p>
      </div>

      {/* Two-col layout — card + story */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start', position: 'relative' }}>

        {/* Pricing card */}
        <div style={{
          borderRadius: 28,
          border: `1px solid rgba(121,101,246,0.25)`,
          background: 'rgba(121,101,246,0.04)',
          padding: '48px 44px',
          boxShadow: `inset 0 1px 0 rgba(121,101,246,0.15), 0 24px 80px rgba(0,0,0,0.4)`,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Top gradient line */}
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(121,101,246,0.7), transparent)' }} />

          {/* Experimental badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(121,101,246,0.1)', border: `1px solid ${accent.border}`, borderRadius: 100, padding: '5px 14px', marginBottom: 32 }}>
            <FlaskConical size={12} color={accent.primary} strokeWidth={2} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: accent.primary }}>Experimental — Early Access</span>
          </div>

          {/* Price */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 72, fontWeight: 800, color: t.fg, lineHeight: 1, letterSpacing: '-3px' }}>$0</span>
              <span style={{ fontSize: 16, color: t.fgMid, fontWeight: 300, paddingBottom: 10 }}>/ forever</span>
            </div>
            <p style={{ fontSize: 14, color: t.fgLow, fontWeight: 300, lineHeight: 1.6, maxWidth: 320 }}>
              No trials. No hidden tiers. Free while we're in experimental stage — and we'll give you fair warning before anything changes.
            </p>
          </div>

          {/* CTA */}
          <Link href="/login" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '14px', borderRadius: 12,
            background: accent.gradient, color: '#fff',
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
            boxShadow: accent.glowLg,
            transition: 'opacity 0.15s, box-shadow 0.15s',
            marginBottom: 36,
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.boxShadow = `0 8px 48px rgba(121,101,246,0.55)` }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = accent.glowLg }}>
            Get started free <ArrowIcon />
          </Link>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={16} color={accent.primary} strokeWidth={1.8} fill={`${accent.primary}20`} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, color: t.fgMid, fontWeight: 300 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Story panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingLeft: 8 }}>

          {/* Student card */}
          <div style={{
            borderRadius: 20, border: `1px solid ${t.border}`,
            background: t.cardBg, padding: '32px 32px',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = accent.border)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: accent.gradientSubtle, border: `1px solid ${accent.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <BookOpen size={20} color={accent.primary} strokeWidth={1.6} fill={`${accent.primary}25`} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: t.fg, marginBottom: 10, letterSpacing: '-0.3px' }}>
              Free for Students
            </div>
            <p style={{ fontSize: 14, color: t.fgMid, lineHeight: 1.72, fontWeight: 300, margin: 0 }}>
              OpenClips was built specifically because juggling research across dozens of tabs, apps, and notebooks is exhausting. Students deserve better tools — and they deserve them free.
            </p>
          </div>

          {/* Builder card */}
          <div style={{
            borderRadius: 20, border: `1px solid ${t.border}`,
            background: t.cardBg, padding: '32px 32px',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = accent.border)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: accent.gradientSubtle, border: `1px solid ${accent.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Zap size={20} color={accent.primary} strokeWidth={1.6} fill={`${accent.primary}25`} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: t.fg, marginBottom: 10, letterSpacing: '-0.3px' }}>
              Built by a Student
            </div>
            <p style={{ fontSize: 14, color: t.fgMid, lineHeight: 1.72, fontWeight: 300, margin: 0 }}>
              This isn't a VC-backed SaaS. It's a tool built out of genuine frustration with how we manage knowledge online. Your feedback directly shapes what gets built next.
            </p>
          </div>

          {/* Experimental note */}
          <div style={{
            borderRadius: 16, border: `1px dashed rgba(121,101,246,0.25)`,
            background: 'rgba(121,101,246,0.04)', padding: '24px 28px',
            display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <FlaskConical size={18} color={accent.primary} strokeWidth={1.6} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: accent.primary, marginBottom: 6 }}>Still in the lab</div>
              <p style={{ fontSize: 13, color: t.fgLow, lineHeight: 1.65, fontWeight: 300, margin: 0 }}>
                Expect rough edges. Some things will break, some features will shift. But every bug you catch and every idea you share makes OpenClips better for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}