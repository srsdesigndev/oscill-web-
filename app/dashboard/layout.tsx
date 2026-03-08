'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SharedSidebar } from './SharedSidebar'

// Place this file at: app/dashboard/layout.tsx
// Wraps all /dashboard/* routes — sidebar stays mounted on every navigation.

type ProjectWithDate = { id: string; title: string; description: string | null; created_at: string }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const router   = useRouter()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userEmail, setUserEmail]     = useState('')
  const [projects, setProjects]       = useState<ProjectWithDate[]>([])
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserEmail(user.email || '')
      const { data } = await supabase
        .from('projects')
        .select('id, title, description, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setProjects((data || []) as ProjectWithDate[])
    }
    init()
  }, []) // eslint-disable-line

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <SharedSidebar
        initialProjects={projects}
        userEmail={userEmail}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(s => !s)}
      />
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}