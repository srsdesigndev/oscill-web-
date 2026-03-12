'use client'

import { accent } from '@/app/dashboard/DShared'
import { Footer } from '@/app/landing/Footer'
import { t } from '@/app/landing/shared'
import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Section {
  id: string
  title: string
  content: React.ReactNode
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes pp-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pp-fade-1 { animation: pp-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .pp-fade-2 { animation: pp-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
  .pp-fade-3 { animation: pp-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.20s both; }

  @keyframes eyebrow-dot {
    0%,100% { box-shadow: 0 0 0px rgba(121,101,246,0.5); }
    50%      { box-shadow: 0 0 8px rgba(121,101,246,0.9), 0 0 14px rgba(121,101,246,0.4); }
  }
  .eyebrow-dot { animation: eyebrow-dot 2.4s ease-in-out infinite; }

  .pp-section {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 40px 0;
  }
  .pp-section:last-of-type { border-bottom: none; }

  .pp-toc-link {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    text-decoration: none;
    padding: 6px 0;
    border-left: 2px solid transparent;
    padding-left: 14px;
    transition: color 0.2s, border-color 0.2s;
  }
  .pp-toc-link:hover {
    color: rgba(255,255,255,0.85);
    border-left-color: rgba(121,101,246,0.6);
  }

  .pp-highlight {
    background: rgba(121,101,246,0.1);
    border: 1px solid rgba(121,101,246,0.2);
    border-radius: 12px;
    padding: 16px 20px;
    margin: 20px 0 0;
  }
`

// ── Data ──────────────────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: (
      <>
        <p>clippx is a browser extension and web app that lets you clip content from the internet — articles, links, text, and images — and organise it into project workspaces. You can write notes and use AI to ask questions across your saved clips.</p>
        <p style={{ marginTop: 16 }}>This Privacy Policy explains what data we collect when you use clippx, how we store it, and what control you have over it. We have written it to be direct and specific, not vague. If something is unclear, email us at <a href="mailto:privacy@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>privacy@clippx.io</a>.</p>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'What we collect',
    content: (
      <>
        <p>We only collect what is necessary for clippx to work. Specifically:</p>
        <ul style={{ marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Your email address.</strong> Used for login only. We send you a magic link to verify your identity — no password is stored.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Your clips.</strong> The content you save via the browser extension or manually — text, URLs, images, and any associated page metadata (title, source URL).</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Your notes.</strong> Any notes you write inside clippx projects.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Your projects.</strong> Project names, structure, and the clips they contain.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Basic usage data.</strong> Anonymous, aggregate information about how features are used (e.g. how often AI Q&A is triggered). This contains no personal identifiers and is used only to improve the product.</li>
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
        <ul style={{ marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li>Your email is used to authenticate you and send login links. We do not send marketing emails unless you explicitly opt in.</li>
          <li>Your clips and notes are used to power the workspace, search, and AI Q&A features. The AI only has access to clips you select or that belong to the active project.</li>
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
        <p>clippx uses a small number of third-party infrastructure providers to operate. These are processors, not data controllers — they act on our instructions and cannot use your data for their own purposes.</p>
        <ul style={{ marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Database &amp; storage.</strong> Your clips, notes, and account data are stored in a managed cloud database. Data is encrypted at rest and in transit.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>AI inference.</strong> When you use the AI Q&A feature, the selected clip content is sent to an AI model provider to generate a response. This content is not retained or used for training by the provider under our agreement.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Email delivery.</strong> Login link emails are sent via a transactional email provider. Your email address is shared with this provider for delivery purposes only.</li>
        </ul>
        <p style={{ marginTop: 16 }}>Your data is never sold, licensed, or shared with advertisers, data brokers, or any party beyond the infrastructure providers listed above.</p>
      </>
    ),
  },
  {
    id: 'login',
    title: 'Authentication',
    content: (
      <p>clippx uses email magic links for login. When you enter your email, we send a single-use verification link. Clicking it signs you in. We do not store passwords. The link expires after 15 minutes. We do not store your email beyond what is needed to maintain your account and send you login links.</p>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights and controls',
    content: (
      <>
        <p>You are in full control of your data:</p>
        <ul style={{ marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Delete individual clips or notes</strong> at any time from within the app. Deletion is immediate and permanent.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Delete your entire account</strong> from account settings. This permanently deletes all your clips, notes, projects, and account information from our systems. There is no recovery after deletion.</li>
          <li><strong style={{ color: '#fff', fontWeight: 600 }}>Export your data</strong> (coming soon) — we are building a full data export feature so you can take your clips and notes with you at any time.</li>
        </ul>
        <div className="pp-highlight">
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
            To delete your account: go to <strong style={{ color: '#fff' }}>Settings → Account → Delete account</strong>. All data is permanently erased. If you have trouble, email <a href="mailto:privacy@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>privacy@clippx.io</a> and we will delete it manually within 48 hours.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'Data retention',
    content: (
      <p>Your data is retained for as long as your account exists. When you delete your account, all associated data — clips, notes, projects, email address — is permanently deleted from our systems and backups within 30 days. We do not retain ghost copies of deleted accounts.</p>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    content: (
      <p>All data is encrypted in transit (TLS) and at rest. We use industry-standard access controls and do not expose your data to the public internet. We are a small team in early access — if you discover a security issue, please disclose it responsibly at <a href="mailto:privacy@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>privacy@clippx.io</a>.</p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    content: (
      <p>If we make material changes to this policy, we will notify you by email before the changes take effect. The date at the top of this page reflects the most recent update. Continued use of clippx after a policy change constitutes acceptance of the updated terms.</p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    content: (
      <p>Questions, requests, or concerns about your data: <a href="mailto:privacy@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>privacy@clippx.io</a>. We aim to respond within 2 business days.</p>
    ),
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PrivacyPage(): React.ReactElement {
  return (
    <>
      <style>{CSS}</style>

      {/* Hero */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '80px 40px 64px', textAlign: 'center' }}>
        <div className="pp-fade-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, background: 'rgba(121,101,246,0.1)', border: '1px solid rgba(121,101,246,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
          <span className="eyebrow-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary, display: 'inline-block' }} />
          Privacy Policy
        </div>

        <h1 className="pp-fade-2" style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 800, letterSpacing: '-2.5px', lineHeight: 1.05, color: '#fff', marginBottom: 20 }}>
          Your data belongs<br />to you.
        </h1>

        <p className="pp-fade-3" style={{ fontSize: 16, color: t.fgMid, lineHeight: 1.75, fontWeight: 300, maxWidth: 460, margin: '0 auto 24px' }}>
          clippx collects only what it needs to work. Your clips and notes are never sold or shared with third parties. You can delete everything at any time.
        </p>

        <p className="pp-fade-3" style={{ fontSize: 13, color: t.fgLow }}>
          Last updated: <span style={{ color: 'rgba(255,255,255,0.5)' }}>March 11, 2026</span>
        </p>
      </section>

      {/* Body: TOC + Content */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px 120px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64, alignItems: 'start' }}>

        {/* TOC — sticky sidebar */}
        <aside style={{ position: 'sticky', top: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: t.fgLow, marginBottom: 14 }}>Contents</p>
          <nav>
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="pp-toc-link">{s.title}</a>
            ))}
          </nav>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 12, color: t.fgLow, lineHeight: 1.6 }}>Also see</p>
            <Link href="/terms" style={{ display: 'block', marginTop: 8, fontSize: 13, color: accent.primary, textDecoration: 'none', fontWeight: 500 }}>Terms of Use →</Link>
          </div>
        </aside>

        {/* Sections */}
        <article style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
          {SECTIONS.map((s) => (
            <div key={s.id} id={s.id} className="pp-section">
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', marginBottom: 16 }}>
                {s.title}
              </h2>
              {s.content}
            </div>
          ))}
        </article>
      </section>
      <Footer />
    </>
  )
}