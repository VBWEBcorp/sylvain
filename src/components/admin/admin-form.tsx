'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function authHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const inputCls =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground/60'

export function AdminPageHeader({
  title,
  back,
  children,
}: {
  title: string
  back?: { href: string; label: string }
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
      <div className="min-w-0">
        {back ? (
          <Link
            href={back.href}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← {back.label}
          </Link>
        ) : null}
        <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

export function SaveButton({
  onSave,
}: {
  onSave: () => Promise<void> | void
}) {
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  async function handle() {
    setSaving(true)
    try {
      await onSave()
      setDone(true)
      setTimeout(() => setDone(false), 1800)
    } finally {
      setSaving(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
    >
      {done ? <Check className="size-4" /> : null}
      {saving ? 'Enregistrement…' : done ? 'Enregistré' : 'Enregistrer'}
    </button>
  )
}

export function Block({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6">
      <header>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-[12px] text-muted-foreground/80">{subtitle}</p>
        ) : null}
      </header>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  )
}
