import Link from 'next/link'

import { brandAssets } from '@/lib/brand'

export function HomeSplash() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center bg-[var(--brand-cream)] px-6 text-center">
      <img
        src={brandAssets.wordmarkBeige}
        alt="Studio M"
        className="h-44 w-auto sm:h-60 lg:h-72"
        draggable={false}
      />

      <p className="mt-7 text-[10px] uppercase tracking-[0.4em] text-foreground/55 sm:text-[11px]">
        Architecture d'intérieur · Paris
      </p>

      <nav
        aria-label="Navigation principale"
        className="mt-12 flex items-center gap-6 sm:gap-10"
      >
        <Link
          href="/projets"
          className="text-[13px] uppercase tracking-[0.3em] text-foreground transition-opacity hover:opacity-60 sm:text-[14px]"
        >
          Réalisations
        </Link>
        <span aria-hidden className="h-3 w-px bg-foreground/40" />
        <Link
          href="/a-propos"
          className="text-[13px] uppercase tracking-[0.3em] text-foreground transition-opacity hover:opacity-60 sm:text-[14px]"
        >
          Studio
        </Link>
        <span aria-hidden className="h-3 w-px bg-foreground/40" />
        <Link
          href="/contact"
          className="text-[13px] uppercase tracking-[0.3em] text-foreground transition-opacity hover:opacity-60 sm:text-[14px]"
        >
          Contact
        </Link>
      </nav>

      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 -z-0 hidden h-px w-[420px] -translate-x-1/2 bg-foreground/15 sm:block"
      />
    </section>
  )
}
