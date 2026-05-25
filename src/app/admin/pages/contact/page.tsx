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
import type { SiteContent } from '@/lib/content-store'

export default function AdminContactPage() {
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

  function patch<K extends keyof SiteContent['contact']>(
    key: K,
    value: SiteContent['contact'][K]
  ) {
    setContent((prev) => (prev ? { ...prev, contact: { ...prev.contact, [key]: value } } : prev))
  }

  return (
    <div className="p-6 pb-24 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <AdminPageHeader title="Page Contact">
          <SaveButton onSave={save} />
        </AdminPageHeader>
        <p className="mt-3 text-sm text-muted-foreground">
          Textes affichés sur la page contact (les coordonnées se gèrent dans <em>Coordonnées</em>).
        </p>

        <Block title="Colonne info (fond noir)">
          <Field label="Petite ligne au-dessus du titre">
            <input
              value={content.contact.eyebrow}
              onChange={(e) => patch('eyebrow', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Titre principal">
            <textarea
              value={content.contact.title}
              onChange={(e) => patch('title', e.target.value)}
              rows={2}
              className={inputCls}
            />
          </Field>
          <Field label="Paragraphe d'introduction">
            <textarea
              value={content.contact.intro}
              onChange={(e) => patch('intro', e.target.value)}
              rows={3}
              className={inputCls}
            />
          </Field>
        </Block>

        <Block title="Colonne formulaire">
          <Field label="Petite ligne au-dessus du formulaire">
            <input
              value={content.contact.formIntro}
              onChange={(e) => patch('formIntro', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Titre du formulaire">
            <input
              value={content.contact.formTitle}
              onChange={(e) => patch('formTitle', e.target.value)}
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
