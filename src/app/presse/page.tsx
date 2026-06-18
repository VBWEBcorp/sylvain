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
  { id: 'IwU2mV35wfc', start: 0, vertical: false, title: 'Reportage vidéo' },
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

function Caption({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-3">
      <span className="font-display text-sm tabular-nums text-foreground/40">{n}</span>
      <span aria-hidden className="h-px w-6 bg-foreground/20" />
      <span className="text-[11px] uppercase tracking-[0.28em] text-foreground/55">{label}</span>
    </div>
  )
}

function VideoTile({ v }: { v: (typeof videos)[number] }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-black shadow-sm ring-1 ring-foreground/10 ${
        v.vertical ? 'mx-auto aspect-[9/16] max-w-[340px]' : 'aspect-video'
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
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-foreground/10 transition-shadow duration-300 group-hover:shadow-md">
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
      <p className="mt-3 max-w-md text-[13px] leading-snug text-foreground/70">
        {a.title}
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

      {/* Presse — reportages vidéo (lecture auto) + captures d'articles */}
      <section className="bg-white pb-24 pt-10 sm:pb-32 sm:pt-14">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <p className="max-w-2xl text-[15px] leading-relaxed text-foreground/65">
            Reportages vidéo et articles consacrés aux projets de Studio M et au
            travail de Sylvain Marceau.
          </p>

          <div className="mt-12 space-y-14 sm:mt-14 sm:space-y-20">
            {/* Ligne 1 — reportage paysage + article */}
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
              <div className="lg:col-span-7">
                <Caption n="01" label={videoMain.title} />
                <VideoTile v={videoMain} />
              </div>
              <div className="lg:col-span-5">
                <Caption n="02" label={articleA.source} />
                <ArticleTile a={articleA} />
              </div>
            </div>

            {/* Ligne 2 — format court vertical + article */}
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
              <div className="lg:col-span-5">
                <div className="mx-auto max-w-[340px]">
                  <Caption n="03" label={videoShort.title} />
                  <VideoTile v={videoShort} />
                </div>
              </div>
              <div className="lg:col-span-7">
                <Caption n="04" label={articleB.source} />
                <ArticleTile a={articleB} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
