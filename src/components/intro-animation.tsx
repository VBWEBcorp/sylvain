'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { brandAssets } from '@/lib/brand'

const TOTAL = 2.8 // durée totale de l'intro en secondes
const FADE_OUT = 0.6

export function IntroAnimation() {
  const [stage, setStage] = useState<'in' | 'out' | 'gone'>('in')

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t1 = setTimeout(() => setStage('out'), (TOTAL - FADE_OUT) * 1000)
    const t2 = setTimeout(() => {
      setStage('gone')
      document.body.style.overflow = original
    }, TOTAL * 1000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.style.overflow = original
    }
  }, [])

  if (stage === 'gone') return null

  return (
    <motion.div
      animate={{ opacity: stage === 'out' ? 0 : 1 }}
      transition={{ duration: FADE_OUT, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0e0d0b]"
    >
      <motion.div
        initial={{ scale: 0.65, opacity: 0 }}
        animate={{
          scale: [0.65, 1, 1.04, 1.1, 1.25],
          opacity: [0, 1, 1, 1, 1],
        }}
        transition={{
          duration: TOTAL,
          times: [0, 0.25, 0.55, 0.8, 1],
          ease: 'easeInOut',
        }}
        className="relative h-36 w-36 sm:h-48 sm:w-48 lg:h-56 lg:w-56"
      >
        {/* S blanc : présent au début et à la fin, s'efface au milieu */}
        <motion.img
          src={brandAssets.monogramWhite}
          alt="Studio M"
          draggable={false}
          animate={{ opacity: [0, 1, 1, 0, 1, 1] }}
          transition={{
            duration: TOTAL,
            times: [0, 0.18, 0.32, 0.55, 0.78, 1],
            ease: 'easeInOut',
          }}
          className="absolute inset-0 h-full w-full object-contain"
        />
        {/* S beige : monte progressivement au milieu, redescend */}
        <motion.img
          src={brandAssets.monogramBeige}
          alt=""
          aria-hidden
          draggable={false}
          animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
          transition={{
            duration: TOTAL,
            times: [0, 0.32, 0.45, 0.6, 0.78, 1],
            ease: 'easeInOut',
          }}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </motion.div>
    </motion.div>
  )
}
