'use client'

import Link from 'next/link'
import { t, accent, ClippxLogo, BrandName } from './shared'

const LINKS = {
  Product:   ['Features', 'How it works', 'Extension', 'Pricing'],
  Resources: ['Docs', 'Changelog', 'Status', 'Blog'],
  Company:   ['About', 'Contact', 'Careers'],
  Legal:     ['Privacy', 'Terms', 'Cookie policy'],
}

export function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${t.border}`, padding: '64px 40px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(4, 1fr)', gap: 40, marginBottom: 56 }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <ClippxLogo size={20} color={accent.primary} />
              <BrandName size={13} color={t.fg} />
            </Link>
            <p style={{ fontSize: 13, color: t.fgLow, lineHeight: 1.6, fontWeight: 300 }}>
              Clip the open web.<br />Think Deeper.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: t.fgLow, marginBottom: 16 }}>{section}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                  <a key={item} href="#" style={{ fontSize: 13, color: t.fgMid, textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = t.fg)}
                    onMouseLeave={e => (e.currentTarget.style.color = t.fgMid)}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingTop: 24, borderTop: `1px solid ${t.border}` }}>
          <span style={{ fontSize: 12, color: t.fgLow }}>© clippx 2026. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Twitter / X', 'GitHub', 'Discord'].map(s => (
              <a key={s} href="#" style={{ fontSize: 12, color: t.fgLow, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = accent.primary)}
                onMouseLeave={e => (e.currentTarget.style.color = t.fgLow)}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}