// Détecte si une URL de galerie pointe vers une vidéo (vs une image).
// Les vidéos sont servies telles quelles (déjà compressées) ; les images
// passent par le CDN d'optimisation.
export function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url)
}
