'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/layout/logo'
import { siteConfig } from '@/lib/seo'
import { cn } from '@/lib/utils'

const links = [
  { to: '/projets', label: 'Réalisations' },
  { to: '/a-propos', label: 'Studio' },
  { to: '/blog', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

const ease = [0.22, 1, 0.36, 1] as const

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Block body scroll when menu open
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // Sur la home, le hero porte déjà l'identité. On masque la navbar
  // tant qu'on est dans le hero, elle apparaît au scroll.
  const hidden = isHome && !scrolled && !open

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 z-50 w-full transition-all duration-500',
          hidden && 'pointer-events-none -translate-y-full opacity-0',
          !hidden && (scrolled || open)
            ? 'bg-[var(--brand-cream)]/90 backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-6 px-6 sm:px-10 lg:px-16">
          <Logo />

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-foreground/25 text-foreground transition-colors hover:bg-foreground/5"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {/* Overlay menu plein écran — même comportement desktop / mobile */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-40 flex flex-col bg-[var(--brand-cream)] pt-20"
          >
            <nav
              aria-label="Navigation principale"
              className="flex flex-1 flex-col items-start justify-center gap-2 px-6 sm:px-12 lg:px-20"
            >
              {links.map((l, i) => {
                const active =
                  pathname === l.to || (l.to !== '/' && pathname?.startsWith(l.to))
                return (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease }}
                  >
                    <Link
                      href={l.to}
                      className={cn(
                        'block font-display font-light leading-none tracking-tight transition-colors',
                        'text-[clamp(3rem,9vw,7rem)]',
                        active
                          ? 'text-foreground'
                          : 'text-foreground/30 hover:text-foreground'
                      )}
                    >
                      {active ? <span className="italic">{l.label}</span> : l.label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              className="border-t border-foreground/10 px-6 py-6 sm:px-12 lg:px-20"
            >
              <div className="flex flex-col items-start justify-between gap-3 text-[11px] uppercase tracking-[0.28em] text-foreground/55 sm:flex-row sm:items-center">
                <p>{siteConfig.address.street}, {siteConfig.address.city}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="hover:text-foreground"
                  >
                    {siteConfig.email}
                  </a>
                  <span aria-hidden className="hidden h-3 w-px bg-foreground/25 sm:block" />
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="hover:text-foreground"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
