'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'studio-m-liked'

function readLikedKeys(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

/**
 * Likes des photos. Le compteur est global (stocké côté serveur), l'état
 * « j'ai liké » est mémorisé localement (localStorage) pour permettre le toggle.
 */
export function useLikes() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [liked, setLiked] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    setLiked(new Set(readLikedKeys()))
    fetch('/api/likes')
      .then((r) => r.json())
      .then((data: Record<string, number>) => {
        if (data && typeof data === 'object') setCounts(data)
      })
      .catch(() => {})
  }, [])

  const toggle = useCallback((key: string) => {
    setLiked((prev) => {
      const willLike = !prev.has(key)
      const nextSet = new Set(prev)
      if (willLike) nextSet.add(key)
      else nextSet.delete(key)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...nextSet]))
      } catch {}

      // maj optimiste du compteur
      setCounts((c) => ({ ...c, [key]: Math.max(0, (c[key] ?? 0) + (willLike ? 1 : -1)) }))

      fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, delta: willLike ? 1 : -1 }),
      })
        .then((r) => r.json())
        .then((data: { key: string; count: number }) => {
          if (data && typeof data.count === 'number') {
            setCounts((c) => ({ ...c, [data.key]: data.count }))
          }
        })
        .catch(() => {})

      return nextSet
    })
  }, [])

  const count = useCallback((key: string) => counts[key] ?? 0, [counts])
  const isLiked = useCallback((key: string) => liked.has(key), [liked])

  return { count, isLiked, toggle }
}
