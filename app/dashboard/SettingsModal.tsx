'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAppTheme, accent } from './DShared'

// ── Icons ─────────────────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)
const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
)
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const PaletteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="8" cy="14" r="1" fill="currentColor"/>
    <circle cx="12" cy="8" r="1" fill="currentColor"/>
    <circle cx="16" cy="14" r="1" fill="currentColor"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const BellIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)

// ── Toggle ─────────────────────────────────────────────────────────────────────
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{
      width: 38, height: 21, borderRadius: 100, border: 'none',
      cursor: 'pointer', flexShrink: 0, padding: 0,
      background: on ? accent.gradient : 'rgba(128,128,128,0.25)',
      position: 'relative', transition: 'background 0.2s',
    }}>
      <div style={{
        width: 15, height: 15, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: on ? 20 : 3,
        transition: 'left 0.18s', boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      }} />
    </button>
  )
}

// ── Types ──────────────────────────────────────────────────────────────────────
type Tab = 'account' | 'appearance' | 'data' | 'notifications'

const NAV: { id: Tab; label: string; Icon: React.FC }[] = [
  { id: 'account',       label: 'Account',       Icon: UserIcon    },
  { id: 'appearance',    label: 'Appearance',     Icon: PaletteIcon },
  { id: 'data',          label: 'Data & Privacy', Icon: ShieldIcon  },
  { id: 'notifications', label: 'Notifications',  Icon: BellIcon    },
]

// ── Confirm Dialog ─────────────────────────────────────────────────────────────
function ConfirmDialog({ message, confirmLabel, onConfirm, onCancel }: {
  message: string; confirmLabel: string
  onConfirm: () => void; onCancel: () => void
}) {
  const { t } = useAppTheme()
  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: t.modalBg, borderRadius: 14, border: `1px solid ${t.border}`, padding: '24px', maxWidth: 360, width: '100%', boxShadow: t.shadowModal }}>
        <p style={{ fontSize: 13.5, color: t.fg, lineHeight: 1.65, marginBottom: 20 }}>{message}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${t.border}`, background: 'transparent', color: t.fgMid, fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

// ── Settings Modal ─────────────────────────────────────────────────────────────
export function SettingsModal({ userEmail, onClose }: {
  userEmail: string
  onClose: () => void
}) {
  const { dark, toggle, t } = useAppTheme()
  const supabase = createClient()
  const router   = useRouter()

  const [tab, setTab]             = useState<Tab>('account')
  const [newEmail, setNewEmail]   = useState(userEmail)
  const [newPw, setNewPw]         = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [feedback, setFeedback]   = useState<{ msg: string; ok: boolean } | null>(null)
  const [loading, setLoading]     = useState(false)
  const [confirm, setConfirm]     = useState<null | 'data' | 'account'>(null)

  // Appearance
  const [fontSize, setFontSize]         = useState<'sm' | 'md' | 'lg'>('md')
  const [density, setDensity]           = useState<'compact' | 'comfortable'>('comfortable')
  const [sidebarWidth, setSidebarWidth] = useState<'narrow' | 'default' | 'wide'>('default')

  // Notifications
  const [notifWeekly, setNotifWeekly]   = useState(false)
  const [notifProduct, setNotifProduct] = useState(true)
  const [notifTips, setNotifTips]       = useState(true)
  const [notifDigest, setNotifDigest]   = useState(false)

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  function flash(msg: string, ok = true) {
    setFeedback({ msg, ok })
    setTimeout(() => setFeedback(null), 3500)
  }

  async function updateEmail() {
    if (!newEmail || newEmail === userEmail) return
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    setLoading(false)
    error ? flash(error.message, false) : flash('Confirmation sent to your new email.')
  }

  async function updatePassword() {
    if (!newPw) return
    if (newPw !== confirmPw) { flash('Passwords do not match.', false); return }
    if (newPw.length < 8)    { flash('Min 8 characters required.', false); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setLoading(false)
    if (error) { flash(error.message, false) } else { flash('Password updated.'); setNewPw(''); setConfirmPw('') }
  }

  async function deleteAllData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('clips').delete().eq('user_id', user!.id)
    await supabase.from('projects').delete().eq('user_id', user!.id)
    setLoading(false); setConfirm(null)
    flash('All clips and projects deleted.')
  }

  async function deleteAccount() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('clips').delete().eq('user_id', user!.id)
    await supabase.from('projects').delete().eq('user_id', user!.id)
    await supabase.functions.invoke('delete-user', { body: { user_id: user!.id } })
    await supabase.auth.signOut()
    router.push('/')
  }

  // ── Shared style helpers ───────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    border: `1px solid ${t.border}`, borderRadius: 8,
    background: t.inputBg, color: t.fg,
    fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    outline: 'none', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    fontSize: 10.5, fontWeight: 600, color: t.fgLow,
    textTransform: 'uppercase', letterSpacing: '1px',
    display: 'block', marginBottom: 8,
  }
  const sec: React.CSSProperties = {
    paddingBottom: 18, marginBottom: 18,
    borderBottom: `1px solid ${t.border}`,
  }
  const btnPrimary: React.CSSProperties = {
    padding: '8px 16px', borderRadius: 8, border: 'none',
    background: accent.gradient, color: '#fff',
    fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer', boxShadow: accent.glow, whiteSpace: 'nowrap',
  }
  const btnDanger: React.CSSProperties = {
    padding: '8px 16px', borderRadius: 8,
    background: 'transparent', color: '#ef4444',
    fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
    border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
  }

  function ChipRow({ val, opts, set }: { val: string; opts: string[]; set: (v: any) => void }) {
    return (
      <div style={{ display: 'flex', gap: 6 }}>
        {opts.map(o => (
          <button key={o} onClick={() => set(o)} style={{
            flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
            border: val === o ? `2px solid ${accent.primary}` : `1px solid ${t.border}`,
            background: val === o ? accent.gradientSubtle : t.cardBg,
            color: val === o ? accent.primary : t.fgMid,
            fontSize: 12.5, fontFamily: "'DM Sans', sans-serif",
            fontWeight: val === o ? 600 : 400, transition: 'all 0.12s',
          }}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </button>
        ))}
      </div>
    )
  }

  // ── Modal — fixed 640 × 480 ────────────────────────────────────────────────
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: 840, height: 640,
            background: t.modalBg,
            borderRadius: 16,
            border: `1px solid ${t.border}`,
            boxShadow: t.shadowModal,
            display: 'flex',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >

          {/* ── LEFT NAV ── */}
          <div style={{
            width: 176, flexShrink: 0,
            background: t.surfaceBg,
            borderRight: `1px solid ${t.border}`,
            display: 'flex', flexDirection: 'column',
            padding: '18px 10px 14px',
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: t.fgLow, textTransform: 'uppercase', letterSpacing: '1.2px', padding: '0 8px', marginBottom: 12 }}>
              Settings
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              {NAV.map(({ id, label, Icon }) => {
                const active = tab === id
                return (
                  <button key={id} onClick={() => { setTab(id); setFeedback(null) }} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 10px', borderRadius: 8,
                    border: 'none', cursor: 'pointer',
                    width: '100%', textAlign: 'left',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? accent.primary : t.sidebarFg,
                    background: active ? accent.gradientSubtle : 'transparent',
                    transition: 'background 0.12s, color 0.12s',
                  }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = t.sidebarItemHoverBg }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <Icon />
                    {label}
                  </button>
                )
              })}
            </div>

            <div style={{ fontSize: 10.5, color: t.fgLow, padding: '0 8px', lineHeight: 1.7 }}>
              OpenClips<br />
              <span style={{ color: t.fgLow, opacity: 0.7 }}>Early Access</span>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
              <span style={{ fontSize: 14.5, fontWeight: 700, color: t.fg, letterSpacing: '-0.3px' }}>
                {NAV.find(n => n.id === tab)?.label}
              </span>
              <button onClick={onClose} style={{ width: 27, height: 27, borderRadius: 7, border: `1px solid ${t.border}`, background: 'transparent', color: t.fgMid, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <CloseIcon />
              </button>
            </div>

            {/* Feedback */}
            {feedback && (
              <div style={{ margin: '12px 20px 0', padding: '9px 12px', borderRadius: 8, fontSize: 12.5, flexShrink: 0, background: feedback.ok ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${feedback.ok ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}`, color: feedback.ok ? '#4ade80' : '#f87171' }}>
                {feedback.msg}
              </div>
            )}

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', minHeight: 0 }}>

              {/* ACCOUNT */}
              {tab === 'account' && (
                <div>
                  <div style={sec}>
                    <label style={lbl}>Email address</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input style={{ ...inp, flex: 1 }} type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                      <button style={btnPrimary} onClick={updateEmail} disabled={loading || newEmail === userEmail}>Update</button>
                    </div>
                    <p style={{ fontSize: 11.5, color: t.fgLow, marginTop: 6, lineHeight: 1.5 }}>A confirmation link will be sent to the new address.</p>
                  </div>

                  <div style={sec}>
                    <label style={lbl}>Change password</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input style={inp} type="password" placeholder="New password" value={newPw} onChange={e => setNewPw(e.target.value)} />
                      <input style={inp} type="password" placeholder="Confirm new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <button style={btnPrimary} onClick={updatePassword} disabled={loading || !newPw}>Update password</button>
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Signed in as</label>
                    <div style={{ fontSize: 13, color: t.fgMid, padding: '9px 12px', background: t.surfaceBg, borderRadius: 8, border: `1px solid ${t.border}` }}>
                      {userEmail}
                    </div>
                  </div>
                </div>
              )}

              {/* APPEARANCE */}
              {tab === 'appearance' && (
                <div>
                  <div style={sec}>
                    <label style={lbl}>Theme</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[{ l: 'Light', v: false, I: SunIcon }, { l: 'Dark', v: true, I: MoonIcon }].map(opt => (
                        <button type='button' key={opt.l} onClick={(e) => { e.stopPropagation(); if (dark !== opt.v) toggle() }} style={{
                          padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
                          border: dark === opt.v ? `2px solid ${accent.primary}` : `1px solid ${t.border}`,
                          background: dark === opt.v ? accent.gradientSubtle : t.cardBg,
                          color: dark === opt.v ? accent.primary : t.fgMid,
                          display: 'flex', alignItems: 'center', gap: 8,
                          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                          fontWeight: dark === opt.v ? 600 : 400, transition: 'all 0.15s',
                        }}>
                          <opt.I />
                          {opt.l}
                          {dark === opt.v && <span style={{ marginLeft: 'auto', fontSize: 11 }}>✓</span>}
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: 11.5, color: t.fgLow, marginTop: 7 }}>Saved to your browser — persists across sessions.</p>
                  </div>

                  <div style={sec}>
                    <label style={lbl}>Font size</label>
                    <ChipRow val={fontSize} opts={['sm', 'md', 'lg']} set={setFontSize} />
                  </div>

                  <div style={sec}>
                    <label style={lbl}>Layout density</label>
                    <ChipRow val={density} opts={['compact', 'comfortable']} set={setDensity} />
                    <p style={{ fontSize: 11.5, color: t.fgLow, marginTop: 7 }}>Controls spacing between clips and list items.</p>
                  </div>

                  <div>
                    <label style={lbl}>Sidebar width</label>
                    <ChipRow val={sidebarWidth} opts={['narrow', 'default', 'wide']} set={setSidebarWidth} />
                  </div>
                </div>
              )}

              {/* DATA & PRIVACY */}
              {tab === 'data' && (
                <div>
                  <div style={sec}>
                    <label style={lbl}>Export your data</label>
                    <p style={{ fontSize: 13, color: t.fgMid, lineHeight: 1.65, marginBottom: 10 }}>Download all clips, notes, and project metadata as JSON. Your data is always yours.</p>
                    <button style={btnPrimary}>Export as JSON</button>
                  </div>

                  <div style={sec}>
                    <label style={lbl}>What we store</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[
                        { item: 'Clips & saved content', detail: 'URLs, titles, selected text, notes' },
                        { item: 'Projects',              detail: 'Titles, descriptions, structure' },
                        { item: 'Account info',          detail: 'Email only — no tracking' },
                      ].map(({ item, detail }) => (
                        <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, border: `1px solid ${t.border}`, background: t.cardBg }}>
                          <span style={{ fontSize: 12.5, fontWeight: 500, color: t.fg }}>{item}</span>
                          <span style={{ fontSize: 12, color: t.fgLow }}>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={sec}>
                    <label style={lbl}>Delete all data</label>
                    <p style={{ fontSize: 13, color: t.fgMid, lineHeight: 1.65, marginBottom: 10 }}>Removes all clips and projects. Your account stays active.</p>
                    <button style={btnDanger} onClick={() => setConfirm('data')}>Delete all data</button>
                  </div>

                  <div>
                    <label style={lbl}>Delete account</label>
                    <p style={{ fontSize: 13, color: t.fgMid, lineHeight: 1.65, marginBottom: 10 }}>Permanently deletes your account and all data. Cannot be undone.</p>
                    <button style={btnDanger} onClick={() => setConfirm('account')}>Delete my account</button>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {tab === 'notifications' && (
                <div>
                  <div style={{ ...sec, fontSize: 12.5, color: t.fgMid, lineHeight: 1.6, padding: '10px 12px', borderRadius: 9, background: accent.gradientSubtle, border: `1px solid ${accent.border}` }}>
                    Emails go to <strong style={{ color: t.fg }}>{userEmail}</strong>
                  </div>

                  {([
                    { key: 'weekly',  lbl: 'Weekly digest',    desc: 'A summary of what you clipped this week with AI highlights.',          val: notifWeekly,  set: setNotifWeekly,  soon: false },
                    { key: 'tips',    lbl: 'Usage tips',        desc: 'Occasional tips on AI features, shortcuts, and workflows.',            val: notifTips,    set: setNotifTips,    soon: false },
                    { key: 'product', lbl: 'Product updates',   desc: 'New features and improvements — only when something meaningful ships.', val: notifProduct, set: setNotifProduct, soon: false },
                    { key: 'digest',  lbl: 'AI insight digest', desc: "AI surfaces connections and patterns across everything you've saved.", val: notifDigest,  set: setNotifDigest,  soon: true  },
                  ] as const).map(({ key, lbl: l, desc, val, set, soon }, i, arr) => (
                    <div key={key} style={{ ...(i < arr.length - 1 ? sec : {}), display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginTop: i === 0 ? 18 : 0 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: t.fg, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 7 }}>
                          {l}
                          {soon && <span style={{ fontSize: 10, fontWeight: 500, background: accent.gradientSubtle, color: accent.primary, border: `1px solid ${accent.border}`, borderRadius: 5, padding: '1px 6px' }}>Soon</span>}
                        </div>
                        <div style={{ fontSize: 12.5, color: t.fgMid, lineHeight: 1.6 }}>{desc}</div>
                      </div>
                      <Toggle on={val} onToggle={() => set((p: boolean) => !p)} />
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {confirm === 'data' && (
        <ConfirmDialog
          message="This will permanently delete all your clips, notes, and projects. Your account will remain active. This cannot be undone."
          confirmLabel="Yes, delete all data"
          onConfirm={deleteAllData}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm === 'account' && (
        <ConfirmDialog
          message="This will permanently delete your account and all its data. You cannot undo this."
          confirmLabel="Yes, delete my account"
          onConfirm={deleteAccount}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  )
}

// ── Settings Button (sidebar footer drop-in) ───────────────────────────────────
export function SettingsButton({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false)
  const { t } = useAppTheme()
  return (
    <>
      <button onClick={() => setOpen(true)} title="Settings" style={{
        width: 26, height: 26, borderRadius: 7, border: 'none',
        background: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: t.iconBtnFg, flexShrink: 0,
        transition: 'background 0.15s, color 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = t.iconBtnHoverBg; e.currentTarget.style.color = t.fg }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = t.iconBtnFg }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </button>
      {open && <SettingsModal userEmail={userEmail} onClose={() => setOpen(false)} />}
    </>
  )
}