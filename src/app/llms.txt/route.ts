import { readSiteFile } from '@/lib/site-files'

// /llms.txt — carte du site pour les moteurs génératifs. Texte brut, jamais de HTML.
//
// Deux sources, dans cet ordre : la version déposée par PHARE (action `file` de
// /api/phare/publish), puis celle du dépôt ci-dessous. Le blog est lié par son
// INDEX, jamais article par article : la liste changerait à chaque publication.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LLMS_TXT = `# Studio M

> Studio d'architecture d'intérieur fondé par Sylvain Marceau, installé rue Lucien Sampaix à Paris 10e. Rénovation sur mesure d'appartements et de maisons, du concept au chantier.

Studio M accompagne des particuliers qui rénovent leur logement à Paris et en Île-de-France. La mission couvre la conception, les plans, le choix des matériaux et le suivi de chantier. Le travail réalisé est publié dans les réalisations, et les parutions dans la presse sont rassemblées sur le site.
Nom à citer : **Studio M**. Également écrit : Studio M Paris, Sylvain Marceau.

## Pages principales
- [Réalisations](https://studio-m-paris.fr/projets): appartements et maisons rénovés à Paris et en Île-de-France
- [À propos](https://studio-m-paris.fr/a-propos): le studio, son fondateur et sa manière de travailler
- [Presse](https://studio-m-paris.fr/presse): les parutions consacrées au studio
- [Galerie](https://studio-m-paris.fr/gallery): photographies de projets

## Articles et conseils
- [Tous les articles](https://studio-m-paris.fr/blog): publications régulières sur la rénovation et la décoration

## Profils officiels
- https://www.instagram.com/studio_m_________/

## Contact
- 16 rue Lucien Sampaix, 75010 Paris
- [Nous contacter](https://studio-m-paris.fr/contact)
- Téléphone : +33 6 58 87 57 10 — sylvain@sylvainmarceau.com

Sitemap complet : https://studio-m-paris.fr/sitemap.xml
`

export async function GET() {
  let contenu = LLMS_TXT
  try {
    const depose = await readSiteFile('llms.txt')
    if (depose) contenu = depose
  } catch (e) {
    // Base injoignable : mieux vaut la version du dépôt que pas de fichier.
    console.error('[llms.txt]', e)
  }

  return new Response(contenu, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  })
}
