import { Metadata } from "next"
import LectureDetailClient from "./lecture-detail-client"

export const metadata: Metadata = {
  title: "강의 재생",
  description: "강의 재생 페이지",
}

interface LectureDetailPageProps {
  params: {
    classId: string
    lectureId: string
  }
}

export default function LectureDetailPage({ params }: LectureDetailPageProps) {
  return <LectureDetailClient classId={params.classId} lectureId={params.lectureId} />
} 