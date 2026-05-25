import 'server-only'

import { connectDB } from '@/lib/db'
import { Like } from '@/models/Like'

export type LikeMap = Record<string, number>

// Carte complète des likes { [urlPhoto]: nombre } — persistée en base (MongoDB),
// donc partagée par tous les visiteurs et conservée entre les déploiements.
export async function readLikes(): Promise<LikeMap> {
  await connectDB()
  const docs = await Like.find({}, { key: 1, count: 1, _id: 0 }).lean<
    { key: string; count: number }[]
  >()
  const map: LikeMap = {}
  for (const d of docs) map[d.key] = d.count
  return map
}

// delta > 0 : +1 like, delta <= 0 : -1 like. Le compteur ne descend jamais sous 0.
export async function addLike(key: string, delta: number): Promise<number> {
  await connectDB()
  const inc = delta > 0 ? 1 : -1
  const doc = await Like.findOneAndUpdate(
    { key },
    { $inc: { count: inc } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  if (doc.count < 0) {
    doc.count = 0
    await doc.save()
  }
  return doc.count
}
