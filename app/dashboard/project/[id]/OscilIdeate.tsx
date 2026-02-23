'use client'

import { useEffect, useRef, useState } from 'react'
import { FONT, Item } from './types'

const IDEATE_URL = 'https://ezadruidbklbzlgycwzs.supabase.co/functions/v1/oscil-ideate-agent'

const PanelLogo = () => (
  <svg width={20} height={18} viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip_ideate)">
      <path d="M11.9188 17.3086C12.4433 17.0691 12.956 16.8041 13.455 16.5147C14.7995 15.7349 16.0386 14.7839 17.1416 13.6851C19.6687 11.1713 21.3029 8.09132 22.0413 4.84502C22.0807 4.67143 22.0998 4.54301 22.1347 4.36573C22.3372 3.34626 22.8545 2.39235 23.6446 1.60637C25.7501 -0.488357 29.0706 -0.597808 31.2245 1.65281C31.7647 2.2172 32.628 2.89175 32.7128 4.65132C32.7142 5.39511 32.6694 6.13947 32.5794 6.87957C32.1048 10.7986 30.3621 14.59 27.3562 17.5802C23.4339 21.4825 18.1825 23.2018 13.0891 22.7483C11.4303 22.6007 9.79968 22.2227 8.24372 21.6251C6.53041 20.9663 4.9278 20.0464 3.492 18.8976C6.35794 19.0539 9.25468 18.5242 11.9188 17.3086Z" fill="#4ACFD2"/>
      <path d="M15.4744 1.18994C17.0003 -0.327931 19.459 -0.313064 20.9666 1.22336C21.9323 2.20771 22.3611 3.41225 22.0807 4.66874L22.0413 4.84517C21.3029 8.09132 19.6687 11.1713 17.1416 13.6851C16.0386 14.7839 14.7994 15.7349 13.4549 16.5147C12.9559 16.8041 12.4433 17.069 11.9188 17.3086C12.4036 16.5148 12.8266 15.6843 13.184 14.8246C14.5278 11.5923 14.9029 8.04644 14.3062 4.63773C14.3017 4.58704 14.2597 4.38244 14.2597 4.38244C14.1078 3.21217 14.5762 2.08354 15.4744 1.18994Z" fill="#F0B400"/>
      <path d="M13.4793 2.83612C13.8085 3.17067 14.0521 3.58065 14.1892 4.03088C14.2317 4.23251 14.2705 4.43527 14.3062 4.63775C14.903 8.04646 14.528 11.5924 13.184 14.8249C12.5928 11.9835 11.3292 9.32763 9.5005 7.08306C9.32802 6.87067 9.15074 6.66229 8.9688 6.45807C8.01676 5.4192 8.38591 3.7964 9.37661 2.81091C10.5164 1.67704 12.3534 1.68865 13.4793 2.83612Z" fill="#E23E2B"/>
      <path d="M1.86286 17.4253C2.37607 17.9486 2.9202 18.4402 3.49228 18.8974C4.92795 20.0463 6.53041 20.9662 8.24358 21.6249C9.79948 22.2227 11.4301 22.6007 13.089 22.7482C18.1827 23.2019 23.4336 21.4824 27.3561 17.5806C31.0199 13.936 32.7845 9.11124 32.6874 4.30628C32.4716 3.1128 31.9939 3.26699 32.0102 2.65106C32.1238 2.74366 32.6323 3.23825 33.0054 3.77503C37.677 10.8606 36.8776 20.5089 30.6429 26.7112C24.9279 32.3962 16.3931 33.4482 9.63394 29.8962C8.01647 29.0461 6.50081 27.933 5.14969 26.5561C4.54204 25.9372 3.97909 25.2754 3.46514 24.5757C2.12394 22.7506 1.13726 20.6868 0.557016 18.4929C0.271167 17.4141 0.0847058 16.311 0 15.1978C0.561085 15.989 1.18402 16.7339 1.86286 17.4253Z" fill="#3A7CEB"/>
    </g>
    <defs>
      <clipPath id="clip_ideate"><rect width="36" height="32" fill="white"/></clipPath>
    </defs>
  </svg>
)

// Animated loader — cycling brand color bg, white dots
const IdeateLoader = () => {
  const colors = ['#3A7CEB', '#4ACFD2', '#F0B400', '#E23E2B']
  const [colorIdx, setColorIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setColorIdx(i => (i + 1) % colors.length), 700)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', borderRadius: 10,
      background: colors[colorIdx],
      transition: 'background 0.5s ease',
      width: 'fit-content',
    }}>
      <span style={{ fontSize: 11, color: '#fff', fontWeight: 500, fontFamily: FONT, opacity: 0.9 }}>
        Ideating
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#fff', display: 'block',
            animation: 'ideate-dot 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  )
}

function Markdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  function parseInline(s: string): React.ReactNode[] {
    const parts: React.ReactNode[] = []
    let buf = ''; let j = 0
    while (j < s.length) {
      if (s[j] === '*' && s[j + 1] === '*') {
        const end = s.indexOf('**', j + 2)
        if (end !== -1) {
          if (buf) { parts.push(buf); buf = '' }
          parts.push(<strong key={j} style={{ fontWeight: 600, color: '#0f172a' }}>{s.slice(j + 2, end)}</strong>)
          j = end + 2; continue
        }
      }
      if (s[j] === '*' && s[j + 1] !== '*') {
        const end = s.indexOf('*', j + 1)
        if (end !== -1) {
          if (buf) { parts.push(buf); buf = '' }
          parts.push(<em key={j} style={{ fontStyle: 'italic', color: '#475569' }}>{s.slice(j + 1, end)}</em>)
          j = end + 1; continue
        }
      }
      buf += s[j]; j++
    }
    if (buf) parts.push(<span key="t" style={{ color: '#334155' }}>{buf}</span>)
    return parts
  }

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') { elements.push(<div key={`e-${i}`} style={{ height: 10 }} />); i++; continue }

    if (line.match(/^---+$/)) {
      elements.push(<hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '14px 0' }} />)
      i++; continue
    }

    const boldLine = line.match(/^\*\*(.+)\*\*$/)
    if (boldLine) {
      elements.push(
        <p key={`bh-${i}`} style={{
          fontSize: 10, fontWeight: 600, color: '#94a3b8',
          margin: '16px 0 5px', letterSpacing: '0.09em',
          textTransform: 'uppercase', fontFamily: FONT,
        }}>
          {boldLine[1]}
        </p>
      )
      i++; continue
    }

    const italicLine = line.match(/^\*(.+)\*$/)
    if (italicLine) {
      elements.push(
        <p key={`il-${i}`} style={{ fontSize: 12, fontStyle: 'italic', color: '#94a3b8', margin: '12px 0 0', lineHeight: 1.65 }}>
          {italicLine[1]}
        </p>
      )
      i++; continue
    }

    elements.push(
      <p key={`p-${i}`} style={{ margin: '3px 0', fontSize: 13, lineHeight: 1.75, color: '#1e293b', fontFamily: FONT }}>
        {parseInline(line)}
      </p>
    )
    i++
  }

  return <div>{elements}</div>
}

interface Message    { role: 'user' | 'ideate'; text: string; id: string }
interface HistoryMsg { role: 'user' | 'assistant'; content: string }

export function OscilIdeate({
  selectedItems,
  onClose,
}: {
  selectedItems: Item[]
  onClose: () => void
}) {
  const [messages, setMessages]   = useState<Message[]>([])
  const [history, setHistory]     = useState<HistoryMsg[]>([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [triggered, setTriggered] = useState(false)
  const messagesEndRef            = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedItems.length > 0 && !triggered) {
      setTriggered(true)
      runIdeation()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function runIdeation(followUp?: string) {
    setLoading(true)
    const isFirstTurn = history.length === 0

    if (followUp) {
      setMessages(prev => [...prev, { role: 'user', text: followUp, id: crypto.randomUUID() }])
    }

    const body = isFirstTurn
      ? {
          clips: selectedItems.map(i => ({
            label: i.label || 'Untitled',
            content: i.content || null,
            note: i.note || null,
          })),
          history,
        }
      : {
          clips: [],
          message: followUp,
          history,
        }

    try {
      const res = await fetch(IDEATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'ideate', text: `Error: ${data.error || 'Something went wrong'}`, id: crypto.randomUUID() }])
        return
      }
      setMessages(prev => [...prev, { role: 'ideate', text: data.reply, id: crypto.randomUUID() }])
      setHistory(data.history)
    } catch {
      setMessages(prev => [...prev, { role: 'ideate', text: 'Network error — please try again.', id: crypto.randomUUID() }])
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    await runIdeation(text)
  }

  return (
    <>
      <style>{`
        @keyframes ideate-in {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ideate-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-4px); opacity: 1; }
        }
        .ideate-panel { animation: ideate-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .ideate-input::placeholder { color: #94a3b8; }
        .ideate-input:focus {
          border-color: #3A7CEB !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(58,124,235,0.08) !important;
          outline: none;
        }
      `}</style>

      <div className="ideate-panel" style={{
        position: 'fixed', bottom: 24, right: 24,
        width: 560, height: 640, zIndex: 50,
        display: 'flex', flexDirection: 'column',
        borderRadius: 16,
        background: '#fff',
        boxShadow: '0 20px 60px rgba(15,23,42,0.14), 0 4px 16px rgba(15,23,42,0.06)',
        overflow: 'hidden',
        fontFamily: FONT,
      }}>



        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: 48,
          borderBottom: '1px solid #f1f5f9',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PanelLogo />
            <div>
              <div style={{
                fontSize: 12, fontWeight: 600,
                color: '#0f172a', letterSpacing: '0.02em',
                fontFamily: FONT,
              }}>
                Oscil Ideate
              </div>
              <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 1, letterSpacing: '0.03em' }}>
                {selectedItems.length} clip{selectedItems.length !== 1 ? 's' : ''} in focus
              </div>
            </div>

            {/* Clip tags */}
            <div style={{ display: 'flex', gap: 5, overflow: 'hidden', maxWidth: 300 }}>
              {selectedItems.slice(0, 4).map(item => (
                <span key={item.id} style={{
                  fontSize: 10, color: '#3A7CEB',
                  background: '#eff6ff', borderRadius: 4,
                  padding: '2px 8px', fontWeight: 500,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90,
                }}>
                  {item.label || 'Untitled'}
                </span>
              ))}
              {selectedItems.length > 4 && (
                <span style={{ fontSize: 10, color: '#94a3b8', padding: '2px 0', whiteSpace: 'nowrap' }}>
                  +{selectedItems.length - 4}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12, padding: '4px 6px', lineHeight: 1 }}
          >✕</button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '18px 18px 10px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {/* Initial loading state */}
          {messages.length === 0 && loading && (
            <div style={{ margin: 'auto' }}>
              <IdeateLoader />
            </div>
          )}

          {messages.length === 0 && !loading && (
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontFamily: FONT }}>
                Select clips and open Ideate to begin.
              </p>
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              {m.role === 'user' ? (
                <div style={{
                  maxWidth: '72%', padding: '10px 14px',
                  borderRadius: '10px 10px 2px 10px',
                  background: '#3A7CEB',
                  color: '#fff', fontSize: 13,
                  lineHeight: 1.6, fontWeight: 400,
                  fontFamily: FONT,
                }}>
                  {m.text}
                </div>
              ) : (
                <div style={{
                  maxWidth: '100%', padding: '14px 16px',
                  borderRadius: '2px 10px 10px 10px',
                  background: '#f8fafc',
                }}>
                  <Markdown text={m.text} />
                </div>
              )}
            </div>
          ))}

          {/* Follow-up loader */}
          {loading && messages.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <IdeateLoader />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '10px 12px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex', gap: 8, alignItems: 'flex-end',
          flexShrink: 0, background: '#fff',
        }}>
          <textarea
            className="ideate-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder={loading ? 'Ideating...' : 'Pull on a thread...'}
            disabled={loading}
            rows={1}
            style={{
              flex: 1, border: '1px solid #e2e8f0', borderRadius: 10,
              padding: '9px 13px', fontSize: 13, fontFamily: FONT,
              outline: 'none', resize: 'none', color: '#0f172a',
              background: '#f8fafc', lineHeight: 1.6,
              opacity: loading ? 0.5 : 1,
              transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              width: 38, height: 38, borderRadius: 10, border: 'none',
              background: (loading || !input.trim()) ? '#f1f5f9' : '#1a3a6b',
              color: (loading || !input.trim()) ? '#94a3b8' : '#fff',
              cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, flexShrink: 0,
              transition: 'all 0.15s',
              boxShadow: (loading || !input.trim()) ? 'none' : '0 2px 8px rgba(26,58,107,0.28)',
            }}
            onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.background = '#3A7CEB' }}
            onMouseLeave={e => { if (!loading && input.trim()) e.currentTarget.style.background = '#1a3a6b' }}
          >↑</button>
        </div>
      </div>
    </>
  )
}