'use client'

import Link from 'next/link'
import { useState } from 'react'

// ── OpenClips Logo SVG ────────────────────────────────────────────────────────
const OpenClipsLogo = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M22.3889 25.8333H6.88889C6.43213 25.8333 5.99407 25.6519 5.67109 25.3289C5.34811 25.0059 5.16667 24.5679 5.16667 24.1111V8.61111H0V5.16667H5.16667V0H8.61111V5.16667H24.1111C24.5679 5.16667 25.0059 5.34811 25.3289 5.67109C25.6519 5.99407 25.8333 6.43213 25.8333 6.88889V22.3889H31V25.8333H25.8333V31H22.3889V25.8333ZM22.3889 22.3889V8.61111H8.61111V22.3889H22.3889Z" fill="url(#logo_grad)"/>
    <defs>
      <linearGradient id="logo_grad" x1="1.65649" y1="6.88889" x2="26.2945" y2="9.21634" gradientUnits="userSpaceOnUse">
        <stop stopColor="#5177F6"/>
        <stop offset="1" stopColor="#7965F6"/>
      </linearGradient>
    </defs>
  </svg>
)

// ── Sun / Moon icons ──────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
)

export default function LandingPage() {
  const [dark, setDark] = useState(true)

  const bg     = dark ? '#0a0a0a' : '#fafaf8'
  const fg     = dark ? '#ffffff' : '#0e0e0e'
  const fgMid  = dark ? 'rgba(255,255,255,0.55)' : 'rgba(14,14,14,0.55)'
  const fgLow  = dark ? 'rgba(255,255,255,0.35)' : 'rgba(14,14,14,0.35)'
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(14,14,14,0.07)'
  const cardBg = dark ? 'rgba(255,255,255,0.03)' : '#ffffff'
  const navBg  = dark ? 'rgba(10,10,10,0.88)'    : 'rgba(250,250,248,0.88)'
  const pillBg = dark ? '#f3f2ef'                 : '#f3f2ef'
  const sectionBg = dark ? '#111'                 : '#f3f2ef'

  return (
    <div style={{ minHeight: '100vh', background: bg, color: fg, fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden', transition: 'background 0.3s, color 0.3s' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=Michroma&display=swap');
        .serif  { font-family: 'DM Serif Display', Georgia, serif; }
        .michroma { font-family: 'Michroma', sans-serif; }
        .grad   { background: linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%); }
        .grad-text {
          background: linear-gradient(135deg, #6B8DF5, #9B7CF5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .deeper-text {
          font-family: 'Michroma', sans-serif;
          font-weight: 700;
          background: linear-gradient(135deg, #6B8DF5, #7B5CE6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .float      { animation: float 6s ease-in-out infinite; }
        .fade-up-1  { animation: fade-up 0.6s 0.0s ease both; }
        .fade-up-2  { animation: fade-up 0.6s 0.1s ease both; }
        .fade-up-3  { animation: fade-up 0.6s 0.2s ease both; }
        .fade-up-4  { animation: fade-up 0.6s 0.35s ease both; }
        .fade-up-5  { animation: fade-up 0.8s 0.5s ease both; }
        .nav-blur   { backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
        .dot-grid   { background-image: radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px); background-size: 28px 28px; }
        .dot-grid-light { background-image: radial-gradient(rgba(14,14,14,0.06) 1px, transparent 1px); background-size: 28px 28px; }
        .preview-float { animation: float 7s ease-in-out infinite; }
        .theme-btn { border: none; cursor: pointer; display:flex; align-items:center; justify-content:center; border-radius: 8px; width:34px; height:34px; transition: background 0.2s; }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav-blur" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 60, borderBottom: `1px solid ${border}`, background: navBg, transition: 'background 0.3s' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <OpenClipsLogo size={22} />
          <span className="michroma" style={{ fontSize: 14, fontWeight: 400, color: fg, letterSpacing: '0.3px' }}>Open<strong>Clips</strong></span>
        </Link>

        <ul style={{ display: 'flex', alignItems: 'center', gap: 32, listStyle: 'none', margin: 0, padding: 0 }} className="hidden md:flex">
          {['Features', 'How it works', 'Extension'].map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase().replace(/ /g, '-')}`} style={{ fontSize: 13.5, color: fgMid, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = fg)}
                onMouseLeave={e => (e.currentTarget.style.color = fgMid)}>
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Theme toggle */}
          <button className="theme-btn" onClick={() => setDark(!dark)}
            style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(14,14,14,0.07)', color: fgMid }}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: fgMid, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = fg)}
            onMouseLeave={e => (e.currentTarget.style.color = fgMid)}>
            Sign in
          </Link>
          <Link href="/login" className="grad" style={{ color: '#fff', fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 8, textDecoration: 'none', boxShadow: '0 2px 8px rgba(108,99,255,0.28)', transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,141,245,0.1) 0%, transparent 65%)', top: -100, left: -150, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,92,230,0.08) 0%, transparent 65%)', bottom: 0, right: -100, pointerEvents: 'none' }} />

        {/* Eyebrow */}
        <div className="fade-up-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 500, color: '#6C63FF', marginBottom: 28 }}>
          <div className="grad" style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0 }} />
          Now in early access
        </div>

        {/* Headline */}
        <h1 className="serif fade-up-2" style={{ fontSize: 'clamp(52px,7vw,88px)', lineHeight: 1.06, letterSpacing: '-2px', color: fg, maxWidth: 860, marginBottom: 24 }}>
          Clip the open web.<br />
          Think <span className="deeper-text">Deeper.</span>
        </h1>

        <p className="fade-up-3" style={{ fontSize: 17, color: fgMid, lineHeight: 1.7, maxWidth: 460, fontWeight: 300, marginBottom: 40 }}>
          Save anything from the internet into your workspace — articles, links, images, notes. Let AI find connections, generate insights, and help you think.
        </p>

        {/* CTAs */}
        <div className="fade-up-4" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Link href="/login" className="grad" style={{ color: '#fff', fontSize: 14, fontWeight: 600, padding: '13px 28px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 16px rgba(108,99,255,0.32)', display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Start for free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <a href="#how-it-works" style={{ fontSize: 14, fontWeight: 500, color: fgMid, border: `1px solid ${border}`, borderRadius: 10, padding: '13px 24px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = fg; e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.2)' : 'rgba(14,14,14,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = fgMid; e.currentTarget.style.borderColor = border }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 5.2C5.5 4.4 6.1 4 7 4s1.5.6 1.5 1.4c0 .7-.4 1.1-1 1.4C7 7 7 7.5 7 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="7" cy="10" r="0.6" fill="currentColor"/></svg>
            See how it works
          </a>
        </div>

        {/* App mockup */}
        <div className="fade-up-5" style={{ width: '100%', maxWidth: 960, marginTop: 80, padding: '0 16px' }}>
          <div className="preview-float" style={{ background: dark ? '#161616' : '#fff', borderRadius: 14, border: `1px solid ${border}`, boxShadow: dark ? '0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4), 0 32px 80px rgba(0,0,0,0.3)' : '0 0 0 1px rgba(14,14,14,0.04), 0 8px 32px rgba(14,14,14,0.08), 0 32px 80px rgba(14,14,14,0.06)', overflow: 'hidden' }}>
            {/* Titlebar */}
            <div style={{ height: 38, background: dark ? '#1e1e1e' : '#f3f2ef', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: dark ? '#2a2a2a' : '#ebebea', borderRadius: 5, height: 20, width: 220, display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                  <span style={{ fontSize: 10.5, color: fgLow }}>app.openclips.io/dashboard</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', height: 420 }}>
              {/* Sidebar */}
              <div style={{ width: 200, flexShrink: 0, background: dark ? '#111' : '#f7f6f3', borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', padding: '14px 10px', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', marginBottom: 12 }}>
                  <OpenClipsLogo size={16} />
                  <span className="michroma" style={{ fontSize: 11, fontWeight: 400, color: fg }}>Open<strong>Clips</strong></span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 500, color: fgLow, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px 4px' }}>Workspace</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 5, fontSize: 12, color: fgMid }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: dark ? '#444' : '#999' }} />Home
                </div>
                <span style={{ fontSize: 10, fontWeight: 500, color: fgLow, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 8px 4px' }}>Projects</span>
                <div className="grad" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 5, fontSize: 12, color: '#fff', fontWeight: 500 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(255,255,255,0.7)' }} />AI Research 2025
                </div>
                {[['#4ACFD2','Product Teardowns'],['#F0B400','Reading List'],['#E23E2B','Design Refs']].map(([c,t]) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 5, fontSize: 12, color: fgMid }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c, flexShrink: 0 }} />{t}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: fg }}>AI Research 2025</span>
                  <button className="grad" style={{ color: '#fff', fontSize: 11, fontWeight: 500, padding: '5px 10px', borderRadius: 5, border: 'none', cursor: 'pointer' }}>+ New</button>
                </div>
                {[
                  ['#6C63FF','The Transformer Architecture Explained','Self-attention mechanisms allow models to weigh the relevance of different parts of the input sequence…'],
                  ['#4ACFD2','Scaling Laws for Neural Language Models','Performance improves predictably with model size, dataset size, and compute budget…'],
                  ['#F0B400','Chain-of-thought prompting elicits reasoning','A simple prompting strategy that dramatically improves multi-step reasoning tasks…'],
                ].map(([color, title, body]) => (
                  <div key={title} style={{ background: dark ? 'rgba(255,255,255,0.04)' : '#fafaf8', border: `1px solid ${border}`, borderRadius: 7, padding: '10px 14px', display: 'flex', gap: 10, cursor: 'pointer' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0, marginTop: 2, background: `${color}22` }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: fg, marginBottom: 3 }}>{title}</div>
                      <div style={{ fontSize: 11, color: fgMid, lineHeight: 1.5 }}>{body}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat */}
              <div style={{ width: 260, flexShrink: 0, borderLeft: `1px solid ${border}`, display: 'flex', flexDirection: 'column', background: dark ? '#111' : '#fff' }} className="hidden lg:flex">
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px 14px', borderBottom: `1px solid ${border}`, fontSize: 12, fontWeight: 600, color: fg }}>
                  <div className="grad" style={{ width: 7, height: 7, borderRadius: '50%' }} />Ask AI
                </div>
                <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
                  <div className="grad" style={{ color: '#fff', alignSelf: 'flex-end', fontSize: 11, lineHeight: 1.5, padding: '8px 10px', borderRadius: '8px 8px 2px 8px', maxWidth: '90%' }}>
                    Summarise the key themes across my clips
                  </div>
                  <div style={{ background: dark ? 'rgba(255,255,255,0.07)' : '#f3f2ef', color: fg, alignSelf: 'flex-start', fontSize: 11, lineHeight: 1.5, padding: '8px 10px', borderRadius: '8px 8px 8px 2px', maxWidth: '90%' }}>
                    Across your 3 clips, the central theme is <strong>scaling and emergent behaviour</strong> in LLMs…
                  </div>
                </div>
                <div style={{ margin: 10, background: dark ? 'rgba(255,255,255,0.05)' : '#f3f2ef', borderRadius: 7, height: 32, display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 11, color: fgLow, border: `1px solid ${border}` }}>
                  Ask about your clips…
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS BAR ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '28px 40px', background: sectionBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, transition: 'background 0.3s' }}>
        <span style={{ fontSize: 11.5, color: fgLow, marginRight: 8 }}>Works with content from</span>
        {['arXiv','Medium','Substack','Wikipedia','YouTube','Twitter / X','Any website'].map(s => (
          <span key={s} style={{ fontSize: 12, fontWeight: 500, color: fgMid, background: dark ? 'rgba(255,255,255,0.06)' : '#fff', border: `1px solid ${border}`, borderRadius: 100, padding: '6px 14px' }}>{s}</span>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#6C63FF', marginBottom: 12 }}>Features</div>
        <h2 className="serif" style={{ fontSize: 'clamp(36px,4vw,52px)', lineHeight: 1.1, letterSpacing: '-1px', color: fg, maxWidth: 520, marginBottom: 16 }}>
          Everything you need.<br />Nothing you don't.
        </h2>
        <p style={{ fontSize: 16, color: fgMid, lineHeight: 1.7, maxWidth: 440, fontWeight: 300, marginBottom: 56 }}>
          Built for researchers, students, and curious minds who want to think — not manage tabs.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', border: `1px solid ${border}`, borderRadius: 14, overflow: 'hidden' }}>
          {[
            { icon: '📎', color: 'rgba(108,99,255,0.08)', title: 'One-click clipping',      body: 'Save any text, image, or link from the web with the browser extension. No copying, no switching tabs.' },
            { icon: '📁', color: 'rgba(74,207,210,0.1)',  title: 'Project workspaces',       body: 'Organise clips into focused projects. Keep your AI research separate from your product teardowns.' },
            { icon: '✦',  color: 'rgba(240,180,0,0.1)',   title: 'Ask AI about your clips',  body: 'Select clips and ask questions. Get answers grounded in your saved research — no hallucinations.' },
            { icon: '🔗', color: 'rgba(226,62,43,0.08)',  title: 'Source always attached',   body: 'Every clip keeps its original URL. Never lose track of where something came from.' },
            { icon: '⌨️', color: 'rgba(108,99,255,0.08)', title: '!ask inline command',      body: 'Type !ask inside any clip to open AI with that clip as context — without leaving your notes.' },
            { icon: '🔄', color: 'rgba(74,207,210,0.1)',  title: 'Always in sync',           body: 'Everything syncs across devices in real time. Clip on mobile, research on desktop.' },
          ].map((f, i) => (
            <div key={f.title} style={{ background: dark ? 'rgba(255,255,255,0.02)' : '#fafaf8', borderRight: i % 3 !== 2 ? `1px solid ${border}` : 'none', borderBottom: i < 3 ? `1px solid ${border}` : 'none', padding: 36, transition: 'background 0.15s', cursor: 'default' }}
              onMouseEnter={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.05)' : '#fff')}
              onMouseLeave={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.02)' : '#fafaf8')}>
              <div style={{ width: 38, height: 38, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 20, background: f.color }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: fg, marginBottom: 8, letterSpacing: '-0.2px' }}>{f.title}</div>
              <div style={{ fontSize: 13.5, color: fgMid, lineHeight: 1.65, fontWeight: 300 }}>{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ position: 'relative', background: '#0e0e0e', padding: '96px 40px', overflow: 'hidden' }}>
        <div className="dot-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,141,245,0.12) 0%, transparent 65%)', top: -100, right: -100, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(107,141,245,0.9)', marginBottom: 12 }}>How it works</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px,4vw,52px)', lineHeight: 1.1, letterSpacing: '-1px', color: '#fff', maxWidth: 520, marginBottom: 16 }}>
            From scattered tabs<br />to structured thinking.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 380, fontWeight: 300, marginBottom: 56 }}>Three steps. No learning curve.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            {[
              { n: '01', title: 'Install the extension',  body: "Add OpenClips to Chrome. One click to clip any text, image, or URL from any page you're browsing." },
              { n: '02', title: 'Organise into projects', body: 'Create projects for each topic. Clips go straight in. The sidebar stays with you as you switch.' },
              { n: '03', title: 'Ask AI anything',        body: 'Select one or more clips and ask a question. Get answers grounded in your own saved research.' },
            ].map(s => (
              <div key={s.n} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 32, background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.15s, background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(107,141,245,0.3)'; e.currentTarget.style.background = 'rgba(107,141,245,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}>
                <div className="serif grad-text" style={{ fontSize: 48, lineHeight: 1, marginBottom: 20 }}>{s.n}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 10, letterSpacing: '-0.2px' }}>{s.title}</div>
                <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, fontWeight: 300 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#6C63FF', marginBottom: 12 }}>Early users</div>
        <h2 className="serif" style={{ fontSize: 'clamp(36px,4vw,52px)', lineHeight: 1.1, letterSpacing: '-1px', color: fg, maxWidth: 480, marginBottom: 56 }}>
          Researchers who<br />made the switch.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { init: 'A', grad: 'linear-gradient(135deg,#6B8DF5,#7B5CE6)', name: 'Arjun M.',  role: 'PhD Researcher, NLP',    quote: '"I used to have 60 open tabs for every project. Now I clip as I go and actually revisit things. The AI summary across clips is genuinely useful."' },
            { init: 'S', grad: 'linear-gradient(135deg,#4ACFD2,#6B8DF5)', name: 'Sofia K.',  role: 'Product Designer',        quote: '"The !ask command changed my workflow completely. I can query my own research inline. It finally thinks the way I do."' },
            { init: 'T', grad: 'linear-gradient(135deg,#F0B400,#E23E2B)', name: 'Tom R.',    role: 'Independent Analyst',     quote: '"Clean, fast, and the sidebar stays put between projects. Sounds small — makes a huge difference when switching context constantly."' },
          ].map(q => (
            <div key={q.name} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: 28, transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = dark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(14,14,14,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {[...Array(5)].map((_,i) => (
                  <div key={i} style={{ width: 13, height: 13, background: '#F0B400', clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' }} />
                ))}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: fg, fontWeight: 300, fontStyle: 'italic', marginBottom: 20 }}>{q.quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#fff', background: q.grad, flexShrink: 0 }}>{q.init}</div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: fg }}>{q.name}</div>
                  <div style={{ fontSize: 11.5, color: fgLow }}>{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div style={{ margin: '0 40px 96px', borderRadius: 20, background: '#0e0e0e', padding: '80px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="dot-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,141,245,0.18) 0%, transparent 65%)', top: -150, left: -100, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,92,230,0.15) 0%, transparent 65%)', bottom: -100, right: -80, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(107,141,245,0.8)', marginBottom: 16 }}>Get started today</div>
          <h2 className="serif" style={{ fontSize: 'clamp(38px,4.5vw,58px)', lineHeight: 1.1, letterSpacing: '-1.5px', color: '#fff', marginBottom: 16 }}>
            Clip the open web.<br />
            <em style={{ fontStyle: 'normal', color: 'rgba(255,255,255,0.4)' }}>Think Deeper.</em>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontWeight: 300, marginBottom: 40 }}>Free to use. No credit card required.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/login" className="grad" style={{ color: '#fff', fontSize: 14, fontWeight: 600, padding: '13px 28px', borderRadius: 10, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(108,99,255,0.4)', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Create free account
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <a href="#features" style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '13px 24px', textDecoration: 'none', transition: 'color 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}>
              Learn more
            </a>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: '32px 40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <OpenClipsLogo size={20} />
          <span className="michroma" style={{ fontSize: 13, fontWeight: 400, color: fg }}>Open<strong>Clips</strong></span>
        </Link>
        <ul style={{ display: 'flex', gap: 28, listStyle: 'none', margin: 0, padding: 0 }}>
          {['Privacy','Terms','Extension','Contact'].map(l => (
            <li key={l}><a href="#" style={{ fontSize: 13, color: fgLow, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = fg)}
              onMouseLeave={e => (e.currentTarget.style.color = fgLow)}>{l}</a></li>
          ))}
        </ul>
        <span style={{ fontSize: 12, color: fgLow }}>© OpenClips 2026</span>
      </footer>

    </div>
  )
}