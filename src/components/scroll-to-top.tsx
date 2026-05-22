'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'

/**
 * Force le scroll à 0 à chaque changement de route, AVANT le paint, et
 * désactive temporairement le scroll-snap pour qu'aucun snap point ne
 * ramène la page sur le footer.
 */
export function ScrollToTop() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const html = document.documentElement
    const body = document.body
    const prevBehavior = html.style.scrollBehavior
    const prevSnapType = html.style.scrollSnapType

    const scrollUp = () => {
      html.scrollTop = 0
      body.scrollTop = 0
      window.scrollTo(0, 0)
    }

    // Coupe smooth + snap pour un reset propre
    html.style.scrollBehavior = 'auto'
    html.style.scrollSnapType = 'none'
    scrollUp()

    // Plusieurs frames pour couvrir les éventuels layout shifts
    const raf1 = requestAnimationFrame(() => {
      scrollUp()
      const raf2 = requestAnimationFrame(() => {
        scrollUp()
        html.style.scrollBehavior = prevBehavior
        html.style.scrollSnapType = prevSnapType
      })
      return () => cancelAnimationFrame(raf2)
    })

    // Filet de sécurité après 80 ms (laisse le temps au DOM de se poser)
    const t = setTimeout(() => {
      scrollUp()
    }, 80)

    return () => {
      cancelAnimationFrame(raf1)
      clearTimeout(t)
      html.style.scrollBehavior = prevBehavior
      html.style.scrollSnapType = prevSnapType
    }
  }, [pathname])

  return null
}
