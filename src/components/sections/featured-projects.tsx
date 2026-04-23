import Link from 'next/link'

import type { Project } from '@/lib/projects'

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const featured = projects.slice(0, 4)
  return (
    <section className="bg-[var(--brand-cream)] pb-28 sm:pb-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <div className="flex items-end justify-between gap-6 pb-14">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
              Projets sélectionnés
            </p>
            <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight tracking-tight text-foreground">
              Quelques <span className="italic">réalisations récentes</span>
            </h2>
          </div>
          <Link
            href="/projets"
            className="hidden shrink-0 border-b border-foreground/60 pb-1 text-[13px] uppercase tracking-[0.18em] text-foreground hover:border-foreground md:inline-block"
          >
            Tous les projets →
          </Link>
        </div>

        <div className="grid gap-x-6 gap-y-16 md:grid-cols-2 lg:gap-x-10 lg:gap-y-24">
          {featured.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projets/${p.slug}`}
              className={`group block ${i % 2 === 1 ? 'md:mt-20' : ''}`}
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
              </div>
              <div className="mt-6 flex items-start justify-between gap-6">
                <div>
                  <h3 className="font-display text-2xl font-light leading-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-foreground/60">
                    {p.location} · {p.year}
                  </p>
                </div>
                <span className="shrink-0 pt-2 text-[13px] uppercase tracking-[0.18em] text-foreground/70 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center md:hidden">
          <Link
            href="/projets"
            className="border-b border-foreground/60 pb-1 text-[13px] uppercase tracking-[0.18em] text-foreground"
          >
            Tous les projets →
          </Link>
        </div>
      </div>
    </section>
  )
}
