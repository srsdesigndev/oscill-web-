'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FONT, Item } from './types'

const CHAT_URL = 'https://ezadruidbklbzlgycwzs.supabase.co/functions/v1/oscil-chat'

// ─── Vibrant palette ──────────────────────────────────────────────────────────
const C = {
  orange: '#FB7B00',
  orangeLight: '#fff4e6',
  red: '#E3373D',
  redLight: '#fff0f0',
  indigo: '#6366f1',
}

interface HistoryMessage { role: 'user' | 'assistant'; content: string }
interface ChatMessage { role: 'user' | 'ai'; text: string; id: string }

export interface ChatTab {
  id: string
  label: string
  messages: ChatMessage[]
  history: HistoryMessage[]
  input: string
  loading: boolean
  sessionId: string | null
  saved: boolean
}

export function makeTab(n: number): ChatTab {
  return { id: crypto.randomUUID(), label: `Chat ${n}`, messages: [], history: [], input: '', loading: false, sessionId: null, saved: false }
}



function Markdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  function parseInline(s: string): React.ReactNode[] {
    const parts: React.ReactNode[] = []
    let buf = ''; let j = 0
    while (j < s.length) {
      if (s[j] === '*' && s[j+1] === '*') {
        const end = s.indexOf('**', j+2)
        if (end !== -1) { if (buf) { parts.push(buf); buf = '' }; parts.push(<strong key={j} style={{ fontWeight: 700, color: '#0f172a' }}>{s.slice(j+2, end)}</strong>); j = end+2; continue }
      }
      if (s[j] === '*' && s[j+1] !== '*') {
        const end = s.indexOf('*', j+1)
        if (end !== -1) { if (buf) { parts.push(buf); buf = '' }; parts.push(<em key={j} style={{ fontStyle: 'italic', color: '#334155' }}>{s.slice(j+1, end)}</em>); j = end+1; continue }
      }
      if (s[j] === '`') {
        const end = s.indexOf('`', j+1)
        if (end !== -1) { if (buf) { parts.push(buf); buf = '' }; parts.push(<code key={j} style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, background: '#f1f5f9', color: '#0f172a', padding: '1px 5px', borderRadius: 4, border: '1px solid #e2e8f0' }}>{s.slice(j+1, end)}</code>); j = end+1; continue }
      }
      if (s[j] === '[') {
        const mid = s.indexOf('](', j); const end = mid !== -1 ? s.indexOf(')', mid) : -1
        if (mid !== -1 && end !== -1) { if (buf) { parts.push(buf); buf = '' }; parts.push(<a key={j} href={s.slice(mid+2, end)} target="_blank" rel="noopener noreferrer" style={{ color: C.indigo, textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: 500 }}>{s.slice(j+1, mid)}</a>); j = end+1; continue }
      }
      buf += s[j]; j++
    }
    if (buf) parts.push(<span key="text" style={{ color: '#1e293b' }}>{buf}</span>)
    return parts
  }

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') { 
      elements.push(<div key={`empty-${i}`} style={{ height: 8 }} />); 
      i++; 
      continue 
    }
    
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim(); 
      const codeLines: string[] = []; 
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { 
        codeLines.push(lines[i]); 
        i++ 
      }
      elements.push(
        <div key={`code-${i}`} style={{ margin: '12px 0', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {lang && <div style={{ padding: '4px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 10, color: '#64748b', fontFamily: 'ui-monospace,monospace', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{lang}</div>}
          <pre style={{ margin: 0, padding: '12px 14px', background: '#0f172a', color: '#e2e8f0', fontFamily: 'ui-monospace,monospace', fontSize: 11, lineHeight: 1.7, overflowX: 'auto' }}><code>{codeLines.join('\n')}</code></pre>
        </div>
      ); 
      i++; 
      continue
    }
    
    const h1 = line.match(/^# (.+)/); 
    const h2 = line.match(/^## (.+)/); 
    const h3 = line.match(/^### (.+)/)
    
    if (h1) { 
      elements.push(<p key={`h1-${i}`} style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '16px 0 6px', lineHeight: 1.3, letterSpacing: '-0.01em' }}>{parseInline(h1[1])}</p>); 
      i++; 
      continue 
    }
    
    if (h2) { 
      elements.push(<p key={`h2-${i}`} style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '14px 0 5px', lineHeight: 1.3 }}>{parseInline(h2[1])}</p>); 
      i++; 
      continue 
    }
    
    if (h3) { 
      elements.push(<p key={`h3-${i}`} style={{ fontSize: 13, fontWeight: 700, color: '#334155', margin: '12px 0 4px', lineHeight: 1.3 }}>{parseInline(h3[1])}</p>); 
      i++; 
      continue 
    }
    
    if (line.match(/^---+$/)) { 
      elements.push(<hr key={`hr-${i}`} style={{ border: 'none', borderTop: '2px solid #e2e8f0', margin: '16px 0' }} />); 
      i++; 
      continue 
    }
    
    if (line.startsWith('> ')) { 
      elements.push(<div key={`quote-${i}`} style={{ borderLeft: `4px solid ${C.orange}`, padding: '8px 0 8px 14px', margin: '12px 0', color: '#475569', fontStyle: 'italic', fontSize: 12, background: '#fff8f0', borderRadius: '0 4px 4px 0' }}>{parseInline(line.slice(2))}</div>); 
      i++; 
      continue 
    }
    
    if (line.match(/^[-*] /)) {
      const items: string[] = []
      const startI = i
      while (i < lines.length && lines[i].match(/^[-*] /)) { 
        items.push(lines[i].slice(2)); 
        i++ 
      }
      elements.push(
        <ul key={`ul-${startI}`} style={{ margin: '8px 0 8px 0', paddingLeft: 0, listStyle: 'none' }}>
          {items.map((it, idx) => (
            <li key={idx} style={{ 
              display: 'flex', 
              gap: 10, 
              alignItems: 'flex-start', 
              fontSize: 12, 
              lineHeight: 1.6, 
              marginBottom: 6,
              color: '#1e293b'
            }}>
              <span style={{ 
                color: C.orange, 
                fontWeight: 700, 
                fontSize: 16,
                marginTop: -2,
                flexShrink: 0,
                width: 6,
                display: 'inline-block',
                textAlign: 'center'
              }}>•</span>
              <span style={{ flex: 1 }}>{parseInline(it)}</span>
            </li>
          ))}
        </ul>
      ); 
      continue
    }
    
    if (line.match(/^\d+\. /)) {
      const items: string[] = []
      const startI = i
      while (i < lines.length && lines[i].match(/^\d+\. /)) { 
        items.push(lines[i].replace(/^\d+\. /, '')); 
        i++ 
      }
      elements.push(
        <ol key={`ol-${startI}`} style={{ margin: '8px 0 8px 0', paddingLeft: 0, listStyle: 'none' }}>
          {items.map((it, idx) => (
            <li key={idx} style={{ 
              display: 'flex', 
              gap: 10, 
              alignItems: 'flex-start', 
              fontSize: 12, 
              lineHeight: 1.6, 
              marginBottom: 6,
              color: '#1e293b'
            }}>
              <span style={{ 
                color: C.orange, 
                fontWeight: 700, 
                fontSize: 10,
                marginTop: 2,
                flexShrink: 0,
                minWidth: 18,
                display: 'inline-block'
              }}>{idx+1}.</span>
              <span style={{ flex: 1 }}>{parseInline(it)}</span>
            </li>
          ))}
        </ol>
      ); 
      continue
    }
    
    elements.push(<p key={`p-${i}`} style={{ margin: '4px 0', fontSize: 12, lineHeight: 1.65, color: '#1e293b' }}>{parseInline(line)}</p>)
    i++
  }
  return <div style={{ fontFamily: FONT, color: '#1e293b' }}>{elements}</div>
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button onClick={copy} style={{
      alignSelf: 'flex-start', background: 'none',
      border: `1px solid ${copied ? '#10b981' : '#e4e4e7'}`,
      borderRadius: 6, cursor: 'pointer', padding: '2px 8px',
      fontSize: 10, color: copied ? '#10b981' : '#a1a1aa',
      fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 4,
      transition: 'all 0.15s',
    }}
      onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange } }}
      onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.color = '#a1a1aa' } }}
    >
      {copied ? '✓ copied' : '⎘ copy'}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function OscilChat({
  selectedItems,
  projectId,
  onClose,
}: {
  selectedItems: Item[]
  projectId: string
  onClose: () => void
}) {
  const supabase = createClient()
  const [tabs, setTabs] = useState<ChatTab[]>([makeTab(1)])
  const [activeTab, setActiveTab] = useState(0)
  const [maximised, setMaximised] = useState(false)
  const [savingTab, setSavingTab] = useState(false)
  const [saveFlash, setSaveFlash] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const tab = tabs[activeTab]

  function updateTab(id: string, patch: Partial<ChatTab>) {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
  }

  function addTab() {
    const next = makeTab(tabs.length + 1)
    setTabs(prev => [...prev, next])
    setActiveTab(tabs.length)
  }

  function closeTab(idx: number) {
    if (tabs.length === 1) { onClose(); return }
    const next = tabs.filter((_, i) => i !== idx)
    setTabs(next)
    setActiveTab(Math.min(activeTab, next.length - 1))
  }

  async function sendMessage() {
    const text = tab.input.trim()
    if (!text || tab.loading) return

    const userMsg: ChatMessage = { role: 'user', text, id: crypto.randomUUID() }
    const optimistic = [...tab.messages, userMsg]

    let system: string | undefined
    if (selectedItems.length > 0) {
      const ctx = selectedItems.map(i => `[${i.label || 'Untitled'}]\n${i.content || '(empty)'}`).join('\n\n---\n\n')
      system = `You are Oscil AI, a helpful research and note-taking assistant.\n\nThe user has selected the following notes as context:\n\n${ctx}\n\nUse these notes to inform your responses where relevant.`
    }

    updateTab(tab.id, { input: '', messages: optimistic, loading: true })

    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ message: text, history: tab.history, ...(system ? { system } : {}) }),
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
        const { data: session, error } = await supabase
          .from('chat_sessions').insert({ user_id: user.id, project_id: projectId, title, saved_at: now })
          .select().single()
        if (error || !session) return
        sessionId = session.id
      } else {
        await supabase.from('chat_sessions').update({ saved_at: now }).eq('id', sessionId)
        await supabase.from('chat_messages').delete().eq('session_id', sessionId)
      }

      await supabase.from('chat_messages').insert(
        tab.messages.map(m => ({ session_id: sessionId, role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
      )
      updateTab(tab.id, { sessionId, saved: true, label: title.slice(0, 20) || tab.label })
      setSaveFlash(true)
      setTimeout(() => setSaveFlash(false), 2000)
    } finally {
      setSavingTab(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [tab.messages])

  const panelW = maximised ? 560 : 360
  const panelH = maximised ? 640 : 440

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, width: panelW, height: panelH,
      zIndex: 50, display: 'flex', flexDirection: 'column',
      borderRadius: 14, border: '1.5px solid #e4e4e7', background: '#fff',
      boxShadow: '0 8px 40px rgba(0,0,0,0.13)', overflow: 'hidden',
      transition: 'width 0.2s, height 0.2s', fontFamily: FONT,
    }}>

      {/* ── Tab bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0',
        background: '#fafafa', padding: '0 6px', height: 38, flexShrink: 0, gap: 2, overflowX: 'auto',
      }}>
        {tabs.map((t, i) => (
          <div key={t.id} onClick={() => setActiveTab(i)} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 8px 3px 10px', borderRadius: 6, cursor: 'pointer',
            fontSize: 11, fontWeight: i === activeTab ? 700 : 500,
            color: i === activeTab ? '#18181b' : '#a1a1aa',
            background: i === activeTab ? '#fff' : 'transparent',
            border: i === activeTab ? '1px solid #e4e4e7' : '1px solid transparent',
            whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.1s',
          }}>
            {t.saved && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />}
            {t.loading && <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.orange, display: 'inline-block', flexShrink: 0 }} />}
            <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</span>
            <button onClick={e => { e.stopPropagation(); closeTab(i) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d4d4d8', fontSize: 9, padding: 0, lineHeight: 1 }}>✕</button>
          </div>
        ))}
        <button onClick={addTab}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', fontSize: 16, lineHeight: 1, padding: '0 5px', flexShrink: 0, fontWeight: 300 }}>+</button>
        <div style={{ flex: 1 }} />
        <button onClick={() => setMaximised(m => !m)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', fontSize: 12, padding: '0 4px', flexShrink: 0 }}>
          {maximised ? '⊟' : '⊞'}
        </button>
        <button onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d4d4d8', fontSize: 11, padding: '0 6px 0 2px', flexShrink: 0 }}>✕</button>
      </div>

      {/* ── Selected context strip ── */}
      {selectedItems.length > 0 && (
        <div style={{
          padding: '5px 12px', borderBottom: '1px solid #fecdd3', background: C.redLight,
          display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: C.red, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            {selectedItems.length} selected
          </span>
          {selectedItems.slice(0, 3).map(item => (
            <span key={item.id} style={{
              fontSize: 10, color: C.red, background: '#ffe4e6', borderRadius: 4,
              padding: '1px 7px', fontWeight: 600,
              maxWidth: 110, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}>{item.label || 'Untitled'}</span>
          ))}
          {selectedItems.length > 3 && <span style={{ fontSize: 10, color: C.red, opacity: 0.7 }}>+{selectedItems.length - 3} more</span>}
        </div>
      )}

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tab.messages.length === 0 && (
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <svg width={22} height={14} viewBox="0 0 20 13" fill="none" style={{ marginBottom: 8, opacity: 0.5 }}>
              <path d="M0 6.5 C2 3 3.8 3 5.5 6.5 S9.5 10 11.5 6.5 S15.5 3 17.5 6.5 L20 4.5"
                stroke={C.orange} strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </svg>
            <p style={{ fontSize: 11, margin: 0, fontWeight: 600, color: '#c4c4c4' }}>Ask Oscil AI anything</p>
            {selectedItems.length > 0 && (
              <p style={{ fontSize: 10, margin: '4px 0 0', color: C.red, opacity: 0.7 }}>
                {selectedItems.length} block{selectedItems.length > 1 ? 's' : ''} in context
              </p>
            )}
          </div>
        )}

        {tab.messages.map((m) => (
          <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'user' ? (
              // User bubble — orange
              <div style={{
                maxWidth: '82%', padding: '8px 12px', fontSize: 12, lineHeight: 1.55,
                borderRadius: '12px 12px 2px 12px',
                background: C.orange, color: '#fff', fontWeight: 500,
              }}>
                {m.text}
              </div>
            ) : (
              // AI bubble — clean light with markdown + copy
              <div style={{ maxWidth: '94%', display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{
                  padding: '10px 13px', borderRadius: '12px 12px 12px 2px',
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                }}>
                  <Markdown text={m.text} />
                </div>
                <CopyButton text={m.text} />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {tab.loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '10px 14px', borderRadius: '12px 12px 12px 2px',
              background: '#f8fafc', border: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: '50%', background: C.orange, display: 'block',
                  animation: 'oscil-bounce 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div style={{
        padding: '8px 10px', borderTop: '1px solid #f0f0f0',
        display: 'flex', gap: 6, alignItems: 'flex-end', flexShrink: 0, background: '#fff',
      }}>
        <textarea
          value={tab.input}
          onChange={e => updateTab(tab.id, { input: e.target.value })}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder={tab.loading ? 'Waiting for response...' : 'Ask anything...'}
          disabled={tab.loading}
          rows={1}
          style={{
            flex: 1, border: '1.5px solid #e4e4e7', borderRadius: 8,
            padding: '7px 10px', fontSize: 12, fontFamily: FONT,
            outline: 'none', resize: 'none', color: '#18181b',
            background: '#fafafa', lineHeight: 1.5,
            opacity: tab.loading ? 0.6 : 1,
          }}
          onFocus={e => { if (!tab.loading) { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.background = '#fff' } }}
          onBlur={e => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.background = '#fafafa' }}
        />

        {/* Save button */}
        <button
          onClick={saveChat}
          disabled={savingTab || tab.messages.length === 0}
          title={tab.saved ? 'Chat saved' : 'Save chat'}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: `1.5px solid ${saveFlash ? '#10b981' : tab.saved ? '#d1fae5' : '#e4e4e7'}`,
            background: saveFlash ? '#ecfdf5' : tab.saved ? '#f0fdf4' : '#fff',
            color: saveFlash ? '#10b981' : tab.saved ? '#10b981' : '#a1a1aa',
            cursor: savingTab || tab.messages.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, flexShrink: 0, transition: 'all 0.2s',
            opacity: tab.messages.length === 0 ? 0.4 : 1,
          }}
        >
          {savingTab ? '…' : tab.saved ? '✓' : '↓'}
        </button>

        {/* Send button */}
        <button
          onClick={sendMessage}
          disabled={tab.loading || !tab.input.trim()}
          style={{
            width: 32, height: 32, borderRadius: 8, border: 'none',
            background: tab.loading || !tab.input.trim() ? '#e4e4e7' : C.orange,
            color: tab.loading || !tab.input.trim() ? '#a1a1aa' : '#fff',
            cursor: tab.loading || !tab.input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, flexShrink: 0, transition: 'all 0.15s',
            boxShadow: tab.loading || !tab.input.trim() ? 'none' : '0 2px 8px rgba(251,123,0,0.35)',
          }}>↑</button>
      </div>

      <style>{`
        @keyframes oscil-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}