export const siteConfig = {
  name: 'Studio M',
  brandLine: "Architecture d'intérieur",
  url: 'https://www.studio-m.paris',
  locale: 'fr_FR',
  description:
    "Studio M · Sylvain Marceau, architecte d'intérieur à Paris. Rénovation d'appartements et de maisons sur mesure. Du concept au chantier.",
  ogImage: 'https://i.ibb.co/Lhg4Vb33/Bandeau.jpg',
  twitterHandle: '@studiom_paris',
  themeColor: '#E8DCC4',
  phone: '+33 6 58 87 57 10',
  email: 'sylvain@sylvainmarceau.com',
  address: {
    street: '16 rue Lucien Sampaix',
    city: 'Paris',
    postalCode: '75010',
    country: 'FR',
  },
  instagram: 'https://www.instagram.com/studio_m_________/',
} as const

export type SeoMeta = {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

export function buildTitle(page?: string) {
  if (!page) return siteConfig.name
  return `${page} · ${siteConfig.name}`
}

export const routes = [
  '/',
  '/projets',
  '/a-propos',
  '/blog',
  '/contact',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/conditions-generales',
  '/politique-cookies',
] as const
