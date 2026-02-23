'use client'

import { useEffect, useRef, useState } from 'react'
import { FONT, Item, ageLabel } from './types'
import { ConfirmDelete } from './ui'

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
    s.async = true
    s.onload = cb
    document.body.appendChild(s)
  } else {
    document.getElementById('ql-js')!.addEventListener('load', cb, { once: true })
  }
}

function isHTML(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str)
}

// The separator text we scan for when splitting back out on save
const SEP = '——— Note ———'

/** Combine clip + note into a single HTML string for Quill */
function buildHTML(content: string | null, note: string | null): string {
  const toHTML = (s: string) =>
    isHTML(s) ? s : `<p>${s.replace(/\n/g, '</p><p>')}</p>`

  const clipPart = content ? toHTML(content) : '<p><br></p>'
  const notePart = note ? toHTML(note) : '<p><br></p>'

  return (
    clipPart +
    `<p><br></p>` +
    `<p><strong>${SEP}</strong></p>` +
    `<p><br></p>` +
    notePart
  )
}

/** Split plain text back into content + note using the separator */
function splitText(fullText: string): { content: string | null; note: string | null } {
  const idx = fullText.indexOf(SEP)
  if (idx === -1) return { content: fullText.trim() || null, note: null }
  return {
    content: fullText.slice(0, idx).trim() || null,
    note: fullText.slice(idx + SEP.length).trim() || null,
  }
}

export function QuillBlock({
  item,
  onSave,
  onPin,
  onArchive,
  selected,
  onToggleSelect,
  isNew,
}: {
  item: Item
  onSave: (u: Partial<Item>) => void
  onPin: () => void
  onArchive: () => void
  selected: boolean
  onToggleSelect: () => void
  isNew?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [label, setLabel] = useState(item.label || '')
  const [saved, setSaved] = useState(false)
  const [active, setActive] = useState(false)
  const [showDel, setShowDel] = useState(false)

  function schedule(l: string, content: string | null, note: string | null) {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      onSave({ label: l || null, content, note })
      setSaved(true)
      setTimeout(() => setSaved(false), 1200)
    }, 700)
  }

  useEffect(() => {
    loadQuill(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Q = (window as any).Quill
      if (!Q) return
      const container = containerRef.current
      if (!container) return

      container.innerHTML = ''
      const el = document.createElement('div')
      container.appendChild(el)

      const quill = new Q(el, {
        theme: 'snow',
        placeholder: 'Start writing...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
          ],
        },
      })

      // Inject clip + separator + note as one HTML blob
      quill.clipboard.dangerouslyPasteHTML(buildHTML(item.content, item.note))

      quill.on('text-change', () => {
        const { content, note } = splitText(quill.getText())
        schedule(labelRef.current?.value ?? label, content, note)
      })

      quill.on('selection-change', (range: unknown) => setActive(!!range))
      quillRef.current = quill
    })

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
      quillRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id])

  const border = active || isNew
    ? '2px solid #6366f1'
    : selected
    ? '2px solid #18181b'
    : '1.5px solid #e4e4e7'

  const shadow = active || isNew
    ? '0 0 0 3px rgba(99,102,241,0.1)'
    : selected
    ? '0 0 0 3px rgba(24,24,27,0.08)'
    : '0 1px 3px rgba(0,0,0,0.06)'

  const lastEdited = item.last_edited || item.saved_at

  return (
    <div style={{
      background: '#fff',
      border,
      borderRadius: 6,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'border-color 0.15s, box-shadow 0.15s',
      boxShadow: shadow,
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 10px 6px', borderBottom: '1px solid #f4f4f5',
        flexShrink: 0, background: '#fff',
      }}>
        <button
          onClick={onToggleSelect}
          title="Select for Oscil AI"
          style={{
            width: 14, height: 14, borderRadius: 3, flexShrink: 0, cursor: 'pointer',
            border: selected ? '2px solid #18181b' : '1.5px solid #d4d4d8',
            background: selected ? '#18181b' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.1s',
          }}
        >
          {selected && <span style={{ color: '#fff', fontSize: 8, fontWeight: 900 }}>✓</span>}
        </button>

        <input
          ref={labelRef}
          type="text"
          value={label}
          onChange={e => {
            setLabel(e.target.value)
            const { content, note } = splitText(quillRef.current?.getText() || '')
            schedule(e.target.value, content, note)
          }}
          placeholder="Your title goes here"
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 9.5, fontWeight: 600, color: '#18181b', fontFamily: FONT,
          }}
        />

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.url}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6366f1', textDecoration: 'none', fontSize: 11,
              width: 20, height: 20, borderRadius: 4,
              border: '1px solid #c7d2fe', background: '#eef2ff',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#eef2ff' }}
          >
            ↗
          </a>
        )}

        <button
          onClick={() => setShowDel(true)}
          title="Delete"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0 1px', flexShrink: 0, color: '#d4d4d8',
            fontSize: 10, lineHeight: 1, fontFamily: FONT,
          }}
        >
          ✕
        </button>
      </div>

      {showDel && (
        <ConfirmDelete
          onConfirm={() => { setShowDel(false); onArchive() }}
          onCancel={() => setShowDel(false)}
        />
      )}

      {/* ── Single Quill editor ── */}
      <div
        ref={containerRef}
        className="block-editor"
        style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      />

      {/* ── Footer ── */}
      <div style={{
        padding: '3px 10px 4px', borderTop: '1px solid #f9f9f9',
        flexShrink: 0, display: 'flex', alignItems: 'center',
        background: '#fafafa',
      }}>
        {saved
          ? <span style={{ fontSize: 9, color: '#10b981', fontWeight: 700, fontFamily: FONT }}>✓ saved</span>
          : <span style={{ fontSize: 9, color: '#c4c4c4', fontFamily: FONT }}>edited {ageLabel(lastEdited)}</span>
        }
      </div>
    </div>
  )
}