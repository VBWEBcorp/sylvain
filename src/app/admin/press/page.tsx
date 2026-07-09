'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Check, X, ArrowLeft, Newspaper, Youtube, Download } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageField } from '@/components/admin/field-editor'
import { cn } from '@/lib/utils'

type PressKind = 'article' | 'video'

interface PressItem {
  _id: string
  kind: PressKind
  title: string
  order: number
  active: boolean
  source?: string
  href?: string
  image?: string
  youtubeId?: string
  start?: number
  vertical?: boolean
}

const emptyForm = {
  kind: 'article' as PressKind,
  title: '',
  order: 0,
  source: '',
  href: '',
  image: '',
  youtubeId: '',
  start: 0,
  vertical: false,
}

// Contenu actuellement en dur sur la page /presse — importable en un clic.
const SEED_ITEMS = [
  {
    kind: 'article' as PressKind,
    source: 'Sloft Magazine',
    title: 'Un appartement en trois villes',
    href: 'https://www.sloft-magazine.com/le-magazine/visite-guidee/un-appartement-en-trois-villes/',
    image: '/presse/sloft-trois-villes.webp',
    order: 1,
  },
  {
    kind: 'video' as PressKind,
    title: 'Reportage vidéo',
    youtubeId: 'IwU2mV35wfc',
    vertical: false,
    order: 2,
  },
  {
    kind: 'video' as PressKind,
    title: 'Format court',
    youtubeId: 'Ug9QKUk2Oq4',
    vertical: true,
    order: 3,
  },
  {
    kind: 'article' as PressKind,
    source: 'Sloft Magazine',
    title: 'Coup double à Paris : 36 m² qui jouent sur tous les tableaux',
    href: 'https://www.sloft-magazine.com/le-magazine/visite-guidee/coup-double-a-paris-36-m%c2%b2-qui-jouent-sur-tous-les-tableaux/',
    image: '/presse/sloft-coup-double.webp',
    order: 4,
  },
]

export default function AdminPressPage() {
  const router = useRouter()
  const [items, setItems] = useState<PressItem[]>([])
  const [form, setForm] = useState({ ...emptyForm })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      router.push('/admin/login')
    }
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/press')
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load press:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const authHeaders = () => {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  const handleAdd = async () => {
    if (!form.title) {
      alert('Le titre est requis')
      return
    }
    if (form.kind === 'article' && !form.href) {
      alert("Le lien de l'article est requis")
      return
    }
    if (form.kind === 'video' && !form.youtubeId) {
      alert("L'identifiant de la vidéo YouTube est requis")
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/press', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const item = await res.json()
        setItems([...items, item])
        setForm({ ...emptyForm })
        alert('✅ Élément ajouté')
      } else {
        const data = await res.json()
        alert('❌ ' + (data.error || 'Erreur'))
      }
    } catch (error) {
      alert('❌ Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet élément ?')) return
    try {
      const res = await fetch(`/api/press/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (res.ok) {
        setItems(items.filter((it) => it._id !== id))
      }
    } catch {
      alert('❌ Erreur lors de la suppression')
    }
  }

  const handleToggle = async (item: PressItem) => {
    try {
      const res = await fetch(`/api/press/${item._id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ active: !item.active }),
      })
      if (res.ok) {
        setItems(items.map((it) => (it._id === item._id ? { ...it, active: !it.active } : it)))
      }
    } catch {
      alert('❌ Erreur')
    }
  }

  const handleImportSeed = async () => {
    if (!confirm('Importer les articles et vidéos actuellement affichés sur le site ?')) return
    setSaving(true)
    try {
      const created: PressItem[] = []
      for (const seed of SEED_ITEMS) {
        const res = await fetch('/api/press', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(seed),
        })
        if (res.ok) created.push(await res.json())
      }
      setItems([...items, ...created])
      alert(`✅ ${created.length} élément(s) importé(s)`)
    } catch (error) {
      alert('❌ Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 pt-8 md:pt-0">
        <Link
          href="/admin/dashboard"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-lg font-bold text-foreground">Presse</h1>
      </div>

      <p className="text-sm text-muted-foreground max-w-2xl -mt-2">
        Gérez les articles de presse et les reportages vidéo affichés sur la page{' '}
        <Link href="/presse" target="_blank" className="text-primary underline underline-offset-2">
          /presse
        </Link>
        . Les éléments sont affichés dans l&apos;ordre croissant du champ « Ordre ».
      </p>

      {/* Import du contenu actuel (si vide) */}
      {items.length === 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 py-5">
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Démarrer avec le contenu existant</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Importez les 2 articles Sloft Magazine et les 2 reportages vidéo déjà présents sur le site.
              </p>
            </div>
            <Button onClick={handleImportSeed} disabled={saving} className="gap-2 shrink-0">
              <Download className="size-4" />
              {saving ? 'Import...' : 'Importer le contenu actuel'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Formulaire d'ajout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-4" />
            Ajouter un élément
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Choix du type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, kind: 'article' })}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  form.kind === 'article'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/50 text-muted-foreground hover:text-foreground'
                )}
              >
                <Newspaper className="size-4" />
                Article de presse
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, kind: 'video' })}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  form.kind === 'video'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/50 text-muted-foreground hover:text-foreground'
                )}
              >
                <Youtube className="size-4" />
                Reportage vidéo
              </button>
            </div>
          </div>

          {form.kind === 'article' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="source">Source / Média</Label>
                <Input
                  id="source"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  placeholder="Ex : Sloft Magazine, AD, Marie Claire Maison..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l&apos;article</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Titre affiché sous la vignette"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="href">Lien vers l&apos;article</Label>
                <Input
                  id="href"
                  value={form.href}
                  onChange={(e) => setForm({ ...form, href: e.target.value })}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              <ImageField
                label="Capture / visuel de l'article"
                value={form.image}
                onChange={(v) => setForm({ ...form, image: v })}
              />
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Titre / Légende</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex : Reportage vidéo, Format court..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtubeId">Identifiant YouTube</Label>
                <Input
                  id="youtubeId"
                  value={form.youtubeId}
                  onChange={(e) => setForm({ ...form, youtubeId: e.target.value })}
                  placeholder="Ex : IwU2mV35wfc"
                />
                <p className="text-[11px] text-muted-foreground/70">
                  Dans une URL comme youtube.com/watch?v=<strong>IwU2mV35wfc</strong>, l&apos;identifiant est la
                  partie après « v= ».
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.vertical}
                  onChange={(e) => setForm({ ...form, vertical: e.target.checked })}
                  className="size-4 accent-[var(--primary)]"
                />
                <span className="text-sm text-muted-foreground">
                  Format vertical (Short / 9:16)
                </span>
              </label>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="order">Ordre d&apos;affichage</Label>
            <Input
              id="order"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              placeholder="0"
              className="max-w-[140px]"
            />
            <p className="text-[11px] text-muted-foreground/70">
              Plus le nombre est petit, plus l&apos;élément apparaît tôt sur la page.
            </p>
          </div>

          <Button onClick={handleAdd} disabled={saving} className="w-full">
            {saving ? 'Ajout...' : 'Ajouter'}
          </Button>
        </CardContent>
      </Card>

      {/* Liste */}
      <Card>
        <CardHeader>
          <CardTitle>Éléments ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition"
                >
                  {/* Vignette */}
                  <div className="size-14 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    {item.kind === 'article' && item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    ) : item.kind === 'video' ? (
                      <Youtube className="size-5 text-muted-foreground" />
                    ) : (
                      <Newspaper className="size-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
                          item.kind === 'article'
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-red-500/10 text-red-600'
                        )}
                      >
                        {item.kind === 'article' ? 'Article' : 'Vidéo'}
                      </span>
                      {item.source && (
                        <span className="text-xs text-primary">{item.source}</span>
                      )}
                      <span className="text-[10px] text-muted-foreground/60">#{item.order}</span>
                    </div>
                    <p className="font-medium text-foreground truncate mt-0.5">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.kind === 'article' ? item.href : `YouTube : ${item.youtubeId}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleToggle(item)}
                      title={item.active ? 'Masquer' : 'Afficher'}
                    >
                      {item.active ? (
                        <Check className="size-4 text-primary" />
                      ) : (
                        <X className="size-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button size="icon-sm" variant="ghost" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Aucun élément de presse</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
