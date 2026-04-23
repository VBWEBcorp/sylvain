'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, ExternalLink, Plus, Trash2 } from 'lucide-react'

import type { Project } from '@/lib/projects'

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
  const router = useRouter()
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
              /projets/{p.slug}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/projets/${p.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
            >
              <ExternalLink className="size-4" />
              Voir la page
            </Link>
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

        {/* Photos principales */}
        <Block title="Photo de couverture">
          <ImageField
            value={p.cover}
            onChange={(v) => setField('cover', v)}
            placeholder="URL de la photo principale"
          />
        </Block>

        <Block title="Avant / Après (optionnel)">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium">Photo « Avant »</p>
              <ImageField value={p.before ?? ''} onChange={(v) => setField('before', v || undefined)} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium">Photo « Après »</p>
              <ImageField value={p.after ?? ''} onChange={(v) => setField('after', v || undefined)} />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Les deux doivent être renseignées pour activer le slider comparatif sur le site.
          </p>
        </Block>

        {/* Galerie */}
        <Block title="Galerie">
          <GalleryEditor value={p.gallery} onChange={(v) => setField('gallery', v)} />
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

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
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

function ImageField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
              Aperçu
            </div>
          )}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? 'https://...'}
          className={inputCls}
        />
      </div>
    </div>
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

function GalleryEditor({
  value,
  onChange,
}: {
  value: string[]
  onChange: (v: string[]) => void
}) {
  function update(i: number, v: string) {
    const next = [...value]
    next[i] = v
    onChange(next)
  }
  function remove(i: number) {
    const next = [...value]
    next.splice(i, 1)
    onChange(next)
  }
  function move(i: number, dir: -1 | 1) {
    const target = i + dir
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[i], next[target]] = [next[target], next[i]]
    onChange(next)
  }
  return (
    <div className="space-y-3">
      {value.map((url, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-6 shrink-0 text-xs text-muted-foreground">{i + 1}</span>
          <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
            {url ? (
              <img src={url} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <input
            value={url}
            onChange={(e) => update(i, e.target.value)}
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => move(i, -1)}
            disabled={i === 0}
            className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => move(i, 1)}
            disabled={i === value.length - 1}
            className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => remove(i)}
            className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Supprimer"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ''])}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
      >
        <Plus className="size-4" />
        Ajouter une photo
      </button>
    </div>
  )
}
