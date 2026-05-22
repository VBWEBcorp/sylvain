'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { brandAssets } from '@/lib/brand'

const ease = [0.22, 1, 0.36, 1] as const

export function AboutContent() {
  return (
    <section className="bg-[var(--brand-cream)] pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-14 px-6 sm:px-10 lg:grid-cols-12 lg:gap-20 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="lg:col-span-7"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
            Le studio
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1] tracking-tight text-foreground">
            <span className="italic">Sylvain</span>, architecte
            <br />
            d'intérieur à Paris.
          </h1>

          <div className="mt-10 max-w-xl space-y-5 text-[15px] leading-relaxed text-foreground/75">
            <p>
              J'aime faire danser les murs, animer le regard, dessiner des
              ronds comme l'eau vive d'un ruisseau. Je crois à la douceur, à
              la beauté des choses, au dialogue sincère.
            </p>
            <p>
              Chaque nouveau projet est une exploration : rendre vraies,
              fonctionnelles et durables les aires de vie du quotidien.
            </p>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <img
              src={brandAssets.monogramDark}
              alt=""
              aria-hidden
              className="h-10 w-auto sm:h-12"
            />
            <span className="font-display text-lg italic text-foreground/85 sm:text-xl">
              Sylvain Marceau, fondateur de Studio M
            </span>
          </div>

          <div className="mt-12">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 border-b border-foreground/60 pb-1 text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground"
            >
              Échanger
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease }}
          className="relative lg:col-span-5"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src="https://i.ibb.co/kg1p7h2k/Sylvain.jpg"
              alt="Sylvain, fondateur de Studio M"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
