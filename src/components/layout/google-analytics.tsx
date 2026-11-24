'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'

/*
 * Google Analytics 4, soumis au consentement.
 *
 * - L'identifiant vient de NEXT_PUBLIC_GA_ID. Absent ou mal formé : rien ne se charge.
 * - Rien ne part vers Google tant que le visiteur n'a pas cliqué « Accepter » dans
 *   le bandeau cookies (localStorage « cookie-consent » = « accepted »).
 * - Le bandeau prévient par l'événement « cookie-consent-change » : la mesure
 *   démarre au clic, sans rechargement.
 * - Première page : c'est gtag('config') qui envoie la page vue. Pages suivantes
 *   (navigation Next sans rechargement) : une page vue envoyée ici, à chaque
 *   changement d'adresse. La première n'est donc jamais comptée deux fois.
 *
 * Réglage à tenir côté Google Analytics : dans le flux de données, « Mesures
 * améliorées », « Pages vues », décocher « Modifications de page en fonction des
 * événements de l'historique du navigateur ». Sinon Google compte lui aussi les
 * changements de page et chaque navigation est comptée deux fois.
 */

const GA_ID = (process.env.NEXT_PUBLIC_GA_ID ?? '').trim()
const GA_ID_VALIDE = /^G-[A-Z0-9]+$/i.test(GA_ID)

const CLE_CONSENTEMENT = 'cookie-consent'
const EVENEMENT_CONSENTEMENT = 'cookie-consent-change'

type FenetreGtag = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
} & Record<string, unknown>

function consentementDonne() {
  try {
    return window.localStorage.getItem(CLE_CONSENTEMENT) === 'accepted'
  } catch {
    return false
  }
}

let gtagCharge = false

function chargerGtag() {
  const w = window as unknown as FenetreGtag
  gtagCharge = true
  w.dataLayer = w.dataLayer || []
  // gtag attend l'objet « arguments » tel quel, pas un tableau.
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments)
  }
  w.gtag('js', new Date())
  w.gtag('config', GA_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.body.appendChild(script)
}

function SuiviDesPages() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [accepte, setAccepte] = useState(false)
  const dernierePage = useRef<string | null>(null)

  useEffect(() => {
    const lire = () => setAccepte(consentementDonne())
    lire()
    window.addEventListener(EVENEMENT_CONSENTEMENT, lire)
    window.addEventListener('storage', lire)
    return () => {
      window.removeEventListener(EVENEMENT_CONSENTEMENT, lire)
      window.removeEventListener('storage', lire)
    }
  }, [])

  useEffect(() => {
    const w = window as unknown as FenetreGtag
    if (!accepte) {
      // Refus après un accord (autre onglet, par exemple) : gtag se tait.
      if (gtagCharge) w[`ga-disable-${GA_ID}`] = true
      return
    }
    if (!pathname || pathname.startsWith('/admin')) return

    const requete = searchParams?.toString()
    const page = requete ? `${pathname}?${requete}` : pathname

    w[`ga-disable-${GA_ID}`] = false
    if (!gtagCharge) {
      // Premier chargement : gtag('config') compte lui-même la page en cours.
      chargerGtag()
      dernierePage.current = page
      return
    }
    if (dernierePage.current === page) return
    dernierePage.current = page
    w.gtag?.('event', 'page_view', {
      page_path: page,
      page_location: window.location.href,
    })
  }, [accepte, pathname, searchParams])

  return null
}

export function GoogleAnalytics() {
  if (!GA_ID_VALIDE) return null
  return (
    <Suspense fallback={null}>
      <SuiviDesPages />
    </Suspense>
  )
}
