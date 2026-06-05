// Optimisation d'images à la volée via wsrv.nl (CDN gratuit) :
// redimensionne + recompresse + sert en WebP. Indispensable pour les
// photos hébergées en pleine résolution (ibb.co), qui peuvent peser
// plus de 10 Mo à l'origine. Une image lourde tombe ainsi à ~200-300 Ko.
//
// Les URLs non http(s) (uploads locaux, data URIs) sont laissées intactes.
export function optimizedImage(
  url: string,
  { width, quality = 78 }: { width: number; quality?: number }
): string {
  if (!url || !/^https?:\/\//i.test(url)) return url
  const params = new URLSearchParams({
    url,
    w: String(width),
    q: String(quality),
    output: 'webp',
    we: '', // sans agrandissement : on ne sur-échantillonne jamais
  })
  return `https://wsrv.nl/?${params.toString()}`
}
