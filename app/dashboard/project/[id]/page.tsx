'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FONT, Item, Project, norm } from './types'
import { GLOBAL_STYLES } from './ui'
import { QuillBlock } from './QuillBlock'
import { OscilChat } from './oscilChat'
import { OscilIdeate } from './OscilIdeate'

const OscilLogo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size * (32 / 36)} viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip_ws)">
      <path d="M11.9188 17.3086C12.4433 17.0691 12.956 16.8041 13.455 16.5147C14.7995 15.7349 16.0386 14.7839 17.1416 13.6851C19.6687 11.1713 21.3029 8.09132 22.0413 4.84502C22.0807 4.67143 22.0998 4.54301 22.1347 4.36573C22.3372 3.34626 22.8545 2.39235 23.6446 1.60637C25.7501 -0.488357 29.0706 -0.597808 31.2245 1.65281C31.7647 2.2172 32.628 2.89175 32.7128 4.65132C32.7142 5.39511 32.6694 6.13947 32.5794 6.87957C32.1048 10.7986 30.3621 14.59 27.3562 17.5802C23.4339 21.4825 18.1825 23.2018 13.0891 22.7483C11.4303 22.6007 9.79968 22.2227 8.24372 21.6251C6.53041 20.9663 4.9278 20.0464 3.492 18.8976C6.35794 19.0539 9.25468 18.5242 11.9188 17.3086Z" fill="#4ACFD2"/>
      <path d="M15.4744 1.18994C17.0003 -0.327931 19.459 -0.313064 20.9666 1.22336C21.9323 2.20771 22.3611 3.41225 22.0807 4.66874L22.0413 4.84517C21.3029 8.09132 19.6687 11.1713 17.1416 13.6851C16.0386 14.7839 14.7994 15.7349 13.4549 16.5147C12.9559 16.8041 12.4433 17.069 11.9188 17.3086C12.4036 16.5148 12.8266 15.6843 13.184 14.8246C14.5278 11.5923 14.9029 8.04644 14.3062 4.63773C14.3017 4.58704 14.2597 4.38244 14.2597 4.38244C14.1078 3.21217 14.5762 2.08354 15.4744 1.18994Z" fill="#F0B400"/>
      <path d="M13.4793 2.83612C13.8085 3.17067 14.0521 3.58065 14.1892 4.03088C14.2317 4.23251 14.2705 4.43527 14.3062 4.63775C14.903 8.04646 14.528 11.5924 13.184 14.8249C12.5928 11.9835 11.3292 9.32763 9.5005 7.08306C9.32802 6.87067 9.15074 6.66229 8.9688 6.45807C8.01676 5.4192 8.38591 3.7964 9.37661 2.81091C10.5164 1.67704 12.3534 1.68865 13.4793 2.83612Z" fill="#E23E2B"/>
      <path d="M1.86286 17.4253C2.37607 17.9486 2.9202 18.4402 3.49228 18.8974C4.92795 20.0463 6.53041 20.9662 8.24358 21.6249C9.79948 22.2227 11.4301 22.6007 13.089 22.7482C18.1827 23.2019 23.4336 21.4824 27.3561 17.5806C31.0199 13.936 32.7845 9.11124 32.6874 4.30628C32.4716 3.1128 31.9939 3.26699 32.0102 2.65106C32.1238 2.74366 32.6323 3.23825 33.0054 3.77503C37.677 10.8606 36.8776 20.5089 30.6429 26.7112C24.9279 32.3962 16.3931 33.4482 9.63394 29.8962C8.01647 29.0461 6.50081 27.933 5.14969 26.5561C4.54204 25.9372 3.97909 25.2754 3.46514 24.5757C2.12394 22.7506 1.13726 20.6868 0.557016 18.4929C0.271167 17.4141 0.0847058 16.311 0 15.1978C0.561085 15.989 1.18402 16.7339 1.86286 17.4253Z" fill="#3A7CEB"/>
    </g>
    <defs>
      <clipPath id="clip_ws"><rect width="36" height="32" fill="white"/></clipPath>
    </defs>
  </svg>
)

const RefreshIcon = ({ spinning }: { spinning: boolean }) => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform 0.6s ease', transform: spinning ? 'rotate(360deg)' : 'rotate(0deg)' }}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)


// ── Toolbar helpers ───────────────────────────────────────────────────────────
function ToolbarDivider() {
  return <div style={{ width: 1, height: 18, background: '#e2e8f0', margin: '0 3px', flexShrink: 0 }} />
}

function ToolbarBtn({
  onClick, label, icon, active = false, badge, badgeActive = false,
}: {
  onClick: () => void
  label: string
  icon?: React.ReactNode
  active?: boolean
  badge?: number
  badgeActive?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 36, padding: '0 14px', borderRadius: 10, border: 'none',
        background: active ? '#1a3a6b' : 'transparent',
        color: active ? '#fff' : '#64748b',
        fontSize: 12, fontWeight: 500, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'background 0.15s, color 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = '#f1f5f9'
          e.currentTarget.style.color = '#0f172a'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#64748b'
        }
      }}
    >
      {icon}
      {label}
      {badge !== undefined && (
        <span style={{
          fontSize: 9, fontWeight: 600,
          color: badgeActive ? 'rgba(255,255,255,0.75)' : '#3A7CEB',
          background: badgeActive ? 'rgba(255,255,255,0.15)' : '#eff6ff',
          borderRadius: 4, padding: '1px 6px',
          letterSpacing: '0.02em', lineHeight: 1.5,
        }}>
          {badge}
        </span>
      )}
    </button>
  )
}

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient()
  const router   = useRouter()

  const [projectId, setProjectId]     = useState('')
  const [project, setProject]         = useState<Project | null>(null)
  const [items, setItems]             = useState<Item[]>([])
  const [loading, setLoading]         = useState(true)
  const [refreshing, setRefreshing]   = useState(false)
  const [search, setSearch]           = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showAI, setShowAI]           = useState(false)
  const [showIdeate, setShowIdeate]   = useState(false)
  const [newBlockId, setNewBlockId]   = useState<string | null>(null)

  useEffect(() => { params.then(p => setProjectId(p.id)) }, [params])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (projectId) load() }, [projectId])

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: proj } = await supabase.from('projects').select('*').eq('id', projectId).single()
    if (!proj) { router.push('/dashboard'); return }
    setProject(proj as Project)
    const { data } = await supabase
      .from('clips').select('*')
      .eq('project_id', projectId).eq('archived', false)
      .order('pinned', { ascending: false })
      .order('saved_at', { ascending: true })
    setItems((data || []).map(r => norm(r as Record<string, unknown>)))
    if (!silent) setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  async function handleRefresh() {
    setRefreshing(true)
    await load(true)
    setTimeout(() => setRefreshing(false), 650)
  }

  async function saveItem(id: string, updates: Partial<Item>) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))
    await supabase.from('clips').update({
      page_title: updates.label ?? null,
      note: updates.note ?? null,
      text: updates.content ?? null,
    }).eq('id', id)
  }

  async function togglePin(item: Item) {
    const pinned = !item.pinned
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, pinned } : i))
    await supabase.from('clips').update({ pinned }).eq('id', item.id)
  }

  async function archiveItem(item: Item) {
    setItems(prev => prev.filter(i => i.id !== item.id))
    setSelectedIds(prev => { const n = new Set(prev); n.delete(item.id); return n })
    await supabase.from('clips').update({ archived: true }).eq('id', item.id)
  }

  async function handleAdd() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const now = new Date().toISOString()
    const { data, error } = await supabase.from('clips').insert({
      type: 'text', page_title: null, text: null, note: null, url: null,
      file_url: null, file_name: null, project_id: projectId, user_id: user.id,
      saved_at: now, last_opened_at: now, tags: [], pinned: false, archived: false, followups: [],
    }).select().single()
    if (!error && data) {
      const newItem = norm(data as Record<string, unknown>)
      setItems(prev => [...prev, newItem])
      setNewBlockId(newItem.id)
      setTimeout(() => setNewBlockId(null), 2000)
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n
    })
  }

  const displayed    = items.filter(i => {
    if (!search) return true
    const q = search.toLowerCase()
    return [(i.label || ''), (i.content || '')].some(s => s.toLowerCase().includes(q))
  })
  const selectedItems = items.filter(i => selectedIds.has(i.id))
  const hasSelection  = selectedIds.size > 0

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8f8f7]">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <OscilLogo size={36} />
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #e4e4e7', borderTopColor: '#3A7CEB', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ fontFamily: FONT, background: '#f8f8f7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        @keyframes spin-icon { to { transform: rotate(360deg); } }
        .spinning { animation: spin-icon 0.6s ease both; }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 25%, #f59e0b 50%, #ef4444 75%, #3b82f6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 4s linear infinite;
        }
        .search-input::placeholder { color: #a1a1aa; }
        .search-input:focus { border-color: #3A7CEB !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(58,124,235,0.1); outline: none; }
        ${GLOBAL_STYLES}
      `}</style>

      {/* ── Header ── */}
      <header className="h-[54px] shrink-0 flex items-center px-6 z-20 border-b border-zinc-100"
        style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)' }}>
        <Link href="/dashboard" className="no-underline flex items-center gap-3">
          <OscilLogo size={28} />
          <div className="flex flex-col justify-center leading-none">
            <div className="flex items-baseline gap-1.5">
              <span className="font-syne font-bold text-[13px] tracking-widest uppercase text-zinc-900">Oscil</span>
              <span className="font-syne text-[11px] font-bold tracking-widest shimmer-text uppercase">AI</span>
            </div>
            <span className="text-[7.5px] font-medium tracking-[2px] uppercase text-zinc-400 mt-0.5">
              Information Across Dimensions
            </span>
          </div>
        </Link>

        <div className="w-px h-4 bg-zinc-200 mx-5" />
        <Link href="/dashboard" className="text-[12px] text-zinc-400 no-underline hover:text-zinc-700 transition-colors font-medium">Projects</Link>
        <span className="text-zinc-300 text-[12px] mx-2">/</span>
        <span className="font-syne font-semibold text-[13px] text-zinc-900">{project?.title}</span>

        <div className="ml-auto flex items-center gap-3">
          {hasSelection && (
            <span className="text-[10px] font-semibold text-[#3A7CEB] bg-blue-50 border border-blue-100 rounded-full px-3 py-1 tracking-wide">
              {selectedIds.size} selected
            </span>
          )}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[12px] pointer-events-none">⌕</span>
            <input type="text" placeholder="Search clips..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input pl-7 pr-3 py-1.5 bg-zinc-100 border border-transparent rounded-full text-[12px] text-zinc-900 w-[140px] transition-all"
              style={{ fontFamily: FONT }} />
          </div>
          <button onClick={handleRefresh} disabled={refreshing} title="Refresh clips"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200 bg-white text-zinc-400 hover:text-[#3A7CEB] hover:border-[#3A7CEB] transition-all disabled:opacity-50">
            <span className={refreshing ? 'spinning' : ''}><RefreshIcon spinning={false} /></span>
          </button>
          <span className="font-syne font-bold text-[13px] text-zinc-300">{items.length}</span>
        </div>
      </header>

      {/* ── Grid ── */}
      <div className="flex-1 overflow-y-auto p-5 pb-28">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-3 mt-24">
            <OscilLogo size={40} />
            <p className="font-syne font-bold text-[15px] text-zinc-300 m-0">
              {search ? `No results for "${search}"` : 'No clips yet'}
            </p>
            <p className="text-[12px] text-zinc-400 font-light m-0">
              {search ? 'Try a different search term' : 'Press + to create your first note, or clip from the web'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {displayed.map(item => (
              <QuillBlock
                key={item.id} item={item}
                onSave={u => saveItem(item.id, u)}
                onPin={() => togglePin(item)}
                onArchive={() => archiveItem(item)}
                selected={selectedIds.has(item.id)}
                onToggleSelect={() => toggleSelect(item.id)}
                isNew={newBlockId === item.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── FAB: Add note — bottom left ── */}
      <button
        onClick={handleAdd}
        title="New note"
        style={{
          position: 'fixed', bottom: 24, left: 24, zIndex: 40,
          width: 44, height: 44, borderRadius: '50%',
          border: '1px solid #e2e8f0',
          background: '#fff', color: '#64748b',
          fontSize: 22, fontWeight: 300, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(15,23,42,0.08)',
          transition: 'box-shadow 0.15s, color 0.15s, border-color 0.15s',
          fontFamily: FONT, lineHeight: 1,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#3A7CEB'; e.currentTarget.style.color = '#3A7CEB'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(58,124,235,0.15)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,23,42,0.08)' }}
      >+</button>

      {/* ── FABs: bottom right — Ideate + Oscil AI ── */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 40, display: 'flex', gap: 10, alignItems: 'center' }}>

        {/* Ideate — amber, only when clips selected */}
        {hasSelection && (
          <button
            onClick={() => { setShowIdeate(s => !s); setShowAI(false) }}
            title="Ideate on selected clips"
            style={{
              height: 44, padding: '0 18px', borderRadius: 22, border: 'none',
              background: '#F0B400',
              color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
              boxShadow: '0 4px 16px rgba(240,180,0,0.3)',
              transition: 'opacity 0.15s, box-shadow 0.15s',
              fontFamily: FONT,
              opacity: showIdeate ? 0.85 : 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(240,180,0,0.4)'; e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(240,180,0,0.3)'; e.currentTarget.style.opacity = showIdeate ? '0.85' : '1' }}
          >
            Ideate
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
              background: 'rgba(0,0,0,0.12)',
              borderRadius: 4, padding: '1px 6px',
            }}>
              {selectedIds.size}
            </span>
          </button>
        )}

        {/* Oscil AI — brand blue */}
        <button
          onClick={() => { setShowAI(s => !s); setShowIdeate(false) }}
          title="Oscil AI"
          style={{
            height: 44, padding: '0 20px', borderRadius: 22, border: 'none',
            background: '#3A7CEB',
            color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(58,124,235,0.3)',
            transition: 'opacity 0.15s, box-shadow 0.15s',
            fontFamily: FONT,
            opacity: showAI ? 0.85 : 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(58,124,235,0.4)'; e.currentTarget.style.opacity = '0.9' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(58,124,235,0.3)'; e.currentTarget.style.opacity = showAI ? '0.85' : '1' }}
        >
          <svg width={13} height={7} viewBox="0 0 24 14" fill="none">
            <path d="M0 7 C3 3 5 3 7 7 S11 11 13 7 S17 3 19 7 L24 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          </svg>
          Oscil AI
          {hasSelection && (
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
              background: 'rgba(0,0,0,0.12)',
              borderRadius: 4, padding: '1px 6px',
            }}>
              {selectedIds.size}
            </span>
          )}
        </button>
      </div>



      {/* ── Panels ── */}
      {showAI && (
        <OscilChat selectedItems={selectedItems} projectId={projectId} onClose={() => setShowAI(false)} />
      )}
      {showIdeate && (
        <OscilIdeate selectedItems={selectedItems} onClose={() => setShowIdeate(false)} />
      )}
    </div>
  )
}