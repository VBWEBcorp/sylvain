import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { defaultBlogPosts, formatDate, getPost } from '@/lib/blog'

export function generateStaticParams() {
  return defaultBlogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.cover],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const idx = defaultBlogPosts.findIndex((p) => p.slug === post.slug)
  const next = defaultBlogPosts[(idx + 1) % defaultBlogPosts.length]

  return (
    <>
      <section className="relative">
        <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
          <img src={post.cover} alt={post.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/45" />
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="mx-auto max-w-[1200px] px-6 pb-12 text-white sm:px-10 lg:px-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/75">
              {formatDate(post.date)} · {post.readingTime}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] font-light leading-[1.05] tracking-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-cream)] py-24 sm:py-32">
        <div className="mx-auto max-w-[680px] px-6 sm:px-10">
          <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/55">
            Par {post.author}
          </p>
          <div className="mt-8 space-y-6 text-[16px] leading-relaxed text-foreground/85">
            {post.content.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'font-display text-[clamp(1.3rem,2vw,1.7rem)] font-light leading-relaxed text-foreground'
                    : ''
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
          {post.tags && post.tags.length > 0 ? (
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
    </>
  )
}
