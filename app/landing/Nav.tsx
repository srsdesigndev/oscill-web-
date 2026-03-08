'use client'

import Link from 'next/link'
import { t, accent, OpenClipsLogo, BrandName } from './shared'

export function Nav() {
  return (
    <nav className="glass-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: 62,
      background: t.navBg,
      borderBottom: `1px solid ${t.border}`,
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <OpenClipsLogo size={22} color={accent.primary} />
        <BrandName size={14} color={t.fg} />
      </Link>

      {/* Links */}
      <ul style={{ display: 'flex', alignItems: 'center', gap: 36, listStyle: 'none' }}>
        {[['Features','#features'],['How it works','#how-it-works'],['Use cases','#use-cases'],['Extension','#extension']].map(([label, href]) => (
          <li key={label}>
            <a href={href} style={{ fontSize: 13.5, color: t.fgMid, textDecoration: 'none', fontWeight: 400 }}
              onMouseEnter={e => (e.currentTarget.style.color = t.fg)}
              onMouseLeave={e => (e.currentTarget.style.color = t.fgMid)}>
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: t.fgMid, textDecoration: 'none', padding: '0 4px' }}
          onMouseEnter={e => (e.currentTarget.style.color = t.fg)}
          onMouseLeave={e => (e.currentTarget.style.color = t.fgMid)}>
          Sign in
        </Link>

        <Link href="/login" className="grad" style={{
          color: '#fff', fontSize: 13, fontWeight: 600, padding: '9px 20px',
          borderRadius: 8, textDecoration: 'none',
          boxShadow: accent.glow,
          transition: 'opacity 0.15s, box-shadow 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.boxShadow = accent.glowLg }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.boxShadow = accent.glow }}>
          Get started free
        </Link>
      </div>
    </nav>
  )
}