'use client'

import { useState, useRef, useEffect, ReactElement } from 'react'
import Link from 'next/link'
import { accent } from '@/app/dashboard/DShared'
import { t } from '@/app/landing/shared'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Section {
  id: string
  title: string
  content: ReactElement
}

// ── Data ──────────────────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: (
      <>
        <p>clippx is a browser extension and web app that lets you clip content from the internet — articles, links, text, and images — and organise it into project workspaces. You can write notes alongside your clips and use AI to ask questions across everything you have saved.</p>
        <p style={{ marginTop: 16 }}>This Privacy Policy explains what data we collect when you use clippx, how we store it, and what control you have over it. It is written to be direct and specific. If anything is unclear, email us at <a href="mailto:privacy@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>privacy@clippx.io</a>.</p>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'What we collect',
    content: (
      <>
        <p>We only collect what is necessary for clippx to work. Specifically:</p>
        <ul style={{ marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Your email address.</strong> Used for login only. We send you a magic link to verify your identity — no password is ever stored.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Your clips.</strong> The content you save via the browser extension — text, URLs, images, and associated page metadata (title, source URL).</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Your notes.</strong> Any notes you write inside clippx projects.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Your projects.</strong> Project names, structure, and the clips they contain.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Basic usage data.</strong> Anonymous, aggregate information about how features are used — no personal identifiers, used only to improve the product.</li>
        </ul>
        <p style={{ marginTop: 16 }}>We do not collect your browsing history. The extension only captures content when you explicitly trigger a clip action.</p>
      </>
    ),
  },
  {
    id: 'how-we-use-it',
    title: 'How we use your data',
    content: (
      <>
        <p>Your data is used for one purpose: to make clippx work for you.</p>
        <ul style={{ marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <li>Your email is used to authenticate you and send login links. We do not send marketing emails unless you explicitly opt in.</li>
          <li>Your clips and notes power the workspace, search, and AI Q&amp;A features. The AI only has access to clips you select or that belong to the active project.</li>
          <li>Usage data is used in aggregate to understand which features are useful and which need work.</li>
        </ul>
        <p style={{ marginTop: 16 }}>We do not use your data to train AI models. We do not sell your data. We do not share your data with third parties for advertising or any commercial purpose.</p>
      </>
    ),
  },
  {
    id: 'third-parties',
    title: 'Third-party services',
    content: (
      <>
        <p>clippx uses a small number of third-party infrastructure providers to operate. These are processors — they act on our instructions and cannot use your data for their own purposes.</p>
        <ul style={{ marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Database &amp; storage.</strong> Your clips, notes, and account data are stored in a managed cloud database. Data is encrypted at rest and in transit.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>AI inference.</strong> When you use AI Q&amp;A, the selected clip content is sent to a model provider to generate a response. It is not retained or used for training under our agreement.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Email delivery.</strong> Login links are sent via a transactional email provider. Your email is shared only for delivery.</li>
        </ul>
        <p style={{ marginTop: 16 }}>Your data is never sold, licensed, or shared beyond the infrastructure providers listed above.</p>
      </>
    ),
  },
  {
    id: 'login',
    title: 'Authentication',
    content: (
      <p>clippx uses email magic links for login. When you enter your email, we send a single-use verification link. Clicking it signs you in — no password is ever created or stored. The link expires after 15 minutes.</p>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights and controls',
    content: (
      <>
        <p>You are in full control of your data:</p>
        <ul style={{ marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Delete individual clips or notes</strong> at any time from within the app. Deletion is immediate and permanent.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Delete your entire account</strong> from account settings. This permanently removes all clips, notes, projects, and your email from our systems. There is no recovery.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Export your data</strong> (coming soon) — a full export feature so you can take everything with you at any time.</li>
        </ul>
        <div style={{ background: 'rgba(121,101,246,0.08)', border: '1px solid rgba(121,101,246,0.2)', borderRadius: 12, padding: '16px 20px', marginTop: 20 }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
            To delete your account: <strong style={{ color: '#fff' }}>Settings → Account → Delete account.</strong> All data is permanently erased. Need help? Email <a href="mailto:privacy@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>privacy@clippx.io</a> and we will delete everything within 48 hours.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'Data retention',
    content: (
      <p>Your data is retained for as long as your account exists. When you delete your account, all associated data — clips, notes, projects, email address — is permanently removed from our systems and backups within 30 days. We do not retain ghost copies of deleted accounts.</p>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    content: (
      <p>All data is encrypted in transit (TLS) and at rest. We use industry-standard access controls. If you discover a security issue, please disclose it responsibly at <a href="mailto:privacy@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>privacy@clippx.io</a>.</p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    content: (
      <p>If we make material changes we will notify you by email before they take effect. The date at the top of this page reflects the most recent update. Continued use of clippx after a change constitutes acceptance of the updated policy.</p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    content: (
      <p>Questions or concerns about your data: <a href="mailto:privacy@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>privacy@clippx.io</a>. We aim to respond within 2 business days.</p>
    ),
  },
]

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  /* Reset stacking context */
  .pp-root {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background: #0a0a0f;
    color: #fff;
  }

  /* ── Navbar ── */
  .pp-nav {
    flex-shrink: 0;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(10,10,15,0.95);
    backdrop-filter: blur(12px);
    z-index: 10;
  }

  .pp-nav-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: '-0.3px';
  }

  .pp-nav-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.4);
    text-decoration: none;
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }
  .pp-nav-back:hover {
    color: #fff;
    border-color: rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.04);
  }

  /* ── Shell: sidebar + content ── */
  .pp-shell {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .pp-sidebar {
    width: 260px;
    min-width: 260px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.01);
    padding: 36px 16px 40px;
    scrollbar-width: none;
  }
  .pp-sidebar::-webkit-scrollbar { display: none; }

  /* ── TOC links ── */
  .pp-toc-btn {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.4);
    padding: 8px 14px;
    border-radius: 8px;
    border-left: 2px solid transparent;
    transition: color 0.15s, background 0.15s, border-color 0.15s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pp-toc-btn:hover {
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.04);
  }
  .pp-toc-btn.active {
    color: #fff;
    background: rgba(121,101,246,0.1);
    border-left-color: #7965F6;
  }

  /* ── Scrollable content ── */
  .pp-content {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.08) transparent;
  }
  .pp-content::-webkit-scrollbar { width: 4px; }
  .pp-content::-webkit-scrollbar-track { background: transparent; }
  .pp-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

  /* ── Section ── */
  .pp-section {
    padding: 44px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .pp-section:last-of-type { border-bottom: none; padding-bottom: 80px; }

  @keyframes eyebrow-dot {
    0%,100% { box-shadow: 0 0 0px  rgba(121,101,246,0.5); }
    50%      { box-shadow: 0 0 8px  rgba(121,101,246,0.9), 0 0 14px rgba(121,101,246,0.4); }
  }
  .eyebrow-dot { animation: eyebrow-dot 2.4s ease-in-out infinite; }

  /* ── Mobile ── */
  @media (max-width: 680px) {
    .pp-root { height: auto; overflow: visible; }
    .pp-shell { flex-direction: column; overflow: visible; }
    .pp-sidebar { width: 100%; min-width: unset; height: auto; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 16px; flex-direction: row; flex-wrap: wrap; gap: 4px; }
    .pp-content { height: auto; overflow: visible; }
  }
`

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PrivacyPage(): ReactElement {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id)
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Track which section is in view while scrolling
  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const handler = () => {
      let current = SECTIONS[0].id
      for (const s of SECTIONS) {
        const ref = sectionRefs.current[s.id]
        if (ref && ref.offsetTop - el.scrollTop <= 120) {
          current = s.id
        }
      }
      setActiveId(current)
    }

    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    const ref = sectionRefs.current[id]
    const el  = contentRef.current
    if (!ref || !el) return
    el.scrollTo({ top: ref.offsetTop - 32, behavior: 'smooth' })
    setActiveId(id)
  }

  return (
    <div className="pp-root">
      <style>{CSS}</style>

      {/* ── Navbar ── */}
      <nav className="pp-nav">
        <Link href="/" className="pp-nav-logo">
          <span className="eyebrow-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: accent.primary, display: 'inline-block', flexShrink: 0 }} />
          clippx
        </Link>
        <Link href="/" className="pp-nav-back">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to home
        </Link>
      </nav>

      {/* ── Shell ── */}
      <div className="pp-shell">

        {/* ── Sidebar ── */}
        <aside className="pp-sidebar">
          <div style={{ marginBottom: 28, paddingLeft: 4 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, background: 'rgba(121,101,246,0.1)', border: '1px solid rgba(121,101,246,0.2)', borderRadius: 100, padding: '5px 14px' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary, display: 'inline-block' }} />
              Privacy Policy
            </div>
            <p style={{ fontSize: 12, color: t.fgLow, marginTop: 12, paddingLeft: 2 }}>
              Last updated March 11, 2026
            </p>
          </div>

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: t.fgLow, marginBottom: 8, paddingLeft: 14 }}>
            Contents
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SECTIONS.map(s => (
              <button
                key={s.id}
                className={`pp-toc-btn${activeId === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 32, paddingLeft: 14 }}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />
            <p style={{ fontSize: 12, color: t.fgLow, marginBottom: 8 }}>Also see</p>
            <Link href="/terms" style={{ display: 'block', fontSize: 13, color: accent.primary, textDecoration: 'none', fontWeight: 500 }}>
              Terms of Use →
            </Link>
          </div>
        </aside>

        {/* ── Content ── */}
        <div ref={contentRef} className="pp-content">
          <div style={{ padding: '48px 64px 0' }}>

            {/* Sections */}
            <article style={{ fontSize: 15, color: 'rgba(255,255,255,0.62)', lineHeight: 1.85 }}>
              {SECTIONS.map(s => (
                <div
                  key={s.id}
                  id={s.id}
                  className="pp-section"
                  ref={el => { sectionRefs.current[s.id] = el }}
                >
                  <h2 style={{ fontSize: 21, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px', marginBottom: 18 }}>
                    {s.title}
                  </h2>
                  {s.content}
                </div>
              ))}
            </article>
          </div>
        </div>

      </div>
    </div>
  )
}