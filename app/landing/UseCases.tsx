'use client'

import { FlaskConical, Code2, GraduationCap, Rocket, PenLine, BarChart3 } from 'lucide-react'
import { t, accent } from './shared'

const CASES = [
  {
    Icon: FlaskConical,
    iconColor: '#7965F6',
    iconBg: 'rgba(121,101,246,0.12)',
    title: 'Researchers',
    body: 'Save papers, annotate findings, and ask AI to surface patterns across your literature review.',
  },
  {
    Icon: Code2,
    iconColor: '#5177F6',
    iconBg: 'rgba(81,119,246,0.12)',
    title: 'Developers',
    body: 'Clip docs, code examples, and Stack Overflow answers — organised by project, not by date.',
  },
  {
    Icon: GraduationCap,
    iconColor: '#A78BFA',
    iconBg: 'rgba(167,139,250,0.12)',
    title: 'Students',
    body: 'Build organised study notes from lectures, articles, and PDFs all in one focused workspace.',
  },
  {
    Icon: Rocket,
    iconColor: '#818CF8',
    iconBg: 'rgba(129,140,248,0.12)',
    title: 'Founders',
    body: 'Capture competitor research, market insights, and strategy notes — then ask AI to connect the dots.',
  },
  {
    Icon: PenLine,
    iconColor: '#7965F6',
    iconBg: 'rgba(121,101,246,0.12)',
    title: 'Writers',
    body: 'Clip references, quotes, and inspiration. Let AI summarise sources so you can focus on writing.',
  },
  {
    Icon: BarChart3,
    iconColor: '#5177F6',
    iconBg: 'rgba(81,119,246,0.12)',
    title: 'Analysts',
    body: "Aggregate data, reports, and news clips. Ask AI questions across everything you've collected.",
  },
]

export function UseCases() {
  return (
    <section id="use-cases" style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 40px' }}>

      {/* Full-width header */}
      <div style={{ marginBottom: 72 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, marginBottom: 20 }}>Use cases</div>
        <h2 style={{ fontSize: 'clamp(42px,5vw,68px)', lineHeight: 1.04, letterSpacing: '-2.5px', fontWeight: 800, color: t.fg, margin: '0 0 20px 0' }}>
          Built for anyone<br />who thinks for a living.
        </h2>
        <p style={{ fontSize: 17, color: t.fgMid, fontWeight: 300, maxWidth: 480, margin: 0, lineHeight: 1.75 }}>
          Whether you research, build, study, or write — clippx adapts to how your mind works.
        </p>
      </div>

      {/* 3-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {CASES.map(({ Icon, iconColor, iconBg, title, body }) => (
          <div key={title} className="card-hover" style={{
            display: 'flex', flexDirection: 'column', gap: 0,
            padding: '32px 28px', borderRadius: 18,
            background: t.cardBg, border: `1px solid ${t.border}`,
            transition: 'border-color 0.2s, background 0.2s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = iconColor + '50'
              e.currentTarget.style.background = iconColor + '08'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = t.border
              e.currentTarget.style.background = t.cardBg
            }}>

            {/* Icon */}
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24,
              background: iconBg,
              border: `1px solid ${iconColor}25`,
            }}>
              <Icon size={24} color={iconColor} strokeWidth={1.6} fill={iconColor + '30'} />
            </div>

            <div style={{ fontSize: 17, fontWeight: 700, color: t.fg, marginBottom: 10, letterSpacing: '-0.3px' }}>{title}</div>
            <div style={{ fontSize: 14, color: t.fgMid, lineHeight: 1.7, fontWeight: 300 }}>{body}</div>
          </div>
        ))}
      </div>
    </section>
  )
}