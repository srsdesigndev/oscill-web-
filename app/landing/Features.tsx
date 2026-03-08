'use client'

import { Zap, FolderOpen, BrainCircuit, NotebookPen } from 'lucide-react'
import { t, accent } from './shared'

const PILLARS = [
  {
    Icon: Zap,
    iconColor: '#7965F6',
    iconBg: 'rgba(121,101,246,0.12)',
    title: 'Clip the internet',
    body: 'Save articles, tweets, research papers, docs — anything on the web — with one click via the browser extension. No copying, no tab-switching.',
  },
  {
    Icon: FolderOpen,
    iconColor: '#5177F6',
    iconBg: 'rgba(81,119,246,0.12)',
    title: 'Turn clips into projects',
    body: 'Organise everything into focused workspaces. Keep your AI research separate from your product teardowns, reading list, and design refs.',
  },
  {
    Icon: BrainCircuit,
    iconColor: '#A78BFA',
    iconBg: 'rgba(167,139,250,0.12)',
    title: 'AI understands your knowledge',
    body: 'Ask questions, get summaries, and surface connections across your clips. Answers are grounded in your research — zero hallucinations.',
  },
  {
    Icon: NotebookPen,
    iconColor: '#818CF8',
    iconBg: 'rgba(129,140,248,0.12)',
    title: 'Fast, friction-free notes',
    body: 'Write ideas the moment they happen. Notes live alongside your clips in each project — no context-switching, no separate app.',
  },
]

export function Features() {
  return (
    <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 40px' }}>

      {/* Full-width header */}
      <div style={{ marginBottom: 72 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, marginBottom: 20 }}>Features</div>
        <h2 style={{
          fontSize: 'clamp(42px,5vw,68px)',
          lineHeight: 1.04,
          letterSpacing: '-2.5px',
          fontWeight: 800,
          color: t.fg,
          margin: '0 0 20px 0',
        }}>
          Everything you need.<br />Nothing you don't.
        </h2>
        <p style={{
          fontSize: 17,
          color: t.fgMid,
          lineHeight: 1.75,
          fontWeight: 300,
          margin: 0,
          maxWidth: 560,
        }}>
          Built for researchers, students, and curious minds who want to think — not manage tabs.
        </p>
      </div>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {PILLARS.map(({ Icon, iconColor, iconBg, title, body }) => (
          <div key={title} className="card-hover" style={{
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: 20,
            padding: '44px 40px',
            transition: 'border-color 0.2s, background 0.2s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = iconColor + '55'
              e.currentTarget.style.background = iconColor + '08'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = t.border
              e.currentTarget.style.background = t.cardBg
            }}>

            <div style={{
              width: 64, height: 64, borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 32,
              background: iconBg,
              border: `1px solid ${iconColor}28`,
            }}>
              <Icon size={30} color={iconColor} strokeWidth={1.6} fill={iconColor + '35'} />
            </div>

            <div style={{ fontSize: 20, fontWeight: 700, color: t.fg, marginBottom: 14, letterSpacing: '-0.4px', lineHeight: 1.2 }}>{title}</div>
            <div style={{ fontSize: 15, color: t.fgMid, lineHeight: 1.72, fontWeight: 300 }}>{body}</div>
          </div>
        ))}
      </div>
    </section>
  )
}