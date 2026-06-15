import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galerie',
  description:
    "Galerie photo de Studio M : ambiances, matières et détails des intérieurs conçus par Sylvain Marceau, architecte d'intérieur à Paris.",
  alternates: { canonical: '/gallery' },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children
}
