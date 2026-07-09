'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Chatbot ShopinZen (acheté par le client) — affiché UNIQUEMENT sur la page
 * Réalisations (/projets).
 *
 * Le site n'étant pas sous WordPress, on reproduit ce que fait leur plugin
 * « ShopinZen Integrator » : un élément `[data-shopinzen-bot]` portant la clé
 * publique dans `data-pkey`, puis le script `chatbot-integrator.js` qui charge
 * le loader. Le loader scanne ce sélecteur UNE fois puis monte la bulle +
 * l'iframe directement dans le <body> (donc HORS de React : ces éléments
 * persistent lors de la navigation SPA).
 *
 * Conséquence : on ne peut pas juste « démonter » le composant pour cacher le
 * chatbot ailleurs. On procède donc en deux temps :
 *   1. injection paresseuse : on ne charge ShopinZen qu'une fois arrivé sur
 *      /projets ;
 *   2. visibilité : un <style> masque le widget (frame, bulle, messages
 *      d'accueil) dès que `body[data-shopinzen-hidden]` est posé, ce qui est
 *      le cas sur toutes les pages ≠ /projets. Le `!important` prime sur les
 *      styles inline que le loader remet lui-même à chaque navigation.
 *
 * La clé est PUBLIQUE (destinée au navigateur), la garder ici est sans risque.
 */
const SHOPINZEN_PUBLIC_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJUOGpqT2NZR213IiwiaWF0IjoxNzgyNDc3MDExfQ.4yuk4-z03aCvVo_peBa8RAH5GcbqwZkbR4ORiBsABNg'
const SHOPINZEN_SCRIPT_URL =
  'https://console.shopinzen.com/freemium/chatbot-integrator.js'

// Page (et elle seule) où le chatbot doit apparaître.
const CHATBOT_PATH = '/projets'
const VISIBILITY_STYLE_ID = 'shopinzen-visibility'

export function Chatbot() {
  const pathname = usePathname()

  useEffect(() => {
    const onTargetPage = pathname === CHATBOT_PATH

    // 1. Règle de visibilité injectée une seule fois. Les IDs ShopinZen sont
    //    suffixés par la clé (ex. « chatbot-frame_eyJ… ») → sélecteurs préfixe.
    if (!document.getElementById(VISIBILITY_STYLE_ID)) {
      const style = document.createElement('style')
      style.id = VISIBILITY_STYLE_ID
      style.textContent = `
        body[data-shopinzen-hidden] [id^="chatbot-frame"],
        body[data-shopinzen-hidden] [id^="chatbot-toggle"],
        body[data-shopinzen-hidden] [id^="chatbot-welcome-messages"] {
          display: none !important;
        }
      `
      document.head.appendChild(style)
    }

    // 2. Masque le widget partout sauf sur /projets.
    document.body.toggleAttribute('data-shopinzen-hidden', !onTargetPage)

    // 3. Injection paresseuse : le loader ShopinZen n'est chargé qu'une fois
    //    l'utilisateur arrivé sur /projets (puis le widget persiste, masqué
    //    ailleurs par la règle ci-dessus).
    if (onTargetPage && !document.querySelector('[data-shopinzen-bot]')) {
      const mount = document.createElement('div')
      mount.setAttribute('data-shopinzen-bot', '')
      mount.setAttribute('data-pkey', SHOPINZEN_PUBLIC_KEY)
      mount.style.display = 'none'
      document.body.appendChild(mount)

      const script = document.createElement('script')
      script.src = SHOPINZEN_SCRIPT_URL
      script.defer = true
      script.setAttribute('data-shopinzen-integrator', '1')
      document.body.appendChild(script)
    }
  }, [pathname])

  return null
}
