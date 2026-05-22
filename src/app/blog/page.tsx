import type { Metadata } from 'next'
import Link from 'next/link'

import { brandAssets } from '@/lib/brand'
import { defaultBlogPosts, formatDate } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Journal',
  description:
    "Réflexions, conseils et coulisses de chantiers. Le journal de Studio M, par Sylvain Marceau.",
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  const [featured, ...rest] = defaultBlogPosts
  return (
    <>
      {/* Bandeau compact */}
      <section className="bg-[var(--brand-cream)] pt-28 pb-6 sm:pt-32 sm:pb-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 sm:px-10 lg:px-16">
          <h1 className="font-display text-3xl font-light leading-none tracking-tight text-foreground sm:text-4xl">
            Journal
          </h1>
          <nav aria-label="Sections du site" className="flex items-center gap-5 sm:gap-7">
            <Link
              href="/projets"
              className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-foreground sm:text-[12px]"
            >
              Réalisations
            </Link>
            <span aria-hidden className="h-3 w-px bg-foreground/30" />
            <Link
              href="/contact"
              className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-foreground sm:text-[12px]"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="mx-auto mt-6 max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <span aria-hidden className="block h-px w-full bg-foreground/10" />
        </div>
      </section>

      {/* Article en vedette */}
      {featured ? (
        <section className="bg-[var(--brand-cream)] pt-12 pb-16 sm:pt-16 sm:pb-20">
          <Link
            href={`/blog/${featured.slug}`}
            className="group mx-auto block max-w-[1200px] px-6 sm:px-10 lg:px-16"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src={featured.cover}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
              />
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/55">
                  {formatDate(featured.date)} · {featured.readingTime}
                </p>
                <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.75rem,3.5vw,3rem)] font-light leading-tight tracking-tight text-foreground">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/65">
                  {featured.excerpt}
                </p>
              </div>
              <span className="border-b border-foreground/60 pb-1 text-[12px] uppercase tracking-[0.2em] text-foreground transition-colors group-hover:border-foreground">
                Lire l'article →
              </span>
            </div>
          </Link>
        </section>
      ) : null}

      {/* Liste des autres articles */}
      <section className="bg-[var(--brand-cream)] pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/55">
            Tous les articles
          </p>
          <ul className="mt-8 grid gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
            {rest.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-foreground/55">
                    {formatDate(p.date)} · {p.readingTime}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-light leading-tight text-foreground sm:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-foreground/65">
                    {p.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
