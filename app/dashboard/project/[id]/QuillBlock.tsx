'use client'

import { useEffect, useRef, useState } from 'react'
import { Item, ageLabel } from './types'
import { useAppTheme } from '../../DShared';

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
  const { t } = useAppTheme()

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
        textAlign: 'left', color: danger ? '#e23e2b' : t.fg,
        borderRadius: 4, transition: 'background 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(227,62,43,0.08)' : t.sidebarItemHoverBg}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>{label}
    </button>
  )

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={e => { e.stopPropagation(); setOpen(s => !s) }}
        style={{
          background: open ? t.sidebarItemHoverBg : 'none', border: 'none',
          cursor: 'pointer', padding: '2px 4px', borderRadius: 4,
          display: 'flex', alignItems: 'center', color: t.fgLow,
          transition: 'background 0.1s, color 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = t.sidebarItemHoverBg; e.currentTarget.style.color = t.fg }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = t.fgLow } }}
      >
        <DotsIcon />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 4,
          background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 6,
          boxShadow: t.shadowModal, zIndex: 100, minWidth: 160, padding: 3,
        }}>
          {menuItem('Ask Oscil AI', '✦', onAskAI)}
          {menuItem('Copy text', '⎘', onCopy)}
          <div style={{ height: 1, background: t.border, margin: '3px 0' }} />
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
  const probedRef    = useRef<Set<string>>(new Set())

  const { t, dark } = useAppTheme()

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

  function tryEmbedUrls() {
    const quill = quillRef.current
    if (!quill) return
    const text = quill.getText()
    const matches = Array.from(new Set(text.match(URL_RE) || [])) as string[]
    const fresh = matches.filter(u => !probedRef.current.has(u))
    if (!fresh.length) return

    fresh.forEach(url => {
      probedRef.current.add(url)
      setTimeout(() => {
        const currentText = quill.getText()
        const idx = currentText.indexOf(url)
        if (idx === -1) return
        quill.deleteText(idx, url.length)
        quill.insertEmbed(idx, 'image', url)
        quill.setSelection(idx + 1, 0)
        setTimeout(() => {
          const root = quill.root as HTMLElement
          const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img')).filter(i => i.src === url)
          imgs.forEach(img => {
            if (img.dataset.handled) return
            img.dataset.handled = '1'
            img.onerror = () => {
              const chip = document.createElement('a')
              chip.href = url
              chip.target = '_blank'
              chip.rel = 'noopener noreferrer'
              chip.className = 'ql-url-chip'
              chip.textContent = (() => { try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url.slice(0, 40) } })()
              img.replaceWith(chip)
              const html = quill.root.innerHTML
              const txt = quill.getText()
              schedule(labelRef.current?.value ?? label, txt.trim() ? html : null)
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

        const cmdLine = text.split('\n').find((l: string) => l.trimStart().startsWith('!ask'))
        if (cmdLine !== undefined) {
          const inner    = cmdLine.replace(/^!ask\s*/i, '')
          const freeFlag = /\s-free$/i.test(inner)
          const question = inner.replace(/\s-(free|this)$/i, '').trim()
          const withCtx  = !freeFlag
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

  function copyContent() {
    const text = quillRef.current?.getText() || item.content || ''
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      <style>{`
        /* ── Toolbar ── */
        .notion-quill .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid ${t.border} !important;
          padding: 4px 8px !important;
          background: ${t.surfaceBg} !important;
          border-radius: 0 !important;
        }
        /* ── Container / editor ── */
        .notion-quill .ql-container {
          border: none !important;
          font-family: 'Inter', -apple-system, sans-serif !important;
          font-size: 14px !important;
          background: ${t.bg} !important;
        }
        .notion-quill .ql-editor {
          padding: 10px 16px 12px !important;
          min-height: 100px !important;
          line-height: 1.65 !important;
          color: ${t.fg} !important;
          background: ${t.bg} !important;
          caret-color: ${t.fg} !important;
        }
        /* Placeholder */
        .notion-quill .ql-editor.ql-blank::before {
          color: ${t.fgLow} !important;
          font-style: normal !important;
          left: 16px !important;
        }
        /* Inline formats */
        .notion-quill .ql-editor strong,
        .notion-quill .ql-editor b { color: ${t.fg} !important; }
        .notion-quill .ql-editor em,
        .notion-quill .ql-editor i  { color: ${t.fgMid} !important; }
        .notion-quill .ql-editor u  { color: ${t.fg} !important; text-decoration-color: ${t.fgLow} !important; }
        .notion-quill .ql-editor p,
        .notion-quill .ql-editor li { color: ${t.fg} !important; }
        /* Lists */
        .notion-quill .ql-editor ol,
        .notion-quill .ql-editor ul  { color: ${t.fg} !important; }
        /* Images */
        .notion-quill .ql-editor img {
          max-width: 100% !important; border-radius: 4px !important;
          display: block !important; margin: 6px 0 !important;
          border: 1px solid ${t.border} !important; cursor: pointer !important;
        }
        /* URL chip */
        .notion-quill .ql-editor a.ql-url-chip {
          display: inline-flex !important; align-items: center !important;
          font-size: 12px !important; color: ${t.fgMid} !important;
          background: ${t.surfaceBg} !important; border: 1px solid ${t.border} !important;
          border-radius: 4px !important; padding: 2px 8px !important;
          text-decoration: none !important; font-family: 'Inter', sans-serif !important;
          transition: background 0.1s !important;
        }
        .notion-quill .ql-editor a.ql-url-chip:hover {
          background: ${t.sidebarItemHoverBg} !important; color: ${t.fg} !important;
        }
        /* Toolbar icons */
        .notion-quill .ql-toolbar .ql-stroke { stroke: ${t.fgMid} !important; }
        .notion-quill .ql-toolbar .ql-fill   { fill:   ${t.fgMid} !important; }
        .notion-quill .ql-toolbar button:hover .ql-stroke,
        .notion-quill .ql-toolbar button.ql-active .ql-stroke { stroke: ${t.fg} !important; }
        .notion-quill .ql-toolbar button:hover .ql-fill,
        .notion-quill .ql-toolbar button.ql-active .ql-fill   { fill:   ${t.fg} !important; }
        .notion-quill .ql-snow .ql-picker       { color: ${t.fgMid} !important; }
        .notion-quill .ql-snow.ql-toolbar button { border-radius: 3px !important; }
        .notion-quill .ql-snow.ql-toolbar button:hover { background: ${t.sidebarItemHoverBg} !important; }

        .quill-expand-area { overflow: hidden; transition: max-height 0.22s ease, opacity 0.15s ease; }
        .quill-expand-area.open   { max-height: 900px; opacity: 1; }
        .quill-expand-area.closed { max-height: 0; opacity: 0; pointer-events: none; }
        .clip-row-title:focus { outline: none; }
      `}</style>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: 5,
          background: selected ? (dark ? 'rgba(108,99,255,0.1)' : 'rgba(108,99,255,0.05)') : (hovered ? t.sidebarItemHoverBg : 'transparent'),
          outline: selected ? `1px solid rgba(108,99,255,0.2)` : 'none',
          transition: 'background 0.1s',
        }}
      >
        {/* Row header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px 6px 8px', minHeight: 34 }}>
          {/* Checkbox */}
          {(hovered || selected) && onToggleSelect ? (
            <button
              onClick={e => { e.stopPropagation(); onToggleSelect() }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center' }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                border: selected ? 'none' : `1.5px solid ${t.border}`,
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
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0, display: 'flex', alignItems: 'center', color: t.fgLow, borderRadius: 3, transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = t.sidebarItemHoverBg}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ transition: 'transform 0.15s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', display: 'flex' }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>

          <span style={{ color: t.fgLow, flexShrink: 0, display: 'flex' }}><PageIcon /></span>

          {/* Title input */}
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
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13.5, fontWeight: 500, color: t.fg,
              fontFamily: 'Inter, sans-serif', cursor: 'text', minWidth: 0,
            }}
          />

          {/* Meta + menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {saved && (
              <span style={{ fontSize: 10, color: '#10b981', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>Saved</span>
            )}
            {!saved && (hovered || active) && (
              <span style={{ fontSize: 11, color: t.fgLow, fontFamily: 'Inter, sans-serif' }}>{ageLabel(lastEdited)}</span>
            )}
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" title={item.url}
                style={{ color: t.fgLow, textDecoration: 'none', fontSize: 11, display: 'flex', alignItems: 'center', padding: '2px 4px', borderRadius: 3, transition: 'background 0.1s, color 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.background = t.sidebarItemHoverBg; e.currentTarget.style.color = t.fg }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.fgLow }}
              >↗</a>
            )}
            {(hovered || active) && (
              <DotMenu onAskAI={onAskAI} onCopy={copyContent} onDelete={onArchive} />
            )}
          </div>
        </div>

        {/* Editor area */}
        <div className={`quill-expand-area ${expanded ? 'open' : 'closed'}`} style={{ marginLeft: 30 }}>
          <div
            ref={containerRef}
            className="notion-quill"
            style={{ borderTop: `1px solid ${t.border}`, overflow: 'hidden' }}
          />
        </div>
      </div>
    </>
  )
}