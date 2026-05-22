'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { brandAssets } from '@/lib/brand'

const ease = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  return (
    <>
      {/* ============ MOBILE (< lg) : cover plein écran, épuré ============ */}
      <section className="relative isolate block h-[100svh] min-h-[640px] overflow-hidden lg:hidden">
        <motion.img
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease }}
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />

        <div className="relative flex h-full flex-col px-6 pt-24 pb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="text-[10px] uppercase tracking-[0.32em] text-white/80"
          >
            Architecte d'intérieur · Paris
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="mt-auto font-display text-[clamp(2.75rem,13vw,4.5rem)] font-light leading-[0.96] tracking-[-0.02em] text-white"
          >
            Dessiner
            <br />
            <span className="italic">des intérieurs</span>
            <br />
            qui vous
            <br />
            ressemblent.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            className="mt-10 flex items-center gap-6"
          >
            <Link
              href="/projets"
              className="inline-flex items-center gap-2 border-b border-white pb-1 text-[12px] uppercase tracking-[0.2em] text-white"
            >
              Voir les réalisations
              <span>→</span>
            </Link>
            <Link
              href="/contact"
              className="text-[12px] uppercase tracking-[0.2em] text-white/70"
            >
              Contact
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-white/50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
              Studio M · depuis 2016
            </span>
          </motion.div>
        </div>
      </section>

      {/* ============ DESKTOP (lg+) : éditorial deux colonnes ============ */}
      <section className="relative isolate hidden overflow-hidden bg-[var(--brand-cream)] lg:block">
        <div className="mx-auto grid min-h-[92vh] max-w-[1400px] grid-cols-12 items-center gap-16 px-16 pt-12 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="col-span-6"
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-foreground/55">
              Architecte d'intérieur · Paris
            </p>
            <h1 className="mt-8 font-display text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.98] tracking-[-0.02em] text-foreground">
              Dessiner
              <br />
              <span className="italic text-foreground/85">des intérieurs</span>
              <br />
              qui vous ressemblent.
            </h1>
            <p className="mt-10 max-w-md text-[15px] leading-relaxed text-foreground/70">
              Studio M accompagne particuliers et commerçants dans la rénovation
              sur mesure de leurs appartements et boutiques à Paris. Du premier
              croquis à la livraison du chantier.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-8">
              <Link
                href="/projets"
                className="group inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.18em] text-foreground"
              >
                <span className="border-b border-foreground/60 pb-1 transition-colors group-hover:border-foreground">
                  Voir les réalisations
                </span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/contact"
                className="text-[13px] uppercase tracking-[0.18em] text-foreground/60 hover:text-foreground"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease }}
            className="relative col-span-6"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
                alt="Intérieur signature Studio M"
                className="h-full w-full object-cover"
              />
            </div>
            <img
              src={brandAssets.monogramBeige}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -top-8 -right-10 h-40 w-auto opacity-80 mix-blend-multiply"
            />
            <div className="absolute -bottom-6 -left-6 max-w-[240px] border border-border/60 bg-[var(--brand-cream)] p-5">
              <p className="font-display text-lg italic text-foreground/80">
                « Un lieu juste, jamais démonstratif. »
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-foreground/50">
                Sylvain, fondateur
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
