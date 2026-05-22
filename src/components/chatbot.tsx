'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Bulle flottante en bas à droite : raccourci direct vers /contact.
 * (Plus de chatbot — un simple lien discret.)
 */
export function Chatbot() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 900)
    return () => clearTimeout(t)
  }, [])

  // Masque la bulle si on est déjà sur la page contact
  if (pathname === '/contact') return null

  return (
    <AnimatePresence>
      {mounted ? (
        <motion.a
          key="contact-bubble"
          href="/contact"
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.5, ease }}
          aria-label="Aller au contact"
          className="fixed right-4 bottom-4 z-40 inline-flex size-12 items-center justify-center rounded-full bg-[oklch(0.22_0.015_60)]/95 text-[var(--brand-cream)] shadow-[0_6px_18px_rgba(30,22,10,0.18)] backdrop-blur-sm transition-transform hover:scale-[1.05] sm:right-6 sm:bottom-6 sm:size-14"
        >
          <MessageSquare className="size-[18px]" />
        </motion.a>
      ) : null}
    </AnimatePresence>
  )
}
