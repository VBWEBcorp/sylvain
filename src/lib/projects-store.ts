import 'server-only'

import { promises as fs } from 'fs'
import path from 'path'

import { projects as defaultProjects, type Project } from '@/lib/projects'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'projects.json')

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultProjects, null, 2), 'utf8')
  }
}

export async function readAll(): Promise<Project[]> {
  try {
    await ensureFile()
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw) as Project[]
    if (!Array.isArray(parsed)) return defaultProjects
    return parsed
  } catch {
    return defaultProjects
  }
}

export async function writeAll(projects: Project[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2), 'utf8')
}

export async function readOne(slug: string): Promise<Project | null> {
  const all = await readAll()
  return all.find((p) => p.slug === slug) ?? null
}

export async function createProject(project: Project): Promise<Project> {
  const all = await readAll()
  if (all.some((p) => p.slug === project.slug)) {
    throw new Error(`Un projet avec le slug "${project.slug}" existe déjà.`)
  }
  const next = [project, ...all]
  await writeAll(next)
  return project
}

export async function updateProject(
  slug: string,
  patch: Partial<Project>
): Promise<Project | null> {
  const all = await readAll()
  const idx = all.findIndex((p) => p.slug === slug)
  if (idx === -1) return null
  const updated = { ...all[idx], ...patch } as Project
  all[idx] = updated
  await writeAll(all)
  return updated
}

export async function deleteProject(slug: string): Promise<boolean> {
  const all = await readAll()
  const next = all.filter((p) => p.slug !== slug)
  if (next.length === all.length) return false
  await writeAll(next)
  return true
}

export async function reorderProjects(slugs: string[]): Promise<Project[]> {
  const all = await readAll()
  const map = new Map(all.map((p) => [p.slug, p]))
  const reordered: Project[] = []
  for (const s of slugs) {
    const p = map.get(s)
    if (p) {
      reordered.push(p)
      map.delete(s)
    }
  }
  // les restants (pas dans slugs) sont concaténés à la fin
  for (const p of map.values()) reordered.push(p)
  await writeAll(reordered)
  return reordered
}
