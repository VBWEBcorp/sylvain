import type { Metadata } from 'next'

import { AboutContent } from './about-content'
import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { readContent } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

const description =
  "Studio M, c'est Sylvain Marceau, architecte d'intérieur à Paris : son approche, sa méthode et sa vision du projet sur mesure, de la conception au chantier."

export const metadata: Metadata = {
  title: 'À propos',
  description,
  alternates: { canonical: '/a-propos' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('À propos', description, '/a-propos'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'À propos', path: '/a-propos' },
    ]),
  ],
}

export default async function AboutPage() {
  const content = await readContent()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutContent studio={content.studio} />
    </>
  )
}
