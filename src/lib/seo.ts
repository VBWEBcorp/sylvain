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
  phone: '+33 6 12 34 56 78',
  email: 'sylvain@studio-m.paris',
  address: {
    street: '14 rue de Turenne',
    city: 'Paris',
    postalCode: '75003',
    country: 'FR',
  },
  instagram: 'https://instagram.com/studiom.paris',
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
