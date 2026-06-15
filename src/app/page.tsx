import type { Metadata } from 'next'

import { homeFaqs } from '@/components/sections/faq-data'
import { FaqSection } from '@/components/sections/faq-section'
import { IntroAnimation } from '@/components/intro-animation'
import { HomeRealisations } from '@/components/sections/home-realisations'
import { JmlcHero } from '@/components/sections/jmlc-hero'
import {
  faqJsonLd,
  localBusinessJsonLd,
  organizationJsonLd,
  webPageJsonLd,
  webSiteJsonLd,
} from '@/components/seo/json-ld'
import { readContent } from '@/lib/content-store'
import { readAll } from '@/lib/projects-store'
import { siteConfig } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  description:
    "Studio M, architecte d'intérieur à Paris. Sylvain Marceau conçoit et rénove appartements et maisons sur mesure, du concept à la livraison du chantier.",
  alternates: { canonical: '/' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webSiteJsonLd(),
    organizationJsonLd(),
    localBusinessJsonLd(),
    webPageJsonLd(siteConfig.name, siteConfig.description, '/'),
    faqJsonLd(homeFaqs),
  ],
}

export default async function HomePage() {
  const [projects, content] = await Promise.all([readAll(), readContent()])
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IntroAnimation />
      <JmlcHero heroImage={content.home.heroImage} />
      <HomeRealisations projects={projects} />
      <FaqSection faqs={homeFaqs} />
    </>
  )
}
