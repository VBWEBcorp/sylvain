'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Lightbox } from '@/components/lightbox'
import type { Project } from '@/lib/projects'

const ease = [0.22, 1, 0.36, 1] as const

export function JmlcStack({ projects }: { projects: Project[] }) {
  return (
    <section className="bg-[var(--brand-cream)] pb-24 sm:pb-32">
      <ul className="space-y-16 pt-16 sm:space-y-24 sm:pt-24">
        {projects.map((p, i) => (
          <motion.li
            key={p.slug}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease, delay: (i % 3) * 0.05 }}
            className="mx-auto w-full max-w-[1100px] px-4 sm:px-8"
          >
            <ProjectCarousel project={p} />
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

function ProjectCarousel({ project }: { project: Project }) {
  const images = Array.from(new Set([project.cover, ...project.gallery])).filter(Boolean)
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const itemWidth = el.scrollWidth / images.length
        const idx = Math.round(el.scrollLeft / itemWidth)
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
    const itemWidth = el.scrollWidth / images.length
    el.scrollBy({ left: direction * itemWidth, behavior: 'smooth' })
  }

  const single = images.length <= 1

  return (
    <div>
      <p className="mb-4 block text-center text-[11px] uppercase tracking-[0.28em] text-foreground/55">
        {project.title} · {project.surface || project.location}
      </p>

      <div className="group relative w-full overflow-hidden bg-muted">
        {single ? (
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="block aspect-[16/10] w-full overflow-hidden"
            aria-label="Agrandir la photo"
          >
            <img
              src={images[0]}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
            />
          </button>
        ) : (
          <>
            <div
              ref={trackRef}
              className="hide-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Agrandir la photo ${i + 1}`}
                  className="relative aspect-[3/4] w-[calc(100%/3)] shrink-0 snap-start overflow-hidden"
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
                  />
                </button>
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
          </>
        )}
      </div>

      {!single ? (
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

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
        caption={`${project.title} · ${project.surface || project.location}`}
      />
    </div>
  )
}
