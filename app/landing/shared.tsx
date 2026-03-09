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


// ── clippx Logo ─────────────────────────────────────────
export const ClippxLogo = ({
  size = 22,
  color = '#FA0143'
}: {
  size?: number
  color?: string
}) => (
  <svg width={size} height={size} viewBox="0 0 69 62" fill="none">
    <path
      d="M46.0914 57.5569L46.0914 34.0282C46.0914 27.5138 40.7629 22.2141 34.2131 22.2141C27.6634 22.2141 22.3348 27.5138 22.3348 34.0282L22.3348 57.5812C22.3348 58.4733 21.9785 59.3289 21.3443 59.9597C20.7101 60.5905 19.8499 60.9448 18.9529 60.9448C18.056 60.9448 17.1958 60.5905 16.5616 59.9597C15.9273 59.3289 15.571 58.4733 15.571 57.5812L15.571 34.029C15.571 23.8056 23.9328 15.4878 34.2131 15.4878C44.4935 15.4878 52.8552 23.8056 52.8552 34.029L52.8552 57.5569C52.8552 58.449 52.4989 59.3046 51.8647 59.9354C51.2305 60.5662 50.3703 60.9206 49.4733 60.9206C48.5764 60.9206 47.7162 60.5662 47.082 59.9354C46.4477 59.3046 46.0914 58.449 46.0914 57.5569Z"
      fill={color}
    />
    <path
      d="M68.4269 34.0279L68.4269 56.9115C68.4269 57.8036 68.0706 58.6591 67.4363 59.2899C66.8021 59.9207 65.9419 60.2751 65.045 60.2751C64.148 60.2751 63.2878 59.9207 62.6536 59.2899C62.0194 58.6591 61.6631 57.8036 61.6631 56.9115L61.6631 34.0279C61.6631 18.9737 49.3492 6.72723 34.2131 6.72723C19.0771 6.72723 6.76275 18.9746 6.76275 34.0288L6.76275 57.9138C6.76784 58.3587 6.68415 58.8001 6.51651 59.2126C6.34887 59.625 6.10062 60.0003 5.78614 60.3167C5.47166 60.6331 5.09719 60.8842 4.68443 61.0556C4.27166 61.2271 3.82881 61.3153 3.38151 61.3153C2.93421 61.3153 2.49135 61.2271 2.07859 61.0556C1.66583 60.8842 1.29136 60.6331 0.976875 60.3167C0.662393 60.0003 0.414144 59.625 0.246506 59.2126C0.0788677 58.8001 -0.00481961 58.3587 0.000274807 57.9138L0.000275851 34.0288C0.000276671 15.2654 15.3482 6.70889e-07 34.214 1.49554e-06C53.0798 2.32019e-06 68.4269 15.2641 68.4269 34.0279Z"
      fill={color}
    />
  </svg>
)

// ── Brand name ────────────────────────────────────────────────────────────────
export const BrandName = ({ size = 14, color = '#fff' }: { size?: number; color?: string }) => (
  <span style={{ fontFamily: "'Michroma', sans-serif", fontSize: size, fontWeight: 400, color, letterSpacing: '0.3px' }}>
    <strong>clippx</strong>
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