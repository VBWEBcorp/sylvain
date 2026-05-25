import { NextRequest, NextResponse } from 'next/server'

import { addLike, readLikes } from '@/lib/likes-store'

export const dynamic = 'force-dynamic'

// Carte complète des likes { [urlPhoto]: nombre }
export async function GET() {
  try {
    const likes = await readLikes()
    return NextResponse.json(likes)
  } catch (error) {
    // dégradation gracieuse : pas de compteurs plutôt qu'une page cassée
    console.error('Likes GET error:', error)
    return NextResponse.json({})
  }
}

// Like / unlike d'une photo : { key, delta: 1 | -1 } -> { key, count }
export async function POST(request: NextRequest) {
  let body: { key?: string; delta?: number }
  try {
    body = (await request.json()) as { key?: string; delta?: number }
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const key = typeof body.key === 'string' ? body.key.trim() : ''
  if (!key) {
    return NextResponse.json({ error: 'key requis' }, { status: 400 })
  }

  const delta = body.delta === -1 ? -1 : 1
  try {
    const count = await addLike(key, delta)
    return NextResponse.json({ key, count })
  } catch (error) {
    console.error('Likes POST error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
