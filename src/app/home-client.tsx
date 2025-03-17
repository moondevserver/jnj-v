'use client'

import { ClassHeader } from "@/components/class/class-header"
import { ClassGrid } from '@/components/class/class-grid'
import { Library } from 'lucide-react'

export default function HomeClient() {
  return (
    <div className="flex min-h-screen flex-col">
      <ClassHeader />
      <div className="container py-8">
        <h1 className="mb-8 text-2xl font-bold flex items-center gap-2">
          <Library className="h-5 w-5" />
          모든 강의
        </h1>
        <ClassGrid isAllClasses={true} />
      </div>
    </div>
  )
} 