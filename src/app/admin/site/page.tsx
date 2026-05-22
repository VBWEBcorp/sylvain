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

export default function AdminSitePage() {
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

  function patch<K extends keyof SiteContent['site']>(key: K, value: SiteContent['site'][K]) {
    setContent((prev) => (prev ? { ...prev, site: { ...prev.site, [key]: value } } : prev))
  }
  function patchAddress<K extends keyof SiteContent['site']['address']>(
    key: K,
    value: SiteContent['site']['address'][K]
  ) {
    setContent((prev) =>
      prev
        ? { ...prev, site: { ...prev.site, address: { ...prev.site.address, [key]: value } } }
        : prev
    )
  }

  return (
    <div className="p-6 pb-24 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <AdminPageHeader title="Site">
          <SaveButton onSave={save} />
        </AdminPageHeader>
        <p className="mt-3 text-sm text-muted-foreground">
          Coordonnées du studio et liens utilisés dans tout le site (footer, contact, signatures).
        </p>

        <Block title="Coordonnées">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <input
                value={content.site.email}
                onChange={(e) => patch('email', e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Téléphone">
              <input
                value={content.site.phone}
                onChange={(e) => patch('phone', e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Block>

        <Block title="Adresse">
          <Field label="Rue">
            <input
              value={content.site.address.street}
              onChange={(e) => patchAddress('street', e.target.value)}
              className={inputCls}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
            <Field label="Code postal">
              <input
                value={content.site.address.postalCode}
                onChange={(e) => patchAddress('postalCode', e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Ville">
              <input
                value={content.site.address.city}
                onChange={(e) => patchAddress('city', e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Block>

        <Block title="Réseaux">
          <Field label="Instagram (URL)">
            <input
              value={content.site.instagram}
              onChange={(e) => patch('instagram', e.target.value)}
              placeholder="https://instagram.com/…"
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
