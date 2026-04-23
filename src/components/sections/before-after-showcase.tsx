'use client'

import Link from 'next/link'
import { useState } from 'react'

import { BeforeAfter } from '@/components/before-after'
import type { Project } from '@/lib/projects'

export function BeforeAfterShowcase({ projects }: { projects: Project[] }) {
  const withBeforeAfter = projects.filter((p) => p.before && p.after)
  const [index, setIndex] = useState(0)
  const current = withBeforeAfter[index]
  if (!current) return null

  return (
    <section className="bg-[oklch(0.94_0.022_82)] py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
            Avant / Après
          </p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight tracking-tight text-foreground">
            La transformation, <span className="italic">en un geste</span>.
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-foreground/70">
            Glissez le curseur pour révéler la métamorphose de chaque lieu.
          </p>
        </div>

        <div className="mt-14">
          <BeforeAfter before={current.before!} after={current.after!} />
          <div className="mt-6 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-2xl font-light leading-tight text-foreground">
                {current.title}
              </p>
              <p className="mt-1 text-[13px] text-foreground/60">
                {current.location} · {current.surface}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {withBeforeAfter.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    i === index
                      ? 'border-b border-foreground pb-0.5 text-foreground'
                      : 'text-foreground/50 hover:text-foreground'
                  }`}
                >
                  0{i + 1}
                </button>
              ))}
              <Link
                href={`/projets/${current.slug}`}
                className="ml-4 border-b border-foreground/60 pb-0.5 text-[11px] uppercase tracking-[0.18em] text-foreground hover:border-foreground"
              >
                Voir le projet →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
