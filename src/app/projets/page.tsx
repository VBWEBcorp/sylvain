import type { Metadata } from 'next'
import Link from 'next/link'

import { ProjectsFilterGrid } from '@/components/sections/projects-filter-grid'
import { brandAssets } from '@/lib/brand'
import { readAll } from '@/lib/projects-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projets',
  description:
    "Sélection de réalisations Studio M : appartements, commerces et maisons rénovés à Paris et en Île-de-France.",
  alternates: { canonical: '/projets' },
}

export default async function ProjectsPage() {
  const projects = await readAll()
  return (
    <>
      <section className="bg-[var(--brand-cream)] pt-40 pb-16 sm:pt-48 sm:pb-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-4">
            <img
              src={brandAssets.monogramBeige}
              alt=""
              aria-hidden
              className="h-5 w-auto opacity-80 mix-blend-multiply"
            />
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
              Studio M · Portfolio
            </p>
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.98] tracking-tight text-foreground">
            Neuf <span className="italic">histoires</span> de lieux transformés.
          </h1>
          <p className="mt-10 max-w-xl text-[15px] leading-relaxed text-foreground/70">
            Une sélection de projets récents, à Paris intra-muros et en proche
            banlieue. Appartements familiaux, pieds-à-terre, boutiques, bureaux
            et restaurants : chaque lieu a son récit.
          </p>
        </div>
      </section>

      <section className="bg-[var(--brand-cream)] pb-32">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="grid gap-x-6 gap-y-20 md:grid-cols-2 lg:gap-x-10 lg:gap-y-28">
            {projects.map((p, i) => (
              <Link
                key={p.slug}
                href={`/projets/${p.slug}`}
                className={`group block ${i % 2 === 1 ? 'md:mt-24' : ''}`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 left-4 bg-[var(--brand-cream)]/90 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-foreground/70 backdrop-blur-sm">
                    {p.category}
                  </span>
                  <span className="absolute bottom-4 right-4 font-display text-sm italic text-white/90">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-display text-2xl font-light leading-tight text-foreground sm:text-3xl">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-[13px] text-foreground/60">
                      {p.location} · {p.year} · {p.surface}
                    </p>
                  </div>
                  <span className="shrink-0 pt-2 text-[13px] uppercase tracking-[0.18em] text-foreground/70 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProjectsFilterGrid projects={projects} />
    </>
  )
}
