import type { Metadata } from 'next'

import { connectDB } from '@/lib/db'
import { PressItem } from '@/models/Press'
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

type PressEntry = {
  kind: 'article' | 'video'
  title: string
  source?: string
  href?: string
  image?: string
  youtubeId?: string
  start?: number
  vertical?: boolean
}

// Contenu de secours affiché tant qu'aucun élément n'a été saisi dans l'admin.
const FALLBACK: PressEntry[] = [
  {
    kind: 'article',
    source: 'Sloft Magazine',
    title: 'Un appartement en trois villes',
    href: 'https://www.sloft-magazine.com/le-magazine/visite-guidee/un-appartement-en-trois-villes/',
    image: '/presse/sloft-trois-villes.webp',
  },
  {
    kind: 'video',
    title: 'Reportage vidéo',
    youtubeId: 'IwU2mV35wfc',
    vertical: false,
  },
  {
    kind: 'video',
    title: 'Format court',
    youtubeId: 'Ug9QKUk2Oq4',
    vertical: true,
  },
  {
    kind: 'article',
    source: 'Sloft Magazine',
    title: 'Coup double à Paris : 36 m² qui jouent sur tous les tableaux',
    href: 'https://www.sloft-magazine.com/le-magazine/visite-guidee/coup-double-a-paris-36-m%c2%b2-qui-jouent-sur-tous-les-tableaux/',
    image: '/presse/sloft-coup-double.webp',
  },
]

async function getPressItems(): Promise<PressEntry[]> {
  try {
    await connectDB()
    const docs = await PressItem.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .lean()

    if (!docs.length) return FALLBACK

    return docs.map((d: any) => ({
      kind: d.kind === 'video' ? 'video' : 'article',
      title: d.title,
      source: d.source,
      href: d.href,
      image: d.image,
      youtubeId: d.youtubeId,
      start: d.start,
      vertical: d.vertical,
    }))
  } catch (error) {
    console.error('Press page fetch error:', error)
    return FALLBACK
  }
}

function embedSrc(id: string, start = 0) {
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

function VideoTile({ v }: { v: PressEntry }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-black shadow-sm ring-1 ring-foreground/10 ${
        v.vertical ? 'mx-auto aspect-[9/16] max-w-[340px]' : 'aspect-video'
      }`}
    >
      <iframe
        src={embedSrc(v.youtubeId ?? '', v.start ?? 0)}
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

function ArticleTile({ a }: { a: PressEntry }) {
  const tile = (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-foreground/10 transition-shadow duration-300 group-hover:shadow-md">
      {a.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={a.image}
          alt={`${a.source ?? ''} — ${a.title}`}
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
  )

  const caption = (
    <p className="mt-3 max-w-md text-[13px] leading-snug text-foreground/70">{a.title}</p>
  )

  if (!a.href) {
    return (
      <div className="group block">
        {tile}
        {caption}
      </div>
    )
  }

  return (
    <a
      href={a.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Lire l'article : ${a.title}${a.source ? ` (${a.source})` : ''}`}
      className="group block"
    >
      {tile}
      {caption}
    </a>
  )
}

export default async function PressePage() {
  const items = await getPressItems()

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

          {items.length === 0 ? (
            <p className="mt-12 text-[15px] italic text-foreground/60">
              Les parutions presse arrivent très bientôt.
            </p>
          ) : (
            <div className="mt-12 grid gap-x-10 gap-y-14 sm:mt-14 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
              {items.map((item, i) => {
                const n = String(i + 1).padStart(2, '0')
                const label = item.kind === 'article' ? item.source ?? 'Presse' : item.title
                return (
                  <div key={i} className={item.kind === 'video' && item.vertical ? 'mx-auto w-full max-w-[340px]' : ''}>
                    <Caption n={n} label={label} />
                    {item.kind === 'article' ? (
                      <ArticleTile a={item} />
                    ) : (
                      <VideoTile v={item} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
