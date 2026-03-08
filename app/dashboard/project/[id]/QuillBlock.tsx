'use client'

import { useEffect, useRef, useState } from 'react'
import { Item, ageLabel } from './types'

function loadQuill(cb: () => void) {
  if (!document.getElementById('ql-css')) {
    const l = document.createElement('link')
    l.id = 'ql-css'; l.rel = 'stylesheet'
    l.href = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css'
    document.head.appendChild(l)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).Quill) { cb(); return }
  if (!document.getElementById('ql-js')) {
    const s = document.createElement('script')
    s.id = 'ql-js'
    s.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js'
    s.async = true; s.onload = cb
    document.body.appendChild(s)
  } else {
    document.getElementById('ql-js')!.addEventListener('load', cb, { once: true })
  }
}

function isHTML(s: string) { return /<[a-z][\s\S]*>/i.test(s) }
function contentToHTML(c: string | null) {
  if (!c) return '<p><br></p>'
  return isHTML(c) ? c : `<p>${c.replace(/\n/g, '</p><p>')}</p>`
}

const URL_RE = /https?:\/\/[^\s"'<>\]]+/gi

function defaultTitle(i: number) {
  return `Untitled ${String(i + 1).padStart(2, '0')}`
}

function hostname(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return url.slice(0, 30) }
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const PageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
)
const DotsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="3"  cy="8" r="1.2" fill="currentColor"/>
    <circle cx="8"  cy="8" r="1.2" fill="currentColor"/>
    <circle cx="13" cy="8" r="1.2" fill="currentColor"/>
  </svg>
)

// ── Dot menu ──────────────────────────────────────────────────────────────────
function DotMenu({ onAskAI, onCopy, onDelete }: {
  onAskAI: () => void
  onCopy: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const menuItem = (label: string, icon: string, onClick: () => void, danger = false) => (
    <button key={label} onClick={() => { onClick(); setOpen(false) }}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        padding: '6px 10px', border: 'none', background: 'none',
        fontSize: 12.5, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
        textAlign: 'left', color: danger ? '#e23e2b' : '#37352f',
        borderRadius: 4, transition: 'background 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(227,62,43,0.06)' : 'rgba(55,53,47,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>{label}
    </button>
  )

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={e => { e.stopPropagation(); setOpen(s => !s) }}
        style={{
          background: open ? 'rgba(55,53,47,0.08)' : 'none', border: 'none',
          cursor: 'pointer', padding: '2px 4px', borderRadius: 4,
          display: 'flex', alignItems: 'center', color: 'rgba(55,53,47,0.4)',
          transition: 'background 0.1s, color 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(55,53,47,0.08)'; e.currentTarget.style.color = '#37352f' }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(55,53,47,0.4)' } }}
      >
        <DotsIcon />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 4,
          background: '#fff', border: '1px solid #e9e9e7', borderRadius: 6,
          boxShadow: 'rgba(15,15,15,0.1) 0 0 0 1px, rgba(15,15,15,0.12) 0 4px 16px -2px',
          zIndex: 100, minWidth: 160, padding: 3,
        }}>
          {menuItem('Ask Oscil AI', '✦', onAskAI)}
          {menuItem('Copy text', '⎘', onCopy)}
          <div style={{ height: 1, background: '#e9e9e7', margin: '3px 0' }} />
          {menuItem('Delete', '✕', onDelete, true)}
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function QuillBlock({
  item, index, onSave, onPin, onArchive, onAskAI, isNew, selected, onToggleSelect,
}: {
  item: Item
  index: number
  onSave: (u: Partial<Item>) => void
  onPin: () => void
  onArchive: () => void
  onAskAI: (question?: string, withContext?: boolean) => void
  isNew?: boolean
  selected?: boolean
  onToggleSelect?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef     = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef     = useRef<any>(null)
  const timer        = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Track which URLs we've already probed so we don't re-probe on every keystroke
  const probedRef    = useRef<Set<string>>(new Set())

  const autoTitle = defaultTitle(index)
  const [label, setLabel]       = useState(item.label || autoTitle)
  const [saved, setSaved]       = useState(false)
  const [active, setActive]     = useState(false)
  const [expanded, setExpanded] = useState(isNew ?? false)
  const [hovered, setHovered]   = useState(false)

  useEffect(() => { setLabel(item.label || autoTitle) }, [item.label]) // eslint-disable-line

  function schedule(l: string, content: string | null) {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      onSave({ label: (l === autoTitle ? null : l) || null, content, note: null })
      setSaved(true)
      setTimeout(() => setSaved(false), 1200)
    }, 700)
  }

  /**
   * Scan editor text for raw URLs not yet processed.
   * Immediately embed each as a Quill image — the browser will render it
   * if it can (including CORS-restricted CDN images like LinkedIn, which
   * block JS probes but load fine as <img> tags).
   * If the image fails to load, the onerror handler in the editor CSS
   * replaces it with a styled link chip via a data attribute.
   */
  function tryEmbedUrls() {
    const quill = quillRef.current
    if (!quill) return
    const text = quill.getText()
    const matches = Array.from(new Set(text.match(URL_RE) || [])) as string[]
    const fresh = matches.filter(u => !probedRef.current.has(u))
    if (!fresh.length) return

    fresh.forEach(url => {
      probedRef.current.add(url)
      // Small delay so Quill finishes its own text-change processing first
      setTimeout(() => {
        const currentText = quill.getText()
        const idx = currentText.indexOf(url)
        if (idx === -1) return
        quill.deleteText(idx, url.length)
        quill.insertEmbed(idx, 'image', url)
        quill.setSelection(idx + 1, 0)
        // After embed, find the <img> and attach onerror to replace with link
        setTimeout(() => {
          const root = quill.root as HTMLElement
          const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img')).filter(i => i.src === url)
          imgs.forEach(img => {
            if (img.dataset.handled) return
            img.dataset.handled = '1'
            img.onerror = () => {
              // Image failed (broken/restricted) — replace with a link chip span
              const chip = document.createElement('a')
              chip.href = url
              chip.target = '_blank'
              chip.rel = 'noopener noreferrer'
              chip.className = 'ql-url-chip'
              chip.textContent = (() => { try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url.slice(0, 40) } })()
              img.replaceWith(chip)
              // Re-save since DOM changed
              const html = quill.root.innerHTML
              const t = quill.getText()
              schedule(labelRef.current?.value ?? label, t.trim() ? html : null)
            }
          })
        }, 50)
      }, 10)
    })
  }

  useEffect(() => {
    if (!expanded) return
    loadQuill(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Q = (window as any).Quill
      if (!Q || !containerRef.current) return
      containerRef.current.innerHTML = ''
      const el = document.createElement('div')
      containerRef.current.appendChild(el)

      const quill = new Q(el, {
        theme: 'snow',
        placeholder: 'Write something… or type !ask to chat',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
          ],
        },
      })

      quill.clipboard.dangerouslyPasteHTML(contentToHTML(item.content))

      quill.on('text-change', () => {
        const text = quill.getText()

        // ── !ask command parser ───────────────────────────────────────────
        // Syntax: !ask <question> [-this|-free]
        // -this  = pass this clip as context (default)
        // -free  = no context, fresh question
        const cmdLine = text.split('\n').find((l: string) => l.trimStart().startsWith('!ask'))
        if (cmdLine !== undefined) {
          const inner     = cmdLine.replace(/^!ask\s*/i, '')
          const freeFlag  = /\s-free$/i.test(inner)
          const thisFlag  = /\s-this$/i.test(inner)
          const question  = inner.replace(/\s-(free|this)$/i, '').trim()
          const withCtx   = !freeFlag // default to -this unless -free explicitly set
          setTimeout(() => {
            const cur = quill.getText()
            const idx = cur.indexOf(cmdLine.trimStart())
            if (idx !== -1) {
              const end = cur.indexOf('\n', idx)
              quill.deleteText(idx, end === -1 ? cur.length - idx : end - idx + 1)
            }
            onAskAI(question || undefined, withCtx)
          }, 80)
          return
        }
        // ─────────────────────────────────────────────────────────────────

        const html    = quill.root.innerHTML
        const content = text.trim() ? html : null
        schedule(labelRef.current?.value ?? label, content)
        tryEmbedUrls()
      })

      quill.on('selection-change', (range: unknown) => setActive(!!range))
      quillRef.current = quill
    })
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
      quillRef.current = null
    }
  }, [expanded, item.id]) // eslint-disable-line

  const lastEdited = item.last_edited || item.saved_at
  const rowBg = hovered ? 'rgba(55,53,47,0.03)' : 'transparent'

  function copyContent() {
    const text = quillRef.current?.getText() || item.content || ''
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      <style>{`
        .notion-quill .ql-toolbar {
          border: none !important; border-bottom: 1px solid #e9e9e7 !important;
          padding: 4px 8px !important; background: #f7f6f3 !important; border-radius: 0 !important;
        }
        .notion-quill .ql-container {
          border: none !important; font-family: 'Inter', -apple-system, sans-serif !important;
          font-size: 14px !important; color: #37352f !important;
        }
        .notion-quill .ql-editor {
          padding: 10px 16px 12px !important; min-height: 100px !important;
          line-height: 1.65 !important; color: #37352f !important;
        }
        .notion-quill .ql-editor.ql-blank::before {
          color: rgba(55,53,47,0.3) !important; font-style: normal !important; left: 16px !important;
        }
        .notion-quill .ql-editor img {
          max-width: 100% !important; border-radius: 4px !important;
          display: block !important; margin: 6px 0 !important;
          border: 1px solid #e9e9e7 !important; cursor: pointer !important;
        }
        /* Fallback chip when image fails to load */
        .notion-quill .ql-editor a.ql-url-chip {
          display: inline-flex !important; align-items: center !important;
          font-size: 12px !important; color: rgba(55,53,47,0.6) !important;
          background: rgba(55,53,47,0.05) !important; border: 1px solid #e9e9e7 !important;
          border-radius: 4px !important; padding: 2px 8px !important;
          text-decoration: none !important; font-family: 'Inter', sans-serif !important;
          transition: background 0.1s !important;
        }
        .notion-quill .ql-editor a.ql-url-chip:hover {
          background: rgba(55,53,47,0.09) !important; color: #37352f !important;
        }
        .notion-quill .ql-toolbar button:hover .ql-stroke,
        .notion-quill .ql-toolbar button.ql-active .ql-stroke { stroke: #37352f !important; }
        .notion-quill .ql-toolbar button:hover .ql-fill,
        .notion-quill .ql-toolbar button.ql-active .ql-fill { fill: #37352f !important; }
        .notion-quill .ql-snow .ql-picker { color: #37352f !important; }
        .notion-quill .ql-snow.ql-toolbar button { border-radius: 3px !important; }
        .notion-quill .ql-snow.ql-toolbar button:hover { background: rgba(55,53,47,0.08) !important; }

        .quill-expand-area { overflow: hidden; transition: max-height 0.22s ease, opacity 0.15s ease; }
        .quill-expand-area.open   { max-height: 900px; opacity: 1; }
        .quill-expand-area.closed { max-height: 0; opacity: 0; pointer-events: none; }
        .clip-row-title:focus { outline: none; }
      `}</style>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ borderRadius: 5, background: selected ? 'rgba(108,99,255,0.05)' : rowBg, transition: 'background 0.1s', outline: selected ? '1px solid rgba(108,99,255,0.15)' : 'none' }}
      >
        {/* Row header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px 6px 8px', minHeight: 34 }}>
          {/* Checkbox — visible on hover or when selected */}
          {(hovered || selected) && onToggleSelect ? (
            <button
              onClick={e => { e.stopPropagation(); onToggleSelect() }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center' }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                border: selected ? 'none' : '1.5px solid #d0d0ce',
                background: selected ? '#6C63FF' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.12s',
              }}>
                {selected && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </button>
          ) : (
            <div style={{ width: 14, flexShrink: 0 }} />
          )}
          {/* Chevron */}
          <button
            onClick={() => setExpanded(s => !s)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0, display: 'flex', alignItems: 'center', color: 'rgba(55,53,47,0.3)', borderRadius: 3, transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(55,53,47,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ transition: 'transform 0.15s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', display: 'flex' }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>

          <span style={{ color: 'rgba(55,53,47,0.4)', flexShrink: 0, display: 'flex' }}><PageIcon /></span>

          {/* Title */}
          <input
            ref={labelRef}
            type="text"
            value={label}
            onChange={e => {
              const val = e.target.value
              setLabel(val)
              const html = quillRef.current?.root.innerHTML ?? null
              const text = quillRef.current?.getText() ?? ''
              schedule(val, text.trim() ? html : null)
            }}
            onBlur={e => { if (!e.target.value.trim()) setLabel(autoTitle) }}
            placeholder={autoTitle}
            className="clip-row-title"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13.5, fontWeight: 500, color: '#37352f', fontFamily: 'Inter, sans-serif', cursor: 'text', minWidth: 0 }}
          />

          {/* Meta + menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {saved && (
              <span style={{ fontSize: 10, color: '#10b981', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>Saved</span>
            )}
            {!saved && (hovered || active) && (
              <span style={{ fontSize: 11, color: 'rgba(55,53,47,0.3)', fontFamily: 'Inter, sans-serif' }}>{ageLabel(lastEdited)}</span>
            )}
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" title={item.url}
                style={{ color: 'rgba(55,53,47,0.4)', textDecoration: 'none', fontSize: 11, display: 'flex', alignItems: 'center', padding: '2px 4px', borderRadius: 3, transition: 'background 0.1s, color 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(55,53,47,0.08)'; e.currentTarget.style.color = '#37352f' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(55,53,47,0.4)' }}
              >↗</a>
            )}
            {(hovered || active) && (
              <DotMenu onAskAI={onAskAI} onCopy={copyContent} onDelete={onArchive} />
            )}
          </div>
        </div>

        {/* Editor */}
        <div className={`quill-expand-area ${expanded ? 'open' : 'closed'}`} style={{ marginLeft: 30 }}>
          <div ref={containerRef} className="notion-quill" style={{ borderTop: '1px solid #e9e9e7', overflow: 'hidden' }} />
        </div>
      </div>
    </>
  )
}