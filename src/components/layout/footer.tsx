import Link from 'next/link'

import { brandAssets } from '@/lib/brand'
import { siteConfig } from '@/lib/seo'

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Projets', to: '/projets' },
  { label: 'Services', to: '/services' },
  { label: 'Studio', to: '/a-propos' },
  { label: 'Contact', to: '/contact' },
]

const legalLinks = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'Confidentialité', to: '/politique-de-confidentialite' },
  { label: 'Cookies', to: '/politique-cookies' },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[oklch(0.22_0.015_60)] text-[oklch(0.92_0.018_80)]">
      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 lg:px-16">
        <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <img src={brandAssets.wordmarkWhite} alt="Studio M" className="h-12 w-auto" />
            <p className="max-w-sm font-display text-2xl leading-[1.15] text-white/90">
              Architecture d'intérieur, du concept au chantier.
            </p>
            <p className="max-w-sm text-[13px] leading-relaxed text-white/55">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.22em] text-white/40">Navigation</h3>
            <ul className="mt-6 space-y-3">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link href={l.to} className="text-sm text-white/75 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.22em] text-white/40">Contact</h3>
            <ul className="mt-6 space-y-3 text-sm text-white/75">
              <li>
                <a href={`tel:${siteConfig.phone}`} className="hover:text-white">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
              <li className="pt-2 text-white/55">
                {siteConfig.address.street}
                <br />
                {siteConfig.address.postalCode} {siteConfig.address.city}
              </li>
              <li>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  Instagram ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.22em] text-white/40">Légal</h3>
            <ul className="mt-6 space-y-3">
              {legalLinks.map((l) => (
                <li key={l.to}>
                  <Link href={l.to} className="text-sm text-white/75 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
          </p>
          <p className="italic">Paris, depuis 2016</p>
        </div>
      </div>
    </footer>
  )
}
