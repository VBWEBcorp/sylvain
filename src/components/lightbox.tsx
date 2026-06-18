'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react'
import { useCallback, useEffect } from 'react'

import { optimizedImage } from '@/lib/img'
import { isVideo } from '@/lib/media'
import { cn } from '@/lib/utils'

type Props = {
  images: string[]
  index: number | null
  onClose: () => void
  onChange: (i: number) => void
  caption?: string
  getLikeCount?: (src: string) => number
  isLiked?: (src: string) => boolean
  onToggleLike?: (src: string) => void
}

const ease = [0.22, 1, 0.36, 1] as const

export function Lightbox({
  images,
  index,
  onClose,
  onChange,
  caption,
  getLikeCount,
  isLiked,
  onToggleLike,
}: Props) {
  const open = index !== null
  const total = images.length
  const currentSrc = images[index ?? 0]
  const likeCount = getLikeCount?.(currentSrc) ?? 0
  const likedNow = isLiked?.(currentSrc) ?? false

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

          {/* Likes — en haut à gauche */}
          {onToggleLike ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleLike(currentSrc)
              }}
              aria-pressed={likedNow}
              aria-label={likedNow ? 'Retirer le like' : 'Aimer cette photo'}
              className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:top-7 sm:left-8"
            >
              <Heart className={cn('size-5', likedNow && 'fill-white')} />
              <span className="text-[13px] tabular-nums">{likeCount}</span>
            </button>
          ) : null}

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

          {/* Compteur au-dessus · image · légende en-dessous (jamais sur la photo) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92vh] max-w-[92vw] flex-col items-center gap-4"
          >
            <p className="shrink-0 text-[11px] uppercase tracking-[0.3em] text-white/65">
              {String((index ?? 0) + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
            {isVideo(currentSrc) ? (
              <motion.video
                key={index}
                src={currentSrc}
                controls
                autoPlay
                loop
                playsInline
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease }}
                className="min-h-0 w-auto max-w-full flex-1 object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              />
            ) : (
              <motion.img
                key={index}
                src={optimizedImage(currentSrc, { width: 2000 })}
                alt=""
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease }}
                className="min-h-0 w-auto max-w-full flex-1 object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                draggable={false}
              />
            )}
            {caption ? (
              <p className="shrink-0 text-center text-[11px] uppercase tracking-[0.3em] text-white/70">
                {caption}
              </p>
            ) : null}
          </div>

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
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
