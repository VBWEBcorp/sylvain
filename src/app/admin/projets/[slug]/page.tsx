'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'

import { GalleryEditor } from '@/components/admin/gallery-editor'
import type { PhotoCredit, PhotoOrientation, Project } from '@/lib/projects'

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
      const payload = {
        ...project,
        // Un projet avec des photos est forcément publié (pas « Coming soon »).
        comingSoon: (project.gallery?.length ?? 0) > 0 ? false : project.comingSoon,
      }
      const res = await fetch(`/api/projects/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(payload),
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

        {/* Informations */}
        <Block title="Informations" subtitle="Le nom s'affiche tel quel sur le site, suivi du descripteur.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom du projet (affiché sur le site)">
              <input
                value={p.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="ex : Appartement Royal Monceau"
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
            <Field label="Descripteur (à côté du nom, optionnel)">
              <input
                value={p.surface}
                onChange={(e) => setField('surface', e.target.value)}
                placeholder="ex : 50 m² · Dolce vita"
                className={inputCls}
              />
            </Field>
          </div>
        </Block>

        {/* Statut — pertinent uniquement tant qu'il n'y a pas de photos.
            Dès qu'une photo est ajoutée, le projet est publié automatiquement. */}
        {(p.gallery?.length ?? 0) === 0 ? (
          <Block
            title="Statut"
            subtitle="Tant qu'il n'y a pas de photos, le projet peut afficher un bloc « Coming soon ». Dès que vous ajoutez des photos, il passe automatiquement en ligne."
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
        ) : (
          <Block title="Statut">
            <p className="text-sm text-muted-foreground">
              ✅ Ce projet a {p.gallery.length} photo{p.gallery.length > 1 ? 's' : ''} — il est{' '}
              <span className="font-medium text-foreground">publié</span> sur le site.
            </p>
          </Block>
        )}

        {/* Galerie principale — l'élément le plus important */}
        <Block
          title="Photos du projet"
          subtitle="La première photo sert de couverture. Glissez-déposez pour réorganiser. Sous chaque photo, choisissez son cadrage dans le carrousel : auto, portrait ou paysage."
        >
          <GalleryEditor
            value={p.gallery.length > 0 ? p.gallery : p.cover ? [p.cover] : []}
            orientations={Object.fromEntries(
              (p.orientations ?? []).map((o) => [o.url, o.orientation])
            )}
            onOrientationChange={(url, orientation) => {
              const rest = (p.orientations ?? []).filter((o) => o.url !== url)
              setField(
                'orientations',
                orientation === 'auto'
                  ? rest
                  : [...rest, { url, orientation: orientation as PhotoOrientation }]
              )
            }}
            onChange={(next) => {
              setField('gallery', next)
              setField('cover', next[0] ?? '')
              // On purge les orientations des photos retirées de la galerie.
              setField(
                'orientations',
                (p.orientations ?? []).filter((o) => next.includes(o.url))
              )
              // Dès qu'il y a des photos, le projet est publié : on retire « Coming soon ».
              if (next.length > 0) setField('comingSoon', false)
            }}
          />
        </Block>

        <Block
          title="Crédits photo"
          subtitle="Nom du photographe / magazine + lien Instagram. Affichés sous la galerie sur le site."
        >
          <CreditsEditor value={p.credits ?? []} onChange={(v) => setField('credits', v)} />
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

