'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

import { brandAssets } from '@/lib/brand'
import { siteConfig } from '@/lib/seo'

const ease = [0.22, 1, 0.36, 1] as const

export function ContactContent() {
  const [sent, setSent] = useState(false)

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
              Contact
            </p>
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.98] tracking-tight text-foreground">
            Racontez-moi <span className="italic">votre projet</span>.
          </h1>
          <p className="mt-10 max-w-xl text-[15px] leading-relaxed text-foreground/70">
            Premier rendez-vous offert, chez vous ou au studio, dans le Marais.
            Je reviens vers vous sous 48 heures ouvrées.
          </p>
        </div>
      </section>

      <section className="bg-[var(--brand-cream)] pb-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 sm:px-10 lg:grid-cols-[1.4fr_1fr] lg:gap-24 lg:px-16">
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
            className="space-y-10"
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
              <div className="mt-5 flex flex-wrap gap-3">
                {['Appartement', 'Commerce', 'Maison', 'Bureaux', 'Décoration'].map(
                  (tag) => (
                    <label
                      key={tag}
                      className="cursor-pointer border border-border/70 px-4 py-2 text-[13px] has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-[var(--brand-cream)]"
                    >
                      <input type="checkbox" name="tags" value={tag} className="sr-only" />
                      {tag}
                    </label>
                  )
                )}
              </div>
            </fieldset>

            <Field label="Surface approximative" name="surface" placeholder="ex. 85 m²" />

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
                className="mt-3 w-full border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="group inline-flex items-center gap-3 border-b border-foreground pb-1 text-[13px] uppercase tracking-[0.2em] text-foreground"
            >
              <span>{sent ? 'Message envoyé' : 'Envoyer le message'}</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            {sent ? (
              <p className="text-sm italic text-foreground/60">
                Merci, je reviens vers vous très vite.
              </p>
            ) : null}
          </motion.form>

          <aside className="space-y-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/55">
                Le studio
              </p>
              <p className="mt-4 font-display text-2xl font-light leading-snug text-foreground">
                {siteConfig.address.street}
                <br />
                {siteConfig.address.postalCode} {siteConfig.address.city}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/55">
                Téléphone
              </p>
              <a
                href={`tel:${siteConfig.phone}`}
                className="mt-4 block font-display text-2xl font-light text-foreground hover:italic"
              >
                {siteConfig.phone}
              </a>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/55">
                Email
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-4 block font-display text-2xl font-light text-foreground hover:italic"
              >
                {siteConfig.email}
              </a>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/55">
                Horaires
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/70">
                Lundi au vendredi<br />
                9h30 à 19h<br />
                <span className="italic text-foreground/50">Sur rendez-vous uniquement</span>
              </p>
            </div>
            <div className="relative">
              <img
                src={brandAssets.banner}
                alt=""
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </aside>
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
