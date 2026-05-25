'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import type { SiteContent } from '@/lib/content-store'

const ease = [0.22, 1, 0.36, 1] as const

export function AboutContent({ studio }: { studio: SiteContent['studio'] }) {
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
            {studio.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1] tracking-tight text-foreground">
            {studio.title}
          </h1>

          {studio.quote ? (
            <p className="mt-8 max-w-xl font-display text-xl font-light italic leading-snug text-foreground/85 sm:text-2xl">
              « {studio.quote} »
            </p>
          ) : null}

          <div className="mt-10 max-w-xl space-y-5 text-[15px] leading-relaxed text-foreground/75">
            {studio.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 border-b border-foreground/60 pb-1 text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground"
            >
              Un projet, parlons-en
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
              src={studio.portrait}
              alt={studio.title}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
