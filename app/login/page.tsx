'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  async function handleSubmit() {
    setError('')
    if (!email) { setError('Enter your email.'); return }
    if (!password) { setError('Enter your password.'); return }
    setLoading(true)

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      setError('Check your email to confirm your account.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=Michroma&display=swap');

        .login-root {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .wave-bg {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          pointer-events: none;
        }

        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }

        .logo-brand {
          font-family: 'Michroma', sans-serif;
          font-size: 20px;
          font-weight: 400;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.5px;
        }

        .logo-brand strong {
          font-weight: 700;
        }

        .hero-text {
          position: relative;
          z-index: 1;
        }

        .hero-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(42px, 5vw, 64px);
          color: #fff;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 20px;
        }

        .hero-title .deeper {
          font-family: 'Michroma', sans-serif;
          font-weight: 700;
          font-style: normal;
          background: linear-gradient(135deg, #6B8DF5, #7B5CE6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          line-height: 1.7;
          max-width: 320px;
          font-weight: 300;
        }

        .hero-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 32px;
        }

        .hero-tag {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 12px;
          border-radius: 100px;
          font-weight: 400;
        }

        .login-right {
          width: 50%;
          flex-shrink: 0;
          background: #f8f8f7;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
        }

        .login-card {
          width: 100%;
          max-width: 360px;
        }

        .card-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          color: #bbb;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: #0f0f0f;
          margin-bottom: 28px;
          letter-spacing: -0.5px;
          white-space: nowrap;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e5e5e4;
          border-radius: 12px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #0f0f0f;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }

        .form-input::placeholder { color: #c0c0be; }

        .form-input:focus {
          border-color: #0f0f0f;
          box-shadow: 0 0 0 3px rgba(15,15,15,0.07);
        }

        .error-box {
          font-size: 12px;
          color: #c0392b;
          background: #fff5f5;
          border: 1px solid rgba(192,57,43,0.2);
          border-radius: 10px;
          padding: 10px 13px;
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .success-box {
          font-size: 12px;
          color: #166534;
          background: #f0fdf4;
          border: 1px solid rgba(22,101,52,0.15);
          border-radius: 10px;
          padding: 10px 13px;
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #0f0f0f;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1);
          letter-spacing: 0.1px;
        }

        .submit-btn:hover:not(:disabled) { background: #222; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 18px;
        }

        .toggle-label {
          font-size: 12px;
          color: #aaa;
        }

        .toggle-btn {
          font-size: 12px;
          font-weight: 600;
          color: #0f0f0f;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { width: 100%; }
        }
      `}</style>

      <div className="login-root">

        {/* ── LEFT ── */}
        <div className="login-left">
          <svg className="wave-bg" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,300 C50,200 100,400 150,300 C200,200 250,400 300,300 C350,200 400,400 450,300 C500,200 550,400 600,300 C650,200 700,400 750,300 C800,200 850,400 900,300" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M0,350 C60,220 120,480 180,350 C240,220 300,480 360,350 C420,220 480,480 540,350 C600,220 660,480 720,350 C780,220 840,480 900,350" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <path d="M0,250 C40,180 80,320 120,250 C160,180 200,320 240,250 C280,180 320,320 360,250 C400,180 440,320 480,250 C520,180 560,320 600,250 C640,180 680,320 720,250" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
          </svg>

          {/* Logo */}
          <div className="logo-wrap">
            <svg width="36" height="36" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 13.5H5.25C5.05109 13.5 4.86032 13.421 4.71967 13.2803C4.57902 13.1397 4.5 12.9489 4.5 12.75V6H2.25V4.5H4.5V2.25H6V4.5H12.75C12.9489 4.5 13.1397 4.57902 13.2803 4.71967C13.421 4.86032 13.5 5.05109 13.5 5.25V12H15.75V13.5H13.5V15.75H12V13.5ZM12 12V6H6V12H12Z" fill="white"/>
            </svg>
            <span className="logo-brand">Open<strong>Clips</strong></span>
          </div>

          {/* Hero */}
          <div className="hero-text">
            <p className="hero-eyebrow">Now in early access</p>
            <h1 className="hero-title">
              Clip the open web.<br />
              Think <span className="deeper">Deeper.</span>
            </h1>
            <p className="hero-sub">
              Save anything from the internet into your workspace — articles, links, images, notes. Let AI find connections, generate insights, and help you think.
            </p>
            <div className="hero-tags">
              <span className="hero-tag">Browser Extension</span>
              <span className="hero-tag">AI-powered</span>
              <span className="hero-tag">Always in sync</span>
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', fontWeight: 300 }}>
            © OpenClips {new Date().getFullYear()}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="login-right">
          <div className="login-card">
            <div className="card-eyebrow">
              {mode === 'signin' ? 'Welcome back' : 'Get started'}
            </div>
            <h2 className="card-title">
              {mode === 'signin' ? 'Sign in to your workspace' : 'Create your account'}
            </h2>

            {error && (
              <div className={error.includes('Check your email') ? 'success-box' : 'error-box'}>
                {error}
              </div>
            )}

            <div className="form-group">
              <input
                className="form-input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoComplete="email"
              />
              <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>

            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>

            <div className="toggle-row">
              <span className="toggle-label">
                {mode === 'signin' ? "Don't have an account?" : 'Already have one?'}
              </span>
              <button
                className="toggle-btn"
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}