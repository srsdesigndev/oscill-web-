'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAppTheme } from './DShared'

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
const FolderIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 4a1 1 0 011-1h4l1.5 2H14a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.1"/>
  </svg>
)
const DotsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="3"  cy="8" r="1.2" fill="currentColor"/>
    <circle cx="8"  cy="8" r="1.2" fill="currentColor"/>
    <circle cx="13" cy="8" r="1.2" fill="currentColor"/>
  </svg>
)

const dotColors = ['#6C63FF', '#4ACFD2', '#F0B400', '#E23E2B']

// ── Row dot menu ──────────────────────────────────────────────────────────────
function RowMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useAppTheme()

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const menuItem = (label: string, icon: string, onClick: () => void, danger = false) => (
    <button
      key={label}
      onClick={() => { onClick(); setOpen(false) }}
      className="flex items-center gap-2 w-full px-2.5 py-1.5 text-left text-[12.5px] rounded border-none cursor-pointer font-[inherit]"
      style={{ background: 'none', color: danger ? '#e23e2b' : t.fg }}
      onMouseEnter={e => (e.currentTarget.style.background = danger ? 'rgba(226,62,43,0.08)' : t.sidebarItemHoverBg)}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      <span>{icon}</span>{label}
    </button>
  )

  return (
    <div ref={ref} className="relative" onClick={e => e.preventDefault()}>
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); setOpen(s => !s) }}
        className="flex items-center justify-center w-6 h-6 rounded border-none cursor-pointer"
        style={{ background: open ? t.sidebarItemHoverBg : 'none', color: t.fgLow }}
        onMouseEnter={e => { e.currentTarget.style.background = t.sidebarItemHoverBg; e.currentTarget.style.color = t.fg }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = t.fgLow } }}
      >
        <DotsIcon />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 rounded-md p-0.5 z-50 min-w-[140px]"
          style={{ background: t.modalBg, border: `1px solid ${t.border}`, boxShadow: t.shadowModal }}
        >
          {menuItem('Edit', '✎', onEdit)}
          <div style={{ height: 1, background: t.border, margin: '2px 0' }} />
          {menuItem('Delete', '✕', onDelete, true)}
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
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
  const { t } = useAppTheme()

  const [projects, setProjects] = useState<ProjectWithDate[]>(initialProjects)
  const [count, setCount] = useState(initialCount)

  // modal: null = closed, create = new, edit = editing existing
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; project?: ProjectWithDate } | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // delete confirm
  const [confirmDelete, setConfirmDelete] = useState<ProjectWithDate | null>(null)
  const [deleting, setDeleting] = useState(false)

  const titleRef = useRef<HTMLInputElement>(null)

  function openCreate() { setModal({ mode: 'create' }); setTitle(''); setDescription(''); setError('') }
  function openEdit(p: ProjectWithDate) { setModal({ mode: 'edit', project: p }); setTitle(p.title); setDescription(p.description ?? ''); setError('') }
  function closeModal() { setModal(null); setTitle(''); setDescription(''); setError('') }

  useEffect(() => {
    if (modal) setTimeout(() => titleRef.current?.focus(), 80)
  }, [modal])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeModal(); setConfirmDelete(null) }
    }
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
    closeModal()
    setLoading(false)
    router.push(`/dashboard/project/${data.id}`)
  }

  async function save() {
    if (!title.trim()) { setError('Give your project a title.'); return }
    if (!modal?.project) return
    setLoading(true); setError('')
    const { error: err } = await supabase
      .from('projects')
      .update({ title: title.trim(), description: description.trim() || null })
      .eq('id', modal.project.id)
    if (err) { setError(err.message); setLoading(false); return }
    setProjects(prev => prev.map(p =>
      p.id === modal.project!.id
        ? { ...p, title: title.trim(), description: description.trim() || null }
        : p
    ))
    closeModal()
    setLoading(false)
  }

  async function deleteProject() {
    if (!confirmDelete) return
    setDeleting(true)
    await supabase.from('projects').delete().eq('id', confirmDelete.id)
    setProjects(prev => prev.filter(p => p.id !== confirmDelete.id))
    setConfirmDelete(null)
    setDeleting(false)
  }

  const isEdit = modal?.mode === 'edit'

  return (
    <>
      <div className="h-screen overflow-hidden font-sans text-sm" style={{ color: t.fg, background: t.bg }}>
        <main className="flex flex-col h-screen overflow-y-auto" style={{ background: t.bg }}>

          {/* Topbar */}
          <div
            className="sticky top-0 z-10 h-[45px] flex items-center gap-2 px-4 backdrop-blur-md"
            style={{ borderBottom: `1px solid ${t.border}`, background: t.navBg }}
          >
            <div className="flex items-center gap-1.5 flex-1 text-[13.5px]" style={{ color: t.fgMid }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ opacity: 0.5 }}>
                <path d="M6.5 1L1 4.8V12h4V8.5h3V12h4V4.8L6.5 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
              </svg>
              <ChevronRight />
              <span className="font-medium" style={{ color: t.fg }}>Projects</span>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[5px] text-[13px] font-medium text-white transition-opacity hover:opacity-80 border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)' }}
            >
              <PlusIcon /> New
            </button>
          </div>

          {/* Page content */}
          <div className="max-w-[900px] w-full mx-auto px-24 pt-[60px] pb-[120px] max-md:px-6 max-md:pt-10">
            <div className="text-[52px] leading-none mb-3">📁</div>
            <h1 className="text-[40px] font-bold tracking-tight mb-2" style={{ color: t.fg }}>Projects</h1>
            <p className="text-sm mb-12" style={{ color: t.fgMid }}>Research playground — gather, process, and learn.</p>

            {/* Stats */}
            <div className="flex rounded-lg overflow-hidden mb-10" style={{ border: `1px solid ${t.border}`, gap: 1, background: t.border }}>
              {[{ num: projects.length, label: 'Projects' }, { num: count, label: 'Clips saved' }].map(({ num, label }) => (
                <div key={label} className="flex-1 flex items-center px-5 py-3.5" style={{ background: t.bg }}>
                  <div className="text-2xl font-semibold tracking-tight" style={{ color: t.fg }}>{num}</div>
                  <div className="text-xs ml-3" style={{ color: t.fgMid }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {!projects.length ? (
              <div className="text-center py-16">
                <div className="text-[40px] opacity-40 mb-4">📄</div>
                <div className="text-base font-medium mb-2" style={{ color: t.fgMid }}>No projects yet</div>
                <div className="text-[13px] mb-5" style={{ color: t.fgLow }}>Create one and start clipping from the web.</div>
                <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-md text-[13.5px] font-medium text-white transition-opacity hover:opacity-80 border-none cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)' }}
                >
                  <PlusIcon /> New project
                </button>
              </div>
            ) : (
              <div>
                {/* Table header */}
                <div className="flex items-center px-3 h-[34px] mb-0.5" style={{ borderBottom: `1px solid ${t.border}` }}>
                  <div className="flex-1 text-[11px] font-medium uppercase tracking-widest" style={{ color: t.fgLow }}>Name</div>
                  <div className="w-[120px] text-right text-[11px] font-medium uppercase tracking-widest" style={{ color: t.fgLow }}>Created</div>
                  <div className="w-8" />
                </div>

                {projects.map((p, i) => (
                  <div
                    key={p.id}
                    className="group flex items-center gap-2.5 px-3 h-10 rounded-md transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = t.sidebarItemHoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Link
                      href={`/dashboard/project/${p.id}`}
                      className="flex-1 flex items-center gap-2 min-w-0 text-sm no-underline h-full"
                      style={{ color: t.fg }}
                    >
                      <span className="shrink-0"><FolderIcon color={dotColors[i % 4]} /></span>
                      <span className="truncate">{p.title}</span>
                      {p.description && (
                        <span className="text-[13px] truncate max-w-[260px]" style={{ color: t.fgMid }}>{p.description}</span>
                      )}
                    </Link>

                    <div className="text-xs w-[120px] text-right shrink-0" style={{ color: t.fgLow }}>
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    <div className="w-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <RowMenu onEdit={() => openEdit(p)} onDelete={() => setConfirmDelete(p)} />
                    </div>
                  </div>
                ))}

                <button
                  onClick={openCreate}
                  className="flex items-center gap-2 px-3 h-9 w-full rounded-md mt-1 text-sm text-left font-[inherit] border-none cursor-pointer"
                  style={{ background: 'none', color: t.fgMid }}
                  onMouseEnter={e => (e.currentTarget.style.background = t.sidebarItemHoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <span style={{ opacity: 0.5 }}><PlusIcon /></span>
                  New project
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Create / Edit Modal ── */}
      {modal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
          style={{ background: 'rgba(15,15,15,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div
            className="w-full max-w-[460px] rounded-lg overflow-hidden"
            style={{ background: t.modalBg, boxShadow: t.shadowModal, border: `1px solid ${t.border}` }}
          >
            <div className="h-[3px]" style={{ background: 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)' }} />

            <div className="px-6 pt-6 pb-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.07em] mb-4" style={{ color: t.fgMid }}>
                {isEdit ? 'Edit project' : 'New project'}
              </div>

              {error && (
                <div className="text-xs rounded px-3 py-2 mb-3" style={{ color: '#e03e3e', background: 'rgba(224,62,62,0.1)' }}>
                  {error}
                </div>
              )}

              <input
                ref={titleRef}
                type="text"
                placeholder="Untitled project"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (isEdit ? save() : create())}
                className="w-full border-0 border-b-[1.5px] pb-2 pt-1 text-[22px] font-semibold bg-transparent outline-none mb-3 font-[inherit]"
                style={{ borderColor: t.border, color: t.fg }}
                onFocus={e => (e.currentTarget.style.borderColor = t.fg)}
                onBlur={e => (e.currentTarget.style.borderColor = t.border)}
              />

              <textarea
                placeholder="Add a description..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border-none p-0 text-sm bg-transparent outline-none resize-none min-h-[60px] leading-relaxed font-[inherit]"
                style={{ color: t.fgMid }}
              />
            </div>

            <div
              className="flex items-center justify-end gap-2 px-6 py-3.5"
              style={{ borderTop: `1px solid ${t.border}`, background: t.modalFooterBg }}
            >
              <button
                onClick={closeModal}
                className="px-3.5 py-1.5 rounded-[5px] text-[13.5px] font-medium font-[inherit] cursor-pointer"
                style={{ border: `1px solid ${t.border}`, background: t.cardBg, color: t.fgMid }}
                onMouseEnter={e => (e.currentTarget.style.background = t.sidebarItemHoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = t.cardBg)}
              >
                Cancel
              </button>
              <button
                onClick={isEdit ? save : create}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-[5px] text-[13.5px] font-medium text-white border-none font-[inherit] transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)' }}
              >
                {loading
                  ? (isEdit ? 'Saving...' : 'Creating...')
                  : (isEdit ? 'Save changes' : 'Create project')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
          style={{ background: 'rgba(15,15,15,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setConfirmDelete(null) }}
        >
          <div
            className="w-full max-w-[400px] rounded-lg overflow-hidden"
            style={{ background: t.modalBg, boxShadow: t.shadowModal, border: `1px solid ${t.border}` }}
          >
            <div className="px-7 pt-7 pb-2 flex justify-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1.5px solid rgba(239,68,68,0.25)' }}>
                🗑
              </div>
            </div>
            <div className="px-7 py-4 text-center">
              <p className="text-sm font-bold mb-1.5" style={{ color: t.fg }}>Delete "{confirmDelete.title}"?</p>
              <p className="text-xs leading-relaxed" style={{ color: t.fgMid }}>
                This will permanently delete the project and all its clips. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-[7px] text-[13px] font-semibold font-[inherit] cursor-pointer transition-colors"
                style={{ border: `1.5px solid ${t.border}`, background: t.cardBg, color: t.fg }}
                onMouseEnter={e => (e.currentTarget.style.background = t.sidebarItemHoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = t.cardBg)}
              >
                Cancel
              </button>
              <button
                onClick={deleteProject}
                disabled={deleting}
                className="flex-1 py-2 rounded-[7px] text-[13px] font-semibold text-white border-none font-[inherit] cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: '#ef4444' }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input::placeholder, textarea::placeholder { color: ${t.fgLow}; }
      `}</style>
    </>
  )
}