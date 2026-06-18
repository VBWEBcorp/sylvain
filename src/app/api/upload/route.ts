import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { r2Enabled, uploadToR2 } from '@/lib/r2'
import { optimizeImage } from '@/lib/optimize-image'

export async function POST(request: NextRequest) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Types autorisés (images + vidéos)
    const allowedImage = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    const isVideoFile = file.type.startsWith('video/')
    if (!allowedImage.includes(file.type) && !isVideoFile) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    // Taille max : 50MB (les originaux HD dépassent souvent 10MB, d'où des
    // envois qui échouaient). Les vidéos lourdes sont compressées en amont.
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 })
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer())
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // SVG: pas d'optimisation
    const isSvg = file.type === 'image/svg+xml'

    let finalBuffer: Buffer
    let contentType: string
    let filename: string

    if (isSvg) {
      finalBuffer = rawBuffer
      contentType = 'image/svg+xml'
      filename = `${uniqueId}.svg`
    } else if (isVideoFile) {
      // Vidéo : stockée telle quelle. Les vidéos lourdes sont compressées en
      // amont et hébergées à part (la compression serveur ne tient pas en
      // serverless). Idéal : coller une URL de vidéo déjà optimisée.
      finalBuffer = rawBuffer
      contentType = file.type || 'video/mp4'
      const ext = (file.name.split('.').pop() || 'mp4').toLowerCase()
      filename = `${uniqueId}.${ext}`
    } else {
      // Optimiser avec Sharp → WebP
      const optimized = await optimizeImage(rawBuffer)
      finalBuffer = optimized.buffer
      contentType = optimized.contentType
      filename = `${uniqueId}.${optimized.ext}`
    }

    let url: string

    if (r2Enabled) {
      // Upload vers Cloudflare R2
      url = await uploadToR2(finalBuffer, filename, contentType)
    } else {
      // Fallback: stockage local
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      await writeFile(path.join(uploadsDir, filename), finalBuffer)
      url = `/uploads/${filename}`
    }

    // Taille avant/après
    const originalSize = (rawBuffer.length / 1024).toFixed(1)
    const optimizedSize = (finalBuffer.length / 1024).toFixed(1)

    return NextResponse.json({
      url,
      filename,
      originalSize: `${originalSize} Ko`,
      optimizedSize: `${optimizedSize} Ko`,
      storage: r2Enabled ? 'cloudflare-r2' : 'local',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
