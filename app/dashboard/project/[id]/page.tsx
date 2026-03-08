'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FONT, Item, Project, norm } from './types'
import { GLOBAL_STYLES } from './ui'
import { QuillBlock } from './QuillBlock'
import { OscilChat } from './oscilChat'
import { useAppTheme } from '../../DShared'

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
const RefreshIcon = ({ spinning }: { spinning: boolean }) => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform 0.5s ease', transform: spinning ? 'rotate(360deg)' : 'rotate(0deg)' }}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient()
  const router   = useRouter()
  const { t }    = useAppTheme()

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

  const [splitPct, setSplitPct] = useState(55)
  const dragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { params.then(p => setProjectId(p.id)) }, [params])
  useEffect(() => {
    if (!projectId) return
    initialLoadDone.current = false
    setLoading(false)
    setItems([])
    setProject(null)
    load()
  }, [projectId]) // eslint-disable-line

  const load = useCallback(async (silent = false) => {
    const isFirst = !initialLoadDone.current
    if (!silent && isFirst) setLoading(true)

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
  }

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
    <div className="h-screen flex flex-col overflow-hidden text-sm" style={{ color: t.fg, background: t.bg }}>
      <style>{`
        .icon-btn { width: 26px; height: 26px; border-radius: 5px; border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: ${t.iconBtnFg}; flex-shrink: 0; transition: background 0.1s, color 0.1s; }
        .icon-btn:hover { background: ${t.iconBtnHoverBg}; color: ${t.fg}; }
        .split-divider { width: 1px; background: ${t.border}; flex-shrink: 0; cursor: col-resize; position: relative; transition: background 0.15s; }
        .split-divider:hover, .split-divider.dragging { background: #6C63FF; }
        .split-divider::after { content: ''; position: absolute; top: 0; left: -4px; right: -4px; bottom: 0; }
        .skeleton { background: linear-gradient(90deg, ${t.border} 25%, ${t.surfaceBg} 50%, ${t.border} 75%); background-size: 600px 100%; animation: shimmer 1.4s ease infinite; border-radius: 4px; }
        @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
        ${GLOBAL_STYLES}
      `}</style>

      <div ref={containerRef} className="flex flex-1 overflow-hidden">

        {/* Left: clips */}
        <div
          className="flex flex-col h-screen overflow-hidden min-w-0"
          style={{ width: showAI ? `${splitPct}%` : '100%', transition: dragging.current ? 'none' : 'width 0.2s ease' }}
        >
          {/* Topbar */}
          <div className="h-[44px] flex items-center px-4 gap-1.5 flex-shrink-0 sticky top-0 z-10" style={{ borderBottom: `1px solid ${t.border}`, background: t.bg }}>
            <div className="flex items-center gap-1.5 flex-1 text-[13.5px]" style={{ color: t.fgMid }}>
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none" style={{ opacity: 0.5 }}><path d="M6.5 1L1 4.8V12h4V8.5h3V12h4V4.8L6.5 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>
              <ChevronRight />
              <Link href="/dashboard" className="transition-colors hover:no-underline" style={{ color: t.fgMid, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = t.fg)}
                onMouseLeave={e => (e.currentTarget.style.color = t.fgMid)}
              >Projects</Link>
              <ChevronRight />
              <span className="font-medium" style={{ color: t.fg }}>{project?.title}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <button className="icon-btn" onClick={handleRefresh} disabled={refreshing} title="Refresh" style={{ width: 28, height: 28 }}>
                <RefreshIcon spinning={refreshing} />
              </button>
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-[5px] text-[12.5px] font-medium text-white border-none font-[inherit] cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)' }}
              >
                <PlusIcon /> New
              </button>
            </div>
          </div>

          {/* Page header */}
          <div className="px-12 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${t.border}` }}>
            <h1 className="text-sm font-semibold m-0" style={{ color: t.fg }}>{project?.title}</h1>
            {project?.description && <p className="text-xs mt-0.5 mb-0" style={{ color: t.fgLow }}>{project.description}</p>}
          </div>

          {/* Selection / meta bar */}
          {selectedIds.size > 0 ? (
            <div className="flex items-center gap-2 px-12 h-[38px] flex-shrink-0" style={{ borderBottom: `1px solid ${t.border}`, background: 'rgba(108,99,255,0.04)' }}>
              <span className="text-xs font-medium" style={{ color: '#6C63FF' }}>{selectedIds.size} selected</span>
              <button
                onClick={() => openAI()}
                className="flex items-center gap-1.5 px-2.5 py-[3px] rounded text-xs font-medium text-white border-none font-[inherit] cursor-pointer"
                style={{ background: '#6C63FF' }}
              >
                <svg width="10" height="6" viewBox="0 0 24 14" fill="none"><path d="M0 7 C3 3 5 3 7 7 S11 11 13 7 S17 3 19 7 L24 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/></svg>
                Ask Oscil AI
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="text-[11px] px-1.5 py-0.5 rounded border-none bg-transparent font-[inherit] cursor-pointer" style={{ color: t.fgLow }}>Clear</button>
              <span className="ml-auto text-xs" style={{ color: t.fgLow }}>{items.length} clip{items.length !== 1 ? 's' : ''} total</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-12 py-2 flex-shrink-0" style={{ borderBottom: `1px solid ${t.border}` }}>
              <span className="text-xs" style={{ color: t.fgLow }}>{items.length} clip{items.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Clips body */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-12 pt-6 pb-20 max-[900px]:px-6">
              {loading ? (
                <div className="flex flex-col gap-2 pt-2">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="flex items-center gap-2 py-1.5">
                      <div className="skeleton shrink-0" style={{ width: 14, height: 14, borderRadius: 3 }} />
                      <div className="skeleton shrink-0" style={{ width: 14, height: 14, borderRadius: 3 }} />
                      <div className="skeleton" style={{ height: 13, width: `${140 + (n * 37) % 160}px` }} />
                    </div>
                  ))}
                </div>
              ) : displayed.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center gap-2.5 py-20">
                  <div className="text-[15px] font-medium" style={{ color: t.fgMid }}>{search ? `No results for "${search}"` : 'No clips yet'}</div>
                  <div className="text-[13px]" style={{ color: t.fgLow }}>{search ? 'Try a different search term' : 'Press New to create your first clip.'}</div>
                  {!search && (
                    <button
                      onClick={handleAdd}
                      className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[5px] text-[13px] font-medium text-white border-none font-[inherit] cursor-pointer"
                      style={{ background: 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)' }}
                    >
                      <PlusIcon /> New clip
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-px">
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
          <div className="split-divider" onMouseDown={onDividerMouseDown} />
        )}

        {/* Right: chat pane */}
        {showAI && (
          <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-[320px]" style={{ background: t.bg }}>
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

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-40 flex gap-2 items-center">
        <button
          onClick={() => showAI ? setShowAI(false) : openAI()}
          className="h-9 px-3.5 rounded-md border-none text-[13px] font-medium font-[inherit] flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80"
          style={{
            background: showAI ? 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)' : t.sidebarItemHoverBg,
            color: showAI ? '#fff' : t.fgMid,
            boxShadow: showAI ? '0 2px 8px rgba(15,15,15,0.15)' : 'none',
          }}
        >
          <svg width="12" height="7" viewBox="0 0 24 14" fill="none"><path d="M0 7 C3 3 5 3 7 7 S11 11 13 7 S17 3 19 7 L24 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/></svg>
          {showAI ? 'Close' : 'Ask AI'}
        </button>
        <button
          onClick={handleAdd}
          title="New clip"
          className="w-9 h-9 rounded-md flex items-center justify-center text-lg font-light cursor-pointer transition-colors font-[inherit]"
          style={{ border: `1px solid ${t.border}`, background: t.bg, color: t.fgMid, boxShadow: t.shadow }}
          onMouseEnter={e => (e.currentTarget.style.background = t.sidebarItemHoverBg)}
          onMouseLeave={e => (e.currentTarget.style.background = t.bg)}
        >+</button>
      </div>
    </div>
  )
}