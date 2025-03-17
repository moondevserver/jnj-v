'use client'

import { gql, useQuery } from '@apollo/client'
import { ClassGrid } from '@/components/class/class-grid'
import { useState } from 'react'
import { cn } from "@/lib/utils"

const GET_MY_CLASSES = gql`
  query GetMyClasses {
    myClasses {
      id
      title
      imageIds
      subCategoryName
      authorName
    }
  }
`

type TabType = 'continue' | 'library';

export function MyClassesClient() {
  const [activeTab, setActiveTab] = useState<TabType>('continue')
  const { data, loading, error } = useQuery(GET_MY_CLASSES)

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>에러가 발생했습니다: {error.message}</div>

  const classes = data?.myClasses || []
  
  if (classes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">수강 중인 클래스가 없습니다.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex space-x-1 rounded-lg bg-muted p-1">
        <button
          onClick={() => setActiveTab('continue')}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
            activeTab === 'continue' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:bg-background/50"
          )}
        >
          이어보기
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
            activeTab === 'library' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:bg-background/50"
          )}
        >
          내 보관함
        </button>
      </div>

      <ClassGrid 
        classes={classes} 
        // 직접 데이터를 전달하고 쿼리는 건너뛰도록 설정
      />
    </div>
  )
} 