'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const OscilLogo = () => (
  <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_13_13)">
      <path d="M11.9188 17.3086C12.4433 17.0691 12.956 16.8041 13.455 16.5147C14.7995 15.7349 16.0386 14.7839 17.1416 13.6851C19.6687 11.1713 21.3029 8.09132 22.0413 4.84502C22.0807 4.67143 22.0998 4.54301 22.1347 4.36573C22.3372 3.34626 22.8545 2.39235 23.6446 1.60637C25.7501 -0.488357 29.0706 -0.597808 31.2245 1.65281C31.7647 2.2172 32.628 2.89175 32.7128 4.65132C32.7142 5.39511 32.6694 6.13947 32.5794 6.87957C32.1048 10.7986 30.3621 14.59 27.3562 17.5802C23.4339 21.4825 18.1825 23.2018 13.0891 22.7483C11.4303 22.6007 9.79968 22.2227 8.24372 21.6251C6.53041 20.9663 4.9278 20.0464 3.492 18.8976C6.35794 19.0539 9.25468 18.5242 11.9188 17.3086Z" fill="#4ACFD2"/>
      <path d="M15.4744 1.18994C17.0003 -0.327931 19.459 -0.313064 20.9666 1.22336C21.9323 2.20771 22.3611 3.41225 22.0807 4.66874L22.0413 4.84517C21.3029 8.09132 19.6687 11.1713 17.1416 13.6851C16.0386 14.7839 14.7994 15.7349 13.4549 16.5147C12.9559 16.8041 12.4433 17.069 11.9188 17.3086C12.4036 16.5148 12.8266 15.6843 13.184 14.8246C14.5278 11.5923 14.9029 8.04644 14.3062 4.63773C14.3017 4.58704 14.2597 4.38244 14.2597 4.38244C14.1078 3.21217 14.5762 2.08354 15.4744 1.18994Z" fill="#F0B400"/>
      <path d="M13.4793 2.83612C13.8085 3.17067 14.0521 3.58065 14.1892 4.03088C14.2317 4.23251 14.2705 4.43527 14.3062 4.63775C14.903 8.04646 14.528 11.5924 13.184 14.8249C12.5928 11.9835 11.3292 9.32763 9.5005 7.08306C9.32802 6.87067 9.15074 6.66229 8.9688 6.45807C8.01676 5.4192 8.38591 3.7964 9.37661 2.81091C10.5164 1.67704 12.3534 1.68865 13.4793 2.83612Z" fill="#E23E2B"/>
      <path d="M1.86286 17.4253C2.37607 17.9486 2.9202 18.4402 3.49228 18.8974C4.92795 20.0463 6.53041 20.9662 8.24358 21.6249C9.79948 22.2227 11.4301 22.6007 13.089 22.7482C18.1827 23.2019 23.4336 21.4824 27.3561 17.5806C31.0199 13.936 32.7845 9.11124 32.6874 4.30628C32.4716 3.1128 31.9939 3.26699 32.0102 2.65106C32.1238 2.74366 32.6323 3.23825 33.0054 3.77503C37.677 10.8606 36.8776 20.5089 30.6429 26.7112C24.9279 32.3962 16.3931 33.4482 9.63394 29.8962C8.01647 29.0461 6.50081 27.933 5.14969 26.5561C4.54204 25.9372 3.97909 25.2754 3.46514 24.5757C2.12394 22.7506 1.13726 20.6868 0.557016 18.4929C0.271167 17.4141 0.0847058 16.311 0 15.1978C0.561085 15.989 1.18402 16.7339 1.86286 17.4253Z" fill="#3A7CEB"/>
    </g>
    <defs>
      <clipPath id="clip0_13_13">
        <rect width="36" height="32" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

type Project = { id: string; title: string; description: string | null; created_at: string }

export default function DashboardClient({
  initialProjects,
  initialCount,
  userEmail,
}: {
  initialProjects: Project[]
  initialCount: number
  userEmail: string
}) {
  const router = useRouter()
  const supabase = createClient()

  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [count, setCount] = useState(initialCount)
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showModal) setTimeout(() => titleRef.current?.focus(), 80)
    else { setTitle(''); setDescription(''); setError('') }
  }, [showModal])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowModal(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  async function create() {
    if (!title.trim()) { setError('Give your project a title.'); return }
    setLoading(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error: err } = await supabase
      .from('projects')
      .insert({ title: title.trim(), description: description.trim() || null, user_id: user!.id })
      .select('id, title, description, created_at')
      .single()
    if (err) { setError(err.message); setLoading(false); return }
    setProjects(prev => [data, ...prev])
    setCount(c => c + 1)
    setShowModal(false)
    setLoading(false)
    router.push(`/dashboard/project/${data.id}`)
  }

  const dotColors = ['#3A7CEB', '#4ACFD2', '#F0B400', '#E23E2B']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .dash-root { font-family: 'DM Sans', sans-serif; }
        .font-syne { font-family: 'Syne', sans-serif; }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 25%, #f59e0b 50%, #ef4444 75%, #3b82f6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @keyframes modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .modal-backdrop {
          animation: backdrop-in 0.2s ease both;
        }
        .modal-card {
          animation: modal-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .project-card-hover .arrow-icon { transition: transform 0.2s, color 0.2s; }
        .project-card-hover:hover .arrow-icon { transform: translateX(4px); color: #3A7CEB; }

        .field-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e5e5e4;
          border-radius: 10px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #0f0f0f;
          background: #f8f8f7;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .field-input::placeholder { color: #c4c4c2; }
        .field-input:focus {
          border-color: #3A7CEB;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(58,124,235,0.1);
        }

        .mesh-bg {
          background:
            radial-gradient(ellipse at 10% 20%, rgba(59,130,246,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 80%, rgba(6,182,212,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 10%, rgba(245,158,11,0.04) 0%, transparent 45%),
            #f8f8f7;
        }
      `}</style>

      <div className="dash-root mesh-bg min-h-screen text-zinc-900">

        {/* ── Header ── */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-zinc-100">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <OscilLogo />
              <div className="flex flex-col justify-center leading-none">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-syne font-bold text-sm tracking-widest uppercase text-zinc-900">Oscil</span>
                  <span className="font-syne text-[11px] font-bold tracking-widest shimmer-text uppercase">AI</span>
                </div>
                <span className="text-[8px] font-medium tracking-[2px] uppercase text-zinc-400 mt-0.5">
                  Information Across Dimensions
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-zinc-400 hidden sm:block">{userEmail}</span>
              <form action="/auth/signout" method="post">
                <button type="submit" className="text-[11px] font-medium text-zinc-500 border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-all">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-14">

          {/* ── Hero ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14">
            <div>
              <p className="font-syne text-[10px] font-semibold tracking-[3px] uppercase text-zinc-400 mb-3">
                Research Playground
              </p>
              <h1 className="font-syne font-extrabold text-5xl leading-none tracking-tight">
                Your <span className="shimmer-text">Projects</span>
              </h1>
              <p className="mt-3 text-sm text-zinc-400 font-light max-w-xs">
                Oscillating across dimensions — gather, process, and learn with care.
              </p>
            </div>
            <div className="flex flex-shrink-0 bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-7 py-5 flex flex-col items-center gap-1">
                <span className="font-syne font-bold text-3xl text-zinc-900">{projects.length}</span>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">Projects</span>
              </div>
              <div className="w-px bg-zinc-100" />
              <div className="px-7 py-5 flex flex-col items-center gap-1">
                <span className="font-syne font-bold text-3xl text-zinc-900">{count}</span>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">Clips</span>
              </div>
            </div>
          </div>

          {/* ── Section header ── */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] font-semibold tracking-[2px] uppercase text-zinc-400">All Projects</span>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3A7CEB] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2563c7] active:scale-95 transition-all"
            >
              <span className="text-base leading-none">+</span> New Project
            </button>
          </div>

          {/* ── Project list / Empty ── */}
          {!projects.length ? (
            <div className="text-center py-24 border-2 border-dashed border-zinc-200 rounded-3xl bg-white/60">
              <div className="flex justify-center mb-5"><OscilLogo /></div>
              <p className="font-syne font-bold text-2xl text-zinc-300 mb-2">No projects yet.</p>
              <p className="text-sm text-zinc-400 font-light mb-6">Create one and start clipping from the web.</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#3A7CEB] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2563c7] transition-all"
              >
                <span className="text-base leading-none">+</span> New Project
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/dashboard/project/${p.id}`}
                  className="project-card-hover group bg-white border border-zinc-100 rounded-2xl px-6 py-5 flex items-center justify-between hover:border-blue-300 hover:shadow-[0_4px_24px_rgba(59,130,246,0.10)] transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColors[i % 4] }} />
                    <div>
                      <div className="font-syne font-semibold text-[14px] text-zinc-900 group-hover:text-[#3A7CEB] transition-colors">{p.title}</div>
                      {p.description && <div className="text-[12px] text-zinc-400 font-light mt-0.5">{p.description}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-5 flex-shrink-0 ml-6">
                    <span className="text-[11px] text-zinc-300 hidden sm:block">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="arrow-icon text-zinc-300 text-lg">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,15,15,0.45)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="modal-card bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal top accent bar — brand gradient */}
            <div className="h-1 w-full" style={{
              background: 'linear-gradient(90deg, #3A7CEB, #4ACFD2, #F0B400, #E23E2B)',
            }} />

            <div className="p-8">
              {/* Modal header */}
              <div className="flex items-start justify-between mb-7">
                <div>
                  <p className="text-[9px] font-semibold tracking-[2.5px] uppercase text-zinc-400 mb-1">New Project</p>
                  <h2 className="font-syne font-extrabold text-2xl text-zinc-900 tracking-tight">
                    Start a <span className="shimmer-text">playground</span>
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-zinc-300 hover:text-zinc-600 transition-colors text-xl leading-none mt-1"
                >
                  ✕
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {/* Fields */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[1px] uppercase text-zinc-400">Title</label>
                  <input
                    ref={titleRef}
                    className="field-input"
                    type="text"
                    placeholder="e.g. AI Research, Competitor Analysis..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && create()}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[1px] uppercase text-zinc-400">
                    Description <span className="text-zinc-300 normal-case font-normal tracking-normal">— optional</span>
                  </label>
                  <textarea
                    className="field-input resize-none"
                    style={{ minHeight: 88, lineHeight: 1.6 }}
                    placeholder="What are you exploring?"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 text-[12px] font-semibold text-zinc-400 border border-zinc-200 rounded-xl hover:border-zinc-400 hover:text-zinc-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={create}
                    disabled={loading}
                    className="flex-1 py-3 text-[12px] font-semibold text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
                    style={{ background: loading ? '#aaa' : 'linear-gradient(135deg, #3A7CEB, #4ACFD2)' }}
                  >
                    {loading ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}