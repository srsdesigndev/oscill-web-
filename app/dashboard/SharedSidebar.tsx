'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Project } from './project/[id]/types'


type ProjectWithDate = Project & { created_at: string }

const GRAD = 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)'
const COLORS = ['#6C63FF', '#4ACFD2', '#F0B400', '#E23E2B']

// ── Icons ─────────────────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1L1 5.5V14h5v-4h3v4h5V5.5L7.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
)
const FolderIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M1 4a1 1 0 011-1h4l1.5 2H14a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.1"/>
  </svg>
)
const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
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

// ── OpenClips Logo ────────────────────────────────────────────────────────────
const OpenClipsLogo = () => (
  <svg width="20" height="20" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M22.3889 25.8333H6.88889C6.43213 25.8333 5.99407 25.6519 5.67109 25.3289C5.34811 25.0059 5.16667 24.5679 5.16667 24.1111V8.61111H0V5.16667H5.16667V0H8.61111V5.16667H24.1111C24.5679 5.16667 25.0059 5.34811 25.3289 5.67109C25.6519 5.99407 25.8333 6.43213 25.8333 6.88889V22.3889H31V25.8333H25.8333V31H22.3889V25.8333ZM22.3889 22.3889V8.61111H8.61111V22.3889H22.3889Z" fill="url(#sidebar_logo_grad)"/>
    <defs>
      <linearGradient id="sidebar_logo_grad" x1="1.65649" y1="6.88889" x2="26.2945" y2="9.21634" gradientUnits="userSpaceOnUse">
        <stop stopColor="#5177F6"/>
        <stop offset="1" stopColor="#7965F6"/>
      </linearGradient>
    </defs>
  </svg>
)

// ── New Project Modal ─────────────────────────────────────────────────────────
function NewProjectModal({ onClose, onCreate }: {
  onClose: () => void
  onCreate: (p: ProjectWithDate) => void
}) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,15,15,0.35)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 8, boxShadow: 'rgba(15,15,15,0.1) 0 0 0 1px, rgba(15,15,15,0.2) 0 8px 32px -4px', width: '100%', maxWidth: 460, overflow: 'hidden' }}>
        <div style={{ height: 3, background: GRAD }} />
        <div style={{ padding: '24px 24px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(55,53,47,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>New Project</div>
          {error && <div style={{ fontSize: 12, color: '#e03e3e', background: '#fdf2f2', borderRadius: 4, padding: '8px 12px', marginBottom: 12 }}>{error}</div>}
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') create() }}
            placeholder="Project title"
            style={{ width: '100%', border: 'none', borderBottom: '1.5px solid #e9e9e7', padding: '4px 0 8px', fontSize: 22, fontWeight: 600, color: '#37352f', fontFamily: 'Inter, sans-serif', outline: 'none', background: 'transparent', marginBottom: 12 }}
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description (optional)"
            rows={2}
            style={{ width: '100%', border: 'none', padding: 0, fontSize: 14, color: 'rgba(55,53,47,0.75)', fontFamily: 'Inter, sans-serif', outline: 'none', background: 'transparent', resize: 'none', lineHeight: 1.6 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '14px 24px', borderTop: '1px solid #e9e9e7', background: '#f7f6f3' }}>
          <button onClick={onClose} style={{ padding: '6px 14px', background: 'none', border: '1px solid #e9e9e7', borderRadius: 5, fontSize: 13, fontFamily: 'Inter, sans-serif', cursor: 'pointer', color: 'rgba(55,53,47,0.6)' }}>Cancel</button>
          <button onClick={create} disabled={loading} style={{ padding: '6px 16px', background: GRAD, color: '#fff', border: 'none', borderRadius: 5, fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main sidebar component ────────────────────────────────────────────────────
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
  const [projects, setProjects] = useState<ProjectWithDate[]>(initialProjects)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (initialProjects.length > 0) setProjects(initialProjects)
  }, [initialProjects])

  const activeProjectId = pathname.match(/\/(?:project|workspace)\/([^/]+)/)?.[1] ?? null
  const isDashboard = !activeProjectId && (pathname === '/dashboard' || pathname.startsWith('/dashboard'))

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Michroma&display=swap');
        .shared-sidebar { width: 240px; flex-shrink: 0; background: #f7f6f3; border-right: 1px solid #e9e9e7; height: 100vh; display: flex; flex-direction: column; overflow: hidden; transition: width 0.2s ease; font-family: 'Inter', sans-serif; }
        .shared-sidebar.collapsed { width: 0; border-right: none; }
        .sb-icon-btn { width: 26px; height: 26px; border-radius: 5px; border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: rgba(55,53,47,0.4); flex-shrink: 0; transition: background 0.1s, color 0.1s; }
        .sb-icon-btn:hover { background: rgba(55,53,47,0.08); color: #37352f; }
        .sb-item { display: flex; align-items: center; gap: 7px; padding: 5px 8px; border-radius: 5px; cursor: pointer; color: rgba(55,53,47,0.7); font-size: 13px; text-decoration: none; white-space: nowrap; overflow: hidden; transition: background 0.1s; font-family: inherit; border: none; background: none; width: 100%; text-align: left; }
        .sb-item:hover { background: rgba(55,53,47,0.07); color: #37352f; }
        .sb-item.active { background: linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%); color: #fff; font-weight: 500; }
        .sb-item.active svg path { stroke: #fff; }
        .sb-item.active:hover { background: linear-gradient(135deg, #5A7DF0 0%, #6B4CD6 100%); color: #fff; }
        .sb-label { font-size: 11px; font-weight: 500; color: rgba(55,53,47,0.45); text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 8px 4px; }
        .sb-new-btn { display: flex; align-items: center; gap: 7px; padding: 5px 8px; border-radius: 5px; cursor: pointer; color: rgba(55,53,47,0.4); font-size: 13px; background: none; border: none; width: 100%; font-family: inherit; text-align: left; transition: background 0.1s, color 0.1s; }
        .sb-new-btn:hover { background: rgba(55,53,47,0.07); color: rgba(55,53,47,0.75); }
        .sign-out-btn { display: flex; align-items: center; gap: 7px; padding: 6px 8px; border-radius: 5px; cursor: pointer; color: rgba(55,53,47,0.5); font-size: 12.5px; background: none; border: none; width: 100%; font-family: inherit; text-align: left; transition: background 0.1s, color 0.1s; }
        .sign-out-btn:hover { background: rgba(55,53,47,0.07); color: #37352f; }
      `}</style>

      {/* Toggle button when collapsed */}
      {!open && (
        <button
          onClick={onToggle}
          className="sb-icon-btn"
          style={{ position: 'fixed', top: 10, left: 10, zIndex: 50, background: '#fff', border: '1px solid #e9e9e7', width: 30, height: 30, borderRadius: 6, boxShadow: '0 1px 4px rgba(15,15,15,0.08)' }}
        >
          <MenuIcon />
        </button>
      )}

      <aside className={`shared-sidebar ${!open ? 'collapsed' : ''}`}>
        {/* Header */}
        <div style={{ padding: '12px 10px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0, padding: '3px 6px', borderRadius: 5 }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(55,53,47,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <OpenClipsLogo />
            <span style={{ fontSize: 13, fontFamily: "'Michroma', sans-serif", fontWeight: 400, color: '#37352f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Open<strong>Clips</strong>
            </span>
          </Link>
          <button className="sb-icon-btn" onClick={onToggle}><CollapseIcon /></button>
        </div>

        {/* Nav */}
        <div style={{ padding: '8px 8px 0', flexShrink: 0 }}>
          <div className="sb-label" style={{ marginTop: 8 }}>Workspace</div>
          <Link href="/dashboard" className={`sb-item ${isDashboard ? 'active' : ''}`}>
            <HomeIcon />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Home</span>
          </Link>
        </div>

        {/* Projects list */}
        <div style={{ padding: '16px 8px 0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="sb-label">Projects</div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {projects.map((p, i) => {
              const isActive = p.id === activeProjectId
              return (
                <Link
                  key={p.id}
                  href={`/dashboard/project/${p.id}`}
                  className={`sb-item ${isActive ? 'active' : ''}`}
                >
                  <FolderIcon color={isActive ? '#fff' : COLORS[i % 4]} />
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
        <div style={{ padding: '8px', borderTop: '1px solid #e9e9e7', flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: 'rgba(55,53,47,0.4)', padding: '0 8px 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userEmail}
          </div>
          <form action="/auth/signout" method="post">
            <button type="submit" className="sign-out-btn">
              <SignOutIcon />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreate={p => setProjects(prev => [p, ...prev])}
        />
      )}
    </>
  )
}