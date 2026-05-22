'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect } from 'react'

type Props = {
  images: string[]
  index: number | null
  onClose: () => void
  onChange: (i: number) => void
  caption?: string
}

const ease = [0.22, 1, 0.36, 1] as const

export function Lightbox({ images, index, onClose, onChange, caption }: Props) {
  const open = index !== null
  const total = images.length

  const next = useCallback(() => {
    if (index === null) return
    onChange((index + 1) % total)
  }, [index, total, onChange])

  const prev = useCallback(() => {
    if (index === null) return
    onChange((index - 1 + total) % total)
  }, [index, total, onChange])

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = original
    }
  }, [open, onClose, next, prev])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Bouton fermer */}
          <button
            type="button"
            aria-label="Fermer"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="absolute top-5 right-5 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:top-7 sm:right-7"
          >
            <X className="size-5" />
          </button>

          {/* Compteur */}
          <p className="absolute top-7 left-5 text-[11px] uppercase tracking-[0.3em] text-white/65 sm:left-8">
            {String((index ?? 0) + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>

          {/* Flèche gauche */}
          {total > 1 ? (
            <button
              type="button"
              aria-label="Photo précédente"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="size-5" />
            </button>
          ) : null}

          {/* Image */}
          <motion.img
            key={index}
            src={images[index ?? 0]}
            alt=""
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            draggable={false}
          />

          {/* Flèche droite */}
          {total > 1 ? (
            <button
              type="button"
              aria-label="Photo suivante"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="size-5" />
            </button>
          ) : null}

          {/* Légende */}
          {caption ? (
            <p className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 text-center text-[11px] uppercase tracking-[0.3em] text-white/70">
              {caption}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
