'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { brandAssets } from '@/lib/brand'
import { siteConfig } from '@/lib/seo'

const ease = [0.22, 1, 0.36, 1] as const

export function ContactContent() {
  const [sent, setSent] = useState(false)

  return (
    <>
      {/* Barre supérieure compacte */}
      <section className="bg-[var(--brand-cream)] pt-28 pb-6 sm:pt-32 sm:pb-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-4">
            <img
              src={brandAssets.monogramDark}
              alt=""
              aria-hidden
              className="h-12 w-auto sm:h-14"
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 sm:text-[11px]">
                Studio M
              </p>
              <h1 className="font-display text-2xl font-light leading-none tracking-tight text-foreground sm:text-3xl">
                Contact
              </h1>
            </div>
          </div>
          <nav aria-label="Sections du site" className="flex items-center gap-5 sm:gap-7">
            <Link
              href="/projets"
              className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-foreground sm:text-[12px]"
            >
              Réalisations
            </Link>
            <span aria-hidden className="h-3 w-px bg-foreground/30" />
            <Link
              href="/a-propos"
              className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-foreground sm:text-[12px]"
            >
              Studio
            </Link>
          </nav>
        </div>
        <div className="mx-auto mt-6 max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <span aria-hidden className="block h-px w-full bg-foreground/10" />
        </div>
      </section>

      {/* Split éditorial : info à gauche, formulaire à droite */}
      <section className="bg-[var(--brand-cream)] pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Colonne gauche — info, fond noir */}
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease }}
            className="relative overflow-hidden bg-black px-6 py-20 text-white sm:px-12 sm:py-28 lg:px-16 lg:py-32"
          >
            <img
              src={brandAssets.monogramWhite}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -right-20 -bottom-16 h-[28rem] w-auto opacity-[0.05]"
            />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
                Échangeons
              </p>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tight">
                Racontez-moi
                <br />
                <span className="italic text-white/80">votre projet.</span>
              </h2>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/65">
                Premier rendez-vous offert, chez vous ou au studio, dans le
                Marais. Je reviens vers vous sous 48 h ouvrées.
              </p>

              <ul className="mt-16 space-y-7">
                <li>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                    Email
                  </p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="group mt-2 inline-flex items-center gap-2 font-display text-xl font-light text-white hover:italic sm:text-2xl"
                  >
                    {siteConfig.email}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
                <li>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                    Téléphone
                  </p>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="mt-2 inline-block font-display text-xl font-light text-white hover:italic sm:text-2xl"
                  >
                    {siteConfig.phone}
                  </a>
                </li>
                <li>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                    Studio
                  </p>
                  <p className="mt-2 font-display text-xl font-light leading-snug text-white sm:text-2xl">
                    {siteConfig.address.street}
                    <br />
                    {siteConfig.address.postalCode} {siteConfig.address.city}
                  </p>
                </li>
                <li>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                    Horaires
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                    Lundi au vendredi, 9h30 à 19h
                    <br />
                    <span className="italic text-white/45">
                      Sur rendez-vous uniquement
                    </span>
                  </p>
                </li>
                <li className="pt-4">
                  <a
                    href={siteConfig.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 border-b border-white/40 pb-1 text-[12px] uppercase tracking-[0.22em] text-white transition-colors hover:border-white"
                  >
                    Instagram
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              </ul>
            </div>
          </motion.aside>

          {/* Colonne droite — formulaire, fond crème */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            className="bg-[var(--brand-cream)] px-6 py-20 sm:px-12 sm:py-28 lg:px-16 lg:py-32"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
              Premier contact
            </p>
            <h3 className="mt-6 font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-light leading-tight tracking-tight text-foreground">
              Quelques mots <span className="italic">suffisent</span>.
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="mt-12 space-y-10"
            >
              <div className="grid gap-10 sm:grid-cols-2">
                <Field label="Prénom" name="firstName" />
                <Field label="Nom" name="lastName" />
              </div>
              <div className="grid gap-10 sm:grid-cols-2">
                <Field label="Email" name="email" type="email" />
                <Field label="Téléphone" name="phone" type="tel" />
              </div>

              <fieldset>
                <legend className="text-[11px] uppercase tracking-[0.22em] text-foreground/55">
                  Nature du projet
                </legend>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Appartement', 'Maison', 'Décoration'].map((tag) => (
                    <label
                      key={tag}
                      className="cursor-pointer rounded-full border border-border/70 px-4 py-1.5 text-[12px] transition-colors hover:border-foreground/60 has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-[var(--brand-cream)]"
                    >
                      <input type="checkbox" name="tags" value={tag} className="sr-only" />
                      {tag}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field
                label="Surface approximative"
                name="surface"
                placeholder="ex. 85 m²"
              />

              <div>
                <label
                  htmlFor="message"
                  className="text-[11px] uppercase tracking-[0.22em] text-foreground/55"
                >
                  Votre projet en quelques mots
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Adresse, état actuel du bien, envies, timing envisagé…"
                  className="mt-3 w-full resize-none border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 text-[12px] uppercase tracking-[0.22em] text-[var(--brand-cream)] transition-transform hover:translate-y-[-1px]"
                >
                  <span>{sent ? 'Message envoyé' : 'Envoyer le message'}</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>
                {sent ? (
                  <p className="text-sm italic text-foreground/65">
                    Merci, je reviens vers vous très vite.
                  </p>
                ) : (
                  <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/40">
                    Réponse sous 48 h
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-[11px] uppercase tracking-[0.22em] text-foreground/55"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-3 w-full border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
      />
    </div>
  )
}
