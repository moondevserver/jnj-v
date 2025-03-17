'use client'

import { Clock, FileText, CheckCircle } from "lucide-react"
import Link from 'next/link'

interface ClassCurriculumProps {
  classData: any
  currentLectureId?: string
  formatDuration: (seconds: number) => string
}

export function ClassCurriculum({ classData, currentLectureId, formatDuration }: ClassCurriculumProps) {
  // 강의를 챕터별로 그룹화
  const lecturesByChapter = classData.lectures.reduce((acc: any, lecture: any) => {
    if (!acc[lecture.chapter]) {
      acc[lecture.chapter] = []
    }
    acc[lecture.chapter].push(lecture)
    return acc
  }, {});

  return (
    <div className="sticky top-8 rounded-lg border">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">커리큘럼</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {classData.title}
        </p>
      </div>
      <div className="divide-y">
        {Object.entries(lecturesByChapter).map(([chapter, chapterLectures]: [string, any]) => (
          <div key={chapter} className="p-4">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">{chapter}</h3>
            <div className="space-y-1">
              {chapterLectures.map((lecture: any) => {
                const isCurrentLecture = lecture.id === currentLectureId;
                return (
                  <Link
                    key={lecture.id}
                    href={`/classes/${classData.id}/lectures/${lecture.id}`}
                    className={`flex items-start gap-4 rounded-lg p-3 transition-colors ${
                      isCurrentLecture 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isCurrentLecture ? 'font-medium' : ''}`}>
                          {lecture.title}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${
                        isCurrentLecture ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      }`}>
                        <span>{formatDuration(lecture.duration)}</span>
                        {lecture.hasMission && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            미션
                          </span>
                        )}
                        {lecture.hasAttachment && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            첨부파일
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 