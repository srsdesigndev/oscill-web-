import { FONT } from './types'

export function OscilMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.65)} viewBox="0 0 20 13" fill="none">
      <path d="M0 6.5 C2 3 3.8 3 5.5 6.5 S9.5 10 11.5 6.5 S15.5 3 17.5 6.5 L20 4.5"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function ConfirmDelete({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)',
        fontFamily: FONT,
      }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div style={{
        width: 340, background: '#fff', borderRadius: 12,
        border: '1.5px solid #e4e4e7',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '28px 28px 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: '#fff1f2', border: '1.5px solid #fecdd3',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>🗑</div>
        </div>
        <div style={{ padding: '16px 28px 20px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: '#18181b' }}>
            Delete this note?
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#71717a', lineHeight: 1.6 }}>
            This will permanently remove the note and all its content. This cannot be undone.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 20px' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '9px 0', borderRadius: 7, cursor: 'pointer',
            border: '1.5px solid #e4e4e7', background: '#fff',
            fontSize: 13, fontWeight: 600, color: '#3f3f46', fontFamily: FONT,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f4f4f5' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '9px 0', borderRadius: 7, cursor: 'pointer',
            border: 'none', background: '#ef4444',
            fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: FONT,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#dc2626' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ef4444' }}
          >Delete</button>
        </div>
      </div>
    </div>
  )
}

export const GLOBAL_STYLES = `
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 99px; }

  .block-editor { display: flex; flex-direction: column; min-height: 0; }
  .block-editor .ql-toolbar.ql-snow {
    border: none !important;
    border-bottom: 1px solid #f4f4f5 !important;
    padding: 3px 8px !important;
    background: #fafafa;
    flex-shrink: 0;
  }
  .block-editor .ql-container.ql-snow {
    border: none !important;
    font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif !important;
    font-size: 12px !important;
    flex: 1; min-height: 0; overflow: hidden;
    display: flex; flex-direction: column;
  }
  .block-editor .ql-editor {
    padding: 9px 11px !important;
    font-size: 12px !important;
    line-height: 1.65 !important;
    color: #52525b !important;
    flex: 1; overflow-y: auto !important; min-height: 0 !important;
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .block-editor .ql-editor::-webkit-scrollbar { display: none; }
  .block-editor .ql-editor.ql-blank::before {
    font-style: normal !important; color: #d4d4d8 !important;
    font-size: 12px; left: 11px !important;
  }
  .block-editor .ql-snow .ql-stroke { stroke: #c4c4c4 !important; }
  .block-editor .ql-snow .ql-fill  { fill:   #c4c4c4 !important; }
  .block-editor .ql-toolbar button:hover .ql-stroke,
  .block-editor .ql-toolbar button.ql-active .ql-stroke { stroke: #18181b !important; }
  .block-editor .ql-toolbar .ql-formats { margin-right: 8px !important; }

  .dot-bounce {
    width: 5px; height: 5px; border-radius: 50%; background: #a1a1aa;
    display: inline-block; animation: dotBounce 1.2s infinite ease-in-out;
  }
  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); }
    40%           { transform: translateY(-4px); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .entries-grid {
    display: grid; gap: 12px;
    grid-template-columns: repeat(2, 1fr);
    align-content: start;
  }
  @media (min-width: 1024px) { .entries-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1400px) { .entries-grid { grid-template-columns: repeat(4, 1fr); } }
`
