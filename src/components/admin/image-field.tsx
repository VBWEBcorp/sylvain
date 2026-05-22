'use client'

import { Loader2, Trash2, UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
  label?: string
  aspect?: 'square' | 'cover' | 'portrait'
}

function authHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function ImageField({ value, onChange, label, aspect = 'cover' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  async function uploadFile(file: File) {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { ...authHeader() },
        body: form,
      })
      if (res.ok) {
        const data = await res.json()
        onChange(data.url)
      } else {
        alert('Envoi impossible.')
      }
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) uploadFile(file)
  }

  const aspectClass =
    aspect === 'square' ? 'aspect-square' : aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'

  return (
    <div>
      {label ? <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p> : null}

      {value ? (
        <div className="group relative overflow-hidden rounded-md border border-border bg-muted">
          <img src={value} alt="" className={`${aspectClass} w-full object-cover`} />
          <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-white/90 px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-white"
            >
              Changer
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="rounded-md bg-white/15 p-2 text-white hover:bg-red-500/80"
              aria-label="Retirer"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-10 text-center transition-colors ${
            dragOver ? 'border-foreground bg-foreground/5' : 'border-border bg-muted/30 hover:bg-muted/50'
          }`}
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : (
            <UploadCloud className="size-6 text-muted-foreground" />
          )}
          <p className="text-[12px] text-muted-foreground">
            {uploading ? 'Envoi…' : 'Cliquez ou glissez une photo ici'}
          </p>
        </div>
      )}

      {/* Champ URL discret pour les cas avancés */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ou collez une URL"
        className="mt-2 w-full rounded border border-border bg-background px-3 py-1.5 text-[12px] text-muted-foreground outline-none focus:border-foreground/60 focus:text-foreground"
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) uploadFile(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}
