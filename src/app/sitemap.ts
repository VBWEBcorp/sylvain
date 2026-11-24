import type { MetadataRoute } from 'next'

import { connectDB } from '@/lib/db'
import { BlogPost } from '@/models/Blog'
import { siteConfig } from '@/lib/seo'

// Rendu a la demande : revalidatePath("/sitemap.xml") ne purge pas le cache des
// routes de metadonnees, un article depose ou retire par PHARE n y apparaitrait
// qu au prochain build.
export const dynamic = 'force-dynamic'

const baseUrl = siteConfig.url

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    {
      url: `${baseUrl}/projets`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Les réalisations n'ont pas de page individuelle : elles vivent toutes sur /projets. Les adresses
  // /projets/<code> répondaient 404 et n'ont rien à faire ici.

  // Articles de blog (MongoDB)
  try {
    await connectDB()
    const posts = await BlogPost.find({ published: true }).select('slug publishedAt updatedAt').lean()
    for (const post of posts) {
      const p = post as any
      pages.push({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: new Date(p.updatedAt || p.publishedAt || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  } catch (error) {
    console.error('Sitemap blog error:', error)
  }

  return pages
}
