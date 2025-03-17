import { Metadata } from "next"
import ClassDetailClient from "./class-detail-client"
import { gql } from "@apollo/client"

export const metadata: Metadata = {
  title: "강의 상세",
  description: "강의 상세 페이지",
}

interface ClassDetailPageProps {
  params: {
    classId: string
  }
}

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
`;

export default function ClassDetailPage({ params }: ClassDetailPageProps) {
  return <ClassDetailClient classId={params.classId} />
} 