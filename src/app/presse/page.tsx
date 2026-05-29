import type { Metadata } from 'next'
import Link from 'next/link'

import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'

export const dynamic = 'force-dynamic'

const description =
  'Studio M dans la presse : reportages vidéo et articles consacrés aux projets de Sylvain Marceau, architecte d’intérieur à Paris.'

export const metadata: Metadata = {
  title: 'Presse',
  description,
  alternates: { canonical: '/presse' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('Presse', description, '/presse'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Presse', path: '/presse' },
    ]),
  ],
}

// Reportages vidéo (YouTube, intégrés en mode confidentialité renforcée).
const videos = [
  {
    id: 'IwU2mV35wfc',
    start: 115,
    vertical: false,
    title: 'Reportage vidéo',
    meta: 'YouTube · Studio M',
  },
  {
    id: 'Ug9QKUk2Oq4',
    start: 0,
    vertical: true,
    title: 'Format court',
    meta: 'YouTube Shorts · Studio M',
  },
] as const

// Articles de presse écrite.
const articles = [
  {
    href: 'https://www.sloft-magazine.com/le-magazine/visite-guidee/coup-double-a-paris-36-m%c2%b2-qui-jouent-sur-tous-les-tableaux/',
    source: 'Sloft Magazine',
    title: 'Coup double à Paris : 36 m² qui jouent sur tous les tableaux',
  },
] as const

function embedSrc(id: string, start: number) {
  const base = `https://www.youtube-nocookie.com/embed/${id}?rel=0`
  return start > 0 ? `${base}&start=${start}` : base
}

export default function PressePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Bandeau compact — cohérent avec les autres pages */}
      <section className="bg-[var(--brand-cream)] pt-28 pb-6 sm:pt-32 sm:pb-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 sm:px-10 lg:px-16">
          <h1 className="font-display text-3xl font-light leading-none tracking-tight text-foreground sm:text-4xl">
            Presse
          </h1>
          <nav aria-label="Sections du site" className="flex items-center gap-5 sm:gap-7">
            <Link
              href="/projets"
              className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-foreground sm:text-[12px]"
            >
              Réalisations
            </Link>
            <span aria-hidden className="h-3 w-px bg-foreground/30" />
            <Link
              href="/contact"
              className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-foreground sm:text-[12px]"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="mx-auto mt-6 max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <span aria-hidden className="block h-px w-full bg-foreground/10" />
        </div>
      </section>

      {/* Reportages vidéo */}
      <section className="bg-[var(--brand-cream)] pt-12 pb-4 sm:pt-16">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/55">
            Studio M · Vidéos
          </p>
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start lg:gap-16">
            {videos.map((v) => (
              <figure key={v.id}>
                <div
                  className={`relative w-full overflow-hidden bg-black ${
                    v.vertical ? 'mx-auto max-w-[360px] aspect-[9/16]' : 'aspect-video'
                  }`}
                >
                  <iframe
                    src={embedSrc(v.id, v.start)}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <figcaption className="mt-4 text-[11px] uppercase tracking-[0.28em] text-foreground/55">
                  {v.meta}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Presse écrite */}
      <section className="bg-[var(--brand-cream)] pb-24 pt-16 sm:pb-32 sm:pt-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/55">
            Studio M · Articles
          </p>
          <ul className="mt-8 border-t border-foreground/10">
            {articles.map((a) => (
              <li key={a.href} className="border-b border-foreground/10">
                <a
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-6 py-7"
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/55">
                      {a.source}
                    </p>
                    <h2 className="mt-2 max-w-3xl font-display text-xl font-light leading-snug tracking-tight text-foreground sm:text-2xl">
                      {a.title}
                    </h2>
                  </div>
                  <span className="shrink-0 text-[12px] uppercase tracking-[0.2em] text-foreground/60 transition-transform group-hover:translate-x-1 group-hover:text-foreground">
                    Lire →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
