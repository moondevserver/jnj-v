import { Metadata } from "next"
import { MyClassesClient } from './my-classes-client'
import { ClassHeader } from "@/components/class/class-header"

export const metadata: Metadata = {
  title: "내 클래스",
  description: "내가 수강 중인 클래스 목록",
}

export default function MyClassesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <ClassHeader />
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">내 클래스</h1>
        <MyClassesClient />
      </div>
    </div>
  )
} 