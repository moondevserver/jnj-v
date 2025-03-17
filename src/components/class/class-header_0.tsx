'use client'

import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useState, FormEvent } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const GET_CATEGORIES = gql`
  query GetCategories {
    rootCategories {
      id
      name
      mainCategories {
        id
        name
      }
    }
  }
`

interface CategoryData {
  rootCategories: {
    id: string
    name: string
    mainCategories: {
      id: string
      name: string
    }[]
  }[]
}

export function ClassHeader() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { data, loading, error } = useQuery<CategoryData>(GET_CATEGORIES)
  const [isOpen, setIsOpen] = useState(false)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-fit min-h-16 flex-wrap items-center py-2">
        <div className="flex w-full flex-wrap items-center gap-6">
          <div className="flex flex-1 items-center gap-6 md:flex-none">
            <Link href="/" className="font-bold text-xl shrink-0">
              JNJ
            </Link>
            <nav className="hidden md:flex gap-6">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-foreground/80">
                  카테고리
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="w-[1200px] p-6"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <div className="grid grid-cols-8 gap-8">
                    {data?.rootCategories.map((rootCategory) => (
                      <div key={rootCategory.id} className="col-span-1">
                        <div className="font-medium mb-3 whitespace-nowrap">{rootCategory.name}</div>
                        <div className="space-y-2">
                          {rootCategory.mainCategories.map((mainCategory) => (
                            <Link 
                              key={mainCategory.id}
                              href={`/categories/${mainCategory.id}`}
                              className="block text-sm text-muted-foreground hover:text-foreground min-w-[120px]"
                              onClick={() => setIsOpen(false)}
                            >
                              {mainCategory.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/my-classes" className="text-sm font-medium transition-colors hover:text-foreground/80">
                내 강의
              </Link>
            </nav>
          </div>
          
          <div className="flex w-full flex-wrap items-center gap-4 md:flex-1 md:justify-end">
            <form onSubmit={handleSearch} className="flex-1 md:w-[400px] md:flex-none">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="강의 검색..."
                  className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </form>
            <Link 
              href="/login" 
              className="whitespace-nowrap text-sm font-medium bg-primary text-primary-foreground px-6 py-2 rounded-md min-w-[100px] text-center shrink-0"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
} 