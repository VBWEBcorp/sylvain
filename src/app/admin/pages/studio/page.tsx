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

export default function AdminStudioPage() {
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

  function patch<K extends keyof SiteContent['studio']>(
    key: K,
    value: SiteContent['studio'][K]
  ) {
    setContent((prev) => (prev ? { ...prev, studio: { ...prev.studio, [key]: value } } : prev))
  }

  return (
    <div className="p-6 pb-24 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <AdminPageHeader title="Page Studio">
          <SaveButton onSave={save} />
        </AdminPageHeader>
        <p className="mt-3 text-sm text-muted-foreground">
          Portrait, titre et texte de présentation de Sylvain.
        </p>

        <Block title="Portrait">
          <ImageField
            value={content.studio.portrait}
            onChange={(v) => patch('portrait', v)}
            aspect="portrait"
          />
        </Block>

        <Block title="Texte">
          <Field label="Petite ligne d'introduction">
            <input
              value={content.studio.eyebrow}
              onChange={(e) => patch('eyebrow', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Titre principal">
            <textarea
              value={content.studio.title}
              onChange={(e) => patch('title', e.target.value)}
              rows={2}
              className={inputCls}
            />
          </Field>
          <Field
            label="Paragraphes du texte"
            hint="Séparez les paragraphes par une ligne vide."
          >
            <textarea
              value={content.studio.paragraphs.join('\n\n')}
              onChange={(e) =>
                patch(
                  'paragraphs',
                  e.target.value
                    .split(/\n{2,}/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              rows={8}
              className={inputCls}
            />
          </Field>
          <Field label="Signature">
            <input
              value={content.studio.signature}
              onChange={(e) => patch('signature', e.target.value)}
              className={inputCls}
            />
          </Field>
        </Block>

        <div className="mt-10 flex justify-end">
          <SaveButton onSave={save} />
        </div>
      </div>
    </div>
  )
}
