import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, description, created_at')
    .order('created_at', { ascending: false })

  const { count } = await supabase
    .from('clips')
    .select('*', { count: 'exact', head: true })

  return (
    <DashboardClient
      initialProjects={projects ?? []}
      initialCount={count ?? 0}
      userEmail={user.email ?? ''}
    />
  )
}