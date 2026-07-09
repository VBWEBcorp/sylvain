import mongoose, { Schema, Document } from 'mongoose'

export type PressKind = 'article' | 'video'

export interface IPressItem extends Document {
  kind: PressKind
  title: string
  order: number
  active: boolean
  // Champs article
  source?: string
  href?: string
  image?: string
  // Champs vidéo (YouTube)
  youtubeId?: string
  start?: number
  vertical?: boolean
  createdAt: Date
  updatedAt: Date
}

const PressItemSchema = new Schema<IPressItem>(
  {
    kind: {
      type: String,
      enum: ['article', 'video'],
      default: 'article',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    // Article
    source: String,
    href: String,
    image: String,
    // Vidéo
    youtubeId: String,
    start: { type: Number, default: 0 },
    vertical: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

export const PressItem =
  mongoose.models.PressItem ||
  mongoose.model<IPressItem>('PressItem', PressItemSchema)
