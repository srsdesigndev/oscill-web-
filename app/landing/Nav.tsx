'use client'

import Link from 'next/link'
import { t, accent, ClippxLogo, BrandName } from './shared'
import { Ribbon } from './Ribbon'

// ── Data ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Products',     href: '#products'     },
  { label: 'Features',     href: '#features'     },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing',      href: '#pricing'      },
  { label: 'Extension',    href: '#extension'    },
  { label: 'Support',    href: '#extension'    },
]

// ── Styles ────────────────────────────────────────────────────────────────────
const CSS = `
  .nav-link {
    font-size: 13.5px;
    font-weight: 400;
    color: ${t.fgMid};
    text-decoration: none;
    transition: color 0.15s;
  }
  .nav-link:hover { color: ${t.fg}; }

  .nav-signin {
    font-size: 13px;
    font-weight: 500;
    color: ${t.fgMid};
    text-decoration: none;
    padding: 0 4px;
    transition: color 0.15s;
  }
  .nav-signin:hover { color: ${t.fg}; }

  .nav-cta {
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 9px 20px;
    border-radius: 8px;
    text-decoration: none;
    box-shadow: ${accent.glow};
    transition: opacity 0.15s, box-shadow 0.15s;
  }
  .nav-cta:hover {
    opacity: 0.88;
    box-shadow: ${accent.glowLg};
  }
`

// ── Component ─────────────────────────────────────────────────────────────────
export function Nav() {
  return (
    <>

      <style>{CSS}</style>
      <nav
        className="glass-nav"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px', height: 62,
          background: t.navBg,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClippxLogo size={22} color={accent.primary} />
          <BrandName size={14} color={t.fg} />
        </Link>

        {/* Links */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: 36, listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className="nav-link">{label}</a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/login" className="nav-signin">Sign in</Link>
          <Link href="/login" className="nav-cta grad">Get started free</Link>
        </div>
      </nav>
    </>
  )
}