'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// ── Accent (same as landing) ──────────────────────────────────────────────────
export const accent = {
  primary:        '#7965F6',
  secondary:      '#5177F6',
  gradient:       'linear-gradient(135deg, #7965F6 0%, #5177F6 100%)',
  gradientSubtle: 'linear-gradient(135deg, rgba(121,101,246,0.12) 0%, rgba(81,119,246,0.12) 100%)',
  glow:           '0 4px 24px rgba(121,101,246,0.35)',
  glowLg:         '0 8px 40px rgba(121,101,246,0.45)',
  border:         'rgba(121,101,246,0.3)',
  borderHover:    'rgba(121,101,246,0.55)',
}

// ── Tokens ────────────────────────────────────────────────────────────────────
// Light values match the original Notion-style sidebar exactly.
// Dark values match the new dark design system.
export function tokens(dark: boolean) {
  return {
    // Backgrounds
    bg:        dark ? '#000000'                : '#ffffff',
    surfaceBg: dark ? '#0a0a0a'               : '#f7f6f3',  // original light surface
    cardBg:    dark ? 'rgba(255,255,255,0.04)': '#ffffff',
    navBg:     dark ? 'rgba(0,0,0,0.8)'       : 'rgba(255,255,255,0.8)',
    sidebarBg: dark ? '#0a0a0a'               : '#f7f6f3',  // original: #f7f6f3
    inputBg:   dark ? 'rgba(255,255,255,0.05)': '#ffffff',
    modalBg:   dark ? '#111111'               : '#ffffff',
    modalFooterBg: dark ? 'rgba(255,255,255,0.03)' : '#f7f6f3', // original modal footer

    // Text
    fg:        dark ? '#ffffff'               : '#37352f',  // original: #37352f
    fgMid:     dark ? 'rgba(255,255,255,0.5)' : 'rgba(55,53,47,0.65)',
    fgLow:     dark ? 'rgba(255,255,255,0.28)': 'rgba(55,53,47,0.4)', // original muted text

    // Borders
    border:    dark ? 'rgba(255,255,255,0.08)': '#e9e9e7',  // original: #e9e9e7
    borderMid: dark ? 'rgba(255,255,255,0.12)': '#e9e9e7',

    // Sidebar specific
    sidebarItem:        'transparent',
    sidebarItemHoverBg: dark ? 'rgba(255,255,255,0.05)' : 'rgba(55,53,47,0.07)', // original hover
    sidebarItemHoverFg: dark ? 'rgba(255,255,255,0.85)' : '#37352f',
    sidebarFg:          dark ? 'rgba(255,255,255,0.45)' : 'rgba(55,53,47,0.7)',  // original item text
    sidebarLabelFg:     dark ? 'rgba(255,255,255,0.2)'  : 'rgba(55,53,47,0.45)', // original label

    // Active item — dark: subtle violet tint / light: solid gradient (original behaviour)
    sidebarActiveBg:     dark
      ? 'linear-gradient(135deg, rgba(121,101,246,0.15), rgba(81,119,246,0.15))'
      : 'linear-gradient(135deg, #6B8DF5 0%, #7B5CE6 100%)',                     // original solid
    sidebarActiveBorder: dark ? 'rgba(121,101,246,0.3)' : 'transparent',
    sidebarActiveFg:     '#ffffff',  // white text in both modes when active

    // Icon button
    iconBtnBg:      'transparent',
    iconBtnHoverBg: dark ? 'rgba(255,255,255,0.07)' : 'rgba(55,53,47,0.08)', // original
    iconBtnFg:      dark ? 'rgba(255,255,255,0.3)'  : 'rgba(55,53,47,0.4)',  // original

    // Scrollbar
    scrollbar: dark ? 'rgba(255,255,255,0.08)' : 'rgba(55,53,47,0.15)',

    // Shadow
    shadow: dark
      ? '0 8px 40px rgba(0,0,0,0.5)'
      : '0 1px 4px rgba(15,15,15,0.08)',
    shadowModal: dark
      ? '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(121,101,246,0.12)'
      : 'rgba(15,15,15,0.1) 0 0 0 1px, rgba(15,15,15,0.2) 0 8px 32px -4px',
  }
}

export type AppTokens = ReturnType<typeof tokens>

// ── Theme Context ─────────────────────────────────────────────────────────────
interface ThemeCtx {
  dark: boolean
  toggle: () => void
  t: AppTokens
}

const ThemeContext = createContext<ThemeCtx>({
  dark: false,
  toggle: () => {},
  t: tokens(false),
})

export function useAppTheme() {
  return useContext(ThemeContext)
}

// ── Provider ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'ProductName-theme'

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false) // default light, updated on mount

  // Hydrate from localStorage on mount — avoids SSR mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        setDark(stored === 'dark')
      } else {
        // Default: respect OS preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setDark(prefersDark)
      }
    } catch {
      // localStorage unavailable (private browsing edge case)
    }
  }, [])

  function toggle() {
    setDark(prev => {
      const next = !prev
      try { localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light') } catch {}
      return next
    })
  }

  const t = tokens(dark)

  return (
    <ThemeContext.Provider value={{ dark, toggle, t }}>
      {/* Apply bg colour to document body so there's no flash on page transitions */}
      <style>{`body { background: ${t.bg}; transition: background 0.2s; }`}</style>
      {children}
    </ThemeContext.Provider>
  )
}

// ── Theme Toggle Button (drop-in component) ───────────────────────────────────
export function ThemeToggle({ size = 32 }: { size?: number }) {
  const { dark, toggle, t } = useAppTheme()
  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: size, height: size, borderRadius: 8,
        border: `1px solid ${t.border}`,
        background: t.iconBtnBg,
        color: t.fgMid,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = t.iconBtnHoverBg)}
      onMouseLeave={e => (e.currentTarget.style.background = t.iconBtnBg)}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

// ── Sun / Moon icons ──────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
)