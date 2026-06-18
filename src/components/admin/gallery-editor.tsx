'use client'

import {
  Image as ImageIcon,
  Link2,
  Loader2,
  RectangleHorizontal,
  RectangleVertical,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { isVideo } from '@/lib/media'
import type { PhotoOrientation } from '@/lib/projects'

type Props = {
  value: string[]
  onChange: (next: string[]) => void
  // Orientation forcée par URL de photo. Absente = « auto » (ratio naturel).
  orientations?: Record<string, PhotoOrientation>
  onOrientationChange?: (url: string, orientation: PhotoOrientation | 'auto') => void
  label?: string
  helpText?: string
}

function authHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function GalleryEditor({
  value,
  onChange,
  orientations,
  onOrientationChange,
  label = 'Photos',
  helpText = 'Glissez vos photos ou vidéos ici, parcourez votre ordinateur, ou collez une URL. Les vidéos sont automatiquement compressées.',
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [bulkUrls, setBulkUrls] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function uploadFile(file: File): Promise<string | null> {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { ...authHeader() },
      body: form,
    })
    if (!res.ok) {
      if (res.status === 401) {
        setError(
          'Votre session a expiré. Redirection vers la page de connexion…'
        )
        // Token mort : on le purge et on renvoie vers la connexion pour que le
        // client se reconnecte proprement (plutôt que de buter sur des 401).
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
        setTimeout(() => {
          window.location.href = '/admin/login'
        }, 1500)
      } else {
        const err = await res.json().catch(() => ({}))
        setError(`Échec de l'envoi de « ${file.name} »${err?.error ? ` : ${err.error}` : ''}.`)
      }
      console.error('Upload failed', res.status)
      return null
    }
    const data = await res.json()
    return data.url as string
  }

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
    )
    if (list.length === 0) return
    setError(null)
    setUploading((c) => c + list.length)
    try {
      const results = await Promise.all(list.map((f) => uploadFile(f)))
      const urls = results.filter((u): u is string => !!u)
      if (urls.length > 0) {
        onChange([...value, ...urls])
      }
    } finally {
      setUploading((c) => Math.max(0, c - list.length))
    }
  }

  function handleDropExternal(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    if (dragIndex !== null) return // c'est un drag de réordonnancement
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  function move(from: number, to: number) {
    if (from === to) return
    const next = [...value]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }

  function addBulk() {
    const urls = bulkUrls
      .split(/\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    if (urls.length === 0) return
    onChange([...value, ...urls])
    setBulkUrls('')
  }

  return (
    <div>
      {label ? (
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-xs font-medium">{label}</p>
          <p className="text-[11px] text-muted-foreground">
            {value.length} photo{value.length > 1 ? 's' : ''}
          </p>
        </div>
      ) : null}

      {/* Zone de drop + bouton parcourir */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (dragIndex === null) setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDropExternal}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragOver
            ? 'border-foreground bg-foreground/5'
            : 'border-border bg-muted/30 hover:bg-muted/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <UploadCloud className="size-7 text-muted-foreground" />
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-[var(--brand-cream)] transition-opacity hover:opacity-90"
          >
            Choisir des photos ou vidéos
          </button>
        </div>
        <p className="max-w-sm text-[12px] text-muted-foreground">{helpText}</p>
        {uploading > 0 ? (
          <p className="inline-flex items-center gap-2 text-[12px] text-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            {uploading} photo{uploading > 1 ? 's' : ''} en cours d'envoi…
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
          {error}
        </p>
      ) : null}

      {/* Coller des URLs */}
      <details className="mt-3">
        <summary className="inline-flex cursor-pointer items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground">
          <Link2 className="size-3.5" />
          Coller des URLs (avancé)
        </summary>
        <div className="mt-3 flex flex-col gap-2 rounded-md border border-border bg-background p-3">
          <textarea
            value={bulkUrls}
            onChange={(e) => setBulkUrls(e.target.value)}
            rows={3}
            placeholder="https://exemple.com/photo1.jpg&#10;https://exemple.com/photo2.jpg"
            className="w-full resize-none rounded border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-foreground/60"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addBulk}
              disabled={!bulkUrls.trim()}
              className="rounded-md bg-foreground px-3 py-1.5 text-[12px] text-[var(--brand-cream)] disabled:opacity-40"
            >
              Ajouter
            </button>
          </div>
        </div>
      </details>

      {/* Grille des photos */}
      {value.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
          <ImageIcon className="size-7" />
          <p className="text-[13px]">Aucune photo pour l'instant.</p>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 items-start gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((src, i) => {
            const orient = orientations?.[src]
            return (
            <li
              key={src + i}
              draggable
              onDragStart={(e) => {
                setDragIndex(i)
                e.dataTransfer.effectAllowed = 'move'
              }}
              onDragOver={(e) => {
                e.preventDefault()
                if (dragIndex !== null) setOverIndex(i)
              }}
              onDragEnd={() => {
                if (dragIndex !== null && overIndex !== null) {
                  move(dragIndex, overIndex)
                }
                setDragIndex(null)
                setOverIndex(null)
              }}
              onDrop={(e) => {
                e.preventDefault()
                if (dragIndex !== null) move(dragIndex, i)
                setDragIndex(null)
                setOverIndex(null)
              }}
              className={`group ${dragIndex === i ? 'opacity-50' : ''}`}
            >
              {/* Aperçu au ratio choisi : portrait 3:4, paysage 3:2, auto 3:4 */}
              <div
                className={`relative overflow-hidden rounded-md border bg-muted transition-all ${
                  orient === 'paysage' ? 'aspect-[3/2]' : 'aspect-[3/4]'
                } ${
                  overIndex === i && dragIndex !== null && dragIndex !== i
                    ? 'border-foreground ring-2 ring-foreground/40'
                    : 'border-border'
                }`}
              >
                {isVideo(src) ? (
                  <video
                    src={src}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full cursor-grab object-cover"
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <img src={src} alt="" className="h-full w-full cursor-grab object-cover" />
                )}

                {/* Numéro d'ordre */}
                <span className="absolute top-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  {i + 1}
                </span>

                {/* Cover badge */}
                {i === 0 ? (
                  <span className="absolute top-2 right-2 rounded-full bg-[var(--brand-cream)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-foreground/80">
                    Cover
                  </span>
                ) : null}

                {/* Actions */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-1">
                    <IconBtn
                      title="Mettre en premier (cover)"
                      onClick={() => move(i, 0)}
                      disabled={i === 0}
                    >
                      ★
                    </IconBtn>
                    <IconBtn title="Reculer" onClick={() => move(i, Math.max(0, i - 1))} disabled={i === 0}>
                      ←
                    </IconBtn>
                    <IconBtn
                      title="Avancer"
                      onClick={() => move(i, Math.min(value.length - 1, i + 1))}
                      disabled={i === value.length - 1}
                    >
                      →
                    </IconBtn>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="rounded-full bg-white/15 p-1.5 text-white hover:bg-red-500/80"
                    aria-label="Supprimer la photo"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Cadrage dans le carrousel du site : auto / portrait / paysage */}
              {onOrientationChange ? (
                <div className="mt-1.5 flex items-center justify-center gap-1">
                  <OrientBtn
                    active={!orient}
                    title="Auto : la photo garde son ratio naturel"
                    onClick={() => onOrientationChange(src, 'auto')}
                  >
                    Auto
                  </OrientBtn>
                  <OrientBtn
                    active={orient === 'portrait'}
                    title="Afficher en portrait (cadre vertical)"
                    onClick={() => onOrientationChange(src, 'portrait')}
                  >
                    <RectangleVertical className="size-3.5" />
                  </OrientBtn>
                  <OrientBtn
                    active={orient === 'paysage'}
                    title="Afficher en paysage (cadre horizontal)"
                    onClick={() => onOrientationChange(src, 'paysage')}
                  >
                    <RectangleHorizontal className="size-3.5" />
                  </OrientBtn>
                </div>
              ) : null}
            </li>
            )
          })}
        </ul>
      )}

      {value.length > 1 ? (
        <p className="mt-3 text-[11px] italic text-muted-foreground">
          Astuce : glissez-déposez une photo pour la réorganiser. La première sert de cover.
          {onOrientationChange
            ? ' Les boutons sous chaque photo choisissent son cadrage sur le site : auto (ratio naturel), portrait ou paysage.'
            : ''}
        </p>
      ) : null}
    </div>
  )
}

function OrientBtn({
  children,
  onClick,
  title,
  active,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  active: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`inline-flex h-6 min-w-7 items-center justify-center rounded-md border px-1.5 text-[10px] font-medium transition-colors ${
        active
          ? 'border-foreground bg-foreground text-[var(--brand-cream)]'
          : 'border-border bg-background text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}

function IconBtn({
  children,
  onClick,
  title,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="inline-flex size-7 items-center justify-center rounded-full bg-white/15 text-[12px] text-white transition-colors hover:bg-white/30 disabled:opacity-30"
    >
      {children}
    </button>
  )
}
