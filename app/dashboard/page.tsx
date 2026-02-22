import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .dash-root {
          min-height: 100vh;
          background: #f8f8f7;
          font-family: 'DM Sans', sans-serif;
          color: #0f0f0f;
        }

        .dash-header {
          height: 56px;
          background: #fff;
          border-bottom: 1px solid #ebebea;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .dash-logo {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 5px;
          color: #0f0f0f;
        }

        .dash-header-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .dash-email {
          font-size: 12px;
          color: #aaa;
        }

        .dash-signout {
          font-size: 11px;
          color: #888;
          background: none;
          border: 1px solid #e5e5e4;
          padding: 5px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }

        .dash-signout:hover {
          border-color: #0f0f0f;
          color: #0f0f0f;
        }

        .dash-body {
          max-width: 820px;
          margin: 0 auto;
          padding: 48px 32px;
        }

        .dash-top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 40px;
          gap: 20px;
        }

        .dash-title-block {}

        .dash-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          color: #bbb;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .dash-title {
          font-family: 'DM Serif Display', serif;
          font-size: 36px;
          color: #0f0f0f;
          line-height: 1.1;
          letter-spacing: -0.8px;
        }

        .dash-stats {
          display: flex;
          gap: 0;
          flex-shrink: 0;
          background: #fff;
          border: 1px solid #ebebea;
          border-radius: 14px;
          overflow: hidden;
        }

        .dash-stat {
          padding: 14px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .dash-stat + .dash-stat {
          border-left: 1px solid #ebebea;
        }

        .dash-stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 26px;
          color: #0f0f0f;
          line-height: 1;
        }

        .dash-stat-label {
          font-size: 10px;
          color: #bbb;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .section-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #bbb;
          text-transform: uppercase;
        }

        .new-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 9px 18px;
          background: #0f0f0f;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.15s, transform 0.1s;
          letter-spacing: 0.1px;
        }

        .new-btn:hover { background: #333; }
        .new-btn:active { transform: scale(0.98); }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .project-card {
          background: #fff;
          border: 1.5px solid #ebebea;
          border-radius: 14px;
          padding: 18px 22px;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
        }

        .project-card:hover {
          border-color: #0f0f0f;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          transform: translateY(-1px);
        }

        .project-card-title {
          font-size: 14px;
          font-weight: 600;
          color: #0f0f0f;
          margin-bottom: 2px;
        }

        .project-card-desc {
          font-size: 12px;
          color: #aaa;
          font-weight: 300;
        }

        .project-card-right {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
          margin-left: 20px;
        }

        .project-card-date {
          font-size: 11px;
          color: #ccc;
        }

        .project-card-arrow {
          font-size: 14px;
          color: #ccc;
          transition: color 0.15s, transform 0.15s;
        }

        .project-card:hover .project-card-arrow {
          color: #0f0f0f;
          transform: translateX(2px);
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          border: 1.5px dashed #e5e5e4;
          border-radius: 16px;
          background: #fff;
        }

        .empty-title {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #ccc;
          margin-bottom: 8px;
        }

        .empty-sub {
          font-size: 13px;
          color: #ccc;
          font-weight: 300;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="dash-root">
        <header className="dash-header">
          <span className="dash-logo">OSCIL</span>
          <div className="dash-header-right">
            <span className="dash-email">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button className="dash-signout" type="submit">Sign out</button>
            </form>
          </div>
        </header>

        <main className="dash-body">
          <div className="dash-top">
            <div className="dash-title-block">
              <div className="dash-eyebrow">Research Playground</div>
              <h1 className="dash-title">Your Projects</h1>
            </div>
            <div className="dash-stats">
              <div className="dash-stat">
                <span className="dash-stat-num">{projects?.length ?? 0}</span>
                <span className="dash-stat-label">Projects</span>
              </div>
              <div className="dash-stat">
                <span className="dash-stat-num">{count ?? 0}</span>
                <span className="dash-stat-label">Clips</span>
              </div>
            </div>
          </div>

          <div className="section-row">
            <span className="section-label">All Projects</span>
            <Link href="/dashboard/new" className="new-btn">+ New Project</Link>
          </div>

          {!projects?.length ? (
            <div className="empty-state">
              <div className="empty-title">No projects yet.</div>
              <div className="empty-sub">Create one and start clipping from the web.</div>
              <Link href="/dashboard/new" className="new-btn" style={{ display: 'inline-flex' }}>
                + New Project
              </Link>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map(p => (
                <Link key={p.id} href={`/dashboard/project/${p.id}`} className="project-card">
                  <div>
                    <div className="project-card-title">{p.title}</div>
                    {p.description && <div className="project-card-desc">{p.description}</div>}
                  </div>
                  <div className="project-card-right">
                    <span className="project-card-date">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="project-card-arrow">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}