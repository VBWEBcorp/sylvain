import type { Metadata } from 'next'

import { ApproachSection } from '@/components/sections/approach-section'
import { BannerStrip } from '@/components/sections/banner-strip'
import { BeforeAfterShowcase } from '@/components/sections/before-after-showcase'
import { ContactCTA } from '@/components/sections/contact-cta'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { HeroSection } from '@/components/sections/hero-section'
import { ManifestoSection } from '@/components/sections/manifesto-section'
import { TestimonialsSimple } from '@/components/sections/testimonials-simple'
import {
  localBusinessJsonLd,
  organizationJsonLd,
  webPageJsonLd,
  webSiteJsonLd,
} from '@/components/seo/json-ld'
import { readAll } from '@/lib/projects-store'
import { siteConfig } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webSiteJsonLd(),
    organizationJsonLd(),
    localBusinessJsonLd(),
    webPageJsonLd(siteConfig.name, siteConfig.description, '/'),
  ],
}

export default async function HomePage() {
  const projects = await readAll()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ManifestoSection />
      <FeaturedProjects projects={projects} />
      <BannerStrip />
      <BeforeAfterShowcase projects={projects} />
      <ApproachSection />
      <TestimonialsSimple />
      <ContactCTA />
    </>
  )
}
