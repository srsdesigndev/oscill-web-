'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { t, accent } from '@/app/landing/shared'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [mode, setMode]         = useState<'signin' | 'signup'>('signin')

  async function handleSubmit() {
    setError('')
    if (!email)    { setError('Enter your email.');    return }
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

  const isSuccess = error.includes('Check your email')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Michroma&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: #000;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        /* ── LEFT PANEL ── */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        .login-left-orb-1 {
          position: absolute;
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(121,101,246,0.14) 0%, transparent 65%);
          top: -200px; left: -150px;
          pointer-events: none;
        }
        .login-left-orb-2 {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(81,119,246,0.1) 0%, transparent 65%);
          bottom: -150px; right: -100px;
          pointer-events: none;
        }
        .dot-grid-login {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        .login-logo {
          display: flex; align-items: center; gap: 9px;
          position: relative; z-index: 1;
          text-decoration: none;
        }
        .login-brand {
          font-family: 'Michroma', sans-serif;
          font-size: 15px; font-weight: 400;
          color: #fff; letter-spacing: 0.3px;
        }
        .login-brand strong { font-weight: 700; }

        .login-hero { position: relative; z-index: 1; }

        .login-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(121,101,246,0.1);
          border: 1px solid rgba(121,101,246,0.3);
          border-radius: 100px; padding: 5px 14px;
          font-size: 11px; font-weight: 500;
          color: #7965F6; margin-bottom: 28px;
        }
        .login-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: linear-gradient(135deg, #7965F6, #5177F6);
          box-shadow: 0 0 6px #7965F6;
          flex-shrink: 0;
        }

        .login-title {
          font-size: clamp(40px, 4.5vw, 64px);
          font-weight: 800;
          color: #fff;
          line-height: 1.04;
          letter-spacing: -2.5px;
          margin-bottom: 20px;
        }

        .login-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.42);
          line-height: 1.75;
          max-width: 340px;
          font-weight: 300;
          margin-bottom: 32px;
        }

        .login-tags {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .login-tag {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          border: 1px solid rgba(255,255,255,0.09);
          padding: 5px 13px; border-radius: 100px;
          font-weight: 400;
          background: rgba(255,255,255,0.02);
        }

        .login-footer {
          font-size: 11px;
          color: rgba(255,255,255,0.15);
          font-weight: 300;
          position: relative; z-index: 1;
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          width: 48%;
          flex-shrink: 0;
          background: #0a0a0a;
          border-left: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
        }

        .login-right::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(121,101,246,0.4), transparent);
        }

        .login-card {
          width: 100%;
          max-width: 380px;
          position: relative; z-index: 1;
        }

        .card-eyebrow {
          font-size: 10.5px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          color: #7965F6; margin-bottom: 10px;
        }

        .card-title {
          font-size: 28px; font-weight: 800;
          color: #fff; margin-bottom: 36px;
          letter-spacing: -0.8px; line-height: 1.1;
        }

        /* Inputs */
        .form-group {
          display: flex; flex-direction: column;
          gap: 10px; margin-bottom: 14px;
        }

        .form-input {
          width: 100%;
          padding: 13px 16px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          background: rgba(255,255,255,0.04);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }

        .form-input::placeholder { color: rgba(255,255,255,0.22); }

        .form-input:focus {
          border-color: rgba(121,101,246,0.5);
          background: rgba(121,101,246,0.05);
          box-shadow: 0 0 0 3px rgba(121,101,246,0.12);
        }

        /* Feedback */
        .error-box {
          font-size: 12.5px; line-height: 1.55;
          color: #f87171;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 10px;
          padding: 11px 14px; margin-bottom: 14px;
        }

        .success-box {
          font-size: 12.5px; line-height: 1.55;
          color: #4ade80;
          background: rgba(74,222,128,0.07);
          border: 1px solid rgba(74,222,128,0.2);
          border-radius: 10px;
          padding: 11px 14px; margin-bottom: 14px;
        }

        /* Submit */
        .submit-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #7965F6 0%, #5177F6 100%);
          color: #fff; border: none; border-radius: 12px;
          font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(121,101,246,0.35);
          transition: opacity 0.15s, box-shadow 0.15s, transform 0.1s;
          letter-spacing: 0.1px;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.88;
          box-shadow: 0 6px 32px rgba(121,101,246,0.5);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Toggle */
        .toggle-row {
          display: flex; align-items: center;
          justify-content: center; gap: 6px;
          margin-top: 20px;
        }
        .toggle-label { font-size: 12.5px; color: rgba(255,255,255,0.3); }
        .toggle-btn {
          font-size: 12.5px; font-weight: 600;
          color: #7965F6; background: none; border: none;
          cursor: pointer; padding: 0;
          font-family: 'DM Sans', sans-serif;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s;
        }
        .toggle-btn:hover { color: #9b8cf8; }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0;
        }
        .divider-line {
          flex: 1; height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .divider-text {
          font-size: 11px; color: rgba(255,255,255,0.2);
          font-weight: 400; white-space: nowrap;
        }

        @media (max-width: 768px) {
          .login-left  { display: none; }
          .login-right { width: 100%; border-left: none; }
        }
      `}</style>

      <div className="login-root">

        {/* ── LEFT ── */}
        <div className="login-left">
          <div className="dot-grid-login" />
          <div className="login-left-orb-1" />
          <div className="login-left-orb-2" />

          {/* Logo */}
          <a href="/" className="login-logo">
            <svg width="22" height="22" viewBox="0 0 31 31" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M22.3889 25.8333H6.88889C6.43213 25.8333 5.99407 25.6519 5.67109 25.3289C5.34811 25.0059 5.16667 24.5679 5.16667 24.1111V8.61111H0V5.16667H5.16667V0H8.61111V5.16667H24.1111C24.5679 5.16667 25.0059 5.34811 25.3289 5.67109C25.6519 5.99407 25.8333 6.43213 25.8333 6.88889V22.3889H31V25.8333H25.8333V31H22.3889V25.8333ZM22.3889 22.3889V8.61111H8.61111V22.3889H22.3889Z" fill="#7965F6"/>
            </svg>
            <span className="login-brand">Open<strong>Clips</strong></span>
          </a>

          {/* Hero text */}
          <div className="login-hero">
            <div className="login-eyebrow">
              <div className="login-eyebrow-dot" />
              Now in early access
            </div>
            <h1 className="login-title">
              Clip the open web.<br />Think Deeper.
            </h1>
            <p className="login-sub">
              Save anything from the internet into your workspace. Let AI find connections, generate insights, and help you think.
            </p>
            <div className="login-tags">
              {['Browser Extension', 'AI-powered', 'Free for Students', 'Early Access'].map(tag => (
                <span key={tag} className="login-tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="login-footer">© ProductName {new Date().getFullYear()}</div>
        </div>

        {/* ── RIGHT ── */}
        <div className="login-right">
          <div className="login-card">
            <div className="card-eyebrow">
              {mode === 'signin' ? 'Welcome back' : 'Get started free'}
            </div>
            <h2 className="card-title">
              {mode === 'signin' ? 'Sign in to your\nworkspace' : 'Create your\naccount'}
            </h2>

            {error && (
              <div className={isSuccess ? 'success-box' : 'error-box'}>
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

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <div className="toggle-row">
              <span className="toggle-label">
                {mode === 'signin' ? "Don't have an account?" : 'Already have one?'}
              </span>
              <button
                className="toggle-btn"
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}>
                {mode === 'signin' ? 'Sign up free' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}