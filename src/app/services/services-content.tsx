'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { brandAssets } from '@/lib/brand'

const ease = [0.22, 1, 0.36, 1] as const

const services = [
  {
    number: '01',
    title: 'Appartements',
    kicker: 'Rénovation résidentielle',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
    body: "Appartements haussmanniens, lofts, pieds-à-terre, duplex. De la redistribution complète des volumes à la simple rénovation d'une pièce de vie, j'interviens sur des projets de 40 à 400 m². Un seul interlocuteur, du plan initial à la pose des derniers rideaux.",
    includes: [
      'Relevé & plans',
      'Redistribution des volumes',
      'Cuisines et salles de bain sur mesure',
      'Mobilier intégré',
      'Sélection des matières et des couleurs',
      'Coordination complète du chantier',
    ],
  },
  {
    number: '02',
    title: 'Commerces',
    kicker: 'Boutiques, restaurants, bureaux',
    image:
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1400&q=85',
    body: "Boutiques, concept stores, restaurants, bureaux d'agence. Je donne à votre lieu une identité architecturale forte, cohérente avec votre marque et pensée pour durer. Agencement sur mesure, signalétique, mobilier : tout est dessiné pour vous.",
    includes: [
      'Concept et positionnement',
      'Agencement & mobilier sur mesure',
      'Éclairage scénique',
      'Signalétique et détails graphiques',
      'Respect des normes ERP',
      'Livraison clé en main',
    ],
  },
  {
    number: '03',
    title: 'Décoration',
    kicker: 'Mise en scène & mobilier',
    image:
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85',
    body: "Lorsque le gros œuvre est déjà là, j'interviens plus légèrement : choix des matières, du mobilier, des textiles, de l'éclairage. Une prestation sur mesure pour donner une nouvelle âme à votre lieu sans toucher aux murs.",
    includes: [
      'Moodboards et direction artistique',
      'Plans de mobilier',
      'Sélection de pièces vintage et contemporaines',
      'Textiles, rideaux, tapis',
      'Éclairage et accessoires',
      'Installation et styling final',
    ],
  },
]

export function ServicesContent() {
  return (
    <>
      <section className="bg-[var(--brand-cream)] pt-40 pb-16 sm:pt-48 sm:pb-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-4">
            <img
              src={brandAssets.monogramBeige}
              alt=""
              aria-hidden
              className="h-5 w-auto opacity-80 mix-blend-multiply"
            />
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
              Services
            </p>
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.98] tracking-tight text-foreground">
            Trois façons de me
            <br />
            <span className="italic">confier un lieu.</span>
          </h1>
          <p className="mt-10 max-w-xl text-[15px] leading-relaxed text-foreground/70">
            Studio M intervient principalement sur trois types de missions.
            Toutes partagent la même méthode : écoute, dessin, chantier,
            livraison.
          </p>
        </div>
      </section>

      <section className="bg-[var(--brand-cream)] pb-28">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="space-y-28 sm:space-y-40">
            {services.map((s, i) => (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease }}
                className="grid gap-10 lg:grid-cols-12 lg:gap-16"
              >
                <div className={`lg:col-span-6 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="flex flex-col justify-center lg:col-span-6">
                  <p className="font-display text-xl italic text-foreground/50">{s.number}</p>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-foreground/55">
                    {s.kicker}
                  </p>
                  <h2 className="mt-4 font-display text-[clamp(2.25rem,4.5vw,4rem)] font-light leading-[1] tracking-tight text-foreground">
                    {s.title}
                  </h2>
                  <p className="mt-8 text-[15px] leading-relaxed text-foreground/70">{s.body}</p>
                  <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                    {s.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-3 text-[14px] text-foreground/80">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground/60" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[oklch(0.22_0.015_60)] py-32 text-white sm:py-40">
        <img
          src={brandAssets.monogramWhite}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-[26rem] w-auto opacity-[0.06]"
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">Honoraires</p>
          <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight tracking-tight">
            Une <span className="italic">transparence</span> totale.
          </h2>
          <p className="mt-8 text-[15px] leading-relaxed text-white/70">
            Chaque mission fait l'objet d'un devis détaillé au démarrage :
            honoraires de conception, coordination de chantier, coût travaux
            estimé par corps de métier. Aucune surprise, aucune commission
            cachée sur les fournisseurs.
          </p>
          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border-b border-white/60 pb-1 text-[13px] uppercase tracking-[0.2em] hover:border-white"
            >
              Demander un devis →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
