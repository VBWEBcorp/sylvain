'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Lightbox } from '@/components/lightbox'
import { useLikes } from '@/hooks/use-likes'
import type { Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

type Likes = ReturnType<typeof useLikes>

export function JmlcStack({ projects }: { projects: Project[] }) {
  const likes = useLikes()
  return (
    <section className="bg-[var(--brand-cream)] pb-24 sm:pb-32">
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
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Largeur réelle d'une vignette (image + gouttière), mesurée dans le DOM
  // pour rester juste malgré le gap de 5 mm entre les images.
  function itemWidth(el: HTMLDivElement) {
    const first = el.firstElementChild as HTMLElement | null
    if (!first) return el.clientWidth
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0
    return first.getBoundingClientRect().width + gap
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollLeft / itemWidth(el))
        setActive(Math.min(Math.max(idx, 0), images.length - 1))
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [images.length])

  function scrollBy(direction: -1 | 1) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: direction * itemWidth(el), behavior: 'smooth' })
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
                {project.comingSoon ? 'Coming soon' : 'Photos à venir'}
              </p>
              {project.shootingDate ? (
                <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-foreground/45">
                  {project.shootingDate}
                </p>
              ) : null}
            </div>
          </div>
        ) : single ? (
          <div className="group/photo relative w-full">
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              className="block aspect-[16/10] w-full overflow-hidden"
              aria-label="Agrandir la photo"
            >
              <img
                src={images[0]}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/photo:scale-[1.02]"
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
              className="hide-scrollbar flex w-full snap-x snap-mandatory gap-[5mm] overflow-x-auto"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {images.map((src, i) => (
                <div
                  key={i}
                  className="group/photo relative aspect-[3/4] w-[84%] shrink-0 snap-start overflow-hidden sm:w-[calc((100%-10mm)/3)]"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Agrandir la photo ${i + 1}`}
                    className="block h-full w-full overflow-hidden"
                  >
                    <img
                      src={src}
                      alt=""
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
              onClick={() => scrollBy(-1)}
              className="absolute top-1/2 left-3 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/85 p-2 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-white sm:flex"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Photo suivante"
              onClick={() => scrollBy(1)}
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

      {images.length > 1 ? (
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
