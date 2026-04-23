'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import type { Project } from '@/lib/projects'

const categories = ['Tous', 'Appartement', 'Commerce', 'Maison'] as const
type Category = (typeof categories)[number]

const ease = [0.22, 1, 0.36, 1] as const

export function ProjectsFilterGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Category>('Tous')
  const [hoverSlug, setHoverSlug] = useState<string | null>(null)

  const filtered = useMemo<Project[]>(() => {
    if (active === 'Tous') return projects
    return projects.filter((p) => p.category === active)
  }, [active, projects])

  const counts = useMemo(() => {
    const acc: Record<string, number> = { Tous: projects.length }
    for (const p of projects) acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, [projects])

  return (
    <section className="relative overflow-hidden bg-[oklch(0.93_0.03_82)] py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
              Vue d'ensemble
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.75rem)] font-light leading-[1.05] tracking-tight text-foreground">
              Explorez les projets <span className="italic">par catégorie</span>.
            </h2>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => {
              const isActive = active === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActive(c)}
                  className={`relative inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? 'border-foreground bg-foreground text-[var(--brand-cream)]'
                      : 'border-border/60 bg-transparent text-foreground/70 hover:border-foreground/70 hover:text-foreground'
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-foreground"
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative">{c}</span>
                  <span
                    className={`relative text-[10px] ${
                      isActive ? 'text-[var(--brand-cream)]/60' : 'text-foreground/40'
                    }`}
                  >
                    {counts[c] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Grille animée */}
        <motion.div
          layout
          className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.55, ease, delay: i * 0.04 }}
                onMouseEnter={() => setHoverSlug(p.slug)}
                onMouseLeave={() => setHoverSlug(null)}
                className="group"
              >
                <Link href={`/projets/${p.slug}`} className="block">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                    <motion.img
                      src={p.cover}
                      alt={p.title}
                      className="h-full w-full object-cover"
                      animate={{
                        scale:
                          hoverSlug === p.slug
                            ? 1.06
                            : hoverSlug && hoverSlug !== p.slug
                              ? 1
                              : 1,
                        opacity:
                          hoverSlug && hoverSlug !== p.slug ? 0.55 : 1,
                      }}
                      transition={{ duration: 0.7, ease }}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-transparent p-4"
                    >
                      <span className="font-display text-base italic text-white">
                        Voir le projet →
                      </span>
                    </motion.div>
                    <span className="absolute top-3 left-3 bg-[var(--brand-cream)]/85 px-2 py-1 text-[9px] uppercase tracking-[0.22em] text-foreground/70 backdrop-blur-sm">
                      {p.category}
                    </span>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-lg font-light leading-tight text-foreground sm:text-xl">
                        {p.title}
                      </h3>
                      <p className="mt-1 truncate text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                        {p.location}
                      </p>
                    </div>
                    <span className="shrink-0 font-display text-sm italic text-foreground/50">
                      {p.year}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Compteur résultat */}
        <motion.p
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="mt-12 text-center text-[11px] uppercase tracking-[0.3em] text-foreground/45"
        >
          {filtered.length} projet{filtered.length > 1 ? 's' : ''} affiché
          {filtered.length > 1 ? 's' : ''}
        </motion.p>
      </div>
    </section>
  )
}
