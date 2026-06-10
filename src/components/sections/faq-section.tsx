'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { type Faq, homeFaqs } from '@/components/sections/faq-data'

const ease = [0.22, 1, 0.36, 1] as const

export function FaqSection({ faqs = homeFaqs }: { faqs?: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-white pb-24 pt-20 sm:pb-32 sm:pt-28">
      <div className="mx-auto max-w-[860px] px-6 sm:px-8">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-foreground/55">
            Studio M · Questions fréquentes
          </p>
        </div>

        <ul className="mt-14 border-t border-foreground/10">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <li key={i} className="border-b border-foreground/10">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-light leading-snug tracking-tight text-foreground sm:text-xl">
                    {faq.question}
                  </span>
                  <Plus
                    className={`size-5 shrink-0 text-foreground/50 transition-transform duration-300 group-hover:text-foreground ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-foreground/70">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>

        <div className="mt-14 flex justify-center">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 border-b border-foreground/60 pb-1 text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground"
          >
            Une autre question ? Écrivez-moi
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
