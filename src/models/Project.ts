import mongoose, { Schema, Document } from 'mongoose'

export interface IProject extends Document {
  slug: string
  title: string
  category: string
  location: string
  year: string
  surface: string
  duration: string
  cover: string
  gallery: string[]
  before?: string
  after?: string
  intro: string
  description: string[]
  services: string[]
  credits: { name: string; url?: string }[]
  comingSoon: boolean
  shootingDate: string
  order: number
  createdAt: Date
  updatedAt: Date
}

const CreditSchema = new Schema(
  {
    name: { type: String, default: '' },
    url: { type: String },
  },
  { _id: false }
)

const ProjectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Appartement' },
    location: { type: String, default: '' },
    year: { type: String, default: '' },
    surface: { type: String, default: '' },
    duration: { type: String, default: '' },
    cover: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    before: { type: String },
    after: { type: String },
    intro: { type: String, default: '' },
    description: { type: [String], default: [] },
    services: { type: [String], default: [] },
    credits: { type: [CreditSchema], default: [] },
    comingSoon: { type: Boolean, default: false },
    shootingDate: { type: String, default: '' },
    // Ordre d'affichage (MongoDB n'a pas d'ordre implicite). Plus petit = en premier.
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const ProjectModel =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
