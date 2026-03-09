'use client'

import { Footer } from '@/app/landing/Footer'
import { accent, t } from '@/app/landing/shared'

type Tag = 'New' | 'Improved' | 'Fixed' | 'Breaking'

const TAG_COLORS: Record<Tag, { bg: string; color: string; border: string }> = {
  New:      { bg: 'rgba(52,211,153,0.1)',  color: '#34d399', border: 'rgba(52,211,153,0.25)'  },
  Improved: { bg: 'rgba(121,101,246,0.1)', color: '#a78bfa', border: 'rgba(121,101,246,0.25)' },
  Fixed:    { bg: 'rgba(56,189,248,0.1)',  color: '#38bdf8', border: 'rgba(56,189,248,0.25)'  },
  Breaking: { bg: 'rgba(251,113,133,0.1)', color: '#fb7185', border: 'rgba(251,113,133,0.25)' },
}

const RELEASES = [
  {
    version: '1.4.0', date: 'March 4, 2026', highlight: true,
    summary: 'AI connections, smarter search, and a faster clip sheet.',
    changes: [
      { tag: 'New' as Tag,      text: 'AI Connections — surface related clips you didn\'t know were linked.' },
      { tag: 'New' as Tag,      text: 'Inline note editor now supports slash commands ( /image, /code, /divider ).' },
      { tag: 'Improved' as Tag, text: 'Semantic search is 3× faster with the new vector index architecture.' },
      { tag: 'Improved' as Tag, text: 'Clip sheet animation is smoother on 60fps and 120fps displays.' },
      { tag: 'Fixed' as Tag,    text: 'Extension popup no longer flickers on Firefox 124.' },
    ],
  },
  {
    version: '1.3.2', date: 'February 14, 2026', highlight: false,
    summary: 'Stability and performance fixes across the board.',
    changes: [
      { tag: 'Fixed' as Tag,    text: 'Projects with 500+ clips no longer time out on the AI pane.' },
      { tag: 'Fixed' as Tag,    text: 'Markdown export now correctly handles nested bullet lists.' },
      { tag: 'Improved' as Tag, text: 'Dashboard cold-load time reduced from 1.8s to 0.6s.' },
    ],
  },
  {
    version: '1.3.0', date: 'January 28, 2026', highlight: false,
    summary: 'Notes get a full editor overhaul and export support.',
    changes: [
      { tag: 'New' as Tag,      text: 'Rich text editor for Notes — bold, italic, code, headings, links.' },
      { tag: 'New' as Tag,      text: 'Export any note or clip to Markdown, PDF, or plain text.' },
      { tag: 'Improved' as Tag, text: 'Sidebar now shows unread clip count per project.' },
      { tag: 'Breaking' as Tag, text: 'Legacy plain-text notes will auto-migrate on first open. Backup recommended.' },
    ],
  },
  {
    version: '1.2.1', date: 'January 9, 2026', highlight: false,
    summary: 'Bug fixes and Edge extension stability.',
    changes: [
      { tag: 'Fixed' as Tag,    text: 'Edge extension correctly handles pages with strict CSP headers.' },
      { tag: 'Fixed' as Tag,    text: 'OAuth login loop on Safari 17.3 resolved.' },
      { tag: 'Improved' as Tag, text: 'Clip title auto-detection now works on JS-rendered pages.' },
    ],
  },
  {
    version: '1.2.0', date: 'December 18, 2025', highlight: false,
    summary: 'Introducing Projects — your new home for organised knowledge.',
    changes: [
      { tag: 'New' as Tag,      text: 'Projects — create isolated workspaces with custom colours and icons.' },
      { tag: 'New' as Tag,      text: 'Drag-and-drop clips between projects.' },
      { tag: 'New' as Tag,      text: 'Project-scoped AI — answers only draw from the current project\'s clips.' },
      { tag: 'Improved' as Tag, text: 'Onboarding flow reduced from 7 steps to 3.' },
    ],
  },
]

const CSS = `
  @keyframes cl-fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cl-hero-1 { animation: cl-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .cl-hero-2 { animation: cl-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
  .cl-hero-3 { animation: cl-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.20s both; }
  .cl-entry  { animation: cl-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both; }

  @keyframes eyebrow-dot {
    0%,100% { box-shadow: 0 0 0px rgba(121,101,246,0.5); }
    50%      { box-shadow: 0 0 8px rgba(121,101,246,0.9), 0 0 14px rgba(121,101,246,0.4); }
  }
  .eyebrow-dot { animation: eyebrow-dot 2.4s ease-in-out infinite; }

  @keyframes highlight-pulse {
    0%,100% { box-shadow: 0 0 0 1px rgba(121,101,246,0.2); }
    50%      { box-shadow: 0 0 0 1px rgba(121,101,246,0.4), 0 0 32px rgba(121,101,246,0.08); }
  }
  .cl-highlight { animation: highlight-pulse 3s ease-in-out infinite; }

  .cl-subscribe {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 11px 16px;
    font-size: 13px; color: #fff; outline: none;
    font-family: inherit;
    transition: border-color 0.2s; flex: 1; min-width: 0;
  }
  .cl-subscribe::placeholder { color: rgba(255,255,255,0.28); }
  .cl-subscribe:focus { border-color: rgba(121,101,246,0.5); }
`

function TagBadge({ tag }: { tag: Tag }) {
  const s = TAG_COLORS[tag]
  return (
    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.4px', color: s.color, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 5, padding: '2px 8px', flexShrink: 0 }}>
      {tag}
    </span>
  )
}

export default function ChangelogPage() {
  return (
    <>
      <style>{CSS}</style>

      {/* Hero */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 40px 64px', textAlign: 'center' }}>
        <div className="cl-hero-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, background: 'rgba(121,101,246,0.1)', border: '1px solid rgba(121,101,246,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
          <span className="eyebrow-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary, display: 'inline-block' }} />
          Changelog
        </div>
        <h1 className="cl-hero-2" style={{ fontSize: 'clamp(40px,5vw,64px)', fontWeight: 800, letterSpacing: '-2.5px', lineHeight: 1.05, color: '#fff', marginBottom: 20 }}>
          What's new in<br />OpenClips.
        </h1>
        <p className="cl-hero-3" style={{ fontSize: 16, color: t.fgMid, fontWeight: 300, lineHeight: 1.75, maxWidth: 400, margin: '0 auto 40px' }}>
          Every release, every fix, every improvement — documented as it ships.
        </p>
        <div className="cl-hero-3" style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto' }}>
          <input className="cl-subscribe" type="email" placeholder="you@example.com" />
          <button style={{ background: accent.gradient, color: '#fff', fontSize: 13, fontWeight: 600, padding: '11px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: accent.glow, whiteSpace: 'nowrap' }}>
            Get notified
          </button>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px 80px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 1, background: 'linear-gradient(180deg, rgba(121,101,246,0.4), rgba(121,101,246,0.04))', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {RELEASES.map(({ version, date, summary, changes, highlight }, ri) => (
              <div
                key={version}
                className={`cl-entry${highlight ? ' cl-highlight' : ''}`}
                style={{ paddingLeft: 36, paddingBottom: 52, position: 'relative', animationDelay: `${ri * 0.08 + 0.25}s` }}
              >
                <div style={{ position: 'absolute', left: -5, top: 10, width: 11, height: 11, borderRadius: '50%', background: highlight ? accent.primary : '#2a2a2e', border: `2px solid ${highlight ? accent.primary : 'rgba(255,255,255,0.15)'}`, boxShadow: highlight ? `0 0 12px ${accent.primary}80` : 'none' }} />
                <div style={{ background: highlight ? 'rgba(121,101,246,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${highlight ? 'rgba(121,101,246,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: '24px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>v{version}</span>
                      {highlight && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: accent.primary, background: 'rgba(121,101,246,0.15)', border: '1px solid rgba(121,101,246,0.3)', borderRadius: 5, padding: '2px 8px' }}>LATEST</span>}
                    </div>
                    <span style={{ fontSize: 12, color: t.fgMid }}>{date}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.65, marginBottom: 20 }}>{summary}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {changes.map(({ tag, text }, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <TagBadge tag={tag} />
                        <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontWeight: 300 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}