import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { brandAssets } from '@/lib/brand'
import { siteConfig } from '@/lib/seo'

const navLinks = [
  { label: 'Réalisations', to: '/projets' },
  { label: 'Studio', to: '/a-propos' },
  { label: 'Journal', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

const legalLinks = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'Confidentialité', to: '/politique-de-confidentialite' },
  { label: 'Cookies', to: '/politique-cookies' },
]

export function Footer() {
  return (
    <footer className="snap-section relative overflow-hidden bg-black text-white">
      {/* monogramme géant en filigrane */}
      <img
        src={brandAssets.monogramWhite}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 h-[34rem] w-auto opacity-[0.04] sm:-right-16 sm:h-[40rem]"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 pt-20 pb-10 sm:px-10 sm:pt-28 lg:px-16">
        {/* Bloc haut : grand titre + CTA */}
        <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:pb-20">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">
              Studio M · Paris
            </p>
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-tight">
              Un projet en tête ?
              <br />
              <span className="italic text-white/70">Échangeons.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-5">
            <a
              href={`mailto:${siteConfig.email}`}
              className="group inline-flex items-center justify-between border-b border-white/30 pb-3 text-[15px] transition-colors hover:border-white sm:text-base"
            >
              <span>{siteConfig.email}</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="group inline-flex items-center justify-between border-b border-white/30 pb-3 text-[15px] transition-colors hover:border-white sm:text-base"
            >
              <span>{siteConfig.phone}</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Bloc bas : colonnes */}
        <div className="grid gap-12 pt-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-16 lg:pt-20">
          <div>
            <img
              src={brandAssets.wordmarkBeige}
              alt="Studio M"
              className="h-28 w-auto sm:h-32 lg:h-40"
            />
            <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-white/55">
              Architecture d'intérieur à Paris. Rénovation d'appartements et de
              maisons sur mesure, du concept au chantier.
            </p>
          </div>

          <Column title="Navigation">
            {navLinks.map((l) => (
              <FooterLink key={l.to} href={l.to}>
                {l.label}
              </FooterLink>
            ))}
          </Column>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.28em] text-white/40">Studio</h3>
            <p className="mt-5 text-sm leading-relaxed text-white/65">
              {siteConfig.address.street}
              <br />
              {siteConfig.address.postalCode} {siteConfig.address.city}
            </p>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/65 hover:text-white"
            >
              Instagram <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          <Column title="Légal">
            {legalLinks.map((l) => (
              <FooterLink key={l.to} href={l.to}>
                {l.label}
              </FooterLink>
            ))}
          </Column>
        </div>

        {/* Bas de page */}
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.22em] text-white/35 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Studio M · Tous droits réservés</p>
          <p className="italic tracking-normal normal-case">Paris, depuis 2016</p>
        </div>
      </div>
    </footer>
  )
}

function Column({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-[10px] uppercase tracking-[0.28em] text-white/40">{title}</h3>
      <ul className="mt-5 space-y-3">
        {Array.isArray(children) ? children : <li>{children}</li>}
      </ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-white/65 transition-colors hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}
