'use client'

import { useLayoutEffect } from 'react'

/**
 * Active le scroll-snap "mandatory" sur la home : tout scroll vers le bas
 * fait basculer instantanément du hero vers le footer. À l'arrivée sur la
 * home, on s'assure d'être tout en haut avant d'activer le snap.
 */
export function HomeSnap() {
  useLayoutEffect(() => {
    const html = document.documentElement
    window.scrollTo(0, 0)
    html.classList.add('snap-home')
    return () => {
      html.classList.remove('snap-home')
    }
  }, [])
  return null
}
