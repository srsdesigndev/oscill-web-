'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Item } from './types'

const CHAT_URL = 'https://ezadruidbklbzlgycwzs.supabase.co/functions/v1/oscil-chat'

interface HistoryMessage { role: 'user' | 'assistant'; content: string }
interface ChatMessage    { role: 'user' | 'ai'; text: string; id: string }

// Snapshot of context sent to AI — used for diffing
interface ContextSnapshot { id: string; content: string; label: string }

export interface ChatTab {
  id: string
  label: string
  messages: ChatMessage[]
  history: HistoryMessage[]
  input: string
  loading: boolean
  sessionId: string | null
  saved: boolean
  lastSnapshot: ContextSnapshot[]  // what was sent last time
}

export function makeTab(n: number): ChatTab {
  return { id: crypto.randomUUID(), label: `Chat ${n}`, messages: [], history: [], input: '', loading: false, sessionId: null, saved: false, lastSnapshot: [] }
}

function stripHtml(html: string) { return html.replace(/<[^>]+>/g, '').trim() }
function snap(items: Item[]): ContextSnapshot[] {
  return items.map(i => ({ id: i.id, label: i.label || 'Untitled', content: stripHtml(i.content || '') }))
}

/** Build a context diff string to send to AI */
function buildContextBlock(current: ContextSnapshot[], last: ContextSnapshot[]): string | null {
  if (current.length === 0) return null

  const lastMap = new Map(last.map(s => [s.id, s]))
  const lines: string[] = []

  // First message — send everything
  if (last.length === 0) {
    lines.push('The user has provided the following clips as context:\n')
    current.forEach(s => { lines.push(`[${s.label}]\n${s.content || '(empty)'}`) })
    return lines.join('\n\n---\n\n')
  }

  // Subsequent messages — only send changes
  const added:   ContextSnapshot[] = []
  const changed: ContextSnapshot[] = []
  const removedIds: string[] = []

  current.forEach(s => {
    const prev = lastMap.get(s.id)
    if (!prev) { added.push(s) }
    else if (prev.content !== s.content || prev.label !== s.label) { changed.push(s) }
  })

  const currentIds = new Set(current.map(s => s.id))
  last.forEach(s => { if (!currentIds.has(s.id)) removedIds.push(s.label) })

  if (added.length === 0 && changed.length === 0 && removedIds.length === 0) return null

  if (added.length)    { lines.push(`New clips added:\n${added.map(s => `[${s.label}]\n${s.content || '(empty)'}`).join('\n\n---\n\n')}`) }
  if (changed.length)  { lines.push(`Updated clips:\n${changed.map(s => `[${s.label}]\n${s.content || '(empty)'}`).join('\n\n---\n\n')}`) }
  if (removedIds.length) { lines.push(`Clips removed from context: ${removedIds.join(', ')}`) }

  return lines.join('\n\n')
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const PageIcon = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)

// ── Markdown ──────────────────────────────────────────────────────────────────
function Markdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  function parseInline(s: string): React.ReactNode[] {
    const parts: React.ReactNode[] = []; let buf = ''; let j = 0
    while (j < s.length) {
      if (s[j] === '*' && s[j+1] === '*') {
        const end = s.indexOf('**', j+2)
        if (end !== -1) { if (buf) { parts.push(buf); buf = '' }
          parts.push(<strong key={j} style={{ fontWeight: 600, color: '#37352f' }}>{s.slice(j+2, end)}</strong>); j = end+2; continue }
      }
      if (s[j] === '*' && s[j+1] !== '*') {
        const end = s.indexOf('*', j+1)
        if (end !== -1) { if (buf) { parts.push(buf); buf = '' }
          parts.push(<em key={j} style={{ fontStyle: 'italic', color: 'rgba(55,53,47,0.75)' }}>{s.slice(j+1, end)}</em>); j = end+1; continue }
      }
      if (s[j] === '`') {
        const end = s.indexOf('`', j+1)
        if (end !== -1) { if (buf) { parts.push(buf); buf = '' }
          parts.push(<code key={j} style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, background: 'rgba(55,53,47,0.06)', color: '#37352f', padding: '1px 5px', borderRadius: 3 }}>{s.slice(j+1, end)}</code>); j = end+1; continue }
      }
      buf += s[j]; j++
    }
    if (buf) parts.push(<span key="t">{buf}</span>)
    return parts
  }

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') { elements.push(<div key={`e-${i}`} style={{ height: 6 }} />); i++; continue }
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim(); const codeLines: string[] = []; i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      elements.push(
        <div key={`code-${i}`} style={{ margin: '8px 0', borderRadius: 5, overflow: 'hidden', border: '1px solid #e9e9e7' }}>
          {lang && <div style={{ padding: '3px 10px', background: '#f7f6f3', fontSize: 10, color: 'rgba(55,53,47,0.55)', fontFamily: 'ui-monospace,monospace', fontWeight: 500, borderBottom: '1px solid #e9e9e7' }}>{lang}</div>}
          <pre style={{ margin: 0, padding: '10px 12px', background: '#f7f6f3', color: '#37352f', fontFamily: 'ui-monospace,monospace', fontSize: 11, lineHeight: 1.7, overflowX: 'auto' }}><code>{codeLines.join('\n')}</code></pre>
        </div>
      ); i++; continue
    }
    const h2 = line.match(/^## (.+)/); const h3 = line.match(/^### (.+)/)
    if (h2) { elements.push(<p key={`h2-${i}`} style={{ fontSize: 13, fontWeight: 600, color: '#37352f', margin: '12px 0 3px' }}>{parseInline(h2[1])}</p>); i++; continue }
    if (h3) { elements.push(<p key={`h3-${i}`} style={{ fontSize: 12, fontWeight: 600, color: 'rgba(55,53,47,0.75)', margin: '8px 0 2px' }}>{parseInline(h3[1])}</p>); i++; continue }
    if (line.match(/^---+$/)) { elements.push(<hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid #e9e9e7', margin: '10px 0' }} />); i++; continue }
    if (line.startsWith('> ')) {
      elements.push(<div key={`q-${i}`} style={{ borderLeft: '2px solid #e9e9e7', padding: '4px 0 4px 10px', margin: '6px 0', color: 'rgba(55,53,47,0.6)', fontSize: 12.5 }}>{parseInline(line.slice(2))}</div>)
      i++; continue
    }
    if (line.match(/^[-*] /)) {
      const items2: string[] = []; const si = i
      while (i < lines.length && lines[i].match(/^[-*] /)) { items2.push(lines[i].slice(2)); i++ }
      elements.push(
        <ul key={`ul-${si}`} style={{ margin: '4px 0', paddingLeft: 0, listStyle: 'none' }}>
          {items2.map((it, idx) => (
            <li key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.6, marginBottom: 2, color: '#37352f' }}>
              <span style={{ color: 'rgba(55,53,47,0.4)', flexShrink: 0, marginTop: 1 }}>•</span>
              <span style={{ flex: 1 }}>{parseInline(it)}</span>
            </li>
          ))}
        </ul>
      ); continue
    }
    elements.push(<p key={`p-${i}`} style={{ margin: '2px 0', fontSize: 13, lineHeight: 1.65, color: '#37352f' }}>{parseInline(line)}</p>)
    i++
  }
  return <div style={{ fontFamily: 'Inter, sans-serif' }}>{elements}</div>
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: 4, fontSize: 11, color: copied ? '#10b981' : 'rgba(55,53,47,0.35)', fontFamily: 'Inter, sans-serif', transition: 'color 0.15s', display: 'flex', alignItems: 'center', gap: 3 }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.background = 'rgba(55,53,47,0.06)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >{copied ? '✓ copied' : '⎘ copy'}</button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function OscilChat({
  selectedItems, allItems, projectId, onClose, prefillQuestion, onPrefillConsumed,
}: {
  selectedItems: Item[]
  allItems: Item[]
  projectId: string
  onClose: () => void
  prefillQuestion?: string
  onPrefillConsumed?: () => void
}) {
  const supabase = createClient()
  const [tabs, setTabs]           = useState<ChatTab[]>([makeTab(1)])
  const [activeTab, setActiveTab] = useState(0)
  const [savingTab, setSavingTab] = useState(false)
  const [saveFlash, setSaveFlash] = useState(false)
  const messagesEndRef            = useRef<HTMLDivElement>(null)

  const tab = tabs[activeTab]

  // When a prefill question arrives (from !ask command), populate the active tab input
  // and auto-send after a short tick so context is ready
  useEffect(() => {
    if (!prefillQuestion) return
    updateTab(tabs[activeTab].id, { input: prefillQuestion })
    // Auto-send on next tick
    const t = setTimeout(() => {
      sendMessageWith(prefillQuestion)
      onPrefillConsumed?.()
    }, 120)
    return () => clearTimeout(t)
  }, [prefillQuestion]) // eslint-disable-line

  function updateTab(id: string, patch: Partial<ChatTab>) {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
  }
  function addTab() { const next = makeTab(tabs.length + 1); setTabs(prev => [...prev, next]); setActiveTab(tabs.length) }
  function closeTab(idx: number) {
    if (tabs.length === 1) { onClose(); return }
    const next = tabs.filter((_, i) => i !== idx)
    setTabs(next); setActiveTab(Math.min(activeTab, next.length - 1))
  }

  async function sendMessageWith(override?: string) {
    return sendMessageCore(override)
  }
  async function sendMessage() { return sendMessageCore() }
  async function sendMessageCore(override?: string) {
    const text = (override ?? tab.input).trim()
    if (!text || tab.loading) return

    const currentSnap = snap(selectedItems)
    const contextBlock = buildContextBlock(currentSnap, tab.lastSnapshot)

    const userMsg: ChatMessage = { role: 'user', text, id: crypto.randomUUID() }
    const optimistic = [...tab.messages, userMsg]

    // Build system prompt only on first message; diffs are injected inline after
    let system: string | undefined
    if (tab.lastSnapshot.length === 0 && selectedItems.length > 0) {
      system = `You are a research and note-taking assistant. Help the user analyse, synthesise and reason about their saved clips. Be concise and insightful.`
    }

    // Inject context diff as a preceding user-side note if there are changes
    const messageToSend = contextBlock
      ? `[Context update]\n${contextBlock}\n\n---\n\n${text}`
      : text

    updateTab(tab.id, { input: '', messages: optimistic, loading: true, lastSnapshot: currentSnap })

    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ message: messageToSend, history: tab.history, ...(system ? { system } : {}) }),
      })
      const data = await res.json()
      if (!res.ok) {
        updateTab(tab.id, { messages: [...optimistic, { role: 'ai', text: `Error: ${data.error || 'Something went wrong'}`, id: crypto.randomUUID() }], loading: false })
        return
      }
      updateTab(tab.id, { messages: [...optimistic, { role: 'ai', text: data.reply, id: crypto.randomUUID() }], history: data.history, loading: false })
    } catch {
      updateTab(tab.id, { messages: [...optimistic, { role: 'ai', text: 'Network error — please try again.', id: crypto.randomUUID() }], loading: false })
    }
  }

  async function saveChat() {
    if (tab.messages.length === 0 || savingTab) return
    setSavingTab(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const title = tab.messages.find(m => m.role === 'user')?.text.slice(0, 60) || 'Chat'
      const now = new Date().toISOString()
      let sessionId = tab.sessionId
      if (!sessionId) {
        const { data: session, error } = await supabase.from('chat_sessions').insert({ user_id: user.id, project_id: projectId, title, saved_at: now }).select().single()
        if (error || !session) return
        sessionId = session.id
      } else {
        await supabase.from('chat_sessions').update({ saved_at: now }).eq('id', sessionId)
        await supabase.from('chat_messages').delete().eq('session_id', sessionId)
      }
      await supabase.from('chat_messages').insert(tab.messages.map(m => ({ session_id: sessionId, role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })))
      updateTab(tab.id, { sessionId, saved: true, label: title.slice(0, 20) || tab.label })
      setSaveFlash(true); setTimeout(() => setSaveFlash(false), 2000)
    } finally { setSavingTab(false) }
  }

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [tab.messages])

  return (
    <>
      <style>{`
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40%            { transform: translateY(-3px); opacity: 1; }
        }
        .chat-textarea { font-family: 'Inter', sans-serif !important; }
        .chat-textarea::placeholder { color: rgba(55,53,47,0.3); }
        .chat-textarea:focus { outline: none; }
        .chat-tab-btn { transition: background 0.1s; }
        .chat-tab-btn:hover { background: rgba(55,53,47,0.06) !important; }
      `}</style>

      {/* Panel — fills the right pane, no floating card */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Inter, -apple-system, sans-serif' }}>

        {/* Header */}
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 14px', borderBottom: '1px solid #e9e9e7', background: '#fafafa', flexShrink: 0, gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700, background: "linear-gradient(135deg, #6B8DF5, #7B5CE6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✦</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#37352f' }}>Ask AI</span>

          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 8, flex: 1 }}>
            {tabs.map((t, i) => (
              <button key={t.id} onClick={() => setActiveTab(i)} className="chat-tab-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px',
                  borderRadius: 5, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                  fontWeight: i === activeTab ? 500 : 400,
                  color: i === activeTab ? '#37352f' : 'rgba(55,53,47,0.45)',
                  background: i === activeTab ? '#fff' : 'transparent',
                  boxShadow: i === activeTab ? '0 1px 3px rgba(15,15,15,0.1)' : 'none',
                }}>
                {t.saved && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />}
                <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.label}</span>
                <span onClick={e => { e.stopPropagation(); closeTab(i) }} style={{ color: 'rgba(55,53,47,0.3)', fontSize: 10, cursor: 'pointer', padding: '0 1px' }}>✕</span>
              </button>
            ))}
            <button onClick={addTab} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(55,53,47,0.4)', fontSize: 15, padding: '0 4px', fontFamily: 'inherit' }}>+</button>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(55,53,47,0.35)', fontSize: 12, padding: '2px 4px', borderRadius: 4, fontFamily: 'inherit', transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(55,53,47,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >✕</button>
        </div>

        {/* Context strip — shows what's selected */}
        {selectedItems.length > 0 && (
          <div style={{ padding: '6px 14px', borderBottom: '1px solid #e9e9e7', background: '#fff', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'rgba(55,53,47,0.4)', fontWeight: 500, flexShrink: 0 }}>Context:</span>
            {selectedItems.slice(0, 5).map(item => (
              <span key={item.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: '#37352f', background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 4, padding: '2px 7px' }}>
                <PageIcon />{item.label || 'Untitled'}
              </span>
            ))}
            {selectedItems.length > 5 && <span style={{ fontSize: 11, color: 'rgba(55,53,47,0.4)' }}>+{selectedItems.length - 5} more</span>}
            {/* Show diff indicator if context changed since last send */}
            {tab.lastSnapshot.length > 0 && snap(selectedItems).some(s => {
              const prev = tab.lastSnapshot.find(p => p.id === s.id)
              return !prev || prev.content !== s.content
            }) && (
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#F0B400', fontWeight: 500 }}>● changes not yet sent</span>
            )}
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tab.messages.length === 0 && (
            <div style={{ margin: 'auto', textAlign: 'center', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 700, background: "linear-gradient(135deg, #6B8DF5, #7B5CE6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✦</span>
              <p style={{ fontSize: 14, margin: 0, fontWeight: 500, color: '#37352f' }}>Ask AI</p>
              <p style={{ fontSize: 12.5, margin: 0, color: 'rgba(55,53,47,0.4)', lineHeight: 1.6 }}>
                {selectedItems.length > 0
                  ? `${selectedItems.length} clip${selectedItems.length > 1 ? 's' : ''} selected as context — start chatting`
                  : 'Select clips from the left panel to add context, then ask anything.'}
              </p>
            </div>
          )}

          {tab.messages.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 3 }}>
              {m.role === 'user' ? (
                <div style={{ maxWidth: '80%', padding: '8px 12px', fontSize: 13, lineHeight: 1.6, borderRadius: '8px 8px 2px 8px', background: '#37352f', color: '#fff' }}>
                  {m.text}
                </div>
              ) : (
                <>
                  <div style={{ maxWidth: '95%', padding: '10px 12px', borderRadius: '2px 8px 8px 8px', background: '#f7f6f3', border: '1px solid #e9e9e7' }}>
                    <Markdown text={m.text} />
                  </div>
                  <CopyButton text={m.text} />
                </>
              )}
            </div>
          ))}

          {tab.loading && (
            <div style={{ display: 'flex' }}>
              <div style={{ padding: '10px 14px', borderRadius: '2px 8px 8px 8px', background: '#f7f6f3', border: '1px solid #e9e9e7', display: 'flex', alignItems: 'center', gap: 4 }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(55,53,47,0.3)', display: 'block', animation: 'dot-bounce 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '8px 12px 12px', borderTop: '1px solid #e9e9e7', flexShrink: 0, background: '#fff' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, border: '1px solid #e9e9e7', borderRadius: 6, background: tab.loading ? '#f7f6f3' : '#fff', transition: 'border-color 0.15s, box-shadow 0.15s', overflow: 'hidden' }}
              onFocusCapture={e => { e.currentTarget.style.borderColor = 'rgba(55,53,47,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(55,53,47,0.06)' }}
              onBlurCapture={e => { e.currentTarget.style.borderColor = '#e9e9e7'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <textarea
                className="chat-textarea"
                value={tab.input}
                onChange={e => updateTab(tab.id, { input: e.target.value })}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder={selectedItems.length > 0 ? `Ask about ${selectedItems.length} clip${selectedItems.length > 1 ? 's' : ''}… ↵ to send` : 'Ask anything — ↵ to send'}
                disabled={tab.loading}
                rows={1}
                style={{ flex: 1, border: 'none', padding: '9px 10px', fontSize: 13, resize: 'none', color: '#37352f', background: 'transparent', lineHeight: 1.5, width: '100%', opacity: tab.loading ? 0.5 : 1 }}
              />
            </div>

            {/* Save */}
            <button onClick={saveChat} disabled={savingTab || tab.messages.length === 0} title="Save chat"
              style={{ width: 34, height: 34, borderRadius: 6, border: '1px solid #e9e9e7', flexShrink: 0, background: saveFlash ? 'rgba(16,185,129,0.06)' : '#f7f6f3', color: saveFlash || tab.saved ? '#10b981' : 'rgba(55,53,47,0.4)', cursor: tab.messages.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, transition: 'all 0.15s', opacity: tab.messages.length === 0 ? 0.4 : 1 }}>
              {savingTab ? '…' : tab.saved ? '✓' : '↓'}
            </button>

            {/* Send */}
            <button onClick={sendMessage} disabled={tab.loading || !tab.input.trim()}
              style={{ width: 34, height: 34, borderRadius: 6, border: 'none', flexShrink: 0, background: (tab.loading || !tab.input.trim()) ? '#f7f6f3' : 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)', color: (tab.loading || !tab.input.trim()) ? 'rgba(55,53,47,0.3)' : '#fff', cursor: (tab.loading || !tab.input.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, transition: 'all 0.15s' }}
              onMouseEnter={e => { if (!tab.loading && tab.input.trim()) e.currentTarget.style.opacity = '0.8' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >↑</button>
          </div>
        </div>
      </div>
    </>
  )
}