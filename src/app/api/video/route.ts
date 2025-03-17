import { NextRequest, NextResponse } from 'next/server'
import { getVideoApiUrl } from '@/utils/class101'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const classId = searchParams.get('classId')
  const lectureId = searchParams.get('lectureId')

  if (!classId || !lectureId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const apiPath = getVideoApiUrl(classId, lectureId)
  return NextResponse.json({ apiPath })
} 