'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FONT, Item } from './types'

const CHAT_URL = 'https://ezadruidbklbzlgycwzs.supabase.co/functions/v1/oscil-chat'

const C = {
  navy:       '#1a3a6b',
  blue:       '#3A7CEB',
  teal:       '#4ACFD2',
  navyLight:  '#eef4fd',
  blueLight:  '#dbeafe',
}

interface HistoryMessage { role: 'user' | 'assistant'; content: string }
interface ChatMessage    { role: 'user' | 'ai'; text: string; id: string }

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

const PanelLogo = () => (
  <svg width={18} height={16} viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#cp_chat)">
      <path d="M11.9188 17.3086C12.4433 17.0691 12.956 16.8041 13.455 16.5147C14.7995 15.7349 16.0386 14.7839 17.1416 13.6851C19.6687 11.1713 21.3029 8.09132 22.0413 4.84502C22.0807 4.67143 22.0998 4.54301 22.1347 4.36573C22.3372 3.34626 22.8545 2.39235 23.6446 1.60637C25.7501 -0.488357 29.0706 -0.597808 31.2245 1.65281C31.7647 2.2172 32.628 2.89175 32.7128 4.65132C32.7142 5.39511 32.6694 6.13947 32.5794 6.87957C32.1048 10.7986 30.3621 14.59 27.3562 17.5802C23.4339 21.4825 18.1825 23.2018 13.0891 22.7483C11.4303 22.6007 9.79968 22.2227 8.24372 21.6251C6.53041 20.9663 4.9278 20.0464 3.492 18.8976C6.35794 19.0539 9.25468 18.5242 11.9188 17.3086Z" fill="#4ACFD2"/>
      <path d="M15.4744 1.18994C17.0003 -0.327931 19.459 -0.313064 20.9666 1.22336C21.9323 2.20771 22.3611 3.41225 22.0807 4.66874L22.0413 4.84517C21.3029 8.09132 19.6687 11.1713 17.1416 13.6851C16.0386 14.7839 14.7994 15.7349 13.4549 16.5147C12.9559 16.8041 12.4433 17.069 11.9188 17.3086C12.4036 16.5148 12.8266 15.6843 13.184 14.8246C14.5278 11.5923 14.9029 8.04644 14.3062 4.63773C14.3017 4.58704 14.2597 4.38244 14.2597 4.38244C14.1078 3.21217 14.5762 2.08354 15.4744 1.18994Z" fill="#F0B400"/>
      <path d="M13.4793 2.83612C13.8085 3.17067 14.0521 3.58065 14.1892 4.03088C14.2317 4.23251 14.2705 4.43527 14.3062 4.63775C14.903 8.04646 14.528 11.5924 13.184 14.8249C12.5928 11.9835 11.3292 9.32763 9.5005 7.08306C9.32802 6.87067 9.15074 6.66229 8.9688 6.45807C8.01676 5.4192 8.38591 3.7964 9.37661 2.81091C10.5164 1.67704 12.3534 1.68865 13.4793 2.83612Z" fill="#E23E2B"/>
      <path d="M1.86286 17.4253C2.37607 17.9486 2.9202 18.4402 3.49228 18.8974C4.92795 20.0463 6.53041 20.9662 8.24358 21.6249C9.79948 22.2227 11.4301 22.6007 13.089 22.7482C18.1827 23.2019 23.4336 21.4824 27.3561 17.5806C31.0199 13.936 32.7845 9.11124 32.6874 4.30628C32.4716 3.1128 31.9939 3.26699 32.0102 2.65106C32.1238 2.74366 32.6323 3.23825 33.0054 3.77503C37.677 10.8606 36.8776 20.5089 30.6429 26.7112C24.9279 32.3962 16.3931 33.4482 9.63394 29.8962C8.01647 29.0461 6.50081 27.933 5.14969 26.5561C4.54204 25.9372 3.97909 25.2754 3.46514 24.5757C2.12394 22.7506 1.13726 20.6868 0.557016 18.4929C0.271167 17.4141 0.0847058 16.311 0 15.1978C0.561085 15.989 1.18402 16.7339 1.86286 17.4253Z" fill="#3A7CEB"/>
    </g>
    <defs><clipPath id="cp_chat"><rect width="36" height="32" fill="white"/></clipPath></defs>
  </svg>
)

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
        if (end !== -1) { if (buf) { parts.push(buf); buf = '' }
          parts.push(<strong key={j} style={{ fontWeight: 600, color: C.navy }}>{s.slice(j+2, end)}</strong>)
          j = end+2; continue }
      }
      if (s[j] === '*' && s[j+1] !== '*') {
        const end = s.indexOf('*', j+1)
        if (end !== -1) { if (buf) { parts.push(buf); buf = '' }
          parts.push(<em key={j} style={{ fontStyle: 'italic', color: '#475569' }}>{s.slice(j+1, end)}</em>)
          j = end+1; continue }
      }
      if (s[j] === '`') {
        const end = s.indexOf('`', j+1)
        if (end !== -1) { if (buf) { parts.push(buf); buf = '' }
          parts.push(<code key={j} style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, background: C.navyLight, color: C.navy, padding: '1px 5px', borderRadius: 4 }}>{s.slice(j+1, end)}</code>)
          j = end+1; continue }
      }
      if (s[j] === '[') {
        const mid = s.indexOf('](', j); const end = mid !== -1 ? s.indexOf(')', mid) : -1
        if (mid !== -1 && end !== -1) { if (buf) { parts.push(buf); buf = '' }
          parts.push(<a key={j} href={s.slice(mid+2, end)} target="_blank" rel="noopener noreferrer" style={{ color: C.blue, textDecoration: 'underline', textUnderlineOffset: 2 }}>{s.slice(j+1, mid)}</a>)
          j = end+1; continue }
      }
      buf += s[j]; j++
    }
    if (buf) parts.push(<span key="t" style={{ color: '#1e293b' }}>{buf}</span>)
    return parts
  }

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') { elements.push(<div key={`e-${i}`} style={{ height: 8 }} />); i++; continue }
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim(); const codeLines: string[] = []; i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      elements.push(
        <div key={`code-${i}`} style={{ margin: '10px 0', borderRadius: 8, overflow: 'hidden' }}>
          {lang && <div style={{ padding: '3px 12px', background: C.navyLight, fontSize: 10, color: C.blue, fontFamily: 'ui-monospace,monospace', fontWeight: 600, textTransform: 'uppercase' }}>{lang}</div>}
          <pre style={{ margin: 0, padding: '10px 14px', background: C.navy, color: '#e2e8f0', fontFamily: 'ui-monospace,monospace', fontSize: 11, lineHeight: 1.7, overflowX: 'auto' }}><code>{codeLines.join('\n')}</code></pre>
        </div>
      ); i++; continue
    }
    const h2 = line.match(/^## (.+)/); const h3 = line.match(/^### (.+)/)
    if (h2) { elements.push(<p key={`h2-${i}`} style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '14px 0 4px', fontFamily: FONT }}>{parseInline(h2[1])}</p>); i++; continue }
    if (h3) { elements.push(<p key={`h3-${i}`} style={{ fontSize: 12, fontWeight: 600, color: C.blue, margin: '10px 0 3px', fontFamily: FONT }}>{parseInline(h3[1])}</p>); i++; continue }
    if (line.match(/^---+$/)) { elements.push(<hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '12px 0' }} />); i++; continue }
    if (line.startsWith('> ')) { elements.push(<div key={`q-${i}`} style={{ borderLeft: `2px solid ${C.teal}`, padding: '6px 0 6px 12px', margin: '10px 0', color: '#475569', fontStyle: 'italic', fontSize: 12, background: '#f0fdfd', borderRadius: '0 6px 6px 0' }}>{parseInline(line.slice(2))}</div>); i++; continue }
    if (line.match(/^[-*] /)) {
      const items: string[] = []; const si = i
      while (i < lines.length && lines[i].match(/^[-*] /)) { items.push(lines[i].slice(2)); i++ }
      elements.push(<ul key={`ul-${si}`} style={{ margin: '6px 0', paddingLeft: 0, listStyle: 'none' }}>
        {items.map((it, idx) => (
          <li key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, lineHeight: 1.65, marginBottom: 4, color: '#1e293b' }}>
            <span style={{ color: C.teal, fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: -1 }}>·</span>
            <span style={{ flex: 1 }}>{parseInline(it)}</span>
          </li>
        ))}
      </ul>); continue
    }
    elements.push(<p key={`p-${i}`} style={{ margin: '3px 0', fontSize: 12, lineHeight: 1.7, color: '#1e293b', fontFamily: FONT }}>{parseInline(line)}</p>)
    i++
  }
  return <div style={{ fontFamily: FONT }}>{elements}</div>
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800) }
  return (
    <button onClick={copy} style={{
      alignSelf: 'flex-start', background: 'none',
      border: `1px solid ${copied ? '#10b981' : '#e4e4e7'}`,
      borderRadius: 5, cursor: 'pointer', padding: '2px 8px',
      fontSize: 10, color: copied ? '#10b981' : '#a1a1aa',
      fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s',
    }}
      onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue } }}
      onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.color = '#a1a1aa' } }}
    >{copied ? '✓ copied' : '⎘ copy'}</button>
  )
}

export function OscilChat({
  selectedItems, projectId, onClose,
}: {
  selectedItems: Item[]
  projectId: string
  onClose: () => void
}) {
  const supabase = createClient()
  const [tabs, setTabs]           = useState<ChatTab[]>([makeTab(1)])
  const [activeTab, setActiveTab] = useState(0)
  const [maximised] = useState(true) // fixed maximised
  const [savingTab, setSavingTab] = useState(false)
  const [saveFlash, setSaveFlash] = useState(false)
  const messagesEndRef            = useRef<HTMLDivElement>(null)

  const tab = tabs[activeTab]

  function updateTab(id: string, patch: Partial<ChatTab>) {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
  }
  function addTab() { const next = makeTab(tabs.length + 1); setTabs(prev => [...prev, next]); setActiveTab(tabs.length) }
  function closeTab(idx: number) {
    if (tabs.length === 1) { onClose(); return }
    const next = tabs.filter((_, i) => i !== idx)
    setTabs(next); setActiveTab(Math.min(activeTab, next.length - 1))
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ message: text, history: tab.history, ...(system ? { system } : {}) }),
      })
      const data = await res.json()
      if (!res.ok) { updateTab(tab.id, { messages: [...optimistic, { role: 'ai', text: `Error: ${data.error || 'Something went wrong'}`, id: crypto.randomUUID() }], loading: false }); return }
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

  const panelW = 560
  const panelH = 640

  return (
    <>
      <style>{`
        @keyframes chat-in {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chat-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-4px); opacity: 1; }
        }
        .chat-panel { animation: chat-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
        .chat-input::placeholder { color: #94a3b8; }
        .chat-input:focus {
          border-color: ${C.blue} !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(58,124,235,0.08) !important;
          outline: none;
        }
      `}</style>

      <div className="chat-panel" style={{
        position: 'fixed', bottom: 24, right: 24,
        width: panelW, height: panelH, zIndex: 50,
        display: 'flex', flexDirection: 'column',
        borderRadius: 16,
        background: '#fff',
        boxShadow: '0 20px 60px rgba(15,23,42,0.14), 0 4px 16px rgba(15,23,42,0.06)',
        overflow: 'hidden',
        transition: 'width 0.22s, height 0.22s',
        fontFamily: FONT,
      }}>

        {/* Tab bar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          borderBottom: '1px solid #f1f5f9',
          background: C.navyLight,
          padding: '0 8px', height: 40, flexShrink: 0, gap: 2, overflowX: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingRight: 10, borderRight: '1px solid #dbeafe', marginRight: 4, flexShrink: 0 }}>
            <PanelLogo />
            <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: C.navy }}>
              Oscil AI
            </span>
          </div>
          {tabs.map((t, i) => (
            <div key={t.id} onClick={() => setActiveTab(i)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '3px 8px 3px 10px', borderRadius: 6, cursor: 'pointer',
              fontSize: 11, fontWeight: i === activeTab ? 600 : 400,
              color: i === activeTab ? C.navy : '#94a3b8',
              background: i === activeTab ? '#fff' : 'transparent',
              whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.1s',
            }}>
              {t.saved   && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />}
              {t.loading && <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, display: 'inline-block' }} />}
              <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</span>
              <button onClick={e => { e.stopPropagation(); closeTab(i) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d4d4d8', fontSize: 9, padding: 0, lineHeight: 1 }}>✕</button>
            </div>
          ))}
          <button onClick={addTab} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.blue, fontSize: 16, lineHeight: 1, padding: '0 5px', flexShrink: 0, fontWeight: 300 }}>+</button>
          <div style={{ flex: 1 }} />

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 11, padding: '0 4px 0 2px' }}>✕</button>
        </div>

        {/* Context strip */}
        {selectedItems.length > 0 && (
          <div style={{ padding: '5px 12px', borderBottom: '1px solid #f1f5f9', background: C.navyLight, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: C.blue, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {selectedItems.length} in context
            </span>
            {selectedItems.slice(0, 3).map(item => (
              <span key={item.id} style={{ fontSize: 10, color: C.navy, background: C.blueLight, borderRadius: 4, padding: '1px 7px', fontWeight: 500, maxWidth: 110, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {item.label || 'Untitled'}
              </span>
            ))}
            {selectedItems.length > 3 && <span style={{ fontSize: 10, color: C.blue, opacity: 0.7 }}>+{selectedItems.length - 3}</span>}
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tab.messages.length === 0 && (
            <div style={{ margin: 'auto', textAlign: 'center', padding: '0 20px' }}>
              <PanelLogo />
              <p style={{ fontSize: 12, margin: '10px 0 4px', fontWeight: 600, color: C.navy, fontFamily: FONT }}>Ask Oscil AI anything</p>
              <p style={{ fontSize: 11, margin: 0, color: '#94a3b8' }}>
                {selectedItems.length > 0 ? `${selectedItems.length} clip${selectedItems.length > 1 ? 's' : ''} loaded as context` : 'Select clips to add context'}
              </p>
            </div>
          )}

          {tab.messages.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'user' ? (
                <div style={{ maxWidth: '80%', padding: '9px 13px', fontSize: 12, lineHeight: 1.6, borderRadius: '10px 10px 2px 10px', background: C.navy, color: '#fff', fontWeight: 400 }}>
                  {m.text}
                </div>
              ) : (
                <div style={{ maxWidth: '94%', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ padding: '10px 13px', borderRadius: '2px 10px 10px 10px', background: '#f8fafc' }}>
                    <Markdown text={m.text} />
                  </div>
                  <CopyButton text={m.text} />
                </div>
              )}
            </div>
          ))}

          {tab.loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '10px 14px', borderRadius: '2px 10px 10px 10px', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 4 }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, display: 'block', animation: 'chat-dot 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '8px 10px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 6, alignItems: 'flex-end', flexShrink: 0, background: '#fff' }}>
          <textarea
            className="chat-input"
            value={tab.input}
            onChange={e => updateTab(tab.id, { input: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder={tab.loading ? 'Thinking...' : 'Ask anything...'}
            disabled={tab.loading}
            rows={1}
            style={{
              flex: 1, border: '1px solid #e2e8f0', borderRadius: 10,
              padding: '8px 11px', fontSize: 12, fontFamily: FONT,
              outline: 'none', resize: 'none', color: '#0f172a',
              background: '#f8fafc', lineHeight: 1.5,
              opacity: tab.loading ? 0.6 : 1, transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
            }}
          />
          <button onClick={saveChat} disabled={savingTab || tab.messages.length === 0}
            style={{
              width: 34, height: 34, borderRadius: 8, border: '1px solid #e2e8f0',
              background: saveFlash ? '#ecfdf5' : '#f8fafc',
              color: saveFlash || tab.saved ? '#10b981' : '#94a3b8',
              cursor: (savingTab || tab.messages.length === 0) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, flexShrink: 0, transition: 'all 0.2s',
              opacity: tab.messages.length === 0 ? 0.4 : 1,
            }}>
            {savingTab ? '…' : tab.saved ? '✓' : '↓'}
          </button>
          <button onClick={sendMessage} disabled={tab.loading || !tab.input.trim()}
            style={{
              width: 34, height: 34, borderRadius: 8, border: 'none',
              background: (tab.loading || !tab.input.trim()) ? '#f1f5f9' : C.navy,
              color: (tab.loading || !tab.input.trim()) ? '#94a3b8' : '#fff',
              cursor: (tab.loading || !tab.input.trim()) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0, transition: 'all 0.15s',
              boxShadow: (tab.loading || !tab.input.trim()) ? 'none' : '0 2px 8px rgba(26,58,107,0.3)',
            }}
            onMouseEnter={e => { if (!tab.loading && tab.input.trim()) e.currentTarget.style.background = C.blue }}
            onMouseLeave={e => { if (!tab.loading && tab.input.trim()) e.currentTarget.style.background = C.navy }}
          >↑</button>
        </div>
      </div>
    </>
  )
}