import sharp from 'sharp'

interface OptimizeOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

export async function optimizeImage(
  buffer: Buffer,
  options: OptimizeOptions = {}
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  // Côté long capé à 2560 px (et non 1080) : indispensable pour les photos
  // portrait, qui sinon perdaient en netteté dans le carrousel et la lightbox.
  const { maxWidth = 2560, maxHeight = 2560, quality = 88 } = options

  // .rotate() applique l'orientation EXIF puis la supprime : une photo prise en
  // paysage s'affiche en paysage (et non tournée), sans aucune action manuelle.
  const image = sharp(buffer).rotate()
  const metadata = await image.metadata()

  // Resize si nécessaire
  if (
    (metadata.width && metadata.width > maxWidth) ||
    (metadata.height && metadata.height > maxHeight)
  ) {
    image.resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
  }

  // Convertir en WebP
  const optimized = await image.webp({ quality }).toBuffer()

  return {
    buffer: optimized,
    contentType: 'image/webp',
    ext: 'webp',
  }
}
