'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { brandAssets } from '@/lib/brand'

// Courbe douce pour les fondus, courbe « cinéma » pour la montée du rideau.
const ease = [0.22, 1, 0.36, 1] as const
const curtainEase = [0.83, 0, 0.17, 1] as const

const LOGO_IN = 0.9 // s — fondu d'apparition du monogramme
const WORDMARK_DELAY = 0.6 // s — décalage de « studio m » (~0,5 s après le logo)
const RISE_START = 2.4 // s — moment où le rideau commence à se lever
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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 overflow-hidden bg-[#0e0d0b] will-change-transform sm:gap-6"
    >
      {/* Monogramme S — apparition en fondu */}
      <motion.img
        src={brandAssets.monogramWhite}
        alt="Studio M"
        draggable={false}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: LOGO_IN, ease }}
        className="h-40 w-40 object-contain sm:h-52 sm:w-52 lg:h-64 lg:w-64"
      />
      {/* « studio m » — fondu décalé d'environ 0,5 s après le logo */}
      <motion.img
        src={brandAssets.wordmarkWhite}
        alt=""
        aria-hidden
        draggable={false}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: LOGO_IN, delay: WORDMARK_DELAY, ease }}
        className="h-20 w-auto object-contain sm:h-28 lg:h-32"
      />
    </motion.div>
  )
}
