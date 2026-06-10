import type { Metadata } from 'next'

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

// Reportages vidéo (YouTube, mode confidentialité renforcée, lecture auto en sourdine).
const videos = [
  { id: 'IwU2mV35wfc', start: 115, vertical: false, title: 'Reportage vidéo' },
  { id: 'Ug9QKUk2Oq4', start: 0, vertical: true, title: 'Format court' },
] as const

// Articles de presse écrite, affichés en capture d'écran cliquable (ouvre l'article).
const articles = [
  {
    href: 'https://www.sloft-magazine.com/le-magazine/visite-guidee/coup-double-a-paris-36-m%c2%b2-qui-jouent-sur-tous-les-tableaux/',
    source: 'Sloft Magazine',
    title: 'Coup double à Paris : 36 m² qui jouent sur tous les tableaux',
    image: '/presse/sloft-coup-double.webp',
  },
  {
    href: 'https://www.sloft-magazine.com/le-magazine/visite-guidee/un-appartement-en-trois-villes/',
    source: 'Sloft Magazine',
    title: 'Un appartement en trois villes',
    image: '/presse/sloft-trois-villes.webp',
  },
]

function embedSrc(id: string, start: number) {
  const params = new URLSearchParams({
    rel: '0',
    autoplay: '1',
    mute: '1',
    playsinline: '1',
  })
  if (start > 0) params.set('start', String(start))
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}

function VideoTile({ v }: { v: (typeof videos)[number] }) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-black ${
        v.vertical ? 'mx-auto aspect-[9/16] max-w-[360px]' : 'aspect-video'
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
  )
}

function ArticleTile({ a }: { a: (typeof articles)[number] }) {
  return (
    <a
      href={a.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Lire l'article : ${a.title} (${a.source})`}
      className="group block"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white ring-1 ring-foreground/10">
        {a.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.image}
            alt={`${a.source} — ${a.title}`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center px-6 text-center font-display text-2xl font-light tracking-tight text-foreground/25">
            {a.source}
          </span>
        )}
        <span
          aria-hidden
          className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10"
        />
        <span
          aria-hidden
          className="absolute bottom-4 left-4 inline-flex translate-y-1 items-center gap-1 bg-white/90 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Lire l’article →
        </span>
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-foreground/55">
        {a.source}
      </p>
    </a>
  )
}

export default function PressePage() {
  const [videoMain, videoShort] = videos
  const [articleA, articleB] = articles

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Bandeau compact — cohérent avec les autres pages */}
      <section className="bg-white pt-28 pb-6 sm:pt-32 sm:pb-8">
        <div className="mx-auto flex max-w-[1400px] items-center px-6 sm:px-10 lg:px-16">
          <h1 className="font-display text-3xl font-light leading-none tracking-tight text-foreground sm:text-4xl">
            Presse
          </h1>
        </div>
        <div className="mx-auto mt-6 max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <span aria-hidden className="block h-px w-full bg-foreground/10" />
        </div>
      </section>

      {/* Presse — chaque vidéo (lecture auto) avec la capture d'article à côté */}
      <section className="bg-white pb-24 pt-10 sm:pb-32 sm:pt-12">
        <div className="mx-auto max-w-[1400px] space-y-4 px-6 sm:space-y-6 sm:px-10 lg:px-16">
          {/* Ligne 1 — vidéo paysage centrée verticalement face à l'article */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:items-center">
            <VideoTile v={videoMain} />
            <ArticleTile a={articleA} />
          </div>

          {/* Ligne 2 — vidéo à gauche, article à droite */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:items-start">
            <VideoTile v={videoShort} />
            <ArticleTile a={articleB} />
          </div>
        </div>
      </section>
    </>
  )
}
