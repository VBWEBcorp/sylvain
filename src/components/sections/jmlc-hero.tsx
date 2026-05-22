'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { brandAssets } from '@/lib/brand'

const ease = [0.22, 1, 0.36, 1] as const

const heroImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85'

export function JmlcHero() {
  return (
    <section className="snap-section relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      <motion.img
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease }}
        src={heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Voiles d'obscurité pour bien faire ressortir logo + nav */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/60" />

      <div className="relative flex h-full flex-col items-center justify-center px-6">
        <motion.img
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6, ease }}
          src={brandAssets.wordmarkWhite}
          alt="Studio M"
          className="h-60 w-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:h-80 lg:h-[26rem]"
          draggable={false}
        />

        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2, ease }}
          aria-label="Navigation principale"
          className="mt-12 flex items-center gap-7 sm:gap-12"
        >
          <Link
            href="/projets"
            className="text-[13px] uppercase tracking-[0.3em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] transition-opacity hover:opacity-80 sm:text-[15px]"
          >
            Réalisations
          </Link>
          <span aria-hidden className="h-4 w-px bg-white/55" />
          <Link
            href="/a-propos"
            className="text-[13px] uppercase tracking-[0.3em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] transition-opacity hover:opacity-80 sm:text-[15px]"
          >
            Studio
          </Link>
          <span aria-hidden className="h-4 w-px bg-white/55" />
          <Link
            href="/contact"
            className="text-[13px] uppercase tracking-[0.3em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] transition-opacity hover:opacity-80 sm:text-[15px]"
          >
            Contact
          </Link>
        </motion.nav>
      </div>
    </section>
  )
}
