'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'

import { GalleryEditor } from '@/components/admin/gallery-editor'
import { ImageField as ImageUploadField } from '@/components/admin/image-field'
import type { PhotoCredit, Project } from '@/lib/projects'

function authHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const categories: Project['category'][] = ['Appartement', 'Commerce', 'Maison']

export default function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/projects/${slug}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Project) => setProject(data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p className="p-10 text-sm text-muted-foreground">Chargement…</p>
  if (!project)
    return (
      <div className="p-10">
        <p className="text-sm text-destructive">Projet introuvable.</p>
        <Link href="/admin/projets" className="mt-4 inline-block text-sm underline">
          Retour à la liste
        </Link>
      </div>
    )

  function setField<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  async function save() {
    if (!project) return
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(project),
      })
      if (!res.ok) throw new Error('save failed')
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 1800)
    } catch {
      alert("Impossible d'enregistrer.")
    } finally {
      setSaving(false)
    }
  }

  const p = project

  return (
    <div className="p-6 pb-24 sm:p-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <Link
              href="/admin/projets"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Tous les projets
            </Link>
            <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight">
              {p.title || 'Sans titre'}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Identifiant : {p.slug}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {justSaved ? <Check className="size-4" /> : null}
              {saving ? 'Enregistrement…' : justSaved ? 'Enregistré' : 'Enregistrer'}
            </button>
          </div>
        </div>

        {/* Informations générales */}
        <Block title="Informations">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Titre">
              <input
                value={p.title}
                onChange={(e) => setField('title', e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Catégorie">
              <select
                value={p.category}
                onChange={(e) => setField('category', e.target.value as Project['category'])}
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Localisation">
              <input
                value={p.location}
                onChange={(e) => setField('location', e.target.value)}
                placeholder="ex : Paris 8e · Monceau"
                className={inputCls}
              />
            </Field>
            <Field label="Année">
              <input
                value={p.year}
                onChange={(e) => setField('year', e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Surface">
              <input
                value={p.surface}
                onChange={(e) => setField('surface', e.target.value)}
                placeholder="ex : 120 m²"
                className={inputCls}
              />
            </Field>
            <Field label="Durée du chantier">
              <input
                value={p.duration}
                onChange={(e) => setField('duration', e.target.value)}
                placeholder="ex : 4 mois"
                className={inputCls}
              />
            </Field>
          </div>
        </Block>

        {/* Statut */}
        <Block
          title="Statut"
          subtitle="Pour un projet pas encore shooté : affiche un bloc « Coming soon » à la place de la galerie."
        >
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={p.comingSoon ?? false}
              onChange={(e) => setField('comingSoon', e.target.checked)}
              className="size-4"
            />
            Coming soon (galerie à venir)
          </label>
          {p.comingSoon ? (
            <Field label="Date / mention de shooting">
              <input
                value={p.shootingDate ?? ''}
                onChange={(e) => setField('shootingDate', e.target.value)}
                placeholder="ex : Shooting en juillet"
                className={inputCls}
              />
            </Field>
          ) : null}
        </Block>

        {/* Description */}
        <Block title="Texte du projet">
          <Field label="Introduction (phrase courte)">
            <textarea
              value={p.intro}
              onChange={(e) => setField('intro', e.target.value)}
              rows={2}
              className={inputCls}
            />
          </Field>
          <Field label="Description (un paragraphe par ligne vide)">
            <textarea
              value={p.description.join('\n\n')}
              onChange={(e) =>
                setField(
                  'description',
                  e.target.value
                    .split(/\n{2,}/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              rows={8}
              className={inputCls}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Séparez les paragraphes par une ligne vide.
            </p>
          </Field>
          <StringList
            label="Interventions (une par ligne)"
            value={p.services}
            onChange={(v) => setField('services', v)}
          />
        </Block>

        {/* Galerie principale — l'élément le plus important */}
        <Block title="Photos du projet" subtitle="La première photo sert de couverture. Glissez-déposez pour réorganiser.">
          <GalleryEditor
            value={p.gallery.length > 0 ? p.gallery : p.cover ? [p.cover] : []}
            onChange={(next) => {
              setField('gallery', next)
              setField('cover', next[0] ?? '')
            }}
          />
        </Block>

        <Block
          title="Crédits photo"
          subtitle="Nom du photographe / magazine + lien Instagram. Affichés sous la galerie sur le site."
        >
          <CreditsEditor value={p.credits ?? []} onChange={(v) => setField('credits', v)} />
        </Block>

        <Block title="Avant / Après (optionnel)" subtitle="Renseignez les deux photos pour activer le slider comparatif.">
          <div className="grid gap-5 sm:grid-cols-2">
            <ImageUploadField
              label="Avant"
              value={p.before ?? ''}
              onChange={(v) => setField('before', v || undefined)}
            />
            <ImageUploadField
              label="Après"
              value={p.after ?? ''}
              onChange={(v) => setField('after', v || undefined)}
            />
          </div>
        </Block>

        {/* Sauvegarde sticky bas */}
        <div className="mt-10 flex items-center justify-end gap-3">
          <Link
            href="/admin/projets"
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Annuler
          </Link>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {justSaved ? <Check className="size-4" /> : null}
            {saving ? 'Enregistrement…' : justSaved ? 'Enregistré' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground/60'

function Block({
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

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium">{label}</span>
      {children}
    </label>
  )
}

function StringList({
  label,
  value,
  onChange,
}: {
  label: string
  value: string[]
  onChange: (v: string[]) => void
}) {
  return (
    <Field label={label}>
      <textarea
        value={value.join('\n')}
        onChange={(e) =>
          onChange(
            e.target.value
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
        rows={4}
        className={inputCls}
      />
    </Field>
  )
}

function CreditsEditor({
  value,
  onChange,
}: {
  value: PhotoCredit[]
  onChange: (v: PhotoCredit[]) => void
}) {
  function update(i: number, patch: Partial<PhotoCredit>) {
    onChange(value.map((c, idx) => (idx === i ? { ...c, ...patch } : c)))
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }
  function add() {
    onChange([...value, { name: '', url: '' }])
  }

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <p className="text-[12px] text-muted-foreground">Aucun crédit pour l'instant.</p>
      ) : null}
      {value.map((c, i) => (
        <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={c.name}
            onChange={(e) => update(i, { name: e.target.value })}
            placeholder="Nom (ex : Studio Nohoia)"
            className={inputCls}
          />
          <input
            value={c.url ?? ''}
            onChange={(e) => update(i, { url: e.target.value })}
            placeholder="https://www.instagram.com/…"
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Retirer ce crédit"
            className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
      >
        + Ajouter un crédit
      </button>
    </div>
  )
}

