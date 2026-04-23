import Link from 'next/link'

import { brandAssets } from '@/lib/brand'

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.22_0.015_60)] py-32 text-white sm:py-40">
      <img
        src={brandAssets.monogramWhite}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-20 -bottom-20 h-[32rem] w-auto opacity-[0.06]"
      />
      <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
          Un projet en tête ?
        </p>
        <h2 className="mt-8 font-display text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tight">
          Parlons-en autour
          <br />
          <span className="italic">d'un café.</span>
        </h2>
        <p className="mt-10 max-w-lg text-[15px] leading-relaxed text-white/70">
          Premier rendez-vous offert, chez vous ou au studio, pour comprendre
          votre projet et estimer ensemble sa faisabilité.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-8">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.2em]"
          >
            <span className="border-b border-white/60 pb-1 transition-colors group-hover:border-white">
              Démarrer la conversation
            </span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <a
            href="mailto:sylvain@studio-m.paris"
            className="text-[13px] uppercase tracking-[0.2em] text-white/60 hover:text-white"
          >
            sylvain@studio-m.paris
          </a>
        </div>
      </div>
    </section>
  )
}
