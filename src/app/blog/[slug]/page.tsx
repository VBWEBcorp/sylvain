import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { connectDB } from '@/lib/db'
import { BlogPost } from '@/models/Blog'
import { estimateReadingTime, formatDate } from '@/lib/blog-utils'

export const dynamic = 'force-dynamic'

type Post = {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  content: string
  publishedAt?: string
  author?: string
  tags: string[]
  metaTitle?: string
  metaDescription?: string
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    await connectDB()
    const doc = await BlogPost.findOne({ slug, published: true }).lean()
    if (!doc) return null
    const p = doc as any
    return {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      content: p.content,
      publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : undefined,
      author: p.author,
      tags: p.tags || [],
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
    }
  } catch (error) {
    console.error('Blog post fetch error:', error)
    return null
  }
}

async function getNextPost(currentSlug: string): Promise<{ slug: string; title: string } | null> {
  try {
    await connectDB()
    const posts = await BlogPost.find({ published: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .select('slug title')
      .lean()
    if (!posts.length) return null
    const idx = posts.findIndex((p: any) => p.slug === currentSlug)
    if (idx === -1) return null
    const next = posts[(idx + 1) % posts.length] as any
    return { slug: next.slug, title: next.title }
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const next = await getNextPost(post.slug)
  const readingTime = estimateReadingTime(post.content)

  // JSON-LD fourni par PHARE, injecté tel quel dans le <head>.
  // Le `<` est échappé pour ne pas casser la balise script.
  const jsonLdBrut = (post as unknown as { jsonLd?: string }).jsonLd
  const articleLd = jsonLdBrut ? jsonLdBrut.replace(/</g, '\\u003c') : null

  return (
    <>
      {articleLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleLd }} />
      )}
      <section className="relative">
        <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
          <img
            src={post.coverImage}
            alt={(post as { coverImageAlt?: string }).coverImageAlt || post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/45" />
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="mx-auto max-w-[1200px] px-6 pb-12 text-white sm:px-10 lg:px-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/75">
              {post.publishedAt ? `${formatDate(post.publishedAt)} · ` : ''}
              {readingTime}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] font-light leading-[1.05] tracking-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-cream)] py-24 sm:py-32">
        <div className="mx-auto max-w-[680px] px-6 sm:px-10">
          {post.author && (
            <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/55">
              Par {post.author}
            </p>
          )}
          <div
            className="mt-8 space-y-6 text-[16px] leading-relaxed text-foreground/85
              [&_h2]:font-display [&_h2]:text-[clamp(1.5rem,2.5vw,2.25rem)] [&_h2]:font-light [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mt-10
              [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-light [&_h3]:text-foreground [&_h3]:mt-8
              [&_a]:underline [&_a]:decoration-foreground/40 [&_a]:underline-offset-2 hover:[&_a]:decoration-foreground
              [&_strong]:font-medium [&_strong]:text-foreground
              [&_em]:italic
              [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6
              [&_li]:my-2
              [&_img]:my-8 [&_img]:w-full [&_img]:h-auto
              [&_blockquote]:border-l-2 [&_blockquote]:border-foreground/40 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-foreground/70"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {post.tags.length > 0 ? (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border/60 pt-8">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="border border-border/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground/70"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {next && (
        <section className="bg-black py-20 text-white">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-16">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">
                  Article suivant
                </p>
                <Link
                  href={`/blog/${next.slug}`}
                  className="mt-3 block font-display text-[clamp(1.5rem,3vw,2.5rem)] font-light leading-tight tracking-tight hover:italic"
                >
                  {next.title} →
                </Link>
              </div>
              <Link
                href="/blog"
                className="border-b border-white/60 pb-1 text-[12px] uppercase tracking-[0.22em] hover:border-white"
              >
                ← Tous les articles
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
