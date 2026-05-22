import { NextRequest, NextResponse } from 'next/server'

import { verifyAuth } from '@/lib/auth'
import type { BlogPost } from '@/lib/blog'
import { createPost, readAllPosts } from '@/lib/journal-store'

export async function GET() {
  return NextResponse.json(await readAllPosts())
}

export async function POST(request: NextRequest) {
  const { authenticated, user } = await verifyAuth(request)
  if (!authenticated || user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = (await request.json()) as Partial<BlogPost>
  if (!body.slug || !body.title) {
    return NextResponse.json({ error: 'slug et title requis' }, { status: 400 })
  }
  const post: BlogPost = {
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt ?? '',
    cover: body.cover ?? '',
    date: body.date ?? new Date().toISOString().split('T')[0],
    author: body.author ?? 'Sylvain Marceau',
    readingTime: body.readingTime ?? '4 min',
    content: body.content ?? [],
    tags: body.tags ?? [],
  }
  try {
    const created = await createPost(post)
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erreur' },
      { status: 409 }
    )
  }
}
