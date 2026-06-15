'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from 'lucide-react'

import type { Project } from '@/lib/projects'

function authHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reorderMode, setReorderMode] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' })
      const data = await res.json()
      setProjects(data)
    } catch (e) {
      setError("Impossible de charger les projets.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(slug: string) {
    if (!confirm('Supprimer définitivement ce projet ?')) return
    const res = await fetch(`/api/projects/${slug}`, {
      method: 'DELETE',
      headers: { ...authHeader() },
    })
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.slug !== slug))
    } else {
      alert('Suppression impossible.')
    }
  }

  async function handleCreate() {
    const slug = prompt(
      'Identifiant (slug) du nouveau projet. Ex : appartement-bastille',
      ''
    )
    if (!slug) return
    const body = {
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      title: 'Nouveau projet',
      category: 'Appartement' as const,
      location: 'Paris',
      year: new Date().getFullYear().toString(),
      surface: '',
      duration: '',
      cover:
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1600&q=80',
      gallery: [],
      intro: '',
      description: [],
      services: [],
    }
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const created = await res.json()
      window.location.href = `/admin/projets/${created.slug}`
    } else {
      const { error } = await res.json().catch(() => ({ error: 'Erreur' }))
      alert(error)
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...projects]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setProjects(next)
    await fetch('/api/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ order: next.map((p) => p.slug) }),
    })
  }

  return (
    <div className="p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Projets</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Créer, éditer, supprimer et réorganiser les réalisations affichées
              sur le site public.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReorderMode((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                reorderMode
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:bg-muted'
              }`}
            >
              <ArrowUpDown className="size-4" />
              {reorderMode ? 'Fin du tri' : 'Réorganiser'}
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90"
            >
              <Plus className="size-4" />
              Nouveau projet
            </button>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-sm text-muted-foreground">Chargement…</p>
        ) : error ? (
          <p className="py-10 text-sm text-destructive">{error}</p>
        ) : (
          <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
            {projects.map((p, i) => (
              <li
                key={p.slug}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/40"
              >
                <span className="w-8 shrink-0 text-center text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  {p.cover ? (
                    <img
                      src={p.cover}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{p.title}</p>
                    {(p.gallery?.length ?? 0) === 0 && p.comingSoon ? (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700">
                        Coming soon
                      </span>
                    ) : null}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.gallery?.length ?? 0} photo{(p.gallery?.length ?? 0) > 1 ? 's' : ''} · {p.category}
                    {p.location ? ` · ${p.location}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {reorderMode ? (
                    <>
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted disabled:opacity-30"
                        aria-label="Monter"
                      >
                        <ChevronUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === projects.length - 1}
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted disabled:opacity-30"
                        aria-label="Descendre"
                      >
                        <ChevronDown className="size-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/admin/projets/${p.slug}`}
                        className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                      >
                        Éditer
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.slug)}
                        className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
            {projects.length === 0 ? (
              <li className="p-10 text-center text-sm text-muted-foreground">
                Aucun projet pour l'instant. Créez-en un pour commencer.
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </div>
  )
}
