'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Project } from './project/[id]/types'
import { SettingsModal } from './SettingsModal'
import { useAppTheme, accent } from './DShared'
import { BrandName, ClippxLogo } from '../landing/shared'

type ProjectWithDate = Project & { created_at: string }

const DARK_COLORS  = ['#7965F6', '#5177F6', '#A78BFA', '#818CF8']
const LIGHT_COLORS = ['#6C63FF', '#4ACFD2', '#F0B400', '#E23E2B']

// ── Icons ─────────────────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1L1 5.5V14h5v-4h3v4h5V5.5L7.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
)
const FolderIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M1 4a1 1 0 011-1h4l1.5 2H14a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.1"/>
  </svg>
)
const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const CollapseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const MenuIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M1 3h12M1 7h12M1 11h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const SignOutIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M5 11H2a1 1 0 01-1-1V3a1 1 0 011-1h3M9 9l3-2.5L9 4M5 6.5h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ProductNameLogo = () => (
  <svg width="18" height="18" viewBox="0 0 31 31" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M22.3889 25.8333H6.88889C6.43213 25.8333 5.99407 25.6519 5.67109 25.3289C5.34811 25.0059 5.16667 24.5679 5.16667 24.1111V8.61111H0V5.16667H5.16667V0H8.61111V5.16667H24.1111C24.5679 5.16667 25.0059 5.34811 25.3289 5.67109C25.6519 5.99407 25.8333 6.43213 25.8333 6.88889V22.3889H31V25.8333H25.8333V31H22.3889V25.8333ZM22.3889 22.3889V8.61111H8.61111V22.3889H22.3889Z" fill="url(#sb_grad)"/>
    <defs>
      <linearGradient id="sb_grad" x1="0" y1="0" x2="31" y2="31" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7965F6"/><stop offset="1" stopColor="#5177F6"/>
      </linearGradient>
    </defs>
  </svg>
)

const SettingsIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
)
// ── New Project Modal ─────────────────────────────────────────────────────────
function NewProjectModal({ onClose, onCreate }: {
  onClose: () => void
  onCreate: (p: ProjectWithDate) => void
}) {
  const { t } = useAppTheme()
  const supabase = createClient()
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  async function create() {
    if (!title.trim()) { setError('Give your project a title.'); return }
    setLoading(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error: err } = await supabase
      .from('projects')
      .insert({ title: title.trim(), description: description.trim() || null, user_id: user!.id })
      .select('id, title, description, created_at')
      .single()
    if (err) { setError(err.message); setLoading(false); return }
    onCreate(data as ProjectWithDate)
    onClose()
    setLoading(false)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: t.modalBg, borderRadius: 20,
        border: `1px solid ${t.border}`,
        boxShadow: t.shadowModal,
        width: '100%', maxWidth: 460, overflow: 'hidden',
      }}>
        {/* Gradient top line */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(121,101,246,0.7), transparent)' }} />

        <div style={{ padding: '28px 28px 20px' }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: '#7965F6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 18 }}>New Project</div>
          {error && (
            <div style={{ fontSize: 12, color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '9px 12px', marginBottom: 14 }}>{error}</div>
          )}
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') create() }}
            placeholder="Project title"
            style={{
              width: '100%', border: 'none',
              borderBottom: `1px solid ${t.borderMid}`,
              padding: '4px 0 10px',
              fontSize: 22, fontWeight: 700,
              color: t.fg, fontFamily: "'DM Sans', sans-serif",
              outline: 'none', background: 'transparent', marginBottom: 14,
            }}
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description (optional)"
            rows={2}
            style={{
              width: '100%', border: 'none', padding: 0,
              fontSize: 14, color: t.fgLow,
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none', background: 'transparent',
              resize: 'none', lineHeight: 1.6,
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '14px 28px 20px', borderTop: `1px solid ${t.border}` }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', background: t.cardBg,
            border: `1px solid ${t.border}`, borderRadius: 9,
            fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer', color: t.fgMid,
            transition: 'background 0.15s',
          }}>Cancel</button>
          <button onClick={create} disabled={loading} style={{
            padding: '8px 18px',
            background: 'linear-gradient(135deg, #7965F6, #5177F6)',
            color: '#fff', border: 'none', borderRadius: 9,
            fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 4px 16px rgba(121,101,246,0.35)',
          }}>
            {loading ? 'Creating…' : 'Create project'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
export function SharedSidebar({
  initialProjects,
  userEmail,
  open,
  onToggle,
}: {
  initialProjects: ProjectWithDate[]
  userEmail: string
  open: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const { t, dark } = useAppTheme()
  const COLORS = dark ? DARK_COLORS : LIGHT_COLORS
  const [projects, setProjects] = useState<ProjectWithDate[]>(initialProjects)
  const [showModal, setShowModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (initialProjects.length > 0) setProjects(initialProjects)
  }, [initialProjects])

  const activeProjectId = pathname.match(/\/(?:project|workspace)\/([^/]+)/)?.[1] ?? null
  const isDashboard = !activeProjectId && (pathname === '/dashboard' || pathname.startsWith('/dashboard'))

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Michroma&display=swap');

        .shared-sidebar {
          width: 240px; flex-shrink: 0;
          background: ${t.sidebarBg};
          border-right: 1px solid ${t.border};
          height: 100vh;
          display: flex; flex-direction: column;
          overflow: hidden;
          transition: width 0.22s ease, background 0.2s, border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .shared-sidebar.collapsed { width: 0; border-right: none; }

        .sb-icon-btn {
          width: 26px; height: 26px; border-radius: 7px;
          border: none; background: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: ${t.iconBtnFg}; flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .sb-icon-btn:hover { background: ${t.iconBtnHoverBg}; color: ${t.fg}; }

        .sb-item {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 9px; border-radius: 8px; cursor: pointer;
          color: ${t.sidebarFg}; font-size: 13px;
          text-decoration: none; white-space: nowrap;
          overflow: hidden; transition: background 0.12s, color 0.12s;
          font-family: inherit; border: none; background: none;
          width: 100%; text-align: left;
        }
        .sb-item:hover { background: ${t.sidebarItemHoverBg}; color: ${t.sidebarItemHoverFg}; }
        .sb-item.active {
          background: ${t.sidebarActiveBg};
          border: 1px solid ${t.sidebarActiveBorder};
          color: ${t.sidebarActiveFg}; font-weight: 500;
        }
        .sb-item.active:hover {
          background: ${t.sidebarActiveBg};
          opacity: 0.92;
        }

        .sb-label {
          font-size: 9.5px; font-weight: 600;
          color: ${t.sidebarLabelFg};
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 2px 9px 5px;
        }

        .sb-new-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 9px; border-radius: 8px; cursor: pointer;
          color: ${t.fgLow}; font-size: 13px;
          background: none; border: 1px dashed ${t.borderMid};
          width: 100%; font-family: inherit; text-align: left;
          transition: background 0.12s, color 0.12s, border-color 0.12s;
          margin-top: 4px;
        }
        .sb-new-btn:hover {
          background: rgba(121,101,246,0.06);
          border-color: rgba(121,101,246,0.3);
          color: #7965F6;
        }

        .sign-out-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 9px; border-radius: 8px; cursor: pointer;
          color: ${t.fgLow}; font-size: 12.5px;
          background: none; border: none; width: 100%;
          font-family: inherit; text-align: left;
          transition: background 0.12s, color 0.12s;
        }
        .sign-out-btn:hover { background: ${t.sidebarItemHoverBg}; color: ${t.fgMid}; }

        .sb-scrollbar::-webkit-scrollbar { width: 3px; }
        .sb-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .sb-scrollbar::-webkit-scrollbar-thumb { background: ${t.scrollbar}; border-radius: 2px; }
      `}</style>

      {/* Collapsed toggle */}
      {!open && (
        <button onClick={onToggle} className="sb-icon-btn" style={{
          position: 'fixed', top: 12, left: 12, zIndex: 50,
          background: t.sidebarBg, border: `1px solid ${t.border}`,
          width: 32, height: 32, borderRadius: 8,
          boxShadow: t.shadow,
        }}>
          <MenuIcon />
        </button>
      )}

      <aside className={`shared-sidebar ${!open ? 'collapsed' : ''}`}>

        {/* Header */}
        <div style={{ padding: '14px 10px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0, padding: '4px 7px', borderRadius: 8, transition: 'background 0.12s' }}
            onMouseEnter={e => (e.currentTarget.style.background = t.sidebarItemHoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClippxLogo size={22} color={accent.primary} />
            <BrandName size={14} color={t.fg} />
          </Link>
          </Link>
          <button className="sb-icon-btn" onClick={onToggle}><CollapseIcon /></button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: t.border, margin: '4px 10px 8px' }} />

        {/* Nav */}
        <div style={{ padding: '0 8px', flexShrink: 0 }}>
          <div className="sb-label">Workspace</div>
          <Link href="/dashboard" className={`sb-item ${isDashboard ? 'active' : ''}`}>
            <HomeIcon />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Home</span>
          </Link>
        </div>

        {/* Projects */}
        <div style={{ padding: '14px 8px 0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="sb-label">Projects</div>
          <div className="sb-scrollbar" style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {projects.map((p, i) => {
              const isActive = p.id === activeProjectId
              return (
                <Link key={p.id} href={`/dashboard/project/${p.id}`} className={`sb-item ${isActive ? 'active' : ''}`}>
                  <FolderIcon color={isActive ? (dark ? '#a78bfa' : '#fff') : COLORS[i % 4]} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{p.title}</span>
                </Link>
              )
            })}
            <button className="sb-new-btn" onClick={() => setShowModal(true)}>
              <PlusIcon />
              <span>New project</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '8px', borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
          {/* Email */}
          <div style={{ fontSize: 11, color: t.fgLow, padding: '0 9px 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userEmail}
          </div>
          {/* Sign out + Settings row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <form action="/auth/signout" method="post" style={{ flex: 1, minWidth: 0 }}>
              <button type="submit" className="sign-out-btn">
                <SignOutIcon />
                Sign out
              </button>
            </form>
            <button
              onClick={() => setShowSettings(true)}
              title="Settings"
              className="sb-icon-btn"
              style={{ flexShrink: 0 }}
            >
              <SettingsIcon />
            </button>
          </div>
        </div>
      </aside>

      {showSettings && (
        <SettingsModal
          userEmail={userEmail}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreate={p => setProjects(prev => [p, ...prev])}
        />
      )}
    </>
  )
}