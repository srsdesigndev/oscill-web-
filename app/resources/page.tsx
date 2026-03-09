'use client'

import Link from 'next/link'
import { accent, t } from '../landing/shared'
import { Footer } from '../landing/Footer'

// ── Data ──────────────────────────────────────────────────────────────────────
const RESOURCE_CARDS = [
  {
    href:    '/resources/docs',
    label:   'Docs',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title:   'Documentation',
    desc:    'Guides, references, and API docs. Everything from quick start to advanced integrations.',
    cta:     'Browse docs',
    accent:  '#7965F6',
    glowRgb: '121,101,246',
  },
  {
    href:    '/resources/changelog',
    label:   'Changelog',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title:   'Changelog',
    desc:    'Every release, every fix, every improvement — documented the moment it ships.',
    cta:     'See what\'s new',
    accent:  '#38bdf8',
    glowRgb: '56,189,248',
    badge:   'v1.4.0',
  },
  {
    href:    '/resources/status',
    label:   'Status',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title:   'System Status',
    desc:    'Live uptime, service health, and incident history across all OpenClips infrastructure.',
    cta:     'View status',
    accent:  '#34d399',
    glowRgb: '52,211,153',
    badge:   'Operational',
    badgeGreen: true,
  },
  {
    href:    '/resources/blog',
    label:   'Blog',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title:   'Blog',
    desc:    'Product thinking, engineering deep-dives, and research from the OpenClips team.',
    cta:     'Read the blog',
    accent:  '#fb923c',
    glowRgb: '251,146,60',
  },
]

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes res-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .res-fade-1 { animation: res-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .res-fade-2 { animation: res-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
  .res-fade-3 { animation: res-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.20s both; }

  .res-card {
    position: relative;
    display: flex; flex-direction: column; gap: 20px;
    padding: 32px 32px 28px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.02);
    text-decoration: none;
    overflow: hidden;
    animation: res-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
    transition: border-color 0.3s, background 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s;
  }
  .res-card:hover {
    transform: translateY(-4px);
    background: rgba(255,255,255,0.035);
  }

  .res-card-icon {
    transition: transform 0.3s cubic-bezier(0.34,1.3,0.64,1), box-shadow 0.3s;
  }
  .res-card:hover .res-card-icon {
    transform: scale(1.1);
  }

  .res-card-cta {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 600;
    transition: gap 0.2s;
  }
  .res-card:hover .res-card-cta { gap: 10px; }

  @keyframes eyebrow-dot {
    0%,100% { box-shadow: 0 0 0px rgba(121,101,246,0.5); }
    50%      { box-shadow: 0 0 8px rgba(121,101,246,0.9), 0 0 14px rgba(121,101,246,0.4); }
  }
  .eyebrow-dot { animation: eyebrow-dot 2.4s ease-in-out infinite; }

  @keyframes green-pulse {
    0%   { box-shadow: 0 0 0 0   rgba(52,211,153,0.5); }
    70%  { box-shadow: 0 0 0 5px rgba(52,211,153,0); }
    100% { box-shadow: 0 0 0 0   rgba(52,211,153,0); }
  }
  .live-dot { animation: green-pulse 2s ease-out infinite; }
`

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ResourcesPage() {
  return (
    <>
      <style>{CSS}</style>

      {/* Hero */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '80px 40px 72px', textAlign: 'center' }}>
        <div className="res-fade-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, background: 'rgba(121,101,246,0.1)', border: '1px solid rgba(121,101,246,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
          <span className="eyebrow-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary, display: 'inline-block' }} />
          Resources
        </div>

        <h1 className="res-fade-2" style={{ fontSize: 'clamp(40px,5vw,64px)', fontWeight: 800, letterSpacing: '-2.5px', lineHeight: 1.05, color: '#fff', marginBottom: 20 }}>
          Everything you need<br />in one place.
        </h1>

        <p className="res-fade-3" style={{ fontSize: 16, color: t.fgMid, lineHeight: 1.75, fontWeight: 300, maxWidth: 440, margin: '0 auto' }}>
          Docs, updates, uptime, and ideas — all the context you need to get the most out of OpenClips.
        </p>
      </section>

      {/* Cards */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
          {RESOURCE_CARDS.map(({ href, icon, title, desc, cta, accent: cardAccent, glowRgb, badge, badgeGreen }, i) => (
            <Link
              key={href}
              href={href}
              className="res-card"
              style={{
                animationDelay: `${i * 0.08 + 0.25}s`,
                // hover border driven inline so it can use per-card color
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `rgba(${glowRgb},0.3)`
                e.currentTarget.style.boxShadow   = `0 20px 60px rgba(${glowRgb},0.1), 0 4px 16px rgba(0,0,0,0.3)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.boxShadow   = 'none'
              }}
            >
              {/* Corner ambient glow */}
              <div style={{ position: 'absolute', top: -50, left: -50, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, rgba(${glowRgb},0.09) 0%, transparent 70%)`, pointerEvents: 'none' }} />

              {/* Icon */}
              <div
                className="res-card-icon"
                style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${glowRgb},0.1)`, border: `1px solid rgba(${glowRgb},0.2)`, color: cardAccent, flexShrink: 0 }}
              >
                {icon}
              </div>

              {/* Body */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>{title}</span>
                  {badge && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
                      color:       badgeGreen ? '#34d399' : cardAccent,
                      background:  badgeGreen ? 'rgba(52,211,153,0.1)' : `rgba(${glowRgb},0.12)`,
                      border:      `1px solid ${badgeGreen ? 'rgba(52,211,153,0.3)' : `rgba(${glowRgb},0.3)`}`,
                      borderRadius: 6, padding: '2px 8px',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                      {badgeGreen && <span className="live-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />}
                      {badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 14, color: t.fgMid, lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
              </div>

              {/* CTA */}
              <div className="res-card-cta" style={{ color: cardAccent }}>
                {cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}