import 'server-only'

import { connectDB } from '@/lib/db'
import { ProjectModel } from '@/models/Project'
import { projects as defaultProjects, type Project } from '@/lib/projects'

// Convertit un document Mongo (lean ou hydraté) vers la forme `Project` plate
// attendue par le front — on retire _id, __v, order, timestamps pour que les
// réponses API restent identiques à l'ancien stockage fichier.
function toPlain(d: Record<string, unknown>): Project {
  const credits = Array.isArray(d.credits)
    ? (d.credits as { name: string; url?: string }[]).map((c) => ({
        name: c.name,
        ...(c.url ? { url: c.url } : {}),
      }))
    : []
  return {
    slug: d.slug as string,
    title: d.title as string,
    category: d.category as Project['category'],
    location: (d.location as string) ?? '',
    year: (d.year as string) ?? '',
    surface: (d.surface as string) ?? '',
    duration: (d.duration as string) ?? '',
    cover: (d.cover as string) ?? '',
    gallery: (d.gallery as string[]) ?? [],
    before: (d.before as string) || undefined,
    after: (d.after as string) || undefined,
    intro: (d.intro as string) ?? '',
    description: (d.description as string[]) ?? [],
    services: (d.services as string[]) ?? [],
    credits,
    comingSoon: (d.comingSoon as boolean) ?? false,
    shootingDate: (d.shootingDate as string) ?? '',
  }
}

// Sème la collection une seule fois à partir des projets par défaut si elle est
// vide (équivalent de l'ancien ensureFile). Idempotent : l'index unique sur slug
// empêche les doublons en cas de seed concurrent.
let seeded = false
async function ensureSeeded(): Promise<void> {
  await connectDB()
  if (seeded) return
  const count = await ProjectModel.estimatedDocumentCount()
  if (count === 0) {
    try {
      await ProjectModel.insertMany(
        defaultProjects.map((p, i) => ({ ...p, order: i })),
        { ordered: false }
      )
    } catch {
      // ignore les erreurs de clé dupliquée (seed concurrent)
    }
  }
  seeded = true
}

export async function readAll(): Promise<Project[]> {
  await ensureSeeded()
  const docs = await ProjectModel.find().sort({ order: 1, createdAt: 1 }).lean()
  return docs.map((d) => toPlain(d as Record<string, unknown>))
}

export async function readOne(slug: string): Promise<Project | null> {
  await ensureSeeded()
  const doc = await ProjectModel.findOne({ slug }).lean()
  return doc ? toPlain(doc as Record<string, unknown>) : null
}

export async function createProject(project: Project): Promise<Project> {
  await ensureSeeded()
  const exists = await ProjectModel.exists({ slug: project.slug })
  if (exists) {
    throw new Error(`Un projet avec le slug "${project.slug}" existe déjà.`)
  }
  // Nouveau projet en tête de liste : order = (plus petit order) - 1
  const first = await ProjectModel.findOne().sort({ order: 1 }).select('order').lean<{
    order?: number
  }>()
  const order = first ? (first.order ?? 0) - 1 : 0
  const created = await ProjectModel.create({ ...project, order })
  return toPlain(created.toObject())
}

export async function updateProject(
  slug: string,
  patch: Partial<Project>
): Promise<Project | null> {
  await ensureSeeded()
  const updated = await ProjectModel.findOneAndUpdate(
    { slug },
    { $set: patch },
    { new: true }
  ).lean()
  return updated ? toPlain(updated as Record<string, unknown>) : null
}

export async function deleteProject(slug: string): Promise<boolean> {
  await ensureSeeded()
  const res = await ProjectModel.deleteOne({ slug })
  return res.deletedCount > 0
}

export async function reorderProjects(slugs: string[]): Promise<Project[]> {
  await ensureSeeded()
  const ops = slugs.map((slug, i) => ({
    updateOne: { filter: { slug }, update: { $set: { order: i } } },
  }))
  if (ops.length > 0) await ProjectModel.bulkWrite(ops)
  return readAll()
}
