import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { r2Enabled, getPresignedUploadUrl } from '@/lib/r2'

// Garde-fou large : le fichier ne passe pas par cette fonction (juste une URL
// pré-signée est renvoyée), mais on refuse les tailles absurdes côté client.
const MAX_SIZE = 300 * 1024 * 1024 // 300 Mo

export async function POST(request: NextRequest) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!r2Enabled) {
      return NextResponse.json({ error: 'Stockage R2 non configuré' }, { status: 500 })
    }

    const body = await request.json().catch(() => null)
    const filename: unknown = body?.filename
    const contentType: unknown = body?.contentType
    const size: unknown = body?.size

    if (typeof filename !== 'string' || typeof contentType !== 'string') {
      return NextResponse.json({ error: 'filename et contentType requis' }, { status: 400 })
    }

    const isImage = contentType.startsWith('image/')
    const isVideoType = contentType.startsWith('video/')
    if (!isImage && !isVideoType) {
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 400 })
    }

    if (typeof size === 'number' && size > MAX_SIZE) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 300 Mo)' }, { status: 400 })
    }

    // Clé unique et propre (on ne réutilise pas le nom d'origine, qui peut
    // contenir des caractères problématiques comme « © »).
    const ext = (filename.split('.').pop() || (isVideoType ? 'mp4' : 'bin'))
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const key = `${uniqueId}.${ext || 'bin'}`

    const { uploadUrl, publicUrl } = await getPresignedUploadUrl(key, contentType)
    return NextResponse.json({ uploadUrl, publicUrl, key })
  } catch (error) {
    console.error('Presign error:', error)
    return NextResponse.json({ error: 'Presign failed' }, { status: 500 })
  }
}
