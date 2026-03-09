'use client'

import Link from 'next/link'
import { accent, t } from './shared'

export function Ribbon() {
  return (
    <div style={{
      width: '100%',
      background: accent.primary,
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    }}>
      <span style={{
        fontSize: 13,
        fontWeight: 500,
        color: '#000',
        letterSpacing: '0.01em',
      }}>
        🚀 Launching soon —
      </span>
      <Link
        href="/waitlist"
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#000',
          textDecoration: 'underline',
          textUnderlineOffset: 3,
          whiteSpace: 'nowrap',
        }}
      >
        Join the early access waitlist →
      </Link>
    </div>
  )
}