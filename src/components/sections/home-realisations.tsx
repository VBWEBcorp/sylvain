import Link from 'next/link'

import { JmlcStack } from '@/components/sections/jmlc-stack'
import type { Project } from '@/lib/projects'

export function HomeRealisations({ projects }: { projects: Project[] }) {
  const featured = projects.slice(0, 3)
  return (
    <section className="bg-[var(--brand-cream)] pt-20 sm:pt-28">
      <div className="mx-auto max-w-[1100px] px-6 text-center sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.32em] text-foreground/55">
          Studio M · Réalisations
        </p>
        <h2 className="mt-5 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-light leading-tight tracking-tight text-foreground">
          Vos projets <span className="italic">prennent vie</span>.
        </h2>
      </div>

      <JmlcStack projects={featured} />

      <div className="mb-24 flex justify-center sm:mb-32">
        <Link
          href="/projets"
          className="group inline-flex items-center gap-3 border-b border-foreground/60 pb-1 text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground"
        >
          Voir toutes les réalisations
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  )
}
