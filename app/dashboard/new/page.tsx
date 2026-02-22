'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function create() {
    if (!title.trim()) { setError('Give your project a title.'); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('projects').insert({
      title: title.trim(),
      description: description.trim() || null,
      user_id: user!.id
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .new-root {
          min-height: 100vh;
          background: #f8f8f7;
          font-family: 'DM Sans', sans-serif;
          color: #0f0f0f;
        }

        .new-header {
          height: 56px;
          background: #fff;
          border-bottom: 1px solid #ebebea;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
        }

        .new-logo {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 5px;
          color: #0f0f0f;
          text-decoration: none;
        }

        .back-btn {
          font-size: 12px;
          color: #aaa;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.15s;
        }

        .back-btn:hover { color: #0f0f0f; }

        .new-body {
          max-width: 520px;
          margin: 0 auto;
          padding: 52px 32px;
        }

        .new-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          color: #bbb;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .new-title {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: #0f0f0f;
          letter-spacing: -0.6px;
          margin-bottom: 36px;
        }

        .form-block {
          background: #fff;
          border: 1.5px solid #ebebea;
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .field { display: flex; flex-direction: column; gap: 7px; }

        .field-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.9px;
          color: #bbb;
          text-transform: uppercase;
        }

        .field-label span {
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
          color: #ddd;
          font-size: 10px;
        }

        .field-input {
          width: 100%;
          padding: 11px 13px;
          border: 1.5px solid #e5e5e4;
          border-radius: 10px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #0f0f0f;
          background: #f8f8f7;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }

        .field-input::placeholder { color: #c8c8c6; }

        .field-input:focus {
          border-color: #0f0f0f;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(15,15,15,0.06);
        }

        .field-textarea {
          resize: none;
          min-height: 100px;
          line-height: 1.6;
        }

        .error-msg {
          font-size: 12px;
          color: #c0392b;
          background: #fff5f5;
          border: 1px solid rgba(192,57,43,0.2);
          border-radius: 8px;
          padding: 9px 12px;
        }

        .create-btn {
          width: 100%;
          padding: 13px;
          background: #0f0f0f;
          color: #fff;
          border: none;
          border-radius: 11px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08);
          margin-top: 4px;
        }

        .create-btn:hover:not(:disabled) { background: #333; }
        .create-btn:active:not(:disabled) { transform: scale(0.99); }
        .create-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
      `}</style>

      <div className="new-root">
        <header className="new-header">
          <span className="new-logo">OSCIL</span>
          <a href="/dashboard" className="back-btn">← Back</a>
        </header>

        <main className="new-body">
          <div className="new-eyebrow">New Project</div>
          <h1 className="new-title">Start a playground</h1>

          <div className="form-block">
            {error && <div className="error-msg">{error}</div>}

            <div className="field">
              <label className="field-label">Title</label>
              <input
                className="field-input"
                type="text"
                placeholder="e.g. AI Research, Competitor Analysis..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && create()}
                autoFocus
              />
            </div>

            <div className="field">
              <label className="field-label">Description <span>(optional)</span></label>
              <textarea
                className="field-input field-textarea"
                placeholder="What are you exploring?"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <button className="create-btn" onClick={create} disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </main>
      </div>
    </>
  )
}