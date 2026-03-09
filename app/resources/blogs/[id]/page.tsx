'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author {
  name: string
  role: string
  avatar: string
}

interface TocItem {
  id: string
  label: string
}

type ContentBlock =
  | { type: 'lead';    text: string }
  | { type: 'p';       text: string }
  | { type: 'h2';      id: string; text: string }
  | { type: 'h3';      id: string; text: string }
  | { type: 'callout'; label?: string; text: string }
  | { type: 'code';    lang: string; label: string; text: string }
  | { type: 'stats';   items: { value: string; label: string }[] }
  | { type: 'image';   src: string; alt: string; caption?: string }
  | { type: 'link';    href: string; label: string; description?: string }
  | { type: 'list';    items: string[] }
  | { type: 'ol';      items: string[] }
  | { type: 'divider' }

interface RelatedPost {
  slug: string
  category: string
  title: string
  readTime: string
  accent: string
}

interface Post {
  slug: string
  category: string
  title: string
  subtitle: string
  author: Author
  date: string
  readTime: string
  accent: string
  toc: TocItem[]
  content: ContentBlock[]
  related: RelatedPost[]
}

// ─── Layout constants — one source of truth ──────────────────────────────────
//
//  ┌─────────────────────────────────────────────────────┐
//  │  PAGE_OUTER (max-width, centered)                   │
//  │  ┌──────────────────────────┬────────────┐          │
//  │  │  ARTICLE_W (680px)       │ SIDEBAR_W  │          │
//  │  └──────────────────────────┴────────────┘          │
//  └─────────────────────────────────────────────────────┘
//
//  Hero & Related use PAGE_OUTER too, so left edge always aligns
//  with the article column's left edge.

const ARTICLE_W  = 980
const SIDEBAR_W  = 192
const COL_GAP    = 64
const PAGE_OUTER = ARTICLE_W + COL_GAP + SIDEBAR_W  // 936

// ─── Sample post data ─────────────────────────────────────────────────────────

const POST: Post = {
  slug:     'how-we-built-ai-connections',
  category: 'Engineering',
  title:    "How we built AI Connections — surfacing knowledge you didn't know you had",
  subtitle: 'A deep dive into the vector architecture, embedding strategy, and the hard UX decisions that power our most ambitious feature yet.',
  author:   { name: 'Arjun Mehta', role: 'Lead Engineer', avatar: 'AM' },
  date:     'March 5, 2026',
  readTime: '9 min read',
  accent:   '#7C6FED',
  toc: [
    { id: 'the-problem',        label: 'The problem' },
    { id: 'why-vectors',        label: 'Why vectors?' },
    { id: 'embedding-strategy', label: 'Our embedding strategy' },
    { id: 'the-index',          label: 'Building the index' },
    { id: 'ux-decisions',       label: 'The hard UX decisions' },
    { id: 'whats-next',         label: "What's next" },
  ],
  content: [
    {
      type: 'lead',
      text: "When we set out to build AI Connections, we had one deceptively simple goal: show users the clips they've forgotten they saved. The kind of note from six months ago that's directly relevant to what you're reading right now. Turns out, getting that right is one of the hardest problems in consumer AI.",
    },
    { type: 'h2', id: 'the-problem', text: 'The problem' },
    {
      type: 'p',
      text: "Most knowledge tools fail at the same place: retrieval. You can save a thousand clips, but if you can't surface the right one at the right moment, you might as well have bookmarked nothing. Traditional keyword search is brittle — you need to remember the exact words you'd use to describe something. That's not how memory works.",
    },
    {
      type: 'p',
      text: "We wanted something closer to how your brain works. You read an article about attention mechanisms in transformers. Weeks later, you're clipping something about long-context reasoning — and the app quietly surfaces that old clip because it understands the semantic relationship, not just the shared words.",
    },
    {
      type: 'callout',
      label: 'The insight',
      text: "Connections shouldn't be something you ask for. They should appear when they're relevant — like a well-read colleague who remembers everything.",
    },
    { type: 'h2', id: 'why-vectors', text: 'Why vectors?' },
    {
      type: 'p',
      text: "Vector embeddings let us represent the meaning of a clip as a point in high-dimensional space. Two clips about the same concept — even if they use completely different vocabulary — will have vectors that sit close together. This is the foundation of every modern semantic search system.",
    },
    {
      type: 'p',
      text: "We evaluated three approaches: sparse retrieval (BM25-style), dense retrieval (pure embeddings), and a hybrid. Pure dense retrieval gives the best semantic quality but struggles with exact matches. We landed on hybrid — using sparse as a pre-filter to narrow candidates, then re-ranking with dense embeddings.",
    },
    {
      type: 'code',
      lang: 'typescript',
      label: 'Connection scoring',
      text: `async function scoreConnections(
  sourceClip: Clip,
  candidates: Clip[],
): Promise<RankedConnection[]> {
  const sourceEmbed = await embed(sourceClip.content)

  return candidates
    .map(clip => ({
      clip,
      score: cosineSimilarity(sourceEmbed, clip.embedding),
    }))
    .filter(c => c.score > SIMILARITY_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONNECTIONS)
}`,
    },
    { type: 'h2', id: 'embedding-strategy', text: 'Our embedding strategy' },
    {
      type: 'p',
      text: "Not all content is equal. A full article has very different density than a clipped tweet. We experimented with whole-document embeddings, sliding-window chunk embeddings, and a hybrid that embeds a summary alongside the full text. The summary-augmented approach won by a significant margin on our eval set.",
    },
    {
      type: 'stats',
      items: [
        { value: '3×',     label: 'faster retrieval vs naive' },
        { value: '91%',    label: 'relevance on eval set' },
        { value: '< 80ms', label: 'p99 lookup latency' },
      ],
    },
    {
      type: 'p',
      text: "We also discovered that the clip title carries disproportionate semantic weight. A well-chosen title is often more descriptive than any single paragraph. We weight title embeddings 2× in our final representation.",
    },
    { type: 'h2', id: 'the-index', text: 'Building the index' },
    {
      type: 'p',
      text: "At small scale, brute-force cosine similarity over all a user's clips is fast enough. At 10,000 clips per user, it becomes untenable. We use HNSW graphs — an approximate nearest-neighbour algorithm that trades a tiny amount of recall for massive speed gains.",
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80',
      alt: 'Abstract network graph',
      caption: 'A simplified view of how HNSW organises vectors into navigable layers.',
    },
    { type: 'h2', id: 'ux-decisions', text: 'The hard UX decisions' },
    {
      type: 'p',
      text: "The algorithm was the easy part. The harder question: how do you surface connections without making users feel surveilled or overwhelmed? We went through eleven design iterations before landing on the current approach.",
    },
    {
      type: 'callout',
      label: 'What we cut',
      text: 'We prototyped a "connection map" graph visualisation. It looked incredible in demos. Users found it completely overwhelming in practice. We cut it in week two.',
    },
    { type: 'h2', id: 'whats-next', text: "What's next" },
    {
      type: 'p',
      text: "We're working on cross-project connections — right now, connections only surface within a single project. The next step is allowing users to opt into broader search across their entire library.",
    },
    {
      type: 'link',
      href: 'https://example.com/docs/connections',
      label: 'Read the full technical spec →',
      description: 'API docs · connections.v2',
    },
  ],
  related: [
    { slug: 'why-we-moved-off-serverless', category: 'Engineering', title: 'Why we moved our AI pipeline off serverless functions', readTime: '7 min read', accent: '#34d399' },
    { slug: 'knowledge-rot',               category: 'Research',    title: 'Knowledge rot: why your bookmarks are worthless',         readTime: '8 min read', accent: '#a78bfa' },
    { slug: 'building-for-100k-clips',     category: 'Engineering', title: 'Designing a database schema for 100k clips per user',     readTime: '11 min read', accent: '#38bdf8' },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractPlainText(blocks: ContentBlock[]): string {
  return blocks
    .filter((b): b is Extract<ContentBlock, { text: string }> => 'text' in b)
    .map(b => b.text)
    .join(' ')
}

// ─── Reading progress bar ─────────────────────────────────────────────────────

function ReadingProgress({ accent }: { accent: string }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      setPct(Math.min(100, (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100))
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 999, background: 'rgba(255,255,255,0.04)' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: accent, transition: 'width 0.1s linear', borderRadius: '0 2px 2px 0' }} />
    </div>
  )
}

// ─── TTS Player ───────────────────────────────────────────────────────────────

type TTSState = 'idle' | 'playing' | 'paused'

function TTSPlayer({ text, accent }: { text: string; accent: string }) {
  const [state, setState]         = useState<TTSState>('idle')
  const [progress, setProgress]   = useState(0)
  const [supported, setSupported] = useState(false)   // always false on server → no mismatch
  const uttRef                    = useRef<SpeechSynthesisUtterance | null>(null)

  // Detect support only after hydration, on the client
  useEffect(() => {
    setSupported('speechSynthesis' in window)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setState('idle')
    setProgress(0)
  }, [])

  const play = useCallback(() => {
    window.speechSynthesis.cancel()
    const utt      = new SpeechSynthesisUtterance(text)
    utt.rate       = 0.95
    utt.onboundary = (e: SpeechSynthesisEvent) => {
      if (e.name === 'word') setProgress(Math.round((e.charIndex / text.length) * 100))
    }
    utt.onend   = () => { setState('idle'); setProgress(0) }
    utt.onerror = () => setState('idle')
    uttRef.current = utt
    window.speechSynthesis.speak(utt)
    setState('playing')
  }, [text])

  const toggle = () => {
    if (state === 'idle')    { play(); return }
    if (state === 'playing') { window.speechSynthesis.pause(); setState('paused') }
    else                     { window.speechSynthesis.resume(); setState('playing') }
  }

  useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

  if (!supported) return null

  const active = state !== 'idle'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 16px', borderRadius: 10,
      border: `1px solid ${active ? `${accent}40` : 'rgba(255,255,255,0.08)'}`,
      background: active ? `${accent}0D` : 'rgba(255,255,255,0.025)',
      transition: 'border-color 0.25s, background 0.25s',
    }}>
      {/* Play / Pause */}
      <button
        onClick={toggle}
        style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          border: `1.5px solid ${active ? accent : 'rgba(255,255,255,0.18)'}`,
          background: active ? accent : 'transparent',
          color: active ? '#fff' : 'rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        {state === 'playing'
          ? <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><rect x="0" y="0" width="3.5" height="12" rx="1.5"/><rect x="6.5" y="0" width="3.5" height="12" rx="1.5"/></svg>
          : <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M1 1l8 5-8 5V1z"/></svg>
        }
      </button>

      {/* Label + progress track */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: active ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)', marginBottom: 5, fontFamily: "'DM Sans',sans-serif" }}>
          {state === 'idle' && 'Listen to this article'}
          {state === 'playing' && 'Playing…'}
          {state === 'paused' && 'Paused'}
        </div>
        <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: accent, borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Stop */}
      {active && (
        <button
          onClick={stop}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.28)', cursor: 'pointer', padding: 4, display: 'flex', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect width="10" height="10" rx="2"/></svg>
        </button>
      )}
    </div>
  )
}

// ─── TOC ─────────────────────────────────────────────────────────────────────

function TOC({ items, accent }: { items: TocItem[]; accent: string }) {
  const [active, setActive] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const headings = items.map(i => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null)
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-20% 0px -72% 0px' },
    )
    headings.forEach(h => obs.observe(h))
    return () => obs.disconnect()
  }, [items])

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '0 0 14px', fontFamily: "'DM Sans',sans-serif" }}>
        On this page
      </p>
      {items.map(({ id, label }) => {
        const isActive = active === id
        return (
          <a
            key={id}
            href={`#${id}`}
            onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setActive(id) }}
            style={{
              display: 'block', fontSize: 12.5, lineHeight: 1.45,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.32)',
              textDecoration: 'none',
              padding: '5px 0 5px 14px',
              borderLeft: `2px solid ${isActive ? accent : 'rgba(255,255,255,0.07)'}`,
              transition: 'color 0.18s, border-color 0.18s',
              fontFamily: "'DM Sans',sans-serif",
            }}
            onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
            onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.32)' }}
          >
            {label}
          </a>
        )
      })}
    </nav>
  )
}

// ─── Copy button ─────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      style={{
        background: 'none', border: '1px solid rgba(255,255,255,0.12)',
        color: copied ? '#34d399' : 'rgba(255,255,255,0.38)',
        fontSize: 11, fontWeight: 500, borderRadius: 6, padding: '3px 10px',
        cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'color 0.15s',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ initials, size = 40, accent }: { initials: string; size?: number; accent: string }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `${accent}22`, border: `1.5px solid ${accent}50`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 700, color: accent,
      fontFamily: "'DM Sans',sans-serif",
    }}>
      {initials}
    </div>
  )
}

// ─── Content renderer ─────────────────────────────────────────────────────────

function RenderContent({ blocks, accent }: { blocks: ContentBlock[]; accent: string }) {
  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 18, lineHeight: 1.82, color: 'rgba(255,255,255,0.7)' }}>
      {blocks.map((block, i) => {

        if (block.type === 'lead') return (
          <p key={i} style={{ fontSize: 20, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', margin: '0 0 40px', paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {block.text}
          </p>
        )

        if (block.type === 'h2') return (
          <h2 key={i} id={block.id} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.2, margin: '52px 0 18px', scrollMarginTop: 80 }}>
            {block.text}
          </h2>
        )

        if (block.type === 'h3') return (
          <h3 key={i} id={block.id} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 19, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.3px', lineHeight: 1.3, margin: '36px 0 14px', scrollMarginTop: 80 }}>
            {block.text}
          </h3>
        )

        if (block.type === 'p') return (
          <p key={i} style={{ margin: '0 0 24px' }}>{block.text}</p>
        )

        if (block.type === 'callout') return (
          <div key={i} style={{ margin: '36px 0', padding: '20px 24px', borderRadius: 12, background: `${accent}0D`, border: `1px solid ${accent}28`, borderLeft: `3px solid ${accent}` }}>
            {block.label && (
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: accent, fontFamily: "'DM Sans',sans-serif", margin: '0 0 10px' }}>
                {block.label}
              </p>
            )}
            <p style={{ fontSize: 16, lineHeight: 1.72, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', margin: 0 }}>
              {block.text}
            </p>
          </div>
        )

        if (block.type === 'code') return (
          <div key={i} style={{ margin: '36px 0', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans',sans-serif" }}>{block.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: accent, background: `${accent}18`, border: `1px solid ${accent}35`, borderRadius: 5, padding: '2px 8px', fontFamily: "'DM Sans',sans-serif" }}>{block.lang}</span>
                <CopyButton text={block.text} />
              </div>
            </div>
            <pre style={{ margin: 0, padding: '20px 24px', background: '#090909', overflowX: 'auto', fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13, lineHeight: 1.72, color: 'rgba(255,255,255,0.78)' }}>
              <code>{block.text}</code>
            </pre>
          </div>
        )

        if (block.type === 'stats') return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: `repeat(${block.items.length}, 1fr)`, gap: 1, margin: '36px 0', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
            {block.items.map(({ value, label }) => (
              <div key={label} style={{ padding: '22px 16px', background: '#0d0d0f', textAlign: 'center', fontFamily: "'DM Sans',sans-serif" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-1px', lineHeight: 1, marginBottom: 6 }}>{value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        )

        if (block.type === 'image') return (
          <figure key={i} style={{ margin: '40px 0' }}>
            <img src={block.src} alt={block.alt} loading="lazy" style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', display: 'block' }} />
            {block.caption && (
              <figcaption style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', textAlign: 'center', marginTop: 12, fontStyle: 'italic', fontFamily: "'DM Sans',sans-serif" }}>
                {block.caption}
              </figcaption>
            )}
          </figure>
        )

        if (block.type === 'link') return (
          <a
            key={i} href={block.href} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '28px 0', padding: '16px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.025)', textDecoration: 'none', color: 'inherit', transition: 'background 0.2s, border-color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.045)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.16)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)' }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}20`, border: `1px solid ${accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>{block.label}</div>
              {block.description && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans',sans-serif" }}>{block.description}</div>}
            </div>
          </a>
        )

        if (block.type === 'list') return (
          <ul key={i} style={{ margin: '0 0 24px', paddingLeft: 22 }}>
            {block.items.map((item, j) => <li key={j} style={{ marginBottom: 8, lineHeight: 1.72 }}>{item}</li>)}
          </ul>
        )

        if (block.type === 'ol') return (
          <ol key={i} style={{ margin: '0 0 24px', paddingLeft: 24 }}>
            {block.items.map((item, j) => <li key={j} style={{ marginBottom: 8, lineHeight: 1.72 }}>{item}</li>)}
          </ol>
        )

        if (block.type === 'divider') return (
          <div key={i} style={{ margin: '52px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', gap: 5 }}>
              {[0, 1, 2].map(d => <div key={d} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.14)' }} />)}
            </div>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>
        )

        return null
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPostPage() {
  const { title, subtitle, author, date, readTime, category, accent, toc, content, related } = POST
  const ttsText = extractPlainText(content)

  const copyLink = () => navigator.clipboard.writeText(window.location.href)

  // Every section uses this one wrapper style — guarantees identical left/right edges
  const section: React.CSSProperties = {
    width: '100%',
    maxWidth: PAGE_OUTER,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 40,
    paddingRight: 40,
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0d', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <ReadingProgress accent={accent} />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <header style={{ ...section, paddingTop: 72, paddingBottom: 0 }}>

        {/* The hero content is constrained to ARTICLE_W so it aligns with the article column */}
        <div style={{ maxWidth: ARTICLE_W }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            <a
              href="/blog"
              style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.32)', textDecoration: 'none', transition: 'color 0.15s', fontWeight: 400 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.32)')}
            >
              Blog
            </a>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>/</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: accent, background: `${accent}18`, border: `1px solid ${accent}30`, borderRadius: 6, padding: '2px 9px' }}>
              {category}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'rgba(255,255,255,0.25)' }}>{readTime}</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(28px,3.8vw,48px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.1, color: '#fff', margin: '0 0 20px' }}>
            {title}
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 32px', fontFamily: 'Georgia, serif', fontWeight: 400 }}>
            {subtitle}
          </p>

          {/* Author row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <Avatar initials={author.avatar} size={40} accent={accent} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.88)', lineHeight: 1.3 }}>{author.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{author.role} · {date}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {[
                { label: 'Share',     icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> },
                { label: 'Copy link', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> },
              ].map(({ label, icon }) => (
                <button
                  key={label}
                  onClick={copyLink}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.45)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.15s' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.2)'; el.style.background = 'rgba(255,255,255,0.06)' }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.color = 'rgba(255,255,255,0.45)'; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.background = 'rgba(255,255,255,0.03)' }}
                >
                  {icon}{label}
                </button>
              ))}
            </div>
          </div>

          {/* TTS — same width as article column */}
          <div style={{ marginTop: 24, marginBottom: 48 }}>
            <TTSPlayer text={ttsText} accent={accent} />
          </div>
        </div>
      </header>

      {/* ── BODY: article column + sticky TOC ─────────────────────────────── */}
      <div style={{ ...section, paddingTop: 0, paddingBottom: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `${ARTICLE_W}px ${SIDEBAR_W}px`, gap: COL_GAP, alignItems: 'start' }}>

          {/* Article */}
          <main>
            <RenderContent blocks={content} accent={accent} />

            {/* Post footer */}
            <div style={{ marginTop: 60, paddingTop: 36, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar initials={author.avatar} size={46} accent={accent} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff', marginBottom: 3 }}>Written by {author.name}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.35)' }}>{author.role}</div>
              </div>
            </div>
          </main>

          {/* Sticky TOC sidebar */}
          <aside style={{ position: 'sticky', top: 80 }}>
            <TOC items={toc} accent={accent} />
          </aside>
        </div>
      </div>

      {/* ── RELATED POSTS ─────────────────────────────────────────────────── */}
      <section style={{ ...section, paddingTop: 0, paddingBottom: 96 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>More from {category}</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <a href="/blog" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
            View all →
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {related.map(({ slug, category: rc, title: rt, readTime: rrt, accent: ra }) => (
            <a
              key={slug} href={`/blog/${slug}`}
              style={{ textDecoration: 'none', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', padding: 20, display: 'flex', flexDirection: 'column', gap: 10, transition: 'background 0.2s, border-color 0.2s, transform 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.transform = 'translateY(-2px)'; el.style.borderColor = 'rgba(255,255,255,0.12)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.02)'; el.style.transform = ''; el.style.borderColor = 'rgba(255,255,255,0.07)' }}
            >
              <div style={{ height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${ra}, transparent)` }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.8px', color: ra, background: `${ra}18`, border: `1px solid ${ra}30`, borderRadius: 5, padding: '2px 8px', alignSelf: 'flex-start', fontFamily: "'DM Sans',sans-serif" }}>{rc}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.86)', lineHeight: 1.35, letterSpacing: '-0.2px', fontFamily: "'DM Sans',sans-serif" }}>{rt}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans',sans-serif" }}>{rrt}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}