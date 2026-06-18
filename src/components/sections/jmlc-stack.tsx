'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Lightbox } from '@/components/lightbox'
import { useLikes } from '@/hooks/use-likes'
import { optimizedImage } from '@/lib/img'
import type { Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

type Likes = ReturnType<typeof useLikes>

export function JmlcStack({ projects }: { projects: Project[] }) {
  const likes = useLikes()
  return (
    <section className="bg-white pb-24 sm:pb-32">
      <ul className="space-y-20 pt-16 sm:space-y-28 sm:pt-24">
        {projects.map((p, i) => (
          <motion.li
            key={p.slug}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease, delay: (i % 3) * 0.05 }}
            className="w-full"
          >
            <ProjectCarousel project={p} likes={likes} />
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

function ProjectCarousel({ project, likes }: { project: Project; likes: Likes }) {
  const images = Array.from(new Set([project.cover, ...project.gallery])).filter(Boolean)
  // Orientation choisie dans l'admin : portrait → cadre 3:4, paysage → cadre 3:2
  // (recadrage object-cover), sinon ratio naturel. Hauteur identique pour toutes.
  const orientationOf = (src: string) =>
    project.orientations?.find((o) => o.url === src)?.orientation
  const frameClass = (src: string) => {
    const o = orientationOf(src)
    if (o === 'portrait') return 'aspect-[3/4]'
    if (o === 'paysage') return 'aspect-[3/2]'
    return ''
  }
  // Largeur d'une photo dans le carrousel (hauteur identique pour toutes).
  // Portrait/auto = 1 créneau → 5 côte à côte sur ordinateur (3 tablette, 1 mobile).
  // Paysage = 2 créneaux → photo large qui « casse » la grille et alterne.
  // RÈGLE : les 5 PREMIÈRES photos restent toujours en portrait (5 côte à côte
  // garanti, quoi qu'il arrive). Les variations paysage n'agissent qu'à partir
  // de la 6ᵉ photo, même si l'admin a mis « paysage » avant.
  const cellBasis = (src: string, i: number) =>
    i >= 5 && orientationOf(src) === 'paysage'
      ? 'basis-[92%] sm:basis-[calc((100%_-_10mm)/3*2_+_5mm)] lg:basis-[calc((100%_-_20mm)/5*2_+_5mm)]'
      : 'basis-[80%] sm:basis-[calc((100%_-_10mm)/3)] lg:basis-[calc((100%_-_20mm)/5)]'
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Index actif = la vignette dont le bord gauche est le plus proche du bord
  // gauche du conteneur. Robuste aux largeurs variables (portrait/paysage).
  function computeActive(el: HTMLDivElement) {
    const base = el.getBoundingClientRect().left
    const kids = Array.from(el.children) as HTMLElement[]
    let best = 0
    let bestDist = Infinity
    kids.forEach((k, i) => {
      const d = Math.abs(k.getBoundingClientRect().left - base)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    return best
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setActive(computeActive(el)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [images.length])

  function scrollByOne(direction: -1 | 1) {
    const el = trackRef.current
    if (!el) return
    const kids = Array.from(el.children) as HTMLElement[]
    const target = kids[Math.min(Math.max(computeActive(el) + direction, 0), kids.length - 1)]
    if (!target) return
    const delta = target.getBoundingClientRect().left - el.getBoundingClientRect().left
    el.scrollTo({ left: el.scrollLeft + delta, behavior: 'smooth' })
  }

  const empty = images.length === 0
  const single = images.length === 1

  return (
    <div>
      <p className="mb-5 block px-4 text-center text-[11px] uppercase tracking-[0.28em] text-foreground/55 sm:px-8">
        {project.title} · {project.surface || project.location}
      </p>

      <div className="relative w-full bg-muted">
        {empty ? (
          <div className="flex aspect-[16/10] w-full items-center justify-center sm:aspect-[21/9]">
            <div className="px-6 text-center">
              <p className="font-display text-2xl font-light tracking-tight text-foreground/70 sm:text-3xl">
                Coming soon
              </p>
            </div>
          </div>
        ) : single ? (
          <div className="group/photo relative flex h-[56vh] max-h-[560px] w-full items-center justify-center sm:h-[440px] lg:h-[480px]">
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              className={cn('block h-full overflow-hidden', frameClass(images[0]))}
              aria-label="Agrandir la photo"
            >
              <img
                src={optimizedImage(images[0], { width: 1600 })}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className={cn(
                  'h-full object-cover transition-transform duration-[1200ms] ease-out group-hover/photo:scale-[1.02]',
                  orientationOf(images[0]) ? 'w-full' : 'w-auto'
                )}
              />
            </button>
            <LikeButton
              count={likes.count(images[0])}
              liked={likes.isLiked(images[0])}
              onToggle={() => likes.toggle(images[0])}
            />
          </div>
        ) : (
          <div className="group relative">
            <div
              ref={trackRef}
              className="hide-scrollbar flex h-[56vh] max-h-[560px] w-full snap-x snap-mandatory gap-[5mm] overflow-x-auto sm:h-[440px] lg:h-[480px]"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {images.map((src, i) => (
                <div
                  key={i}
                  className={cn(
                    'group/photo relative h-full shrink-0 grow-0 snap-start overflow-hidden',
                    cellBasis(src, i)
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Agrandir la photo ${i + 1}`}
                    className="block h-full w-full overflow-hidden"
                  >
                    <img
                      src={optimizedImage(src, { width: 1300 })}
                      alt=""
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={i === 0 ? 'high' : 'auto'}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/photo:scale-[1.02]"
                    />
                  </button>
                  <LikeButton
                    count={likes.count(src)}
                    liked={likes.isLiked(src)}
                    onToggle={() => likes.toggle(src)}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              aria-label="Photo précédente"
              onClick={() => scrollByOne(-1)}
              className="absolute top-1/2 left-3 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/85 p-2 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-white sm:flex"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Photo suivante"
              onClick={() => scrollByOne(1)}
              className="absolute top-1/2 right-3 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/85 p-2 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-white sm:flex"
            >
              <ChevronRight className="size-4" />
            </button>

            <div className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
              {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </div>
          </div>
        )}
      </div>

      {images.length > 1 && images.length <= 12 ? (
        <div className="mt-4 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-[2px] transition-all duration-300 ${
                i === active ? 'w-6 bg-foreground/70' : 'w-3 bg-foreground/20'
              }`}
            />
          ))}
        </div>
      ) : null}

      {project.credits && project.credits.length > 0 ? (
        <p className="mt-3 px-4 text-center text-[11px] italic leading-relaxed text-foreground/35">
          Crédit photo :{' '}
          {project.credits.map((c, i) => (
            <span key={i}>
              {i > 0 ? ' · ' : ''}
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 transition-colors hover:text-foreground/70 hover:underline"
                >
                  {c.name}
                </a>
              ) : (
                c.name
              )}
            </span>
          ))}
        </p>
      ) : null}

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
        caption={`${project.title} · ${project.surface || project.location}`}
        getLikeCount={(src) => likes.count(src)}
        isLiked={(src) => likes.isLiked(src)}
        onToggleLike={(src) => likes.toggle(src)}
      />
    </div>
  )
}

function LikeButton({
  count,
  liked,
  onToggle,
}: {
  count: number
  liked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      aria-pressed={liked}
      aria-label={liked ? 'Retirer le like' : 'Aimer cette photo'}
      className={cn(
        'absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-white backdrop-blur-sm transition-opacity duration-300',
        // visible au survol sur desktop, toujours visible si liké ou sur mobile
        'opacity-100 sm:opacity-0 sm:group-hover/photo:opacity-100',
        liked && 'sm:opacity-100'
      )}
    >
      <Heart className={cn('size-4', liked && 'fill-white')} />
      {count > 0 ? <span className="text-[12px] tabular-nums">{count}</span> : null}
    </button>
  )
}
