'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { brandAssets } from '@/lib/brand'

const TOTAL = 3 // durée totale de l'intro en secondes
const FADE_OUT = 0.6
const ease = [0.22, 1, 0.36, 1] as const

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
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{
          // grandit, se stabilise, donne un coup d'échelle pile sur la bascule
          // beige→blanc, puis avance vers le regard avant le fondu de sortie
          scale: [0.7, 1, 1, 1.14, 1.06, 1.34],
          opacity: [0, 1, 1, 1, 1, 1],
        }}
        transition={{
          duration: TOTAL,
          times: [0, 0.2, 0.45, 0.52, 0.62, 1],
          ease,
        }}
        className="relative h-56 w-56 sm:h-80 sm:w-80 lg:h-[28rem] lg:w-[28rem]"
      >
        {/* S beige : entre en premier, présence affirmée */}
        <motion.img
          src={brandAssets.monogramBeige}
          alt=""
          aria-hidden
          draggable={false}
          animate={{ opacity: [0, 1, 1, 0, 0] }}
          transition={{
            duration: TOTAL,
            times: [0, 0.18, 0.45, 0.52, 1],
            ease: 'easeInOut',
          }}
          className="absolute inset-0 h-full w-full object-contain"
        />
        {/* S blanc : bascule nette depuis le beige, tient jusqu'à la fin */}
        <motion.img
          src={brandAssets.monogramWhite}
          alt="Studio M"
          draggable={false}
          animate={{ opacity: [0, 0, 1, 1] }}
          transition={{
            duration: TOTAL,
            times: [0, 0.46, 0.52, 1],
            ease: 'easeInOut',
          }}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </motion.div>
    </motion.div>
  )
}
