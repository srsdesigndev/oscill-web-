'use client'

import Link from 'next/link'
import { Footer } from '@/app/landing/Footer'
import { accent, t } from '@/app/landing/shared'

const CATEGORIES = ['All', 'Product', 'Engineering', 'Research', 'Guides']

const POSTS = [
  {
    slug: 'how-we-built-ai-connections', category: 'Engineering', featured: true,
    title: 'How we built AI Connections — surfacing knowledge you didn\'t know you had',
    excerpt: 'A deep dive into the vector architecture, embedding strategy, and UX decisions that power our new AI Connections feature.',
    author: { name: 'Arjun Mehta' }, date: 'March 5, 2026', readTime: '9 min read', accent: '#7965F6',
  },
  {
    slug: 'second-brain-for-researchers', category: 'Guides', featured: false,
    title: 'Building a second brain for academic research with OpenClips',
    excerpt: 'A practical workflow for PhD students and researchers who want AI-assisted literature reviews without losing source fidelity.',
    author: { name: 'Leila Park' }, date: 'February 26, 2026', readTime: '6 min read', accent: '#38bdf8',
  },
  {
    slug: 'why-we-moved-off-serverless', category: 'Engineering', featured: false,
    title: 'Why we moved our AI pipeline off serverless functions',
    excerpt: 'Cold starts were killing our p95 latency. Here\'s the infra shift that brought it from 2.4s to 340ms.',
    author: { name: 'Arjun Mehta' }, date: 'February 18, 2026', readTime: '7 min read', accent: '#34d399',
  },
  {
    slug: 'openclips-v1-3-notes', category: 'Product', featured: false,
    title: 'Introducing the new Notes editor in v1.3',
    excerpt: 'Rich text, slash commands, and Markdown export — notes are now a first-class citizen in your workspace.',
    author: { name: 'Sana Torres' }, date: 'January 28, 2026', readTime: '4 min read', accent: '#fb923c',
  },
  {
    slug: 'knowledge-rot', category: 'Research', featured: false,
    title: 'Knowledge rot: why your bookmarks are worthless (and what to do about it)',
    excerpt: 'Research shows humans forget 70% of what they read within 24 hours. We dug into the psychology and built something to fight it.',
    author: { name: 'Leila Park' }, date: 'January 14, 2026', readTime: '8 min read', accent: '#a78bfa',
  },
  {
    slug: 'building-for-100k-clips', category: 'Engineering', featured: false,
    title: 'Designing a database schema for 100k clips per user',
    excerpt: 'Pagination, lazy loading, and full-text indexing at scale — what broke, what worked, and the tradeoffs we made.',
    author: { name: 'Arjun Mehta' }, date: 'December 22, 2025', readTime: '11 min read', accent: '#38bdf8',
  },
]

const AUTHOR_COLORS: Record<string, string> = {
  'Arjun Mehta': '#7965F6',
  'Leila Park':  '#34d399',
  'Sana Torres': '#fb923c',
}

const CSS = `
  @keyframes blog-fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .blog-fade-1 { animation: blog-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .blog-fade-2 { animation: blog-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
  .blog-fade-3 { animation: blog-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.20s both; }
  .blog-card   { animation: blog-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both; }

  @keyframes eyebrow-dot {
    0%,100% { box-shadow: 0 0 0px rgba(121,101,246,0.5); }
    50%      { box-shadow: 0 0 8px rgba(121,101,246,0.9), 0 0 14px rgba(121,101,246,0.4); }
  }
  .eyebrow-dot { animation: eyebrow-dot 2.4s ease-in-out infinite; }

  .cat-pill {
    font-size: 12px; font-weight: 500;
    padding: 6px 16px; border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent; color: rgba(255,255,255,0.45);
    cursor: pointer; font-family: inherit;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }
  .cat-pill:hover, .cat-pill.active {
    color: #fff;
    border-color: rgba(121,101,246,0.4);
    background: rgba(121,101,246,0.1);
  }

  .blog-featured {
    display: grid; grid-template-columns: 1fr 1fr;
    border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.02); overflow: hidden;
    text-decoration: none;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .blog-featured:hover {
    border-color: rgba(121,101,246,0.3);
    transform: translateY(-2px);
    box-shadow: 0 24px 64px rgba(0,0,0,0.35);
  }

  .blog-post-card {
    border-radius: 16px; border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.02); padding: 24px;
    text-decoration: none; display: flex; flex-direction: column; gap: 12px;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .blog-post-card:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.13);
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    .blog-featured { grid-template-columns: 1fr; }
  }
`

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('')
  const color    = AUTHOR_COLORS[name] ?? '#7965F6'
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `${color}25`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700, color, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

export default function BlogPage() {
  const featured     = POSTS.find(p => p.featured)!
  const regularPosts = POSTS.filter(p => !p.featured)

  return (
    <>
      <style>{CSS}</style>

      {/* Hero */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 40px 48px' }}>
        <div style={{ marginBottom: 40 }}>
          <div className="blog-fade-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent.primary, background: 'rgba(121,101,246,0.1)', border: '1px solid rgba(121,101,246,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
            <span className="eyebrow-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: accent.primary, display: 'inline-block' }} />
            Blog
          </div>
          <h1 className="blog-fade-2" style={{ fontSize: 'clamp(40px,5vw,64px)', fontWeight: 800, letterSpacing: '-2.5px', lineHeight: 1.05, color: '#fff', marginBottom: 16 }}>
            Ideas, updates,<br />and deep dives.
          </h1>
          <p className="blog-fade-3" style={{ fontSize: 16, color: t.fgMid, fontWeight: 300, lineHeight: 1.75, maxWidth: 460 }}>
            Product thinking, engineering breakdowns, and research from the OpenClips team.
          </p>
        </div>
        <div className="blog-fade-3" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat, i) => (
            <button key={cat} className={`cat-pill${i === 0 ? ' active' : ''}`}>{cat}</button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px 40px' }}>
        <Link href={`/resources/blog/${featured.slug}`} className="blog-featured blog-card" style={{ animationDelay: '0.25s' }}>
          <div style={{ background: `linear-gradient(135deg, ${featured.accent}18 0%, transparent 70%)`, borderRight: '1px solid rgba(255,255,255,0.06)', minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, ${featured.accent}20 0%, transparent 65%)`, top: -70, left: -70, pointerEvents: 'none' }} />
            <div style={{ fontSize: 64, lineHeight: 1 }}>✦</div>
          </div>
          <div style={{ padding: '32px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1px', color: featured.accent, background: `${featured.accent}18`, border: `1px solid ${featured.accent}35`, borderRadius: 5, padding: '2px 8px' }}>{featured.category}</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: accent.primary, background: 'rgba(121,101,246,0.15)', border: '1px solid rgba(121,101,246,0.3)', borderRadius: 5, padding: '2px 8px' }}>Featured</span>
              </div>
              <h2 style={{ fontSize: 21, fontWeight: 800, color: '#fff', lineHeight: 1.25, letterSpacing: '-0.5px', marginBottom: 12 }}>{featured.title}</h2>
              <p style={{ fontSize: 14, color: t.fgMid, lineHeight: 1.7, fontWeight: 300 }}>{featured.excerpt}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name={featured.author.name} size={26} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{featured.author.name}</span>
              <span style={{ fontSize: 12, color: t.fgMid }}>·</span>
              <span style={{ fontSize: 12, color: t.fgMid }}>{featured.date}</span>
              <span style={{ fontSize: 12, color: t.fgMid }}>·</span>
              <span style={{ fontSize: 12, color: t.fgMid }}>{featured.readTime}</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {regularPosts.map(({ slug, category, title, excerpt, author, date, readTime, accent: pa }, i) => (
            <Link key={slug} href={`/resources/blogs/${slug}`} className="blog-post-card blog-card" style={{ animationDelay: `${i * 0.07 + 0.3}s` }}>
              <div style={{ height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${pa}, transparent)`, marginBottom: 4 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.8px', color: pa, background: `${pa}18`, border: `1px solid ${pa}30`, borderRadius: 5, padding: '2px 8px' }}>{category}</span>
                <span style={{ fontSize: 11.5, color: t.fgMid, marginLeft: 'auto' }}>{readTime}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.35, letterSpacing: '-0.2px' }}>{title}</h3>
              <p style={{ fontSize: 13, color: t.fgMid, lineHeight: 1.65, fontWeight: 300, flex: 1 }}>{excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <Avatar name={author.name} size={22} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{author.name}</span>
                <span style={{ fontSize: 11.5, color: t.fgMid, marginLeft: 'auto' }}>{date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}