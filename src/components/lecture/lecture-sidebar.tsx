"use client"

import { cn } from "@/lib/utils"
import { PlayCircle, Lock } from "lucide-react"

interface Chapter {
  id: string
  title: string
  lectures: Lecture[]
}

interface Lecture {
  id: string
  title: string
  duration: string
  isLocked?: boolean
  isCompleted?: boolean
}

const DUMMY_CHAPTERS: Chapter[] = [
  {
    id: "welcome",
    title: "WELCOME",
    lectures: [
      {
        id: "1",
        title: "챗GPT 온라인 자동화 수익 창출 가이드",
        duration: "01:26",
        isCompleted: true
      }
    ]
  },
  {
    id: "chapter-1",
    title: "CHAPTER 1",
    lectures: [
      {
        id: "2",
        title: "기존의 수익창출 공식은 잊어라. 챗GPT로 세상이 완전히 달라졌다!",
        duration: "10:12",
        isCompleted: true
      },
      {
        id: "3",
        title: "챗GPT를 활용한 효과적인 수익화 사례 분석하기",
        duration: "11:41",
        isCompleted: true
      },
      {
        id: "4",
        title: "일자리가 위협받는 AI 시대에 부캐가 더 중요해진 이유",
        duration: "09:17",
        isCompleted: true
      }
    ]
  },
  {
    id: "chapter-2",
    title: "CHAPTER 2",
    lectures: [
      {
        id: "5",
        title: "10년차 시장조사 분석가의 프로젝트 세팅법",
        duration: "11:10",
        isLocked: true
      },
      {
        id: "6",
        title: "고급 레벨로 브랜드 기획하고 마케팅 실행하기",
        duration: "12:02",
        isLocked: true
      }
    ]
  }
]

interface LectureSidebarProps {
  currentLectureId?: string
}

export function LectureSidebar({ currentLectureId }: LectureSidebarProps) {
  return (
    <div className="h-[calc(100vh-4rem)] w-[400px] overflow-y-auto border-l">
      <div className="p-6">
        <h2 className="text-lg font-semibold">커리큘럼</h2>
        <div className="mt-4 space-y-6">
          {DUMMY_CHAPTERS.map((chapter) => (
            <div key={chapter.id}>
              <h3 className="text-sm font-medium text-muted-foreground">
                {chapter.title}
              </h3>
              <div className="mt-2 space-y-1">
                {chapter.lectures.map((lecture) => (
                  <button
                    key={lecture.id}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                      lecture.id === currentLectureId && "bg-muted",
                      lecture.isCompleted && "text-muted-foreground"
                    )}
                  >
                    <div className="flex h-5 w-5 items-center justify-center">
                      {lecture.isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <PlayCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="line-clamp-1">{lecture.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {lecture.duration}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 