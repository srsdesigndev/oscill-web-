'use client'

import { useState, useRef, useEffect } from 'react'
import { t, accent } from './shared'

// ── Data ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'What exactly is clippx?',
    a: 'clippx is a browser extension + web app that lets you save anything from the internet — articles, tweets, PDFs, research papers, videos — into organised project workspaces. You can then ask AI questions across everything you\'ve saved.',
  },
  {
    q: 'How is this different from Pocket or Notion?',
    a: 'Pocket is a read-later app with no AI. Notion is a blank canvas that requires setup. clippx is purpose-built for capturing and connecting knowledge — clips land in the right project instantly, and AI understands your entire collection from day one.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'Yes. Your clips are stored encrypted at rest. We never use your personal content to train AI models, and we don\'t sell your data. You can export or delete everything at any time.',
  },
  {
    q: 'Which browsers does the extension support?',
    a: 'Chrome and Edge are fully supported today. Firefox and Safari extensions are in active development and coming soon.',
  },
  {
    q: 'How does the AI work? Does it hallucinate?',
    a: 'The AI answers are grounded strictly in your saved clips — it only surfaces information that exists in your workspace. It won\'t make things up or pull from outside your collection, which dramatically reduces hallucinations.',
  },
  {
    q: 'Can I use clippx for free?',
    a: 'Yes. The free plan gives you up to 3 projects, 200 clips, and full AI access. Paid plans unlock unlimited projects, higher clip limits, priority AI, and team collaboration.',
  },
  {
    q: 'What happens to my clips if I cancel?',
    a: 'You keep full access to your data. You can export everything as JSON or Markdown at any time, before or after cancelling. We\'ll never hold your content hostage.',
  },
  {
    q: 'Is there a team or collaborative plan?',
    a: 'Team workspaces are on the roadmap and currently in closed beta. Join the waitlist from your dashboard to get early access when it launches.',
  },
]

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes faq-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .faq-header { animation: faq-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both; }

  .faq-item {
    border-bottom: 1px solid ${t.border};
    transition: border-color 0.2s;
  }
  .faq-item:first-child { border-top: 1px solid ${t.border}; }

  .faq-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 22px 0;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    color: ${t.fg};
  }
  .faq-trigger:hover .faq-q { color: #fff; }

  .faq-q {
    font-size: 16px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    line-height: 1.4;
    transition: color 0.2s;
  }

  .faq-icon {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    transition: background 0.2s, border-color 0.2s, transform 0.35s cubic-bezier(0.34,1.2,0.64,1);
  }
  .faq-icon.open {
    background: rgba(121,101,246,0.15);
    border-color: rgba(121,101,246,0.3);
    transform: rotate(45deg);
  }

  .faq-body-wrap {
    overflow: hidden;
    transition: height 0.38s cubic-bezier(0.22,1,0.36,1);
  }

  .faq-body {
    padding: 0 0 22px;
    font-size: 14.5px;
    color: rgba(255,255,255,0.48);
    line-height: 1.78;
    font-weight: 300;
    max-width: 680px;
  }

  @keyframes faq-eyebrow-dot {
    0%, 100% { box-shadow: 0 0 0px rgba(121,101,246,0.5); }
    50%       { box-shadow: 0 0 8px rgba(121,101,246,0.9), 0 0 14px rgba(121,101,246,0.4); }
  }
  .faq-eyebrow-dot { animation: faq-eyebrow-dot 2.4s ease-in-out infinite; }
`

// ── Accordion item ────────────────────────────────────────────────────────────
function FAQItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen]   = useState(defaultOpen)
  const bodyRef           = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>(defaultOpen ? 'auto' : 0)

  useEffect(() => {
    if (!bodyRef.current) return
    if (open) {
      // Measure then animate to exact height, then switch to auto for reflow safety
      const h = bodyRef.current.scrollHeight
      setHeight(h)
      const t = setTimeout(() => setHeight('auto'), 380)
      return () => clearTimeout(t)
    } else {
      // Snapshot current height before collapsing so transition has a start point
      const h = bodyRef.current.scrollHeight
      setHeight(h)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(0))
      })
    }
  }, [open])

  return (
    <div className="faq-item">
      <button className="faq-trigger" onClick={() => setOpen(o => !o)}>
        <span className="faq-q">{q}</span>
        <span className={`faq-icon${open ? ' open' : ''}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </button>
      <div
        className="faq-body-wrap"
        style={{ height: height === 'auto' ? 'auto' : height }}
      >
        <div ref={bodyRef} className="faq-body">{a}</div>
      </div>
    </div>
  )
}

// ── FAQ section ───────────────────────────────────────────────────────────────
export function FAQ() {
  return (
    <>
      <style>{CSS}</style>
      <section id="faq" style={{ maxWidth: 820, margin: '0 auto', padding: '120px 40px' }}>

        {/* Header */}
        <div className="faq-header" style={{ marginBottom: 64, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11, fontWeight: 600, letterSpacing: '2px',
            textTransform: 'uppercase', color: accent.primary,
            background: 'rgba(121,101,246,0.1)',
            border: '1px solid rgba(121,101,246,0.2)',
            borderRadius: 100, padding: '5px 14px',
            marginBottom: 24,
          }}>
            <span className="faq-eyebrow-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary, display: 'inline-block' }} />
            FAQ
          </div>

          <h2 style={{
            fontSize: 'clamp(36px,4.5vw,58px)',
            lineHeight: 1.06, letterSpacing: '-2px',
            fontWeight: 800, color: t.fg,
            margin: '0 0 18px',
          }}>
            Questions? Answered.
          </h2>

          <p style={{
            fontSize: 16, color: t.fgMid,
            lineHeight: 1.75, fontWeight: 300,
            margin: '0 auto', maxWidth: 420,
          }}>
            Everything you need to know before getting started. Can't find your answer?{' '}
            <a href="mailto:hello@clippx.io" style={{ color: accent.primary, textDecoration: 'none' }}>
              Email us.
            </a>
          </p>
        </div>

        {/* Accordion */}
        <div>
          {FAQS.map((item, i) => (
            <FAQItem key={item.q} {...item} defaultOpen={i === 0} />
          ))}
        </div>

      </section>
    </>
  )
}