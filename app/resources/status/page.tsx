'use client'

import { Footer } from '@/app/landing/Footer'

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance'
type IncidentStatus = 'resolved' | 'investigating' | 'monitoring'
type LogLevel = 'info' | 'warn' | 'error' | 'success'

interface UptimeDay {
  date: string       // ISO date string e.g. "2026-03-09"
  status: ServiceStatus
}

interface Service {
  id: string
  name: string
  description: string
  status: ServiceStatus
  uptime: string     // e.g. "100%" — will come from API
  launchedAt: string // ISO date string
  note: string       // e.g. "Launched · No errors so far"
  uptimeHistory: UptimeDay[]
}

interface IncidentUpdate {
  timestamp: string  // ISO datetime string
  message: string
}

interface Incident {
  id: string
  service: string
  title: string
  status: IncidentStatus
  severity: ServiceStatus
  createdAt: string  // ISO datetime string
  resolvedAt: string | null
  updates: IncidentUpdate[]
}

interface LogEntry {
  id: string
  timestamp: string  // ISO datetime string
  service: string
  level: LogLevel
  message: string
  meta?: Record<string, string | number>
}

interface StatusData {
  updatedAt: string  // ISO datetime string — from API
  services: Service[]
  incidents: Incident[]
  logs: LogEntry[]
}

// ─── Dummy JSON — replace with `fetch('/api/status')` ─────────────────────────

const STATUS_DATA: StatusData = {
  updatedAt: new Date().toISOString(),
  services: [
    {
      id: 'api',
      name: 'API',
      description: 'REST & streaming endpoints',
      status: 'operational',
      uptime: '100%',
      launchedAt: '2026-01-01T00:00:00Z',
      note: 'Launched · No errors so far',
      uptimeHistory: Array.from({ length: 60 }, (_, i) => ({
        date: new Date(Date.now() - (59 - i) * 86400000).toISOString().slice(0, 10),
        status: 'operational' as ServiceStatus,
      })),
    },
    {
      id: 'extension',
      name: 'Browser Extension',
      description: 'Chrome & Firefox extension',
      status: 'operational',
      uptime: '100%',
      launchedAt: '2026-01-01T00:00:00Z',
      note: 'Launched · No errors so far',
      uptimeHistory: Array.from({ length: 60 }, (_, i) => ({
        date: new Date(Date.now() - (59 - i) * 86400000).toISOString().slice(0, 10),
        status: 'operational' as ServiceStatus,
      })),
    },
    {
      id: 'ai',
      name: 'AI Processing',
      description: 'Embeddings & inference',
      status: 'operational',
      uptime: '100%',
      launchedAt: '2026-01-01T00:00:00Z',
      note: 'Launched · No errors so far',
      uptimeHistory: Array.from({ length: 60 }, (_, i) => ({
        date: new Date(Date.now() - (59 - i) * 86400000).toISOString().slice(0, 10),
        status: 'operational' as ServiceStatus,
      })),
    },
  ],
  incidents: [
    {
      id: 'inc-001',
      service: 'API',
      title: 'API — scheduled maintenance window',
      status: 'resolved',
      severity: 'maintenance',
      createdAt: '2026-02-10T02:00:00Z',
      resolvedAt: '2026-02-10T04:00:00Z',
      updates: [
        { timestamp: '2026-02-10T04:00:00Z', message: 'Maintenance complete. All systems nominal.' },
        { timestamp: '2026-02-10T02:00:00Z', message: 'Scheduled maintenance started. API may be intermittently unavailable.' },
      ],
    },
    {
      id: 'inc-002',
      service: 'AI Processing',
      title: 'AI Processing — initial deployment',
      status: 'resolved',
      severity: 'operational',
      createdAt: '2026-01-01T09:00:00Z',
      resolvedAt: '2026-01-01T09:45:00Z',
      updates: [
        { timestamp: '2026-01-01T09:45:00Z', message: 'Deployment complete. Inference endpoints healthy.' },
        { timestamp: '2026-01-01T09:00:00Z', message: 'Initial rollout started. Warming up model serving infrastructure.' },
      ],
    },
  ],
  logs: [
    { id: 'log-001', timestamp: new Date(Date.now() - 2 * 60000).toISOString(),   service: 'API',               level: 'info',    message: 'Health check passed',                     meta: { latency_ms: 12 } },
    { id: 'log-002', timestamp: new Date(Date.now() - 5 * 60000).toISOString(),   service: 'AI Processing',     level: 'info',    message: 'Embedding batch processed',               meta: { batch_size: 64, duration_ms: 340 } },
    { id: 'log-003', timestamp: new Date(Date.now() - 11 * 60000).toISOString(),  service: 'Browser Extension', level: 'success', message: 'Extension update v1.0.3 pushed',           meta: {} },
    { id: 'log-004', timestamp: new Date(Date.now() - 18 * 60000).toISOString(),  service: 'API',               level: 'info',    message: 'Rate limit headers updated',              meta: {} },
    { id: 'log-005', timestamp: new Date(Date.now() - 34 * 60000).toISOString(),  service: 'AI Processing',     level: 'info',    message: 'Model warm-up completed',                 meta: { model: 'embed-v2' } },
    { id: 'log-006', timestamp: new Date(Date.now() - 60 * 60000).toISOString(),  service: 'API',               level: 'info',    message: 'Deployment v1.4.0 rolled out',            meta: {} },
    { id: 'log-007', timestamp: new Date(Date.now() - 90 * 60000).toISOString(),  service: 'Browser Extension', level: 'info',    message: 'CDN cache purged',                        meta: {} },
    { id: 'log-008', timestamp: new Date(Date.now() - 140 * 60000).toISOString(), service: 'AI Processing',     level: 'success', message: 'Auto-scaling policy verified',            meta: { min: 2, max: 10 } },
  ],
}

// ─── Display maps ─────────────────────────────────────────────────────────────

const STATUS_META: Record<ServiceStatus, { label: string; color: string; bg: string; border: string }> = {
  operational: { label: 'Operational', color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.18)'  },
  degraded:    { label: 'Degraded',    color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.18)'  },
  outage:      { label: 'Outage',      color: '#fb7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.18)' },
  maintenance: { label: 'Maintenance', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.18)' },
}

const INCIDENT_STATUS_META: Record<IncidentStatus, { label: string; color: string; bg: string; border: string }> = {
  resolved:     { label: 'Resolved',     color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)'  },
  investigating:{ label: 'Investigating',color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)'  },
  monitoring:   { label: 'Monitoring',   color: '#38bdf8', bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.2)'  },
}

const LOG_LEVEL_META: Record<LogLevel, { color: string; bg: string; label: string }> = {
  info:    { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)',   label: 'INFO'    },
  warn:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   label: 'WARN'    },
  error:   { color: '#fb7185', bg: 'rgba(251,113,133,0.1)',  label: 'ERROR'   },
  success: { color: '#34d399', bg: 'rgba(52,211,153,0.1)',   label: 'OK'      },
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'API': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  'Browser Extension': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  'AI Processing': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
    </svg>
  ),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  })
}

function formatRelative(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .st-1 { animation: fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .st-2 { animation: fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
  .st-3 { animation: fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.20s both; }

  @keyframes pulse-dot {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.35; }
  }
  .live-dot { animation: pulse-dot 2.4s ease-in-out infinite; }

  .svc-card {
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.025);
    padding: 26px 22px 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .svc-card:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.11);
    transform: translateY(-2px);
  }

  .bar-track { display: flex; gap: 2px; height: 20px; align-items: stretch; }
  .bar { flex: 1; border-radius: 2px; min-width: 2px; }

  .incident-card {
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.02);
    overflow: hidden;
  }

  .log-row {
    display: grid;
    grid-template-columns: 80px 130px 120px 1fr auto;
    align-items: center;
    gap: 16px;
    padding: 9px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }
  .log-row:last-child { border-bottom: none; }
  .log-row:hover { background: rgba(255,255,255,0.025); }
`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StatusPage() {
  // TODO: replace with `const data = await fetch('/api/status').then(r => r.json())`
  const { updatedAt, services, incidents, logs } = STATUS_DATA

  const updatedLabel = formatTimestamp(updatedAt)

  return (
    <>
      <style>{CSS}</style>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '72px 40px 96px' }}>

        {/* ── Services grid ───────────────────────────────────────────────── */}
        <section className="st-1">
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '0 0 20px' }}>
            Services
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {services.map((svc) => {
              const meta = STATUS_META[svc.status]
              const icon = SERVICE_ICONS[svc.name]
              const barColor = (s: ServiceStatus) =>
                s === 'operational' ? '#34d399' : s === 'degraded' ? '#fbbf24' : s === 'outage' ? '#fb7185' : '#a78bfa'

              return (
                <div key={svc.id} className="svc-card">

                  {/* Top: icon + name + badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ color: 'rgba(255,255,255,0.35)' }}>{icon}</div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', marginBottom: 3 }}>{svc.name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>{svc.description}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 6, padding: '3px 9px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {meta.label}
                    </span>
                  </div>

                  {/* Uptime bar */}
                  <div>
                    <div className="bar-track">
                      {svc.uptimeHistory.map((day) => (
                        <div
                          key={day.date}
                          className="bar"
                          title={`${day.date} — ${day.status}`}
                          style={{ background: barColor(day.status), opacity: day.status === 'operational' ? 0.38 : 0.85 }}
                        />
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>60 days ago</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{svc.uptime} uptime</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>Today</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.42)' }}>{svc.note}</span>
                    </div>
                    <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.18)', whiteSpace: 'nowrap' }}>
                      {updatedLabel}
                    </span>
                  </div>

                </div>
              )
            })}
          </div>
        </section>

        {/* ── Incident history ────────────────────────────────────────────── */}
        <section className="st-2" style={{ marginTop: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '0 0 20px' }}>
            Incident History
          </p>
          {incidents.length === 0 ? (
            <div style={{ padding: '28px 24px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', fontSize: 13, color: 'rgba(255,255,255,0.28)', textAlign: 'center' }}>
              No incidents recorded.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {incidents.map((inc) => {
                const sm = INCIDENT_STATUS_META[inc.status]
                const sv = STATUS_META[inc.severity]
                return (
                  <div key={inc.id} className="incident-card">
                    {/* Header */}
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>{inc.title}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: sv.color, background: sv.bg, border: `1px solid ${sv.border}`, borderRadius: 5, padding: '2px 7px', flexShrink: 0 }}>
                          {STATUS_META[inc.severity].label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.28)' }}>{formatTimestamp(inc.createdAt)}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: sm.color, background: sm.bg, border: `1px solid ${sm.border}`, borderRadius: 5, padding: '2px 8px' }}>
                          {sm.label}
                        </span>
                      </div>
                    </div>
                    {/* Updates */}
                    <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {inc.updates.map((u) => (
                        <div key={u.timestamp} style={{ display: 'flex', gap: 16 }}>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 500, flexShrink: 0, width: 80, paddingTop: 2, fontFamily: 'monospace' }}>
                            {formatTime(u.timestamp)}
                          </span>
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.58)', lineHeight: 1.6 }}>{u.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── System logs ─────────────────────────────────────────────────── */}
        <section className="st-3" style={{ marginTop: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '0 0 20px' }}>
            System Logs
          </p>
          <div style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)', overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px 130px 120px 1fr auto', gap: 16, padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
              {['Level', 'Time', 'Service', 'Message', 'Meta'].map((h) => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Sans',sans-serif" }}>
                  {h}
                </span>
              ))}
            </div>
            {/* Rows */}
            {logs.map((entry) => {
              const lm = LOG_LEVEL_META[entry.level]
              const metaStr = entry.meta && Object.keys(entry.meta).length > 0
                ? Object.entries(entry.meta).map(([k, v]) => `${k}=${v}`).join(' ')
                : '—'
              return (
                <div key={entry.id} className="log-row">
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: lm.color, background: lm.bg, borderRadius: 5, padding: '2px 7px', width: 'fit-content' }}>
                    {lm.label}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{formatRelative(entry.timestamp)}</span>
                  <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{entry.service}</span>
                  <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)' }}>{entry.message}</span>
                  <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap' }}>{metaStr}</span>
                </div>
              )
            })}
          </div>
        </section>

      </div>

      <Footer />
    </>
  )
}