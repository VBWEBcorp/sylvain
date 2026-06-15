import type { Metadata } from 'next'

import { ContactContent } from './contact-content'
import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { readContent } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

const description =
  "Contactez Studio M, architecte d'intérieur à Paris, pour votre projet de rénovation ou d'aménagement intérieur. Premier échange et devis gratuits."

export const metadata: Metadata = {
  title: 'Contact',
  description,
  alternates: { canonical: '/contact' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('Contact', description, '/contact'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Contact', path: '/contact' },
    ]),
  ],
}

export default async function ContactPage() {
  const content = await readContent()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactContent site={content.site} contact={content.contact} />
    </>
  )
}
