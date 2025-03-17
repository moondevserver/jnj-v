'use client'

import { gql, useQuery } from '@apollo/client'
import { ClassHeader } from "@/components/class/class-header"
import { Clock, MessageSquare, FileText, CheckCircle } from "lucide-react"
import Link from 'next/link'
import { getClassThumbnailUrl } from "@/lib/image-utils"
import { ClassCurriculumList } from "@/components/class/class-curriculum-list"

const GET_CLASS = gql`
  query GetClass($id: ID!) {
    class(id: $id) {
      id
      title
      imageIds
      subCategoryName
      authorName
      lectures {
        id
        sn
        chapter
        title
        duration
        commentCount
        hasMission
        hasAttachment
      }
    }
  }
`

interface ClassDetailClientProps {
  classId: string
}

// 초를 시:분:초 형식으로 변환하는 함수
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}

export default function ClassDetailClient({ classId }: ClassDetailClientProps) {
  const { data, loading, error } = useQuery(GET_CLASS, {
    variables: { id: classId },
  })

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>에러가 발생했습니다: {error.message}</div>
  if (!data?.class) return <div>강의를 찾을 수 없습니다.</div>

  const classData = data.class
  const imageUrl = getClassThumbnailUrl(classData.imageIds[0])

  // 총 강의 시간과 개수 계산
  const totalDuration = classData.lectures.reduce((total: number, lecture: any) => total + lecture.duration, 0)
  const totalLectures = classData.lectures.length

  return (
    <div className="flex min-h-screen flex-col">
      <ClassHeader />
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={imageUrl}
                alt={classData.title}
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="mt-6 text-2xl font-bold">{classData.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>총 {formatDuration(totalDuration)} ({totalLectures}개 강의)</span>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold">강의 정보</h2>
              <div className="mt-2 rounded-lg border p-4">
                <p><span className="font-medium">강의 ID:</span> {classData.id}</p>
                <p><span className="font-medium">상품 ID:</span> {classData.productId}</p>
                <p><span className="font-medium">카테고리 ID:</span> {classData.categoryId}</p>
                <p><span className="font-medium">작가 ID:</span> {classData.authorName}</p>
              </div>
            </div>
          </div>
          <div>
            <ClassCurriculumList 
              classData={classData}
              formatDuration={formatDuration}
              showComments={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 