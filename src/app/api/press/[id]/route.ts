import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { PressItem } from '@/models/Press'
import { verifyAuth } from '@/lib/auth'
import { Types } from 'mongoose'

type Params = Promise<{ id: string }>

// GET un élément de presse
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params
    await connectDB()

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const item = await PressItem.findById(id)
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Press item error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT mettre à jour un élément (admin uniquement)
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await request.json()
    const update: Record<string, unknown> = {}
    for (const key of [
      'kind',
      'title',
      'order',
      'active',
      'source',
      'href',
      'image',
      'youtubeId',
      'start',
      'vertical',
    ]) {
      if (body[key] !== undefined) update[key] = body[key]
    }

    const item = await PressItem.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Press item update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE supprimer un élément (admin uniquement)
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const item = await PressItem.findByIdAndDelete(id)

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Item deleted' })
  } catch (error) {
    console.error('Press item delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
