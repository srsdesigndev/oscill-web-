'use client'

import { GLOBAL_CSS, t } from "../landing/shared"
import { ResourcesNav } from "./components/ResourcesNav"

// Drop this layout at app/resources/layout.tsx
// All child pages (docs, changelog, status, blog) inherit it automatically.

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: t.bg,
      color: t.fg,
      fontFamily: "'DM Sans', sans-serif",
      overflowX: 'hidden',
    }}>
      <style>{GLOBAL_CSS}</style>
      <ResourcesNav />
      {/* Offset for fixed nav */}
      <div style={{ paddingTop: 56 }}>
        {children}
      </div>
    </div>
  )
}