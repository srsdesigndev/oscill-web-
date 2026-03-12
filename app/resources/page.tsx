'use client'

import { useState, useRef, useEffect, ReactElement, JSX } from 'react'
import { Footer } from '../landing/Footer'
import { accent, t } from '../landing/shared'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Step {
  number: string
  title: string
  desc: string
}

interface Topic {
  id: string
  label: string
  icon: JSX.Element
  title: string
  subtitle: string
  glowRgb: string
  accentColor: string
  steps: Step[]
  tip?: string
}

// ── Data ──────────────────────────────────────────────────────────────────────
const TOPICS: Topic[] = [
  {
    id: 'get-started',
    label: 'Get started',
    accentColor: '#7965F6',
    glowRgb: '121,101,246',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Getting started',
    subtitle: 'Create your account and set up clippx in under 5 minutes.',
    steps: [
      {
        number: '01',
        title: 'Create your account',
        desc: 'Go to app.clippx.io and enter your email address. We will send you a magic link — a one-time login link that lands in your inbox. Click it and you are in. No password needed, ever.',
      },
      {
        number: '02',
        title: 'Install the browser extension',
        desc: 'After signing in, you will be prompted to install the clippx extension. It is available for Chrome, Edge, and Firefox. Click "Add to browser", confirm the install, and the clippx icon will appear in your toolbar. This is the main way you will save content.',
      },
      {
        number: '03',
        title: 'Create your first project',
        desc: 'In the sidebar, click "+ New project" and give it a name — "Research", "Reading list", or whatever you are working on. Projects keep different topics separate. You can have as many as you want.',
      },
      {
        number: '04',
        title: 'Save your first clip',
        desc: 'Go to any webpage, highlight some text or just click the clippx extension icon in your toolbar. A small popup appears asking which project to save to. Select your project and hit "Save clip". The clip appears instantly in your workspace.',
      },
    ],
    tip: 'You can also press Alt+S (Option+S on Mac) anywhere on a page to open the clip popup without clicking the toolbar icon.',
  },
  {
    id: 'clipping',
    label: 'Saving clips',
    accentColor: '#38bdf8',
    glowRgb: '56,189,248',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Saving clips',
    subtitle: 'Everything you can clip and how to do it.',
    steps: [
      {
        number: '01',
        title: 'Clip selected text',
        desc: 'Highlight any text on a webpage — a paragraph, a sentence, a heading — then click the clippx icon in your toolbar. The selected text is saved along with the source URL and page title so you always know where it came from.',
      },
      {
        number: '02',
        title: 'Clip an entire page',
        desc: 'If you do not select anything and just click the extension icon, clippx saves the full page: title, URL, and a clean version of the main content stripped of ads and navigation. Good for articles you want to reference later.',
      },
      {
        number: '03',
        title: 'Clip an image',
        desc: 'Right-click any image on a webpage and choose "Save image to clippx" from the context menu. The image is saved to your most recently used project. You can move it to a different project any time from inside the workspace.',
      },
      {
        number: '04',
        title: 'Clip a link',
        desc: 'To save just a URL without opening the page, right-click any hyperlink and choose "Save link to clippx". The link is stored in your project with its title if one is available.',
      },
      {
        number: '05',
        title: 'Choose the right project',
        desc: 'When the clip popup appears, use the dropdown to pick which project to save to. Your most recently used project is always pre-selected. You can move any clip to a different project later from inside the workspace.',
      },
    ],
    tip: 'Clips save instantly — you do not need to wait for a confirmation before closing the tab.',
  },
  {
    id: 'projects',
    label: 'Projects',
    accentColor: '#a78bfa',
    glowRgb: '167,139,250',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Projects',
    subtitle: 'How to organise your clips into focused workspaces.',
    steps: [
      {
        number: '01',
        title: 'Create a project',
        desc: 'Click "+ New project" in the left sidebar. Give it a clear name that reflects what you are working on — "Competitor research", "Essay sources", "Job search". You can rename it any time by clicking the project name.',
      },
      {
        number: '02',
        title: 'Switch between projects',
        desc: 'Click any project in the sidebar to open it. All your clips and notes for that project load immediately. The sidebar stays visible as you switch so you can move between research threads without losing your place.',
      },
      {
        number: '03',
        title: 'Move a clip to a different project',
        desc: 'Open a clip and click the three-dot menu in the top-right corner. Select "Move to project" and choose the destination. The clip moves instantly and will no longer appear in the original project.',
      },
      {
        number: '04',
        title: 'Delete a project',
        desc: 'Click the three-dot menu next to a project name in the sidebar and select "Delete project". This permanently deletes the project and every clip and note inside it. There is no undo.',
      },
    ],
    tip: 'Keep projects focused on one topic. The AI only looks at clips in the current project — specific projects give much more useful answers than one big catch-all.',
  },
  {
    id: 'notes',
    label: 'Notes',
    accentColor: '#fb923c',
    glowRgb: '251,146,60',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Notes',
    subtitle: 'Write your own thoughts alongside your clips.',
    steps: [
      {
        number: '01',
        title: 'Add a note to a project',
        desc: 'Inside any project, click "+ New note". A text editor opens. Write whatever you want — your own analysis, a summary, a to-do list, a question. Notes live in the same project as your clips so everything stays together.',
      },
      {
        number: '02',
        title: 'Add a note directly to a clip',
        desc: 'Open any clip and click "Add note" below the clipped content. This pins your note directly to that specific clip — useful for annotating a source, flagging a contradiction, or noting what you want to do with the information.',
      },
      {
        number: '03',
        title: 'Edit and delete notes',
        desc: 'Click any note to open it in the editor. Changes save automatically as you type — there is no save button. To delete, open the note, click the three-dot menu, and select "Delete". Deletion is permanent.',
      },
    ],
    tip: 'Notes are included in AI context just like clips. If you write a note summarising what you already know, the AI will factor it into its answers alongside your saved clips.',
  },
  {
    id: 'ai',
    label: 'AI features',
    accentColor: '#34d399',
    glowRgb: '52,211,153',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    title: 'AI features',
    subtitle: 'Ask questions across your clips and get answers grounded in your own research.',
    steps: [
      {
        number: '01',
        title: 'Ask a question about your clips',
        desc: 'Inside any project, click "Ask AI" at the top of the clip list. Type a question in plain English — "What are the main arguments across these articles?", "Summarise the key findings", "What do my sources say about X?". The AI reads your clips and answers based only on what you have saved.',
      },
      {
        number: '02',
        title: 'Query specific clips only',
        desc: 'By default the AI uses all clips in the current project. To query specific clips, tick the checkboxes next to the clips you want before clicking "Ask AI". Only the selected clips will be used to form the answer.',
      },
      {
        number: '03',
        title: 'Understand the limits',
        desc: 'The AI answers based on your saved content only — it does not search the internet or pull from general knowledge. If you ask about something not in your clips, it will say so rather than guessing. This is intentional.',
      },
      {
        number: '04',
        title: 'Follow up and refine',
        desc: 'After an answer you can ask follow-up questions in the same session. The AI remembers the conversation context. Ask it to go deeper, focus on a different angle, or compare two specific clips.',
      },
    ],
    tip: 'The more clips you have in a project, the richer the answers. A project with 3 clips gives shallow results. A project with 20 well-chosen clips gives genuinely useful synthesis.',
  },
  {
    id: 'account',
    label: 'Account & data',
    accentColor: '#f472b6',
    glowRgb: '244,114,182',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: 'Account & data',
    subtitle: 'Manage your login, data, and account deletion.',
    steps: [
      {
        number: '01',
        title: 'Log in',
        desc: 'clippx uses email magic links — no password. Go to app.clippx.io, enter your email, and click the link we send. Each link is valid for 15 minutes and works on any device. A new link is sent each time you log in.',
      },
      {
        number: '02',
        title: 'Log out',
        desc: 'Click your email in the bottom-left of the sidebar and select "Log out". You are signed out on the current device only. All your clips and notes are untouched and will be there when you log back in.',
      },
      {
        number: '03',
        title: 'Delete a clip or note',
        desc: 'Open the clip or note, click the three-dot menu, and select "Delete". Deletion is immediate and permanent. There is no trash folder or undo.',
      },
      {
        number: '04',
        title: 'Delete your account',
        desc: 'Go to Settings → Account → Delete account and confirm the prompt. This permanently deletes your account, every clip, every note, and every project — all of it, immediately. There is no recovery. If you have trouble, email hello@clippx.io and we will delete everything within 48 hours.',
      },
    ],
    tip: 'Your data is never shared with third parties. Deleting your account removes everything from our systems and backups within 30 days.',
  },
]

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  /* Full-viewport two-column layout */
  .help-shell {
    display: flex;
    height: calc(100vh - 64px); /* subtract your navbar height */
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .help-sidebar {
    width: 260px;
    min-width: 260px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.01);
    padding: 32px 16px 40px;
    scrollbar-width: none;
  }
  .help-sidebar::-webkit-scrollbar { display: none; }

  /* ── Content pane ── */
  .help-content {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.08) transparent;
  }
  .help-content::-webkit-scrollbar { width: 4px; }
  .help-content::-webkit-scrollbar-track { background: transparent; }
  .help-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

  /* ── Nav buttons ── */
  .help-nav-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .help-nav-btn:hover  { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
  .help-nav-btn.active { background: rgba(121,101,246,0.12); color: #fff; }

  .help-nav-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s;
  }

  /* ── Steps ── */
  .help-step {
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 24px;
    align-items: start;
    padding: 28px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .help-step:last-of-type { border-bottom: none; }

  .help-step-num {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
    font-variant-numeric: tabular-nums;
  }

  /* ── Tip box ── */
  .help-tip {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: rgba(121,101,246,0.07);
    border: 1px solid rgba(121,101,246,0.18);
    border-radius: 14px;
    padding: 18px 22px;
  }

  /* ── Search ── */
  .help-search-wrap { position: relative; }
  .help-search {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 10px 12px 10px 38px;
    font-size: 13px;
    color: #fff;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .help-search::placeholder { color: rgba(255,255,255,0.25); }
  .help-search:focus {
    border-color: rgba(121,101,246,0.4);
    background: rgba(121,101,246,0.05);
    box-shadow: 0 0 0 3px rgba(121,101,246,0.08);
  }
  .help-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.25);
    pointer-events: none;
  }

  /* ── Next btn ── */
  .help-next-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 11px 20px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .help-next-btn:hover { background: rgba(255,255,255,0.07); }

  /* ── Animations ── */
  @keyframes help-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hau { animation: help-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both; }

  @keyframes eyebrow-dot {
    0%,100% { box-shadow: 0 0 0px  rgba(121,101,246,0.5); }
    50%      { box-shadow: 0 0 8px  rgba(121,101,246,0.9), 0 0 14px rgba(121,101,246,0.4); }
  }
  .eyebrow-dot { animation: eyebrow-dot 2.4s ease-in-out infinite; }

  /* ── Mobile ── */
  @media (max-width: 720px) {
    .help-shell { flex-direction: column; height: auto; overflow: visible; }
    .help-sidebar { width: 100%; height: auto; min-width: unset; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); flex-direction: row; flex-wrap: wrap; padding: 16px; gap: 6px; }
    .help-content { height: auto; overflow: visible; }
  }
`

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ResourcesPage(): ReactElement {
  const [activeId, setActiveId] = useState<string>(TOPICS[0].id)
  const [query, setQuery]       = useState<string>('')
  const inputRef  = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const activeTopic = TOPICS.find(tp => tp.id === activeId) ?? TOPICS[0]
  const currentIdx  = TOPICS.findIndex(tp => tp.id === activeId)
  const nextTopic   = TOPICS[currentIdx + 1] ?? null

  const matchesTopic = (tp: Topic): boolean => {
    if (!query.trim()) return true
    const lower = query.toLowerCase()
    return (
      tp.title.toLowerCase().includes(lower) ||
      tp.subtitle.toLowerCase().includes(lower) ||
      tp.steps.some(s => s.title.toLowerCase().includes(lower) || s.desc.toLowerCase().includes(lower))
    )
  }

  // Auto-select first matching topic when searching
  useEffect(() => {
    if (query.trim()) {
      const first = TOPICS.find(tp => matchesTopic(tp))
      if (first) setActiveId(first.id)
    }
  }, [query])

  // Scroll content back to top on topic change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeId])

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setQuery('')
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleTopicClick = (id: string) => {
    setActiveId(id)
    setQuery('')
  }

  return (
    <>
      <style>{CSS}</style>

      <div className="help-shell">

        {/* ── Fixed Sidebar ── */}
        <aside className="help-sidebar">

          {/* Logo / label */}
          <div style={{ marginBottom: 24, paddingLeft: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="eyebrow-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: accent.primary, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary }}>
                Help & guides
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="help-search-wrap" style={{ marginBottom: 20 }}>
            <span className="help-search-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              ref={inputRef}
              className="help-search"
              placeholder="Search… (press /)"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Topic label */}
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: t.fgLow, marginBottom: 6, paddingLeft: 14 }}>
            Topics
          </p>

          {/* Nav items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TOPICS.map(tp => {
              const isActive = activeId === tp.id
              const dimmed   = query.trim() && !matchesTopic(tp)
              return (
                <button
                  key={tp.id}
                  className={`help-nav-btn${isActive ? ' active' : ''}`}
                  style={{ opacity: dimmed ? 0.2 : 1 }}
                  onClick={() => handleTopicClick(tp.id)}
                >
                  <span
                    className="help-nav-icon"
                    style={{
                      background: isActive ? `rgba(${tp.glowRgb},0.15)` : 'rgba(255,255,255,0.04)',
                      color: isActive ? tp.accentColor : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {tp.icon}
                  </span>
                  {tp.label}
                </button>
              )
            })}
          </div>

          {/* Spacer + support link */}
          <div style={{ marginTop: 'auto', paddingTop: 32, paddingLeft: 14 }}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />
            <p style={{ fontSize: 12, color: t.fgLow, marginBottom: 8 }}>Still stuck?</p>
            <a
              href="mailto:hello@clippx.io"
              style={{ fontSize: 13, color: accent.primary, textDecoration: 'none', fontWeight: 500 }}
            >
              Email support →
            </a>
          </div>
        </aside>

        {/* ── Scrollable Content ── */}
        <div ref={contentRef} className="help-content">
          <div style={{ maxWidth: 760, padding: '56px 64px 100px' }}>

            {/* Topic header */}
            <div className="hau" key={`header-${activeId}`} style={{ marginBottom: 48, animationDelay: '0s' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, color: activeTopic.accentColor, background: `rgba(${activeTopic.glowRgb},0.1)`, border: `1px solid rgba(${activeTopic.glowRgb},0.2)`, borderRadius: 10, padding: '6px 14px 6px 10px', fontSize: 13, fontWeight: 600 }}>
                {activeTopic.icon}
                {activeTopic.label}
              </div>
              <h1 style={{ fontSize: 'clamp(28px,3vw,40px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 14 }}>
                {activeTopic.title}
              </h1>
              <p style={{ fontSize: 16, color: t.fgMid, lineHeight: 1.7, fontWeight: 300 }}>
                {activeTopic.subtitle}
              </p>
            </div>

            {/* Steps */}
            <div className="hau" key={`steps-${activeId}`} style={{ animationDelay: '0.06s' }}>
              {activeTopic.steps.map(step => (
                <div key={step.number} className="help-step">
                  <div
                    className="help-step-num"
                    style={{
                      background: `rgba(${activeTopic.glowRgb},0.1)`,
                      border: `1px solid rgba(${activeTopic.glowRgb},0.2)`,
                      color: activeTopic.accentColor,
                    }}
                  >
                    {step.number}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-0.3px' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.58)', lineHeight: 1.8, fontWeight: 300 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tip */}
            {activeTopic.tip && (
              <div className="hau help-tip" key={`tip-${activeId}`} style={{ marginTop: 36, animationDelay: '0.1s' }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, fontWeight: 300 }}>
                  <strong style={{ color: '#fff', fontWeight: 600 }}>Tip: </strong>
                  {activeTopic.tip}
                </p>
              </div>
            )}

            {/* Next topic */}
            {nextTopic && (
              <div
                className="hau"
                key={`next-${activeId}`}
                style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animationDelay: '0.12s' }}
              >
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: t.fgLow, marginBottom: 4 }}>Next up</p>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{nextTopic.subtitle}</p>
                </div>
                <button
                  className="help-next-btn"
                  onClick={() => handleTopicClick(nextTopic.id)}
                  style={{ borderColor: `rgba(${nextTopic.glowRgb},0.2)` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${nextTopic.glowRgb},0.4)` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${nextTopic.glowRgb},0.2)` }}
                >
                  {nextTopic.label}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      <Footer />
    </>
  )
}