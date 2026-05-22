import { NextRequest, NextResponse } from 'next/server'

import { verifyAuth } from '@/lib/auth'
import { readContent, writeContent, type SiteContent } from '@/lib/content-store'

export async function GET() {
  const content = await readContent()
  return NextResponse.json(content)
}

export async function PUT(request: NextRequest) {
  const { authenticated, user } = await verifyAuth(request)
  if (!authenticated || user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = (await request.json()) as SiteContent
  await writeContent(body)
  return NextResponse.json(body)
}
