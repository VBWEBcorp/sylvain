import type { Metadata } from 'next'

import Link from 'next/link'

import { JmlcStack } from '@/components/sections/jmlc-stack'
import { brandAssets } from '@/lib/brand'
import { readAll } from '@/lib/projects-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Réalisations',
  description:
    "Sélection de réalisations Studio M : appartements et maisons rénovés à Paris et en Île-de-France.",
  alternates: { canonical: '/projets' },
}

export default async function ProjectsPage() {
  const projects = await readAll()
  return (
    <>
      <section className="relative bg-[var(--brand-cream)] pt-28 pb-6 sm:pt-32 sm:pb-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-4">
            <img
              src={brandAssets.monogramDark}
              alt=""
              aria-hidden
              className="h-12 w-auto sm:h-14"
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 sm:text-[11px]">
                Studio M
              </p>
              <h1 className="font-display text-2xl font-light leading-none tracking-tight text-foreground sm:text-3xl">
                Réalisations
              </h1>
            </div>
          </div>

          <nav
            aria-label="Sections du site"
            className="flex items-center gap-5 sm:gap-7"
          >
            <Link
              href="/a-propos"
              className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline sm:text-[12px]"
            >
              Studio
            </Link>
            <span aria-hidden className="h-3 w-px bg-foreground/30" />
            <Link
              href="/contact"
              className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline sm:text-[12px]"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="mx-auto mt-6 max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <span aria-hidden className="block h-px w-full bg-foreground/10" />
        </div>
      </section>

      <JmlcStack projects={projects} />
    </>
  )
}
