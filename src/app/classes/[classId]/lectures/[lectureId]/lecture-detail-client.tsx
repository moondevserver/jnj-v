'use client'

import { gql, useQuery } from '@apollo/client'
import { ClassHeader } from "@/components/class/class-header"
import { Clock, MessageSquare, FileText, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { VideoPlayer } from "@/components/video/video-player"
import { ClassCurriculumList } from "@/components/class/class-curriculum-list"

const GET_CLASS_AND_LECTURE_DETAIL = gql`
  query GetClassAndLectureDetail($classId: ID!, $lectureId: ID!) {
    class(id: $classId) {
      id
      title
      imageIds
      lectures {
        id
        sn
        chapter
        title
        duration
        commentCount
        hasMission
        hasAttachment
        videoPath
        attachments {
          name
          path
        }
      }
    }
    lecture(classId: $classId, lectureId: $lectureId) {
      id
      title
      videoPath
    }
  }
`

interface LectureDetailClientProps {
  classId: string
  lectureId: string
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

export default function LectureDetailClient({ classId, lectureId }: LectureDetailClientProps) {
  const router = useRouter()
  const { data, loading, error } = useQuery(GET_CLASS_AND_LECTURE_DETAIL, {
    variables: { classId, lectureId },
  })

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>에러가 발생했습니다: {error.message}</div>
  if (!data?.class) return <div>강의를 찾을 수 없습니다.</div>

  const classData = data.class
  const lectures = classData.lectures
  
  // 현재 강의 찾기
  const currentLectureIndex = lectures.findIndex((lecture: any) => lecture.id === lectureId)
  if (currentLectureIndex === -1) {
    return <div>해당 강의를 찾을 수 없습니다.</div>
  }
  
  const currentLecture = lectures[currentLectureIndex]
  
  // 이전/다음 강의 ID 계산
  const prevLectureId = currentLectureIndex > 0 ? lectures[currentLectureIndex - 1].id : null
  const nextLectureId = currentLectureIndex < lectures.length - 1 ? lectures[currentLectureIndex + 1].id : null

  return (
    <div className="flex min-h-screen flex-col">
      <ClassHeader />
      <div className="container py-8">
        <div className="mb-4">
          <Link href={`/classes/${classId}`} className="text-sm text-muted-foreground hover:text-foreground">
            &larr; 강의 목록으로 돌아가기
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <VideoPlayer 
              classId={classId}
              lectureId={lectureId}
              title={currentLecture.title} 
            />
            <div className="mt-4 flex justify-between">
              {prevLectureId ? (
                <Link 
                  href={`/classes/${classId}/lectures/${prevLectureId}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                  이전 강의
                </Link>
              ) : (
                <div></div>
              )}
              {nextLectureId && (
                <Link 
                  href={`/classes/${classId}/lectures/${nextLectureId}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  다음 강의
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="mt-6">
              <h1 className="text-2xl font-bold">{currentLecture.title}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(currentLecture.duration)}</span>
                </div>
                {currentLecture.commentCount > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>댓글 {currentLecture.commentCount}개</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {currentLecture.hasMission && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                    <CheckCircle className="h-3 w-3" />
                    미션
                  </span>
                )}
                {currentLecture.hasAttachment && currentLecture.attachments?.length > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-500">
                    <FileText className="h-3 w-3" />
                    첨부파일
                  </span>
                )}
              </div>
              {currentLecture.hasAttachment && currentLecture.attachments?.length > 0 && (
                <div className="w-full mt-2">
                  <div className="text-sm space-y-1">
                    {currentLecture.attachments.map((file: any, index: number) => (
                      <a
                        key={index}
                        href={file.path}
                        download
                        className="block text-blue-500 hover:text-blue-600 hover:underline"
                      >
                        {file.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <ClassCurriculumList 
              classData={classData}
              currentLectureId={lectureId}
              formatDuration={formatDuration}
              showComments={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 