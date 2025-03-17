'use client'

import { gql, useQuery } from '@apollo/client'
import { ClassHeader } from "@/components/class/class-header"
import Link from 'next/link'
import { Search } from 'lucide-react'
import { getClassThumbnailUrl } from "@/lib/image-utils"

const SEARCH_CLASSES = gql`
  query SearchClasses($keyword: String!) {
    searchClasses(keyword: $keyword) {
      id
      title
      imageIds
    }
  }
`

interface SearchResultsClientProps {
  keyword: string
}

export default function SearchResultsClient({ keyword }: SearchResultsClientProps) {
  const { data, loading, error } = useQuery(SEARCH_CLASSES, {
    variables: { keyword },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <ClassHeader />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-5 w-5" />
            "{keyword}" 검색 결과
          </h1>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">검색 중...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive">검색 중 오류가 발생했습니다: {error.message}</p>
          </div>
        )}

        {!loading && !error && data?.searchClasses?.length === 0 && (
          <div className="rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">"{keyword}"에 대한 검색 결과가 없습니다.</p>
            <p className="mt-2 text-sm text-muted-foreground">다른 검색어로 다시 시도해보세요.</p>
          </div>
        )}

        {!loading && !error && data?.searchClasses?.length > 0 && (
          <>
            <p className="mb-4 text-muted-foreground">총 {data.searchClasses.length}개의 강의를 찾았습니다.</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.searchClasses.map((classItem: any) => {
                const imageUrl = getClassThumbnailUrl(classItem.imageIds?.[0]);
                
                return (
                  <Link 
                    href={`/classes/${classItem.id}`} 
                    key={classItem.id}
                    className="block overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="aspect-video bg-muted">
                      <img
                        src={imageUrl}
                        alt={classItem.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-medium">{classItem.title}</h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
} 