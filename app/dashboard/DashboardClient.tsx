'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'


type ProjectWithDate = { id: string; title: string; description: string | null; created_at: string }
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
)

const FolderIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 4a1 1 0 011-1h4l1.5 2H14a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.1"/>
  </svg>
)


const dotColors = ['#6C63FF', '#4ACFD2', '#F0B400', '#E23E2B']

export default function DashboardClient({
  initialProjects,
  initialCount,
  userEmail,
}: {
  initialProjects: ProjectWithDate[]
  initialCount: number
  userEmail: string
}) {
  const router = useRouter()
  const supabase = createClient()

  const [projects, setProjects] = useState<ProjectWithDate[]>(initialProjects)
  const [count, setCount] = useState(initialCount)
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showModal) setTimeout(() => titleRef.current?.focus(), 80)
    else { setTitle(''); setDescription(''); setError('') }
  }, [showModal])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowModal(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

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
    setProjects(prev => [data, ...prev])
    setCount(c => c + 1)
    setShowModal(false)
    setLoading(false)
    router.push(`/dashboard/project/${data.id}`)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }
        .notion-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          color: #37352f;
          background: #fff;
        }

        /* Sidebar */
        .sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #f7f6f3;
          border-right: 1px solid #e9e9e7;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: width 0.2s ease;
        }
        .sidebar.collapsed { width: 0; border-right: none; }

        .sidebar-header {
          padding: 12px 12px 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .workspace-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          flex: 1;
          min-width: 0;
          background: none;
          border: none;
          text-align: left;
          color: #37352f;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
        }
        .workspace-btn:hover { background: rgba(55,53,47,0.08); }

        .icon-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(55,53,47,0.45);
          flex-shrink: 0;
        }
        .icon-btn:hover { background: rgba(55,53,47,0.08); color: #37352f; }

        .sidebar-section {
          padding: 0 8px;
          margin-top: 8px;
        }
        .sidebar-section-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(55,53,47,0.5);
          padding: 4px 8px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 2px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          border-radius: 6px;
          cursor: pointer;
          color: rgba(55,53,47,0.75);
          font-size: 13.5px;
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          transition: background 0.1s;
        }
        .sidebar-item:hover { background: rgba(55,53,47,0.08); color: #37352f; }
        .sidebar-item.active { background: rgba(55,53,47,0.08); color: #37352f; }
        .sidebar-item-icon { flex-shrink: 0; opacity: 0.6; }
        .sidebar-item-text { overflow: hidden; text-overflow: ellipsis; flex: 1; }

        .sidebar-new-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          border-radius: 6px;
          cursor: pointer;
          color: rgba(55,53,47,0.5);
          font-size: 13.5px;
          background: none;
          border: none;
          width: 100%;
          font-family: inherit;
          text-align: left;
          transition: background 0.1s, color 0.1s;
        }
        .sidebar-new-btn:hover { background: rgba(55,53,47,0.08); color: #37352f; }

        .sidebar-footer {
          margin-top: auto;
          padding: 8px;
          border-top: 1px solid #e9e9e7;
        }

        /* Main content */
        .main-content {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          height: 100vh;
        }

        .topbar {
          height: 45px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          border-bottom: 1px solid #e9e9e7;
          gap: 8px;
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 10;
        }
        .topbar-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: rgba(55,53,47,0.65);
          flex: 1;
        }
        .topbar-breadcrumb span { color: #37352f; font-weight: 500; }

        /* Page content */
        .page-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 96px 120px;
        }
        @media (max-width: 768px) {
          .page-content { padding: 40px 24px 80px; }
          .sidebar { display: none; }
        }

        .page-emoji { font-size: 52px; margin-bottom: 12px; line-height: 1; }
        .page-title {
          font-size: 40px;
          font-weight: 700;
          color: #37352f;
          line-height: 1.2;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .page-subtitle {
          font-size: 14px;
          color: rgba(55,53,47,0.5);
          margin-bottom: 48px;
          font-weight: 400;
        }

        /* Stats row */
        .stats-row {
          display: flex;
          gap: 1px;
          margin-bottom: 40px;
          background: #e9e9e7;
          border: 1px solid #e9e9e7;
          border-radius: 8px;
          overflow: hidden;
        }
        .stat-cell {
          flex: 1;
          background: #fff;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .stat-num {
          font-size: 24px;
          font-weight: 600;
          color: #37352f;
          letter-spacing: -0.03em;
        }
        .stat-label {
          font-size: 12px;
          color: rgba(55,53,47,0.5);
          font-weight: 400;
        }
        .stat-divider {
          width: 1px;
          background: #e9e9e7;
        }

        /* Table */
        .table-header-row {
          display: flex;
          align-items: center;
          padding: 0 12px;
          height: 34px;
          border-bottom: 1px solid #e9e9e7;
          margin-bottom: 2px;
        }
        .table-header-cell {
          font-size: 11px;
          font-weight: 500;
          color: rgba(55,53,47,0.45);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex: 1;
        }
        .table-header-cell.date-col { width: 120px; flex: none; text-align: right; }

        .project-row {
          display: flex;
          align-items: center;
          padding: 0 12px;
          height: 40px;
          border-radius: 6px;
          text-decoration: none;
          color: #37352f;
          transition: background 0.1s;
          gap: 10px;
        }
        .project-row:hover { background: rgba(55,53,47,0.04); }
        .project-row:hover .row-chevron { opacity: 1; }
        .row-chevron { opacity: 0; color: rgba(55,53,47,0.35); transition: opacity 0.15s; }

        .row-title {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          font-size: 14px;
        }
        .row-title-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .row-desc {
          font-size: 13px;
          color: rgba(55,53,47,0.45);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 260px;
        }
        .row-date {
          font-size: 12px;
          color: rgba(55,53,47,0.4);
          width: 120px;
          text-align: right;
          flex-shrink: 0;
        }

        .new-page-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          height: 36px;
          border-radius: 6px;
          cursor: pointer;
          color: rgba(55,53,47,0.4);
          font-size: 14px;
          margin-top: 4px;
          background: none;
          border: none;
          width: 100%;
          font-family: inherit;
          text-align: left;
          transition: background 0.1s, color 0.1s;
        }
        .new-page-row:hover { background: rgba(55,53,47,0.04); color: rgba(55,53,47,0.7); }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 64px 0 32px;
        }
        .empty-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.4; }
        .empty-title { font-size: 16px; font-weight: 500; color: rgba(55,53,47,0.5); margin-bottom: 8px; }
        .empty-sub { font-size: 13px; color: rgba(55,53,47,0.35); margin-bottom: 20px; }
        .empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 13.5px;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .empty-btn:hover { opacity: 0.8; }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,15,15,0.35);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: overlay-in 0.15s ease;
        }
        @keyframes overlay-in { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: #fff;
          border-radius: 8px;
          box-shadow: rgba(15,15,15,0.1) 0 0 0 1px, rgba(15,15,15,0.2) 0 8px 32px -4px;
          width: 100%;
          max-width: 460px;
          overflow: hidden;
          animation: modal-up 0.18s cubic-bezier(0.18, 0.89, 0.45, 1.1);
        }
        @keyframes modal-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        .modal-top-strip {
          height: 3px;
          background: linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%);
        }

        .modal-body { padding: 24px 24px 20px; }
        .modal-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(55,53,47,0.5);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 16px;
        }

        .notion-input {
          width: 100%;
          border: none;
          border-bottom: 1.5px solid #e9e9e7;
          padding: 4px 0 8px;
          font-size: 22px;
          font-weight: 600;
          color: #37352f;
          font-family: inherit;
          outline: none;
          background: transparent;
          margin-bottom: 12px;
          transition: border-color 0.15s;
        }
        .notion-input::placeholder { color: rgba(55,53,47,0.25); }
        .notion-input:focus { border-bottom-color: #37352f; }

        .notion-textarea {
          width: 100%;
          border: none;
          padding: 0;
          font-size: 14px;
          color: rgba(55,53,47,0.75);
          font-family: inherit;
          outline: none;
          background: transparent;
          resize: none;
          min-height: 60px;
          line-height: 1.6;
        }
        .notion-textarea::placeholder { color: rgba(55,53,47,0.25); }

        .error-bar {
          font-size: 12px;
          color: #e03e3e;
          background: #fdf2f2;
          border-radius: 4px;
          padding: 8px 12px;
          margin-bottom: 12px;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding: 14px 24px;
          border-top: 1px solid #e9e9e7;
          background: #f7f6f3;
        }

        .btn-cancel {
          padding: 6px 14px;
          border-radius: 5px;
          border: 1px solid #e9e9e7;
          background: #fff;
          font-size: 13.5px;
          font-family: inherit;
          font-weight: 500;
          color: rgba(55,53,47,0.7);
          cursor: pointer;
          transition: background 0.1s;
        }
        .btn-cancel:hover { background: rgba(55,53,47,0.06); }

        .btn-create {
          padding: 6px 14px;
          border-radius: 5px;
          border: none;
          background: linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%);
          color: #fff;
          font-size: 13.5px;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .btn-create:hover { opacity: 0.8; }
        .btn-create:disabled { opacity: 0.4; cursor: not-allowed; }

        .sign-out-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          border-radius: 6px;
          cursor: pointer;
          color: rgba(55,53,47,0.65);
          font-size: 13px;
          background: none;
          border: none;
          font-family: inherit;
          width: 100%;
          text-align: left;
          transition: background 0.1s;
        }
        .sign-out-btn:hover { background: rgba(55,53,47,0.08); color: #37352f; }
      `}</style>

      <div className="notion-root" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* ── Main ── */}
        <main className="main-content">
          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-breadcrumb">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ opacity: 0.5 }}>
                <path d="M6.5 1L1 4.8V12h4V8.5h3V12h4V4.8L6.5 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
              </svg>
              <ChevronRight />
              <span>Projects</span>
            </div>

            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', background: 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)', color: '#fff',
                border: 'none', borderRadius: 5, fontSize: 13, fontFamily: 'inherit',
                fontWeight: 500, cursor: 'pointer', opacity: 1, transition: 'opacity 0.15s'
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              <PlusIcon />
              New
            </button>
          </div>

          {/* Page */}
          <div className="page-content">
            <div className="page-emoji">📁</div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">Research playground — gather, process, and learn.</p>

            {/* Stats */}
            <div className="stats-row">
              <div className="stat-cell">
                <div>
                  <div className="stat-num">{projects.length}</div>
                  <div className="stat-label">Projects</div>
                </div>
              </div>
              <div className="stat-divider" />
              <div className="stat-cell">
                <div>
                  <div className="stat-num">{count}</div>
                  <div className="stat-label">Clips saved</div>
                </div>
              </div>
            </div>

            {/* Table view */}
            {!projects.length ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <div className="empty-title">No projects yet</div>
                <div className="empty-sub">Create one and start clipping from the web.</div>
                <button className="empty-btn" onClick={() => setShowModal(true)}>
                  <PlusIcon />
                  New project
                </button>
              </div>
            ) : (
              <div>
                <div className="table-header-row">
                  <div className="table-header-cell">Name</div>
                  <div className="table-header-cell" style={{ maxWidth: 260, display: 'none' }}>Description</div>
                  <div className="table-header-cell date-col">Created</div>
                </div>

                {projects.map((p, i) => (
                  <Link key={p.id} href={`/dashboard/project/${p.id}`} className="project-row">
                    <div className="row-title">
                      <span style={{ flexShrink: 0 }}><FolderIcon color={dotColors[i % 4]} /></span>
                      <span className="row-title-text">{p.title}</span>
                      {p.description && (
                        <span className="row-desc">{p.description}</span>
                      )}
                    </div>
                    <div className="row-date">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <span className="row-chevron"><ChevronRight /></span>
                  </Link>
                ))}

                <button className="new-page-row" onClick={() => setShowModal(true)}>
                  <span style={{ opacity: 0.5 }}><PlusIcon /></span>
                  <span>New project</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="modal-box">
            <div className="modal-top-strip" />
            <div className="modal-body">
              <div className="modal-label">New project</div>

              {error && <div className="error-bar">{error}</div>}

              <input
                ref={titleRef}
                className="notion-input"
                type="text"
                placeholder="Untitled project"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && create()}
              />

              <textarea
                className="notion-textarea"
                placeholder="Add a description..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-create" onClick={create} disabled={loading}>
                {loading ? 'Creating...' : 'Create project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}