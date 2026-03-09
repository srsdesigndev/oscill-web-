'use client'

import Link from 'next/link'
import { t, accent, ClippxLogo, BrandName } from './shared'

type LinkItem = { label: string; href: string }

const LINKS: Record<string, LinkItem[]> = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Extension', href: '/extension' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Resources: [
    { label: 'Docs', href: '/resources/docs' },
    { label: 'Changelog', href: '/resources/changelog' },
    { label: 'Status', href: '/resources/status' },
    { label: 'Blog', href: '/resources/blogs' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
    { label: 'Privacy', href: '/legal/privacy' },
    { label: 'Terms', href: '/legal/terms' },
    { label: 'Cookie policy', href: '/legal/cookies' },
  ],
  Support: [
    { label: 'Feature request', href: '/support/feature-request' },
    { label: 'Report abuse', href: '/support/report-abuse' },
  ],
}

const SOCIALS: LinkItem[] = [
  { label: 'Twitter / X', href: 'https://x.com/clippx' },
  { label: 'Discord', href: 'https://discord.gg/clippx' },
]

export function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${t.border}`, padding: '64px 40px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(5, 1fr)', gap: 40, marginBottom: 56 }}>

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

              {/* Section heading — Resources is a link itself */}
              {section === 'Resources' ? (
                <Link
                  href="/resources"
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: t.fgLow,
                    marginBottom: 16,
                    textDecoration: 'none',
                  }}
                >
                  {section}
                </Link>
              ) : (
                <p style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: t.fgLow,
                  marginBottom: 16,
                  margin: '0 0 16px',
                }}>
                  {section}
                </p>
              )}

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item: LinkItem) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{ fontSize: 13, color: t.fgMid, textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = t.fg }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = t.fgMid }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          paddingTop: 24,
          borderTop: `1px solid ${t.border}`,
        }}>
          <span style={{ fontSize: 12, color: t.fgLow }}>© clippx 2026. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {SOCIALS.map((social: LinkItem) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: t.fgLow, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = accent.primary }}
                onMouseLeave={(e) => { e.currentTarget.style.color = t.fgLow }}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}