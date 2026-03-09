'use client'

import Link from 'next/link'
import { Footer } from '@/app/landing/Footer'
import { accent, t } from '@/app/landing/shared'

// ── Data ──────────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    group: 'Getting Started',
    icon: '🚀',
    items: [
      { title: 'What is OpenClips?',      slug: 'introduction',       desc: 'How OpenClips works — the extension, the dashboard, and how they connect.' },
      { title: 'Create your account',     slug: 'create-account',     desc: 'Sign up and set up your workspace in under a minute.' },
      { title: 'Install the extension',   slug: 'install-extension',  desc: 'Add OpenClips to Chrome in two clicks. No terminal, no setup.' },
      { title: 'Clip your first page',    slug: 'first-clip',         desc: 'How to save anything from the web instantly using the extension.' },
    ],
  },
  {
    group: 'The Extension',
    icon: '🧩',
    items: [
      { title: 'Clipping from Chrome',    slug: 'clipping',           desc: 'Save full pages, selected text, images, and links with one click.' },
      { title: 'The clip sheet',          slug: 'clip-sheet',         desc: 'The popup that appears when you clip — tagging, project selection, and notes.' },
      { title: 'Supported content types', slug: 'content-types',      desc: 'Articles, tweets, PDFs, YouTube videos, research papers, and more.' },
      { title: 'Extension settings',      slug: 'extension-settings', desc: 'Keyboard shortcuts, default project, and auto-tag preferences.' },
    ],
  },
  {
    group: 'The Dashboard',
    icon: '🖥️',
    items: [
      { title: 'Dashboard overview',      slug: 'dashboard',          desc: 'Your home for everything saved — browse, search, and organise clips.' },
      { title: 'Projects',                slug: 'projects',           desc: 'Group clips into focused workspaces. One project per topic or goal.' },
      { title: 'Quick Notes',             slug: 'quick-notes',        desc: 'Write ideas directly in the dashboard — no extension needed.' },
      { title: 'Search & filters',        slug: 'search',             desc: 'Find anything across your entire library instantly.' },
    ],
  },
  {
    group: 'AI Features',
    icon: '✦',
    items: [
      { title: 'Ask AI',                  slug: 'ask-ai',             desc: 'Ask questions about your clips in plain language. Answers stay grounded in your data.' },
      { title: 'Summaries',               slug: 'summaries',          desc: 'Auto-summarise any clip or entire project with one click.' },
      { title: 'Connections',             slug: 'connections',        desc: 'AI surfaces hidden links between clips you\'ve saved.' },
      { title: 'How grounding works',     slug: 'grounding',          desc: 'Why the AI only answers from your clips — and why that matters.' },
    ],
  },
  {
    group: 'Account & Billing',
    icon: '⚙️',
    items: [
      { title: 'Plans & limits',          slug: 'plans',              desc: 'Free vs paid — clip limits, project limits, and AI access.' },
      { title: 'Managing your account',   slug: 'account',            desc: 'Profile, password, connected devices, and session management.' },
      { title: 'Export your data',        slug: 'export',             desc: 'Download all your clips and notes as Markdown, JSON, or PDF.' },
      { title: 'Delete your account',     slug: 'delete-account',     desc: 'How to permanently remove your data from OpenClips.' },
    ],
  },
]

const CSS = `
  @keyframes docs-fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .docs-fade-1 { animation: docs-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .docs-fade-2 { animation: docs-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
  .docs-fade-3 { animation: docs-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.20s both; }

  .docs-search {
    width: 100%; background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
    padding: 14px 18px 14px 44px; font-size: 14px;
    color: #fff; outline: none; font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .docs-search::placeholder { color: rgba(255,255,255,0.28); }
  .docs-search:focus {
    border-color: rgba(121,101,246,0.5);
    box-shadow: 0 0 0 3px rgba(121,101,246,0.1);
  }

  .doc-card {
    display: flex; flex-direction: column; gap: 6px;
    padding: 18px 20px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.02);
    text-decoration: none;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .doc-card:hover {
    background: rgba(121,101,246,0.07);
    border-color: rgba(121,101,246,0.25);
    transform: translateY(-1px);
  }

  @keyframes eyebrow-dot {
    0%,100% { box-shadow: 0 0 0px rgba(121,101,246,0.5); }
    50%      { box-shadow: 0 0 8px rgba(121,101,246,0.9), 0 0 14px rgba(121,101,246,0.4); }
  }
  .eyebrow-dot { animation: eyebrow-dot 2.4s ease-in-out infinite; }
`

export default function DocsPage() {
  return (
    <>
      <style>{CSS}</style>

      {/* Hero */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '80px 40px 64px', textAlign: 'center' }}>
        <div className="docs-fade-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, background: 'rgba(121,101,246,0.1)', border: '1px solid rgba(121,101,246,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
          <span className="eyebrow-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary, display: 'inline-block' }} />
          Documentation
        </div>
        <h1 className="docs-fade-2" style={{ fontSize: 'clamp(40px,5vw,64px)', fontWeight: 800, letterSpacing: '-2.5px', lineHeight: 1.05, color: '#fff', marginBottom: 20 }}>
          Everything you need<br />to know.
        </h1>
        <p className="docs-fade-3" style={{ fontSize: 16, color: t.fgMid, lineHeight: 1.75, fontWeight: 300, maxWidth: 460, margin: '0 auto 40px' }}>
          From installing the Chrome extension to using AI across your clips — all guides in one place.
        </p>
        <div className="docs-fade-3" style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}>
          <svg style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="docs-search" type="text" placeholder="Search documentation…" />
        </div>
      </section>

      {/* Sections */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '0 40px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>
          {SECTIONS.map(({ group, icon, items }) => (
            <div key={group}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 17 }}>{icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.2px' }}>{group}</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)', marginLeft: 8 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {items.map(({ title, slug, desc }) => (
                  <Link key={slug} href={`/resources/docs/${slug}`} className="doc-card">
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>{title}</span>
                    <span style={{ fontSize: 12.5, color: t.fgMid, lineHeight: 1.6, fontWeight: 300 }}>{desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}