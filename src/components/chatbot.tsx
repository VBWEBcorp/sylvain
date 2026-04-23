'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { brandAssets } from '@/lib/brand'

type Message = {
  id: string
  from: 'bot' | 'user'
  text: string
}

type Step = {
  bot: string
  options?: string[]
  placeholder?: string
}

// Scénario scripté — aucune IA, juste un enchaînement démo.
const script: Step[] = [
  {
    bot: "Bonjour, je suis l'assistant de Studio M. Souhaitez-vous me parler de votre projet ?",
    options: ['Oui, avec plaisir', 'Juste une question', 'Obtenir un devis'],
  },
  {
    bot: 'Très bien. De quel type de lieu s\'agit-il ?',
    options: ['Appartement', 'Commerce', 'Maison', 'Bureaux'],
  },
  {
    bot: 'Et à peu près combien de mètres carrés ?',
    options: ['< 50 m²', '50 – 100 m²', '100 – 200 m²', '> 200 m²'],
  },
  {
    bot: 'Dans quel quartier ou ville ?',
    placeholder: 'Paris 8e, Neuilly, Vincennes…',
  },
  {
    bot: "Parfait. À quelle adresse email Sylvain peut-il vous répondre ?",
    placeholder: 'votre@email.fr',
  },
  {
    bot: "Merci, tout est noté. Sylvain vous recontactera personnellement sous 48 h. En attendant, vous pouvez parcourir les projets récents.",
    options: ['Voir les projets', 'Fermer la conversation'],
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [hasNew, setHasNew] = useState(true)
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Délai d'apparition pour ne pas gêner l'entrée sur la page
    const t = setTimeout(() => setMounted(true), 1200)
    return () => clearTimeout(t)
  }, [])

  // Poster le premier message du bot dès l'ouverture
  useEffect(() => {
    if (open && messages.length === 0) {
      sendBot(script[0].bot)
    }
    if (open) setHasNew(false)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, typing])

  function sendBot(text: string) {
    setTyping(true)
    const delay = Math.min(600 + text.length * 14, 1400)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), from: 'bot', text },
      ])
      setTyping(false)
    }, delay)
  }

  function handleUserAnswer(text: string) {
    if (!text.trim()) return
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), from: 'user', text: text.trim() },
    ])
    setInput('')

    const current = script[stepIndex]
    // Cas particulier dernier écran
    if (stepIndex === script.length - 1) {
      if (text.toLowerCase().includes('projet')) {
        window.location.href = '/projets'
        return
      }
      setOpen(false)
      return
    }

    const nextIndex = stepIndex + 1
    setStepIndex(nextIndex)
    const nextStep = script[nextIndex]
    if (nextStep) sendBot(nextStep.bot)
  }

  function restart() {
    setMessages([])
    setStepIndex(0)
    setTimeout(() => sendBot(script[0].bot), 200)
  }

  const step = script[stepIndex]

  return (
    <>
      {/* Bouton flottant */}
      <AnimatePresence>
        {mounted && !open ? (
          <motion.button
            key="fab"
            type="button"
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ duration: 0.5, ease }}
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le chat avec Studio M"
            className="fixed right-4 bottom-4 z-40 inline-flex size-11 items-center justify-center rounded-full bg-[oklch(0.22_0.015_60)]/90 text-[var(--brand-cream)] shadow-[0_6px_18px_rgba(30,22,10,0.18)] backdrop-blur-sm transition-transform hover:scale-105 sm:right-6 sm:bottom-6 sm:size-12"
          >
            <MessageSquare className="size-[18px]" />
            {hasNew ? (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[oklch(0.78_0.09_70)] ring-2 ring-[oklch(0.22_0.015_60)]" />
            ) : null}
          </motion.button>
        ) : null}
      </AnimatePresence>

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease }}
            className="fixed right-3 bottom-3 z-50 flex h-[min(520px,calc(100dvh-32px))] w-[calc(100vw-24px)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-[var(--brand-cream)] shadow-[0_18px_50px_rgba(30,22,10,0.22)] sm:right-6 sm:bottom-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-[oklch(0.22_0.015_60)] px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-[var(--brand-cream)]">
                  <img
                    src={brandAssets.monogramBeige}
                    alt=""
                    className="h-6 w-auto mix-blend-multiply"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Studio M</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">
                    En ligne · réponse rapide
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto bg-[oklch(0.96_0.018_85)] px-4 py-5"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                      m.from === 'user'
                        ? 'rounded-br-sm bg-[oklch(0.22_0.015_60)] text-white'
                        : 'rounded-bl-sm border border-border/60 bg-white text-foreground'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-border/60 bg-white px-4 py-3">
                    <Dot delay={0} />
                    <Dot delay={0.15} />
                    <Dot delay={0.3} />
                  </div>
                </motion.div>
              ) : null}

              {/* Quick replies si l'étape en propose */}
              {!typing && step?.options && messages.length > 0 && messages[messages.length - 1].from === 'bot' ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {step.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleUserAnswer(opt)}
                      className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-[12px] text-foreground/80 transition-colors hover:border-foreground hover:bg-foreground hover:text-[var(--brand-cream)]"
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              ) : null}

              {stepIndex >= script.length - 1 && !typing ? (
                <button
                  type="button"
                  onClick={restart}
                  className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-foreground/45 hover:text-foreground"
                >
                  Recommencer la conversation
                </button>
              ) : null}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUserAnswer(input)
              }}
              className="flex items-center gap-2 border-t border-border/70 bg-[var(--brand-cream)] px-3 py-2.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={step?.placeholder ?? 'Votre message…'}
                className="flex-1 bg-transparent px-2 py-2 text-[14px] text-foreground placeholder:text-foreground/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Envoyer"
                className="inline-flex size-9 items-center justify-center rounded-full bg-[oklch(0.22_0.015_60)] text-[var(--brand-cream)] transition-opacity disabled:opacity-30"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 0.9, repeat: Infinity, delay, ease: 'easeInOut' }}
      className="size-1.5 rounded-full bg-foreground/50"
    />
  )
}
