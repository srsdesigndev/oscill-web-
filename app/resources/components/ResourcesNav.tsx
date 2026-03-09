'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { t, accent, ProductNameLogo, BrandName } from '@/app/landing/shared'

// ── Data ──────────────────────────────────────────────────────────────────────
const RESOURCES_LINKS = [
  { label: 'Docs',      href: '/resources/docs'      },
  { label: 'Changelog', href: '/resources/changelog' },
  { label: 'Status',    href: '/resources/status'    },
  { label: 'Blogs',      href: '/resources/blogs'      },
]

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  .res-nav-link {
    position: relative;
    font-size: 13.5px;
    font-weight: 400;
    color: rgba(255,255,255,0.42);
    text-decoration: none;
    padding: 4px 0;
    transition: color 0.18s;
  }
  .res-nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0; right: 0;
    height: 1px;
    border-radius: 1px;
    background: ${accent.primary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.22s cubic-bezier(0.22,1,0.36,1);
  }
  .res-nav-link:hover          { color: rgba(255,255,255,0.85); }
  .res-nav-link:hover::after   { transform: scaleX(1); }
  .res-nav-link.active         { color: #fff; font-weight: 500; }
  .res-nav-link.active::after  { transform: scaleX(1); }

  .res-back-link {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 400;
    color: rgba(255,255,255,0.28);
    text-decoration: none;
    transition: color 0.18s;
    padding: 4px 0;
  }
  .res-back-link:hover { color: rgba(255,255,255,0.65); }
`

// ── Component ─────────────────────────────────────────────────────────────────
export function ResourcesNav() {
  const pathname = usePathname()

  return (
    <>
      <style>{CSS}</style>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 56,
        display: 'flex', alignItems: 'center',
        padding: '0 40px',
        background: 'rgba(7,7,9,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>

        {/* Left — logo → back to home */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginRight: 40, flexShrink: 0 }}>
          <ProductNameLogo size={18} color={accent.primary} />
          <BrandName size={12.5} color={t.fg} />
        </Link>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', marginRight: 40, flexShrink: 0 }} />

        {/* Center — resource links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {RESOURCES_LINKS.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={label}
                href={href}
                className={`res-nav-link${active ? ' active' : ''}`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right — back link */}
        <div style={{ marginLeft: 'auto' }}>
          <Link href="/" className="res-back-link">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to OpenClips
          </Link>
        </div>

      </nav>
    </>
  )
}