'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { brandAssets } from '@/lib/brand'

const ease = [0.22, 1, 0.36, 1] as const

const values = [
  {
    title: 'Écoute',
    body: "Chaque projet commence par un silence : celui d'écouter vraiment ce que vous vivez, recevez, ressentez chez vous.",
  },
  {
    title: 'Justesse',
    body: "Plutôt que de multiplier les effets, je cherche le geste juste. Une matière, une proportion, une couleur.",
  },
  {
    title: 'Artisanat',
    body: "Je travaille avec un cercle restreint d'artisans français : menuisiers, tapissiers, peintres, ferronniers.",
  },
  {
    title: 'Tenue',
    body: "Du premier croquis à la dernière vis, un seul interlocuteur. Budget maîtrisé, planning tenu, promesses respectées.",
  },
]

export function AboutContent() {
  return (
    <>
      <section className="bg-[var(--brand-cream)] pt-40 pb-20 sm:pt-48 sm:pb-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 sm:px-10 lg:grid-cols-12 lg:gap-20 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="lg:col-span-7"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
              Le studio
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.98] tracking-tight text-foreground">
              <span className="italic">Sylvain</span>,<br />
              architecte d'intérieur<br />à Paris.
            </h1>
            <div className="mt-10 max-w-xl space-y-5 text-[15px] leading-relaxed text-foreground/75">
              <p>
                J'aime faire danser les murs, animer le regard, interroger
                l'humeur, dessiner des ronds comme l'eau vive d'un ruisseau.
                Je crois à la douceur, à la beauté des choses, au dialogue
                sincère où l'authenticité fragile et réelle s'exprime.
              </p>
              <p>
                Dans ces conversations discrètes avec les lieux, toujours
                cette même volonté m'anime, une promesse, à chaque fois,
                l'ambition de porter au mieux les choses, d'apprendre, de
                désapprendre et de rendre vraies, fonctionnelles et
                habitables, durables et esthétiques, les aires de vie du
                quotidien. Chaque nouveau projet est une exploration.
              </p>
              <p className="flex items-center gap-3 pt-2">
                <img
                  src={brandAssets.monogramBeige}
                  alt=""
                  aria-hidden
                  className="h-6 w-auto opacity-90 mix-blend-multiply"
                />
                <span className="font-display text-lg italic text-foreground">
                  Je suis Sylvain Marceau, architecte d'intérieur et
                  fondateur de Studio M.
                </span>
              </p>
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
            <img
              src={brandAssets.monogramBeige}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -left-4 h-28 w-auto opacity-90 mix-blend-multiply sm:h-36"
            />
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-[oklch(0.93_0.03_82)] py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-10 px-6 sm:grid-cols-4 sm:px-10 lg:px-16">
          {[
            { k: '8', v: 'années de studio' },
            { k: '60+', v: 'projets livrés' },
            { k: '12', v: 'artisans partenaires' },
            { k: '100%', v: 'du concept au chantier' },
          ].map((s) => (
            <div key={s.v}>
              <p className="font-display text-5xl font-light leading-none text-foreground sm:text-6xl">
                {s.k}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-foreground/55">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--brand-cream)] py-28 sm:py-36">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-24">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
                Ce qui me tient
              </p>
              <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight">
                Quatre <span className="italic">convictions</span>.
              </h2>
            </div>
            <dl className="grid gap-10 sm:grid-cols-2">
              {values.map((v) => (
                <div key={v.title}>
                  <dt className="font-display text-2xl font-light italic text-foreground">
                    {v.title}
                  </dt>
                  <dd className="mt-3 text-[15px] leading-relaxed text-foreground/70">
                    {v.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[oklch(0.22_0.015_60)] py-32 text-white sm:py-40">
        <img
          src={brandAssets.monogramWhite}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -left-20 -bottom-20 h-[28rem] w-auto opacity-[0.06]"
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-10">
          <p className="font-display text-[clamp(1.6rem,3vw,2.5rem)] font-light italic leading-[1.3] text-white/90">
            « Un lieu réussi est celui qu'on oublie en y entrant, parce qu'il
            vous porte au lieu de vous imposer. »
          </p>
          <p className="mt-10 text-[11px] uppercase tracking-[0.3em] text-white/55">
            Sylvain · Studio M
          </p>
        </div>
      </section>

      <section className="bg-[var(--brand-cream)] py-28">
        <div className="mx-auto max-w-[900px] px-6 text-center sm:px-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
            Échanger
          </p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight tracking-tight">
            Et si l'on se <span className="italic">rencontrait</span> ?
          </h2>
          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border-b border-foreground/60 pb-1 text-[13px] uppercase tracking-[0.2em] text-foreground hover:border-foreground"
            >
              Prendre rendez-vous →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
