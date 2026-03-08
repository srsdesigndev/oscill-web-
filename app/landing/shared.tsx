'use client'

// ── Accent palette ────────────────────────────────────────────────────────────
export const accent = {
  primary:   '#7965F6',               // main violet
  secondary: '#5177F6',               // blue-violet
  gradient:  'linear-gradient(135deg, #7965F6 0%, #5177F6 100%)',
  gradientSubtle: 'linear-gradient(135deg, rgba(121,101,246,0.15) 0%, rgba(81,119,246,0.15) 100%)',
  glow:      '0 4px 24px rgba(121,101,246,0.35)',
  glowLg:    '0 8px 40px rgba(121,101,246,0.45)',
  border:    'rgba(121,101,246,0.3)',
  borderHover: 'rgba(121,101,246,0.55)',
}

// ── Theme tokens — dark only ──────────────────────────────────────────────────
export const t = {
  bg:        '#000000',
  surfaceBg: '#0a0a0a',
  fg:        '#ffffff',
  fgMid:     'rgba(255,255,255,0.5)',
  fgLow:     'rgba(255,255,255,0.28)',
  border:    'rgba(255,255,255,0.1)',
  cardBg:    'rgba(255,255,255,0.04)',
  navBg:     'rgba(0,0,0,0.65)',
  // CTA — gradient accent
  ctaBg:     accent.gradient,
  ctaFg:     '#ffffff',
  ctaShadow: accent.glow,
  // Secondary outline button
  secBorder: 'rgba(255,255,255,0.15)',
  secFg:     'rgba(255,255,255,0.55)',
}

// ── OpenClips Logo ────────────────────────────────────────────────────────────
export const OpenClipsLogo = ({ size = 22, color = 'currentColor' }: { size?: number; color?: string; id?: string }) => (
  <svg width={size} height={size} viewBox="0 0 31 31" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M22.3889 25.8333H6.88889C6.43213 25.8333 5.99407 25.6519 5.67109 25.3289C5.34811 25.0059 5.16667 24.5679 5.16667 24.1111V8.61111H0V5.16667H5.16667V0H8.61111V5.16667H24.1111C24.5679 5.16667 25.0059 5.34811 25.3289 5.67109C25.6519 5.99407 25.8333 6.43213 25.8333 6.88889V22.3889H31V25.8333H25.8333V31H22.3889V25.8333ZM22.3889 22.3889V8.61111H8.61111V22.3889H22.3889Z" fill={color}/>
  </svg>
)

// ── Brand name ────────────────────────────────────────────────────────────────
export const BrandName = ({ size = 14, color = '#fff' }: { size?: number; color?: string }) => (
  <span style={{ fontFamily: "'Michroma', sans-serif", fontSize: size, fontWeight: 400, color, letterSpacing: '0.3px' }}>
    Open<strong>Clips</strong>
  </span>
)

// ── Arrow icon ────────────────────────────────────────────────────────────────
export const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── Global CSS ────────────────────────────────────────────────────────────────
export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=Michroma&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .serif    { font-family: 'DM Serif Display', Georgia, serif; }
  .michroma { font-family: 'Michroma', sans-serif; }

  /* CTA gradient */
  .grad      { background: linear-gradient(135deg, #7965F6 0%, #5177F6 100%); }
  .grad-text { background: linear-gradient(135deg, #7965F6 0%, #5177F6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .deeper-text {
    font-family: 'Michroma', sans-serif;
    font-weight: 700;
    background: linear-gradient(135deg, #7965F6 0%, #5177F6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass-nav {
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
  }
  .dot-grid { background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 28px 28px; }

  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes fade-up  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  .float     { animation: float   7s ease-in-out infinite; }
  .fade-up-1 { animation: fade-up 0.6s 0.0s  ease both; }
  .fade-up-2 { animation: fade-up 0.6s 0.1s  ease both; }
  .fade-up-3 { animation: fade-up 0.6s 0.2s  ease both; }
  .fade-up-4 { animation: fade-up 0.6s 0.35s ease both; }
  .fade-up-5 { animation: fade-up 0.8s 0.5s  ease both; }
  .card-hover { transition: transform 0.2s ease, border-color 0.2s ease; }
  .card-hover:hover { transform: translateY(-3px); }
  a, button { cursor: pointer; }
`