'use client'

import { useEffect, useState } from 'react'

import {
  AdminPageHeader,
  Block,
  Field,
  SaveButton,
  authHeader,
  inputCls,
} from '@/components/admin/admin-form'
import { ImageField } from '@/components/admin/image-field'
import type { SiteContent } from '@/lib/content-store'

export default function AdminAccueilPage() {
  const [content, setContent] = useState<SiteContent | null>(null)

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then((r) => r.json())
      .then(setContent)
  }, [])

  async function save() {
    if (!content) return
    await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(content),
    })
  }

  if (!content) return <p className="p-10 text-sm text-muted-foreground">Chargement…</p>

  return (
    <div className="p-6 pb-24 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <AdminPageHeader title="Page d'accueil">
          <SaveButton onSave={save} />
        </AdminPageHeader>
        <p className="mt-3 text-sm text-muted-foreground">
          Photo plein écran qui s'affiche derrière le logo en arrivant sur le site.
        </p>

        <Block title="Hero">
          <Field label="Petite ligne d'introduction (au-dessus du logo)">
            <input
              value={content.home.eyebrow}
              onChange={(e) =>
                setContent({ ...content, home: { ...content.home, eyebrow: e.target.value } })
              }
              className={inputCls}
            />
          </Field>
          <div>
            <p className="mb-2 text-xs font-medium">Photo plein écran</p>
            <ImageField
              value={content.home.heroImage}
              onChange={(v) =>
                setContent({ ...content, home: { ...content.home, heroImage: v } })
              }
              aspect="cover"
            />
          </div>
        </Block>

        <div className="mt-10 flex justify-end">
          <SaveButton onSave={save} />
        </div>
      </div>
    </div>
  )
}
