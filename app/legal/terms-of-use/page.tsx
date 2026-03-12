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
  @keyframes tu-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .tu-fade-1 { animation: tu-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .tu-fade-2 { animation: tu-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
  .tu-fade-3 { animation: tu-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.20s both; }

  @keyframes eyebrow-dot {
    0%,100% { box-shadow: 0 0 0px rgba(121,101,246,0.5); }
    50%      { box-shadow: 0 0 8px rgba(121,101,246,0.9), 0 0 14px rgba(121,101,246,0.4); }
  }
  .eyebrow-dot { animation: eyebrow-dot 2.4s ease-in-out infinite; }

  .tu-section {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 40px 0;
  }
  .tu-section:last-of-type { border-bottom: none; }

  .tu-toc-link {
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
  .tu-toc-link:hover {
    color: rgba(255,255,255,0.85);
    border-left-color: rgba(121,101,246,0.6);
  }

  .tu-highlight {
    background: rgba(121,101,246,0.08);
    border: 1px solid rgba(121,101,246,0.18);
    border-radius: 12px;
    padding: 16px 20px;
    margin: 20px 0 0;
  }

  .tu-warn {
    background: rgba(251,146,60,0.07);
    border: 1px solid rgba(251,146,60,0.2);
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
        <p>These Terms of Use govern your access to and use of clippx — including the web app at <a href="https://app.clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>app.clippx.io</a> and the browser extension. By creating an account or using clippx, you agree to these terms.</p>
        <p style={{ marginTop: 16 }}>clippx is currently in early experimental access. It is free to use. We are building in public and things may change — we will always give you fair notice before anything material shifts.</p>
      </>
    ),
  },
  {
    id: 'what-clippx-is',
    title: 'What clippx is',
    content: (
      <>
        <p>clippx is a tool for personal knowledge management. It lets you:</p>
        <ul style={{ marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li>Clip content from the web — text, links, and images — using the browser extension.</li>
          <li>Organise clips into projects and workspaces.</li>
          <li>Write notes alongside your clips.</li>
          <li>Use AI to ask questions about the content you have saved.</li>
        </ul>
        <p style={{ marginTop: 16 }}>clippx is intended for personal research, study, and note-taking. It is not a hosting platform, a publishing tool, or a way to redistribute content.</p>
      </>
    ),
  },
  {
    id: 'your-account',
    title: 'Your account',
    content: (
      <>
        <p>You create an account by providing your email address. We authenticate you via a magic link — a single-use verification link sent to your email. You are responsible for keeping access to your email account secure.</p>
        <p style={{ marginTop: 16 }}>You may only create one account per person. Accounts are non-transferable. If you believe your account has been compromised, contact us immediately at <a href="mailto:hello@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>hello@clippx.io</a>.</p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    content: (
      <>
        <p>You may use clippx for lawful personal research, study, writing, and knowledge management. You agree not to use clippx to:</p>
        <ul style={{ marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li>Store, distribute, or reproduce content in a way that infringes copyright or other intellectual property rights.</li>
          <li>Clip or store content that is illegal, harmful, abusive, or that violates the rights of others.</li>
          <li>Attempt to reverse-engineer, scrape, or otherwise extract data from the clippx platform or other users' workspaces.</li>
          <li>Use the service to distribute spam, malware, or any harmful content.</li>
          <li>Circumvent any authentication, security, or access controls.</li>
        </ul>
        <div className="tu-warn">
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
            clippx is a personal tool. Clips you save are for your own reference and research. They are not a licence to republish, resell, or redistribute third-party content.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'your-content',
    title: 'Your content',
    content: (
      <>
        <p>You own the content you create in clippx — your notes, your project structure, and any original writing. By using clippx, you grant us a limited licence to store and process your content solely to provide the service to you.</p>
        <p style={{ marginTop: 16 }}>When you clip third-party content (articles, web pages, etc.), you are responsible for ensuring your use is consistent with applicable copyright law and the terms of the source site. clippx does not endorse, verify, or take responsibility for third-party content you save.</p>
        <p style={{ marginTop: 16 }}>We do not claim ownership of your notes or clips. We do not use your content to train AI models or for any purpose outside of providing clippx to you.</p>
      </>
    ),
  },
  {
    id: 'ai-features',
    title: 'AI features',
    content: (
      <>
        <p>clippx includes an AI Q&A feature that lets you ask questions about your saved clips. This feature is powered by a third-party AI model. When you use it, the selected clip content is sent to that model to generate a response.</p>
        <ul style={{ marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li>AI responses are generated and may contain errors. Do not rely on them as a substitute for professional, legal, medical, or financial advice.</li>
          <li>You are responsible for verifying any information the AI provides before acting on it.</li>
          <li>Your clip content sent to the AI is not retained or used for model training by the provider under our agreement.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'account-deletion',
    title: 'Account deletion',
    content: (
      <>
        <p>You may delete your account at any time. Deleting your account permanently removes all your clips, notes, projects, and personal data from our systems. This action cannot be undone.</p>
        <div className="tu-highlight">
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
            To delete your account: <strong style={{ color: '#fff' }}>Settings → Account → Delete account.</strong> If you have trouble accessing settings, email <a href="mailto:hello@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>hello@clippx.io</a> and we will delete your account and all associated data within 48 hours.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'availability',
    title: 'Service availability',
    content: (
      <p>clippx is in early experimental access. We aim for high availability but do not guarantee uninterrupted service. We may modify, suspend, or discontinue features at any time. If we ever shut down the service entirely, we will give you reasonable notice and the ability to export your data before doing so.</p>
    ),
  },
  {
    id: 'pricing',
    title: 'Pricing',
    content: (
      <p>clippx is currently free during the experimental access period. If we introduce paid plans in the future, we will notify existing users by email in advance and will not charge you without your explicit consent. Free access may continue to be available at a reduced feature set.</p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    content: (
      <>
        <p>clippx is provided as-is. To the extent permitted by applicable law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the service — including loss of data, loss of access, or errors in AI-generated responses.</p>
        <p style={{ marginTop: 16 }}>Our total liability to you for any claim arising from use of clippx shall not exceed the amount you have paid us in the 12 months preceding the claim. During free access, this means our liability is zero beyond what is required by law.</p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    content: (
      <p>We may update these terms as the product evolves. If we make material changes, we will notify you by email before they take effect. The date at the top of this page reflects the latest update. Continued use of clippx after an update constitutes acceptance of the revised terms.</p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    content: (
      <p>Questions about these terms: <a href="mailto:hello@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>hello@clippx.io</a>. We aim to respond within 2 business days.</p>
    ),
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TermsPage(): React.ReactElement {
  return (
    <>
      <style>{CSS}</style>

      {/* Hero */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '80px 40px 64px', textAlign: 'center' }}>
        <div className="tu-fade-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, background: 'rgba(121,101,246,0.1)', border: '1px solid rgba(121,101,246,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
          <span className="eyebrow-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary, display: 'inline-block' }} />
          Terms of Use
        </div>

        <h1 className="tu-fade-2" style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 800, letterSpacing: '-2.5px', lineHeight: 1.05, color: '#fff', marginBottom: 20 }}>
          Simple terms for<br />a simple tool.
        </h1>

        <p className="tu-fade-3" style={{ fontSize: 16, color: t.fgMid, lineHeight: 1.75, fontWeight: 300, maxWidth: 460, margin: '0 auto 24px' }}>
          clippx is a personal clipping and note-taking tool. These terms cover what you can do with it, what we do with your data, and your rights.
        </p>

        <p className="tu-fade-3" style={{ fontSize: 13, color: t.fgLow }}>
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
              <a key={s.id} href={`#${s.id}`} className="tu-toc-link">{s.title}</a>
            ))}
          </nav>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 12, color: t.fgLow, lineHeight: 1.6 }}>Also see</p>
            <Link href="/privacy" style={{ display: 'block', marginTop: 8, fontSize: 13, color: accent.primary, textDecoration: 'none', fontWeight: 500 }}>Privacy Policy →</Link>
          </div>
        </aside>

        {/* Sections */}
        <article style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
          {SECTIONS.map((s) => (
            <div key={s.id} id={s.id} className="tu-section">
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