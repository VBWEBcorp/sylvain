import type { Metadata } from 'next'
import Link from 'next/link'

import { brandAssets } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-[var(--brand-cream)] px-6 py-28 sm:py-36">
      {/* Monogramme en filigrane */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brandAssets.monogramDark}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 w-[min(72vw,620px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
      />

      <div className="relative mx-auto max-w-xl text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-foreground/50">
          Erreur 404
        </p>

        <h1 className="mt-6 font-display text-[clamp(5rem,18vw,11rem)] font-light leading-[0.85] tracking-tight text-foreground">
          404
        </h1>

        <p className="mt-6 font-display text-2xl font-light italic leading-snug text-foreground/80 sm:text-3xl">
          Cette page s&apos;est égarée.
        </p>

        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-foreground/60">
          La page que vous cherchez n&apos;existe pas ou a été déplacée. Revenez à
          l&apos;accueil, ou explorez les réalisations du studio.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 text-[12px] uppercase tracking-[0.22em] text-[var(--brand-cream)] transition-transform hover:-translate-y-[1px]"
          >
            Retour à l&apos;accueil
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            href="/projets"
            className="group inline-flex items-center gap-2 border-b border-foreground/50 pb-1 text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground"
          >
            Voir les réalisations
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
