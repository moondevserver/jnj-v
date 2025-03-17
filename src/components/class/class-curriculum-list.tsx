'use client'

import { Clock, MessageSquare, FileText, CheckCircle } from "lucide-react"
import Link from 'next/link'

interface ClassCurriculumListProps {
  classData: any
  currentLectureId?: string
  formatDuration: (seconds: number) => string
  showComments?: boolean
}

export function ClassCurriculumList({ 
  classData, 
  currentLectureId, 
  formatDuration,
  showComments = true 
}: ClassCurriculumListProps) {
  const totalDuration = classData.lectures.reduce((total: number, lecture: any) => total + lecture.duration, 0)
  const totalLectures = classData.lectures.length

  // 강의를 챕터별로 그룹화
  const lecturesByChapter = classData.lectures.reduce((acc: any, lecture: any) => {
    if (!acc[lecture.chapter]) {
      acc[lecture.chapter] = []
    }
    acc[lecture.chapter].push(lecture)
    return acc
  }, {})

  return (
    <div className="sticky top-8 rounded-lg border">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">커리큘럼</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          총 {totalLectures}개 강의 · {formatDuration(totalDuration)}
        </p>
      </div>
      <div className="max-h-[600px] overflow-y-auto p-4">
        {Object.entries(lecturesByChapter).map(([chapter, lectures]: [string, any]) => (
          <div key={chapter} className="mb-6 last:mb-0">
            <h3 className="mb-2 font-medium">{chapter}</h3>
            <ul className="space-y-3">
              {lectures.map((lecture: any) => {
                const isCurrentLecture = lecture.id === currentLectureId;
                return (
                  <Link 
                    href={`/classes/${classData.id}/lectures/${lecture.id}`}
                    key={lecture.id}
                  >
                    <li className={`rounded-md border p-3 transition-colors hover:bg-muted/50 ${
                      isCurrentLecture 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    } cursor-pointer`}>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isCurrentLecture ? 'font-semibold' : 'font-medium'}`}>
                          {lecture.sn}. {lecture.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDuration(lecture.duration)}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {lecture.hasMission && (
                          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            <CheckCircle className="h-3 w-3" />
                            미션
                          </span>
                        )}
                        {lecture.hasAttachment && (
                          <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-500">
                            <FileText className="h-3 w-3" />
                            첨부파일
                          </span>
                        )}
                        {showComments && lecture.commentCount > 0 && (
                          <span className="flex items-center gap-1 rounded-full bg-gray-500/10 px-2 py-0.5 text-xs text-gray-500">
                            <MessageSquare className="h-3 w-3" />
                            {lecture.commentCount}
                          </span>
                        )}
                      </div>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 