export const FONT = `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`

export type Item = {
  id: string
  type: string
  label: string | null      // mapped from page_title
  content: string | null    // mapped from text (the clipped content)
  note: string | null       // mapped from note (user's own notes)
  url: string | null
  file_url: string | null
  file_name: string | null
  file_type: string | null
  urls: unknown | null      // jsonb
  tags: string[]
  followups: unknown | null // jsonb
  pinned: boolean
  archived: boolean
  saved_at: string
  last_opened_at: string | null
  last_edited?: string
  project_id: string
  user_id: string
}

export type Project = { id: string; title: string; description: string | null }
export type ChatMessage = { role: 'user' | 'assistant'; text: string }

export function norm(raw: Record<string, unknown>): Item {
  return {
    id: raw.id as string,
    type: (raw.type as string) || 'text',
    label: (raw.page_title || raw.label || null) as string | null,
    content: (raw.text || null) as string | null,           // clipped text
    note: (raw.note || null) as string | null,              // user note
    url: (raw.url || null) as string | null,
    file_url: (raw.file_url || null) as string | null,
    file_name: (raw.file_name || null) as string | null,
    file_type: (raw.file_type || null) as string | null,
    urls: (raw.urls || null),
    tags: (raw.tags as string[]) || [],
    followups: (raw.followups || null),
    pinned: (raw.pinned as boolean) || false,
    archived: (raw.archived as boolean) || false,
    saved_at: raw.saved_at as string,
    last_opened_at: (raw.last_opened_at || null) as string | null,
    last_edited: (raw.last_edited || raw.saved_at) as string,
    project_id: raw.project_id as string,
    user_id: raw.user_id as string,
  }
}

export function ageLabel(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}