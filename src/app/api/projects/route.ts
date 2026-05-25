import { NextRequest, NextResponse } from 'next/server'

import { verifyAuth } from '@/lib/auth'
import { createProject, readAll, reorderProjects } from '@/lib/projects-store'
import type { Project } from '@/lib/projects'

export async function GET() {
  const projects = await readAll()
  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const { authenticated, user } = await verifyAuth(request)
  if (!authenticated || user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as Partial<Project>

  if (!body.slug || !body.title || !body.category) {
    return NextResponse.json(
      { error: 'slug, title et category sont requis' },
      { status: 400 }
    )
  }

  const project: Project = {
    slug: body.slug,
    title: body.title,
    category: body.category,
    location: body.location ?? '',
    year: body.year ?? new Date().getFullYear().toString(),
    surface: body.surface ?? '',
    duration: body.duration ?? '',
    cover: body.cover ?? '',
    gallery: body.gallery ?? [],
    before: body.before,
    after: body.after,
    intro: body.intro ?? '',
    description: body.description ?? [],
    services: body.services ?? [],
    credits: body.credits ?? [],
    comingSoon: body.comingSoon ?? false,
    shootingDate: body.shootingDate ?? '',
  }

  try {
    const created = await createProject(project)
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur interne'
    return NextResponse.json({ error: message }, { status: 409 })
  }
}

// PATCH pour réordonner via tableau de slugs { order: string[] }
export async function PATCH(request: NextRequest) {
  const { authenticated, user } = await verifyAuth(request)
  if (!authenticated || user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { order } = (await request.json()) as { order: string[] }
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: 'order doit être un tableau' }, { status: 400 })
  }
  const reordered = await reorderProjects(order)
  return NextResponse.json(reordered)
}
