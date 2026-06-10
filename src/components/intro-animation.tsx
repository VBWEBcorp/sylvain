'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { brandAssets } from '@/lib/brand'

// Courbe « in-out » très douce pour le voyage des logos, courbe « cinéma » pour le rideau.
const ease = [0.65, 0, 0.35, 1] as const
const curtainEase = [0.83, 0, 0.17, 1] as const

const ENTER_DUR = 1.5 // s — voyage des logos jusqu'au centre (plus long = plus smooth)
const RISE_START = 1.7 // s — le rideau se lève dès qu'ils se rejoignent
const RISE_DUR = 1 // s — durée de la montée du rideau

export function IntroAnimation() {
  const [stage, setStage] = useState<'enter' | 'rise' | 'gone'>('enter')

  useEffect(() => {
    // Respecte les utilisateurs qui réduisent les animations : pas d'intro.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setStage('gone')
      return
    }

    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t1 = setTimeout(() => setStage('rise'), RISE_START * 1000)
    const t2 = setTimeout(() => {
      setStage('gone')
      document.body.style.overflow = original
    }, (RISE_START + RISE_DUR) * 1000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.style.overflow = original
    }
  }, [])

  if (stage === 'gone') return null

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: stage === 'rise' ? '-100%' : 0 }}
      transition={{ duration: RISE_DUR, ease: curtainEase }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-0 overflow-hidden bg-[#0e0d0b] will-change-transform"
    >
      {/* Monogramme S — descend du haut vers le centre */}
      <motion.img
        src={brandAssets.monogramWhite}
        alt="Studio M"
        draggable={false}
        initial={{ opacity: 0, y: '-55vh' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ENTER_DUR, ease }}
        className="h-40 w-40 object-contain sm:h-52 sm:w-52 lg:h-64 lg:w-64"
      />
      {/* « studio m » — monte du bas vers le centre, rejoint le monogramme */}
      <motion.img
        src={brandAssets.wordmarkWhite}
        alt=""
        aria-hidden
        draggable={false}
        initial={{ opacity: 0, y: '55vh' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ENTER_DUR, ease }}
        className="-mt-6 h-40 w-auto object-contain sm:-mt-10 sm:h-52 lg:-mt-14 lg:h-60"
      />
    </motion.div>
  )
}
