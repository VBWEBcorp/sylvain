import mongoose, { Schema, Document } from 'mongoose'

export interface ILike extends Document {
  key: string
  count: number
  createdAt: Date
  updatedAt: Date
}

const LikeSchema = new Schema<ILike>(
  {
    // identifiant de la photo (URL). Unique : un document = un compteur global.
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export const Like =
  mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema)
