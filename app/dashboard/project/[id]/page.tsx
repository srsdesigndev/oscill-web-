'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FONT, Item, Project, norm } from './types'
import { OscilMark, GLOBAL_STYLES } from './ui'
import { QuillBlock } from './QuillBlock'
import { OscilChat } from './oscilChat'

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient()
  const router = useRouter()

  const [projectId, setProjectId] = useState('')
  const [project, setProject] = useState<Project | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showAI, setShowAI] = useState(false)
  const [newBlockId, setNewBlockId] = useState<string | null>(null)

  useEffect(() => { params.then(p => setProjectId(p.id)) }, [params])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (projectId) load() }, [projectId])

  async function load() {
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
    setLoading(false)
  }

  async function saveItem(id: string, updates: Partial<Item>) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))
    await supabase.from('clips').update({
      page_title: updates.label ?? null,
      note: updates.content ?? null,
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
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const displayed = items.filter(i => {
    if (!search) return true
    const q = search.toLowerCase()
    return [(i.label || ''), (i.content || '')].some(s => s.toLowerCase().includes(q))
  })

  const selectedItems = items.filter(i => selectedIds.has(i.id))

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: FONT }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #e4e4e7', borderTopColor: '#18181b', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ fontFamily: FONT, background: '#f7f7f5' }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── Header ── */}
      <header className="h-[50px] shrink-0 flex items-center px-5 z-20 border-b border-zinc-200"
        style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)' }}>
        <Link href="/dashboard" className="no-underline flex items-center gap-2 text-zinc-900">
          <OscilMark />
          <span className="text-[11px] font-extrabold tracking-[5px]">OSCIL</span>
        </Link>
        <div className="w-px h-4 bg-zinc-200 mx-4" />
        <Link href="/dashboard" className="text-[12px] text-zinc-400 no-underline font-medium">Projects</Link>
        <span className="text-zinc-300 text-[12px] mx-1.5">/</span>
        <span className="text-[12px] text-zinc-900 font-semibold">{project?.title}</span>

        <div className="ml-auto flex items-center gap-2.5">
          {selectedIds.size > 0 && (
            <span className="text-[11px] text-gray-500 bg-gray-100 border border-gray-200 rounded-[5px] px-2 py-0.5 font-medium">
              {selectedIds.size} selected
            </span>
          )}
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-[12px] pointer-events-none">⌕</span>
            <input
              type="text" placeholder="Search..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-6 pr-2.5 py-1.5 bg-zinc-100 border-[1.5px] border-transparent rounded-full text-[12px] text-zinc-900 outline-none w-[130px] focus:border-zinc-400 focus:bg-white transition-all"
              style={{ fontFamily: FONT }}
            />
          </div>
          <span className="text-[11px] text-zinc-400 font-semibold">{items.length}</span>
        </div>
      </header>

      {/* ── Grid ── */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-2.5 mt-20">
            <OscilMark size={22} />
            <p className="text-[13px] font-semibold text-zinc-400 m-0">
              {search ? `No results for "${search}"` : 'No notes yet'}
            </p>
            <p className="text-[12px] text-zinc-300 m-0">Press + to create your first note</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {displayed.map(item => (
              <QuillBlock
                key={item.id}
                item={item}
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

      {/* ── FAB Left — Add entry ── */}
      <button
        onClick={handleAdd}
        title="New entry"
        style={{
          position: 'fixed', bottom: 24, left: 24, zIndex: 40,
          width: 44, height: 44, borderRadius: '50%',
          border: '1.5px solid #e4e4e7', background: '#fff', color: '#18181b',
          fontSize: 22, fontWeight: 300, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          transition: 'box-shadow 0.15s, transform 0.15s', fontFamily: FONT, lineHeight: 1,
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'scale(1.07)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'scale(1)' }}
      >+</button>

      {/* ── FAB Right — Oscil AI (minimised) ── */}
      {!showAI && (
        <button
          onClick={() => setShowAI(true)}
          title="Oscil AI"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 40,
            height: 44, padding: '0 18px', borderRadius: 22,
            border: 'none', background: '#18181b', color: '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            transition: 'box-shadow 0.15s, transform 0.15s', fontFamily: FONT,
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.26)'; e.currentTarget.style.transform = 'scale(1.04)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.18)'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          <svg width={11} height={7} viewBox="0 0 20 13" fill="none">
            <path d="M0 6.5 C2 3 3.8 3 5.5 6.5 S9.5 10 11.5 6.5 S15.5 3 17.5 6.5 L20 4.5"
              stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
          Oscil AI
          {selectedIds.size > 0 && (
            <span style={{
              background: 'rgba(255,255,255,0.15)', borderRadius: 5,
              padding: '1px 7px', fontSize: 10, fontWeight: 700,
            }}>
              {selectedIds.size}
            </span>
          )}
        </button>
      )}

      {/* ── AI Chat Panel ── */}
      {showAI && (
        <OscilChat
          selectedItems={selectedItems}
          projectId={projectId}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  )
}