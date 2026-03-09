"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

// ── shared tokens (mirror your existing theme) ───────────────────────────────
const accent = {
  primary: "#7965f6",
  gradient: "linear-gradient(135deg, #7965f6 0%, #5177f6 100%)",
  glowLg: "0 0 40px rgba(121,101,246,0.35), 0 8px 32px rgba(0,0,0,0.4)",
};
const t = {
  fg: "#fff",
  fgMid: "rgba(255,255,255,0.5)",
  border: "rgba(255,255,255,0.1)",
};

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ── Animated gradient border via canvas ──────────────────────────────────────
function GradientBorder({ radius = 28 }: { radius?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;

    const stops = [
      { pos: 0,    color: [121, 101, 246] }, // violet
      { pos: 0.25, color: [ 56, 189, 248] }, // sky
      { pos: 0.5,  color: [ 52, 211, 153] }, // emerald
      { pos: 0.75, color: [251, 146,  60] }, // orange
      { pos: 1,    color: [121, 101, 246] }, // back to violet
    ];

    function lerpColor(a: number[], b: number[], f: number) {
      return a.map((v, i) => Math.round(v + (b[i] - v) * f));
    }

    function colorAt(p: number) {
      const wrapped = ((p % 1) + 1) % 1;
      for (let i = 0; i < stops.length - 1; i++) {
        const s = stops[i], e = stops[i + 1];
        if (wrapped >= s.pos && wrapped <= e.pos) {
          const f = (wrapped - s.pos) / (e.pos - s.pos);
          const [r, g, b] = lerpColor(s.color, e.color, f);
          return `rgb(${r},${g},${b})`;
        }
      }
      return `rgb(121,101,246)`;
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    function drawRoundedBorder(
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      r: number,
    ) {
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(w - r, 0);
      ctx.arcTo(w, 0, w, r, r);
      ctx.lineTo(w, h - r);
      ctx.arcTo(w, h, w - r, h, r);
      ctx.lineTo(r, h);
      ctx.arcTo(0, h, 0, h - r, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.closePath();
    }

    // Total perimeter of rounded rect
    function perimeter(w: number, h: number, r: number) {
      return 2 * (w + h) - 8 * r + 2 * Math.PI * r;
    }

    // Point at distance `d` along the rounded-rect perimeter (clockwise from top-left corner after radius)
    function pointAt(d: number, w: number, h: number, r: number): [number, number] {
      const P = perimeter(w, h, r);
      d = ((d % P) + P) % P;

      // Segments: top, tr arc, right, br arc, bottom, bl arc, left, tl arc
      const top = w - 2 * r;
      const right = h - 2 * r;
      const bottom = w - 2 * r;
      const left = h - 2 * r;
      const arc = (Math.PI / 2) * r;

      const segs = [
        { len: top,  fn: (s: number): [number, number] => [r + s, 0] },
        { len: arc,  fn: (s: number): [number, number] => [w - r + Math.sin(s / r) * r, r - Math.cos(s / r) * r] },
        { len: right, fn: (s: number): [number, number] => [w, r + s] },
        { len: arc,  fn: (s: number): [number, number] => [w - r + Math.cos(s / r) * r, h - r + Math.sin(s / r) * r] },
        { len: bottom, fn: (s: number): [number, number] => [w - r - s, h] },
        { len: arc,  fn: (s: number): [number, number] => [r - Math.sin(s / r) * r, h - r + Math.cos(s / r) * r] },
        { len: left, fn: (s: number): [number, number] => [0, h - r - s] },
        { len: arc,  fn: (s: number): [number, number] => [r - Math.cos(s / r) * r, r - Math.sin(s / r) * r] },
      ];

      for (const seg of segs) {
        if (d <= seg.len) return seg.fn(d);
        d -= seg.len;
      }
      return [r, 0];
    }

    function draw() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.clearRect(0, 0, W, H);

      const P = perimeter(W, H, radius);
      const GLOW_LEN = P * 0.28; // fraction of perimeter lit up
      const STEPS = 120;
      const BORDER = 1.5;

      // 1. Base border — very dim static line
      ctx.save();
      drawRoundedBorder(ctx, W, H, radius);
      ctx.strokeStyle = "rgba(121,101,246,0.13)";
      ctx.lineWidth = BORDER;
      ctx.stroke();
      ctx.restore();

      // 2. Travelling glow arc
      for (let i = 0; i <= STEPS; i++) {
        const frac = i / STEPS;
        const dist = ((t * P) + frac * GLOW_LEN) % P;
        const [x, y] = pointAt(dist, W, H, radius);
        const colorFrac = (t + frac * 0.28) % 1;
        const alpha = Math.sin(frac * Math.PI) * 0.9;

        ctx.beginPath();
        ctx.arc(x, y, BORDER * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = colorAt(colorFrac).replace("rgb", "rgba").replace(")", `,${alpha})`);
        ctx.fill();
      }

      // 3. Bright leading dot
      const leadDist = (t * P) % P;
      const [lx, ly] = pointAt(leadDist, W, H, radius);
      const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 10);
      lg.addColorStop(0, colorAt(t).replace("rgb", "rgba").replace(")", ",0.95)"));
      lg.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(lx, ly, 10, 0, Math.PI * 2);
      ctx.fillStyle = lg;
      ctx.fill();

      t = (t + 0.0018) % 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [radius]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        borderRadius: radius,
        zIndex: 2,
      }}
    />
  );
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
export function CTABanner() {
  return (
    <>
      <style>{`
        @keyframes cta-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cta-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes cta-pulse-ring {
          0%, 100% { opacity: 0.18; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 0.32; transform: translate(-50%, -50%) scale(1.04); }
        }
        .cta-eyebrow {
          animation: cta-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .cta-heading {
          animation: cta-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.08s both;
        }
        .cta-sub {
          animation: cta-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.16s both;
        }
        .cta-actions {
          animation: cta-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.24s both;
        }
        .cta-primary-btn {
          position: relative;
          overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.15s;
        }
        .cta-primary-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .cta-primary-btn:hover { transform: translateY(-1px); box-shadow: 0 0 52px rgba(121,101,246,0.5), 0 12px 40px rgba(0,0,0,0.5) !important; }
        .cta-primary-btn:hover::after { opacity: 1; animation: cta-shimmer 0.55s linear; }
        .cta-primary-btn:active { transform: translateY(0px); }
        .cta-ghost-btn {
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }
        .cta-ghost-btn:hover {
          color: #fff !important;
          border-color: rgba(255,255,255,0.22) !important;
          background: rgba(255,255,255,0.04) !important;
        }
      `}</style>

      <div style={{
        margin: "0 40px 96px",
        borderRadius: 28,
        background: "#070709",
        padding: "100px 64px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        // Subtle static border underneath — canvas draws the animated one on top
        border: "1px solid transparent",
      }}>

        {/* Animated gradient border (canvas) */}
        <GradientBorder radius={28} />

        {/* Deep background orbs */}
        <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(121,101,246,0.09) 0%, transparent 60%)", top: -350, left: -200, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 60%)", bottom: -280, right: -120, pointerEvents: "none" }} />

        {/* Pulsing center ring */}
        <div style={{
          position: "absolute", width: 520, height: 520, borderRadius: "50%",
          border: "1px solid rgba(121,101,246,0.1)",
          top: "50%", left: "50%",
          animation: "cta-pulse-ring 4s ease-in-out infinite",
          pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", width: 340, height: 340, borderRadius: "50%",
          border: "1px solid rgba(121,101,246,0.08)",
          top: "50%", left: "50%",
          animation: "cta-pulse-ring 4s ease-in-out 1s infinite",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }} />

        {/* Inset top gradient sheen */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 28, pointerEvents: "none", zIndex: 0,
          background: "linear-gradient(180deg, rgba(121,101,246,0.06) 0%, transparent 45%)",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Eyebrow */}
          <div className="cta-eyebrow" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, fontWeight: 600, letterSpacing: "2px",
            textTransform: "uppercase", color: accent.primary,
            marginBottom: 24,
            background: "rgba(121,101,246,0.1)",
            border: "1px solid rgba(121,101,246,0.2)",
            borderRadius: 100, padding: "6px 14px",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent.primary, display: "inline-block", boxShadow: "0 0 6px rgba(121,101,246,0.8)" }} />
            Get started today
          </div>

          {/* Headline */}
          <h2 className="cta-heading" style={{
            fontSize: "clamp(38px, 5vw, 66px)",
            lineHeight: 1.04,
            letterSpacing: "-2.5px",
            fontWeight: 800,
            color: "#fff",
            marginBottom: 20,
          }}>
            Build your personal<br />
            <span style={{
              background: "linear-gradient(90deg, #a78bfa, #38bdf8, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              knowledge system.
            </span>
          </h2>

          {/* Sub */}
          <p className="cta-sub" style={{
            fontSize: 16,
            color: t.fgMid,
            fontWeight: 300,
            maxWidth: 360,
            margin: "0 auto 48px",
            lineHeight: 1.65,
            letterSpacing: "0.01em",
          }}>
            Free to use. No credit card required.
          </p>

          {/* Actions */}
          <div className="cta-actions" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/login"
              className="cta-primary-btn"
              style={{
                background: accent.gradient,
                color: "#fff",
                fontSize: 14, fontWeight: 600,
                padding: "14px 32px",
                borderRadius: 10,
                textDecoration: "none",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: accent.glowLg,
              }}>
              Create free account <ArrowIcon />
            </Link>

            <a href="#extension"
              className="cta-ghost-btn"
              style={{
                fontSize: 14, fontWeight: 500,
                color: t.fgMid,
                border: `1px solid ${t.border}`,
                borderRadius: 10,
                padding: "14px 28px",
                textDecoration: "none",
                background: "transparent",
              }}>
              Install extension
            </a>
          </div>
        </div>
      </div>
    </>
  );
}