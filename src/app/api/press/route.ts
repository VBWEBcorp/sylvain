import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { PressItem } from '@/models/Press'
import { verifyAuth } from '@/lib/auth'

// GET tous les éléments de presse (public - actifs uniquement)
export async function GET() {
  try {
    await connectDB()
    const items = await PressItem.find({ active: true }).sort({ order: 1, createdAt: -1 })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Press items error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST créer un élément de presse (admin uniquement)
export async function POST(request: NextRequest) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const kind = body.kind === 'video' ? 'video' : 'article'

    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (kind === 'article' && !body.href) {
      return NextResponse.json(
        { error: "Le lien de l'article est requis" },
        { status: 400 }
      )
    }

    if (kind === 'video' && !body.youtubeId) {
      return NextResponse.json(
        { error: "L'identifiant YouTube est requis" },
        { status: 400 }
      )
    }

    const item = await PressItem.create({
      kind,
      title: body.title,
      order: body.order || 0,
      active: body.active ?? true,
      source: body.source,
      href: body.href,
      image: body.image,
      youtubeId: body.youtubeId,
      start: body.start || 0,
      vertical: body.vertical ?? false,
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Press item creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
