'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export function BeforeAfter({
  before,
  after,
  beforeLabel = 'Avant',
  afterLabel = 'Après',
  className,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)

  const update = useCallback((clientX: number) => {
    const el = wrapperRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.min(Math.max(clientX - rect.left, 1), rect.width - 1)
    setPos((x / rect.width) * 100)
  }, [])

  useEffect(() => {
    if (!dragging) return
    const move = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      update(x)
    }
    const up = () => setDragging(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move, { passive: true })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
  }, [dragging, update])

  return (
    <div
      ref={wrapperRef}
      className={`relative aspect-[16/10] w-full overflow-hidden bg-muted select-none ${className ?? ''}`}
      onMouseDown={(e) => {
        setDragging(true)
        update(e.clientX)
      }}
      onTouchStart={(e) => {
        setDragging(true)
        update(e.touches[0].clientX)
      }}
    >
      {/* Après en arrière-plan */}
      <img
        src={after}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <span className="absolute right-4 bottom-4 z-20 rounded-full bg-black/55 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
        {afterLabel}
      </span>

      {/* Avant clippé à gauche */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={before}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: `${(100 / pos) * 100}%`, maxWidth: 'none' }}
          draggable={false}
        />
        <span className="absolute bottom-4 left-4 z-20 rounded-full bg-black/55 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          {beforeLabel}
        </span>
      </div>

      {/* Curseur */}
      <div
        className="absolute inset-y-0 z-10 w-px bg-white/80 shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{ left: `${pos}%` }}
      >
        <button
          type="button"
          aria-label="Glisser pour comparer"
          className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-foreground shadow-lg ring-1 ring-black/5"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 18 15 12 9 6" transform="translate(6 0)" />
          </svg>
        </button>
      </div>
    </div>
  )
}
