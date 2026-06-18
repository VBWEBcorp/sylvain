'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { useState } from 'react'

import { brandAssets } from '@/lib/brand'
import type { SiteContent } from '@/lib/content-store'

const ease = [0.22, 1, 0.36, 1] as const

export function ContactContent({
  site,
  contact,
}: {
  site: SiteContent['site']
  contact: SiteContent['contact']
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const hoursLines = (site.hours || '').split('\n').filter(Boolean)
  const hasIntroHeader = Boolean(contact.eyebrow || contact.title || contact.intro)

  return (
    <>
      {/* Barre supérieure compacte */}
      <section className="bg-[var(--brand-cream)] pt-28 pb-6 sm:pt-32 sm:pb-8">
        <div className="mx-auto flex max-w-[1400px] items-center px-6 sm:px-10 lg:px-16">
          <h1 className="font-display text-3xl font-light leading-none tracking-tight text-foreground sm:text-4xl">
            Contact
          </h1>
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
              {contact.eyebrow ? (
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
                  {contact.eyebrow}
                </p>
              ) : null}
              {contact.title ? (
                <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tight">
                  {contact.title}
                </h2>
              ) : null}
              {contact.intro ? (
                <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/65">
                  {contact.intro}
                </p>
              ) : null}

              <ul className={`space-y-7 ${hasIntroHeader ? 'mt-16' : ''}`}>
                <li>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                    Email
                  </p>
                  <a
                    href={`mailto:${site.email}`}
                    className="group mt-2 inline-flex items-center gap-2 font-display text-xl font-light text-white hover:italic sm:text-2xl"
                  >
                    {site.email}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
                <li>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                    Téléphone
                  </p>
                  <a
                    href={`tel:${site.phone}`}
                    className="mt-2 inline-block font-display text-xl font-light text-white hover:italic sm:text-2xl"
                  >
                    {site.phone}
                  </a>
                </li>
                <li>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                    Studio
                  </p>
                  <p className="mt-2 font-display text-xl font-light leading-snug text-white sm:text-2xl">
                    {site.address.street}
                    <br />
                    {site.address.postalCode} {site.address.city}
                  </p>
                </li>
                {hoursLines.length > 0 && (
                  <li>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                      Horaires
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                      {hoursLines.map((line, i) => (
                        <span key={i}>
                          {i === 0 ? line : <span className="italic text-white/45">{line}</span>}
                          {i < hoursLines.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </li>
                )}
                {site.instagram && (
                  <li className="pt-4">
                    <a
                      href={site.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 border-b border-white/40 pb-1 text-[12px] uppercase tracking-[0.22em] text-white transition-colors hover:border-white"
                    >
                      Instagram
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </li>
                )}
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
            {contact.formIntro ? (
              <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
                {contact.formIntro}
              </p>
            ) : null}
            {contact.formTitle ? (
              <h3 className="mt-6 font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-light leading-tight tracking-tight text-foreground">
                {contact.formTitle}
              </h3>
            ) : null}

            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="mt-12 flex flex-col items-start"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 13, delay: 0.12 }}
                    className="inline-flex size-16 items-center justify-center rounded-full bg-foreground text-[var(--brand-cream)]"
                  >
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.35, duration: 0.3 }}
                    >
                      <Check className="size-8" strokeWidth={1.75} />
                    </motion.span>
                  </motion.span>
                  <h3 className="mt-7 font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                    Message bien envoyé
                  </h3>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground/65">
                    Merci, votre message m&apos;est bien parvenu. Je reviens vers vous
                    personnellement très vite — généralement sous 24 à 48 heures.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="group mt-9 inline-flex items-center gap-2 border-b border-foreground/50 pb-1 text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground"
                  >
                    Envoyer un autre message
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const form = e.currentTarget
                    setStatus('sending')
                    try {
                      const res = await fetch('https://formspree.io/f/xqeovznn', {
                        method: 'POST',
                        headers: { Accept: 'application/json' },
                        body: new FormData(form),
                      })
                      if (res.ok) {
                        setStatus('sent')
                        form.reset()
                      } else {
                        setStatus('error')
                      }
                    } catch {
                      setStatus('error')
                    }
                  }}
                  className="mt-12 space-y-10"
                >
                  {/* Sujet du mail reçu (en français) + piège anti-spam */}
                  <input
                    type="hidden"
                    name="_subject"
                    value="Nouveau message depuis le site Studio M"
                  />
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="hidden"
                  />

                  <div className="grid gap-10 sm:grid-cols-2">
                    <Field label="Prénom" id="firstName" name="Prénom" />
                    <Field label="Nom" id="lastName" name="Nom" />
                  </div>
                  <div className="grid gap-10 sm:grid-cols-2">
                    <Field label="Email" id="email" name="Email" type="email" required />
                    <Field label="Téléphone" id="phone" name="Téléphone" type="tel" />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="text-[11px] uppercase tracking-[0.22em] text-foreground/55"
                    >
                      Votre message
                    </label>
                    <textarea
                      id="message"
                      name="Message"
                      rows={5}
                      required
                      placeholder="Votre projet, vos envies, le lieu…"
                      className="mt-3 w-full resize-none border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 text-[12px] uppercase tracking-[0.22em] text-[var(--brand-cream)] transition-transform hover:translate-y-[-1px] disabled:opacity-60"
                    >
                      <span>{status === 'sending' ? 'Envoi…' : 'Envoyer le message'}</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                    {status === 'error' ? (
                      <p className="text-sm italic text-red-700">
                        Une erreur est survenue. Réessayez, ou écrivez-moi directement par email.
                      </p>
                    ) : null}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function Field({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  required,
}: {
  label: string
  id: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-[11px] uppercase tracking-[0.22em] text-foreground/55"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-3 w-full border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
      />
    </div>
  )
}
