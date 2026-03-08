'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FONT, Item, Project, norm } from './types'
import { GLOBAL_STYLES } from './ui'
import { QuillBlock } from './QuillBlock'
import { OscilChat } from './oscilChat'


const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const FolderIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path d="M1 4a1 1 0 011-1h4l1.5 2H14a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" fill="rgba(108,99,255,0.15)" stroke="#6C63FF" strokeWidth="1.1"/>
  </svg>
)
const RefreshIcon = ({ spinning }: { spinning: boolean }) => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform 0.5s ease', transform: spinning ? 'rotate(360deg)' : 'rotate(0deg)' }}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)
const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient()
  const router   = useRouter()

  const [projectId, setProjectId]     = useState('')
  const [project, setProject]         = useState<Project | null>(null)
  const [items, setItems]             = useState<Item[]>([])
  const [loading, setLoading]         = useState(true)
  const initialLoadDone = useRef(false)
  const [refreshing, setRefreshing]   = useState(false)
  const [search, setSearch]           = useState('')
  const [showAI, setShowAI]           = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [prefillQuestion, setPrefillQuestion] = useState<string | undefined>(undefined)
  const [newBlockId, setNewBlockId]   = useState<string | null>(null)

  // Split pane drag
  const [splitPct, setSplitPct] = useState(55) // left pane % when AI open
  const dragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { params.then(p => setProjectId(p.id)) }, [params])
  useEffect(() => {
    if (!projectId) return
    // Reset so each project navigation is a clean silent swap (no skeleton flash)
    initialLoadDone.current = false
    setLoading(false)
    setItems([])        // clear stale clips instantly
    setProject(null)    // clear stale title
    load()
  }, [projectId]) // eslint-disable-line

  const load = useCallback(async (silent = false) => {
    // Only show skeleton on the very first load — subsequent project switches
    // keep old items visible until new ones arrive (no flicker)
    const isFirst = !initialLoadDone.current
    if (!silent && isFirst) setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: proj } = await supabase.from('projects').select('*').eq('id', projectId).single()
    if (!proj) { router.push('/dashboard'); return }
    setProject(proj as Project)

    // Fetch projects list and clips in parallel
    const { data } = await supabase
      .from('clips').select('*')
      .eq('project_id', projectId).eq('archived', false)
      .order('pinned', { ascending: false })
      .order('saved_at', { ascending: true })

    setItems((data || []).map(r => norm(r as Record<string, unknown>)))

    initialLoadDone.current = true
    if (!silent) setLoading(false)
  }, [projectId]) // eslint-disable-line

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
    setSelectedIds(prev => { const s = new Set(prev); s.delete(item.id); return s })
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
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  function openAI(question?: string, withContext?: boolean) {
    setShowAI(true)
    if (question) setPrefillQuestion(question)
    // withContext handled by selectedIds already being set before this call
  }

  // Drag-to-resize split pane
  function onDividerMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    dragging.current = true
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((ev.clientX - rect.left) / rect.width) * 100
      setSplitPct(Math.min(75, Math.max(30, pct)))
    }
    const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const displayed = items.filter(i => {
    if (!search) return true
    const q = search.toLowerCase()
    return [(i.label || ''), (i.content || '')].some(s => s.toLowerCase().includes(q))
  })

  const selectedItems = items.filter(i => selectedIds.has(i.id))

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontSize: 14, color: '#37352f', background: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .ws-sidebar.collapsed { width: 0; border-right: none; }
        .sidebar-logo-row:hover { background: rgba(55,53,47,0.06); }
        .icon-btn { width: 26px; height: 26px; border-radius: 5px; border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: rgba(55,53,47,0.4); flex-shrink: 0; transition: background 0.1s, color 0.1s; }
        .icon-btn:hover { background: rgba(55,53,47,0.08); color: #37352f; }
        .sidebar-item:hover { background: rgba(55,53,47,0.07); color: #37352f; }
        .sidebar-item.active { background: rgba(55,53,47,0.08); color: #37352f; font-weight: 500; }
        .sidebar-new-btn:hover { background: rgba(55,53,47,0.07); color: rgba(55,53,47,0.75); }

        .ws-topbar { height: 44px; display: flex; align-items: center; padding: 0 16px; gap: 6px; border-bottom: 1px solid #e9e9e7; background: #fff; position: sticky; top: 0; z-index: 10; flex-shrink: 0; }
        .breadcrumb { display: flex; align-items: center; gap: 5px; flex: 1; font-size: 13.5px; color: rgba(55,53,47,0.55); }
        .breadcrumb a { color: rgba(55,53,47,0.55); text-decoration: none; transition: color 0.1s; }
        .breadcrumb a:hover { color: #37352f; }
        .breadcrumb .current { color: #37352f; font-weight: 500; }

        .ws-search { display: flex; align-items: center; gap: 6px; padding: 5px 10px; background: rgba(55,53,47,0.06); border-radius: 6px; border: 1px solid transparent; transition: all 0.15s; width: 180px; }
        .ws-search:focus-within { background: #fff; border-color: rgba(55,53,47,0.25); box-shadow: 0 0 0 2px rgba(55,53,47,0.06); }
        .ws-search input { border: none; background: transparent; outline: none; font-size: 13px; color: #37352f; font-family: inherit; flex: 1; width: 100%; }
        .ws-search input::placeholder { color: rgba(55,53,47,0.35); }

        /* Split layout */
        .ws-content { flex: 1; min-width: 0; height: 100vh; display: flex; overflow: hidden; }
        .ws-left { height: 100vh; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
        .ws-body { flex: 1; overflow-y: auto; }

        /* Divider */
        .split-divider {
          width: 1px; background: #e9e9e7; flex-shrink: 0; cursor: col-resize; position: relative;
          transition: background 0.15s;
        }
        .split-divider:hover, .split-divider.dragging { background: #6C63FF; }
        .split-divider::after {
          content: ''; position: absolute; top: 0; left: -4px; right: -4px; bottom: 0;
        }

        /* Right chat pane */
        .ws-right { height: 100vh; display: flex; flex-direction: column; overflow: hidden; min-width: 320px; background: #fff; }

        .clips-area { padding: 24px 48px 80px; }
        @media (max-width: 900px) { .clips-area { padding: 20px 24px 80px; } }

        /* FAB */
        .ws-fab { position: fixed; bottom: 24px; right: 24px; z-index: 40; display: flex; gap: 8px; align-items: center; }
        .fab-btn { height: 36px; padding: 0 14px; border-radius: 6px; border: none; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: inherit; transition: opacity 0.15s, box-shadow 0.15s; }
        .fab-add { width: 36px; height: 36px; padding: 0; border-radius: 6px; border: 1px solid #e9e9e7; background: #fff; color: rgba(55,53,47,0.6); box-shadow: 0 2px 8px rgba(15,15,15,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; font-family: inherit; font-weight: 300; transition: all 0.1s; }
        .fab-add:hover { background: rgba(55,53,47,0.06); border-color: rgba(55,53,47,0.3); }

        /* Selection bar */
        .sel-bar { display: flex; align-items: center; gap: 8px; padding: 0 48px; height: 38px; border-bottom: 1px solid #e9e9e7; background: rgba(108,99,255,0.04); flex-shrink: 0; }

        .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 10px; padding: 80px 0 40px; }
        .empty-title { font-size: 15px; font-weight: 500; color: rgba(55,53,47,0.35); }
        .empty-sub { font-size: 13px; color: rgba(55,53,47,0.3); }

        ${GLOBAL_STYLES}
      `}</style>
      {/* ── Content (split pane when AI open) ── */
      <div ref={containerRef} className="ws-content">

        {/* Left: clips */}
        <div className="ws-left" style={{ width: showAI ? `${splitPct}%` : '100%', transition: dragging.current ? 'none' : 'width 0.2s ease' }}>

          {/* Topbar */}
          <div className="ws-topbar">
            <div className="breadcrumb">
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none" style={{ opacity: 0.5 }}><path d="M6.5 1L1 4.8V12h4V8.5h3V12h4V4.8L6.5 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>
              <ChevronRight />
              <Link href="/dashboard" className="breadcrumb-link" style={{ color: 'rgba(55,53,47,0.55)', textDecoration: 'none' }}>Projects</Link>
              <ChevronRight />
              <span className="current">{project?.title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
              <button className="icon-btn" onClick={handleRefresh} disabled={refreshing} title="Refresh" style={{ width: 28, height: 28 }}>
                <span style={{ display: 'flex', transition: 'transform 0.5s', transform: refreshing ? 'rotate(360deg)' : 'none' }}>
                  <RefreshIcon spinning={refreshing} />
                </span>
              </button>
              <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)', color: '#fff', border: 'none', borderRadius: 5, fontSize: 12.5, fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer', transition: 'opacity 0.1s' }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              ><PlusIcon /> New</button>
            </div>
          </div>

          {/* Page header */}
          <div style={{ padding: '16px 48px', borderBottom: '1px solid #e9e9e7', flexShrink: 0 }}>
            <h1 style={{ fontSize: 14, fontWeight: 600, color: '#37352f', margin: 0 }}>{project?.title}</h1>
            {project?.description && <p style={{ fontSize: 12, color: 'rgba(55,53,47,0.4)', margin: '2px 0 0' }}>{project.description}</p>}
          </div>

          {/* Meta / selection bar */}
          {selectedIds.size > 0 ? (
            <div className="sel-bar">
              <span style={{ fontSize: 12, color: '#6C63FF', fontWeight: 500 }}>{selectedIds.size} selected</span>
              <button
                onClick={() => { openAI() }}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer' }}
              >
                <svg width="10" height="6" viewBox="0 0 24 14" fill="none"><path d="M0 7 C3 3 5 3 7 7 S11 11 13 7 S17 3 19 7 L24 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/></svg>
                Ask Oscil AI
              </button>
              <button onClick={() => setSelectedIds(new Set())} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'rgba(55,53,47,0.4)', fontFamily: 'inherit', padding: '2px 6px', borderRadius: 3 }}>Clear</button>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(55,53,47,0.4)' }}>{items.length} clip{items.length !== 1 ? 's' : ''} total</span>
            </div>
          ) : (
            <div style={{ padding: '8px 48px', borderBottom: '1px solid #e9e9e7', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: 'rgba(55,53,47,0.4)' }}>{items.length} clip{items.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Clips */}
          <div className="ws-body">
            <div className="clips-area">
              {loading ? (
                // Skeleton — sidebar stays visible, only content area shows loader
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
                  <style>{`
                    @keyframes shimmer {
                      0% { background-position: -600px 0; }
                      100% { background-position: 600px 0; }
                    }
                    .skeleton {
                      background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
                      background-size: 600px 100%;
                      animation: shimmer 1.4s ease infinite;
                      border-radius: 4px;
                    }
                  `}</style>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                      <div className="skeleton" style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0 }} />
                      <div className="skeleton" style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0 }} />
                      <div className="skeleton" style={{ flex: 1, height: 13, maxWidth: `${140 + (n * 37) % 160}px` }} />
                    </div>
                  ))}
                </div>
              ) : displayed.length === 0 ? (
                <div className="empty">
                  
                  <div className="empty-title">{search ? `No results for "${search}"` : 'No clips yet'}</div>
                  <div className="empty-sub">{search ? 'Try a different search term' : 'Press New to create your first clip.'}</div>
                  {!search && (
                    <button onClick={handleAdd} style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)', color: '#fff', border: 'none', borderRadius: 5, fontSize: 13, fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer' }}>
                      <PlusIcon /> New clip
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {displayed.map((item, i) => (
                    <QuillBlock
                      key={item.id} item={item} index={i}
                      onSave={u => saveItem(item.id, u)}
                      onPin={() => togglePin(item)}
                      onArchive={() => archiveItem(item)}
                      onAskAI={(question, withCtx) => {
                      if (withCtx !== false) toggleSelect(item.id)
                      openAI(question, withCtx)
                    }}
                      isNew={newBlockId === item.id}
                      selected={selectedIds.has(item.id)}
                      onToggleSelect={() => toggleSelect(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        {showAI && (
          <div
            className="split-divider"
            onMouseDown={onDividerMouseDown}
          />
        )}

        {/* Right: chat pane */}
        {showAI && (
          <div className="ws-right" style={{ flex: 1 }}>
            <OscilChat
              selectedItems={selectedItems}
              allItems={items}
              projectId={projectId}
              prefillQuestion={prefillQuestion}
              onPrefillConsumed={() => setPrefillQuestion(undefined)}
              onClose={() => { setShowAI(false); setSelectedIds(new Set()) }}
            />
          </div>
        )}
      </div>

}

      {/* ── Content (split pane when AI open) ── */}
      
      <div className="ws-fab">
        <button
          onClick={() => showAI ? setShowAI(false) : openAI()}
          className="fab-btn"
          style={{
            background: showAI ? 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)' : 'rgba(55,53,47,0.08)',
            color: showAI ? '#fff' : 'rgba(55,53,47,0.7)',
            boxShadow: showAI ? '0 2px 8px rgba(15,15,15,0.15)' : 'none',
          }}
        >
          <svg width="12" height="7" viewBox="0 0 24 14" fill="none"><path d="M0 7 C3 3 5 3 7 7 S11 11 13 7 S17 3 19 7 L24 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/></svg>
          {showAI ? 'Close' : 'Ask AI'}
        </button>
        <button className="fab-add" onClick={handleAdd} title="New clip">+</button>
      </div>
    </div>
  )
}