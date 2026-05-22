import 'server-only'

import { promises as fs } from 'fs'
import path from 'path'

import { defaultBlogPosts, type BlogPost } from '@/lib/blog'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'journal.json')

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultBlogPosts, null, 2), 'utf8')
  }
}

export async function readAllPosts(): Promise<BlogPost[]> {
  try {
    await ensureFile()
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw) as BlogPost[]
    return Array.isArray(parsed) ? parsed : defaultBlogPosts
  } catch {
    return defaultBlogPosts
  }
}

export async function writeAllPosts(posts: BlogPost[]) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8')
}

export async function readPost(slug: string): Promise<BlogPost | null> {
  const all = await readAllPosts()
  return all.find((p) => p.slug === slug) ?? null
}

export async function createPost(post: BlogPost): Promise<BlogPost> {
  const all = await readAllPosts()
  if (all.some((p) => p.slug === post.slug)) {
    throw new Error(`Un article avec le slug "${post.slug}" existe déjà.`)
  }
  await writeAllPosts([post, ...all])
  return post
}

export async function updatePost(
  slug: string,
  patch: Partial<BlogPost>
): Promise<BlogPost | null> {
  const all = await readAllPosts()
  const idx = all.findIndex((p) => p.slug === slug)
  if (idx === -1) return null
  const updated = { ...all[idx], ...patch }
  all[idx] = updated
  await writeAllPosts(all)
  return updated
}

export async function deletePost(slug: string): Promise<boolean> {
  const all = await readAllPosts()
  const next = all.filter((p) => p.slug !== slug)
  if (next.length === all.length) return false
  await writeAllPosts(next)
  return true
}
