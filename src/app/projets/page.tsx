import type { Metadata } from 'next'

import { JmlcStack } from '@/components/sections/jmlc-stack'
import { brandAssets } from '@/lib/brand'
import { readAll } from '@/lib/projects-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Réalisations',
  description:
    "Réalisations de Studio M : appartements et maisons rénovés sur mesure à Paris et en Île-de-France, par l'architecte d'intérieur Sylvain Marceau.",
  alternates: { canonical: '/projets' },
}

export default async function ProjectsPage() {
  const projects = await readAll()
  return (
    <>
      <section className="relative bg-white pt-28 pb-6 sm:pt-32 sm:pb-8">
        <div className="mx-auto flex max-w-[1400px] items-center px-6 sm:px-10 lg:px-16">
          <h1 className="font-display text-3xl font-light leading-none tracking-tight text-foreground sm:text-4xl">
            Réalisations
          </h1>
        </div>
        <div className="mx-auto mt-6 max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <span aria-hidden className="block h-px w-full bg-foreground/10" />
        </div>
      </section>

      <JmlcStack projects={projects} />
    </>
  )
}
