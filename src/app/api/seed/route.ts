import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { BlogSettings } from '@/models/Blog'
import { GallerySettings } from '@/models/Gallery'

const ADMIN_EMAIL = 'sylvain@sylvainmarceau.com'
const ADMIN_PASSWORD = 'StudioM2230'
const ADMIN_NAME = 'Sylvain Marceau'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-seed-secret') ?? new URL(request.url).searchParams.get('secret')
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await connectDB()
    const results: string[] = []

    // Compte admin Sylvain
    const existing = await User.findOne({ email: ADMIN_EMAIL })
    if (existing) {
      results.push(`Compte admin déjà présent (${ADMIN_EMAIL})`)
    } else {
      await User.create({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: ADMIN_NAME,
        role: 'admin',
      })
      results.push(`Compte admin créé : ${ADMIN_EMAIL}`)
    }

    // Settings blog (Studio M)
    const blog = await BlogSettings.findOne()
    if (!blog) {
      await BlogSettings.create({
        enabled: true,
        title: 'Journal',
        eyebrow: 'Studio M',
        description: 'Réflexions, conseils et coulisses de chantiers. Le journal de Studio M, par Sylvain Marceau.',
        categories: ['Inspiration', 'Chantier', 'Conseils'],
      })
      results.push('Blog settings initialisés')
    } else {
      results.push('Blog settings déjà présents')
    }

    // Settings gallery (désactivée par défaut, /gallery n'est pas dans la nav)
    const gallery = await GallerySettings.findOne()
    if (!gallery) {
      await GallerySettings.create({
        enabled: false,
        eyebrow: 'Galerie',
        title: 'Galerie',
        description: '',
      })
      results.push('Gallery settings initialisés (désactivée)')
    } else {
      results.push('Gallery settings déjà présents')
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
