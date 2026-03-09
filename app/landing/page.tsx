'use client'

import { CTABanner } from "./CTA"
import { FAQ } from "./FAQ"
import { Features } from "./Features"
import { Footer } from "./Footer"
import { Hero } from "./Hero"
import { HowItWorks } from "./HowItWorks"
import { Nav } from "./Nav"
import { Pricing } from "./Pricing"
import { Problem } from "./Problem"
import { Ribbon } from "./Ribbon"
import { GLOBAL_CSS, t } from "./shared"
import { Extension, Testimonials } from "./Social"
import { UseCases } from "./UseCases"

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.fg, fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{GLOBAL_CSS}</style>
      
      <Ribbon/>
      
      <Nav />

      {/* 1. Hook — what is this, why should I care */}
      <Hero />

      {/* 2. Problem — agitate the pain they already feel */}
      <Problem />

      {/* 3. Features — here's what it does to solve that */}
      <Features />

      {/* 4. How it works — show me it's simple */}
      <HowItWorks />

      {/* 5. Use cases — is this for someone like me? */}
      <UseCases />

      {/* 6. Extension — how do I actually use it day-to-day */}
      <Extension />

      {/* 7. Social proof — can I trust this? */}
      <Testimonials />

      {/* 8. Pricing — what does it cost? */}
      <Pricing />

      {/* 9. FAQs — handle last-minute objections */}
      <FAQ />

      {/* 10. Final push — last chance to convert */}
      <CTABanner />

      <Footer />
    </div>
  )
}