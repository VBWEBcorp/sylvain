import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BeforeAfter } from '@/components/before-after'
import { readAll, readOne } from '@/lib/projects-store'

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const project = await readOne(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.intro,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.intro,
      images: [project.cover],
    },
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await readOne(slug)
  if (!project) notFound()

  const projects = await readAll()
  const currentIndex = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(currentIndex + 1) % projects.length]

  return (
    <>
      {/* Cover */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
          <img
            src={project.cover}
            alt={project.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="mx-auto max-w-[1400px] px-6 pb-12 text-white sm:px-10 lg:px-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">
              {project.category} · {project.location}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(2rem,6vw,5rem)] font-light leading-[1.05] tracking-tight">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Intro + fiche */}
      <section className="bg-[var(--brand-cream)] py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-20">
            <div>
              <p className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-light leading-[1.25] text-foreground">
                {project.intro}
              </p>
              <div className="mt-10 space-y-5 text-[15px] leading-relaxed text-foreground/70">
                {project.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <aside className="space-y-6 border-t border-border/60 pt-10 text-[13px] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <Row label="Année" value={project.year} />
              <Row label="Surface" value={project.surface} />
              <Row label="Durée" value={project.duration} />
              <Row label="Localisation" value={project.location} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/50">
                  Interventions
                </p>
                <ul className="mt-3 space-y-1 text-foreground">
                  {project.services.map((s) => (
                    <li key={s} className="font-display text-lg italic">
                      · {s}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Avant / Après */}
      {project.before && project.after ? (
        <section className="bg-[oklch(0.94_0.022_82)] py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
              Avant / Après
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,3rem)] font-light leading-tight tracking-tight">
              La <span className="italic">métamorphose</span> du lieu.
            </h2>
            <div className="mt-12">
              <BeforeAfter before={project.before} after={project.after} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Galerie */}
      <section className="bg-[var(--brand-cream)] py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
            Galerie
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
            {project.gallery.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden bg-muted ${
                  i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation vers projet suivant */}
      <section className="bg-[oklch(0.22_0.015_60)] py-28 text-white">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">
                Projet suivant
              </p>
              <Link
                href={`/projets/${next.slug}`}
                className="mt-4 block font-display text-[clamp(1.75rem,4vw,3.5rem)] font-light leading-[1.1] tracking-tight hover:italic"
              >
                {next.title} →
              </Link>
              <p className="mt-3 text-[13px] text-white/55">
                {next.location} · {next.year}
              </p>
            </div>
            <Link
              href="/projets"
              className="border-b border-white/60 pb-1 text-[13px] uppercase tracking-[0.2em] hover:border-white"
            >
              ← Tous les projets
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/50">
        {label}
      </p>
      <p className="mt-1 font-display text-xl font-light text-foreground">
        {value}
      </p>
    </div>
  )
}
