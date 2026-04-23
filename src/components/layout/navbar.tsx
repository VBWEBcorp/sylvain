'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/layout/logo'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/projets', label: 'Projets' },
  { to: '/services', label: 'Services' },
  { to: '/a-propos', label: 'Studio' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border/50 bg-[var(--brand-cream)]/90 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-6 px-6 sm:px-10 lg:px-16">
        <Logo />

        <nav
          className="hidden items-center gap-10 md:flex"
          aria-label="Navigation principale"
        >
          {links.map((l) => {
            const active = pathname === l.to || (l.to !== '/' && pathname?.startsWith(l.to))
            return (
              <Link
                key={l.to}
                href={l.to}
                className={cn(
                  'relative text-[13px] tracking-[0.14em] uppercase transition-colors',
                  active
                    ? 'text-foreground'
                    : 'text-foreground/60 hover:text-foreground'
                )}
              >
                {l.label}
                {active ? (
                  <span className="absolute -bottom-1.5 left-1/2 h-px w-4 -translate-x-1/2 bg-foreground/60" />
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/contact"
            className="text-[13px] tracking-[0.14em] uppercase text-foreground underline-offset-4 hover:underline"
          >
            Prendre rendez-vous
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border/60 text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-border/50 bg-[var(--brand-cream)] md:hidden"
          >
            <div className="mx-auto flex flex-col gap-1 px-6 py-6">
              {links.map((l) => {
                const active =
                  pathname === l.to || (l.to !== '/' && pathname?.startsWith(l.to))
                return (
                  <Link
                    key={l.to}
                    href={l.to}
                    className={cn(
                      'py-3 font-display text-2xl font-light tracking-tight transition-colors',
                      active ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'
                    )}
                  >
                    {l.label}
                  </Link>
                )
              })}
              <Link
                href="/contact"
                className="mt-4 inline-flex w-fit items-center border-b border-foreground/40 pb-0.5 text-[13px] uppercase tracking-[0.14em]"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
