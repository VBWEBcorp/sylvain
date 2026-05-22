import type { Metadata } from 'next'

import { IntroAnimation } from '@/components/intro-animation'
import { HomeRealisations } from '@/components/sections/home-realisations'
import { JmlcHero } from '@/components/sections/jmlc-hero'
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
      <IntroAnimation />
      <JmlcHero />
      <HomeRealisations projects={projects} />
    </>
  )
}
