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
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { UserRole } from '@/types/auth'

// UserWithRole 인터페이스 정의
interface UserWithRole {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

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

// 역할별 뱃지 설정 (문자열 키 사용)
const roleBadges: Record<string, { text: string, color: string }> = {
  'admin': { text: '1', color: 'bg-red-500' },
  'teacher': { text: '2', color: 'bg-yellow-500' },
  'student': { text: '3', color: 'bg-green-500' },
  'user': { text: '4', color: 'bg-gray-500' },
}

// 역할 값을 표준화하는 함수
function normalizeRole(role: string | undefined): string | undefined {
  if (!role) return undefined;
  
  // 소문자로 변환
  const lowerRole = role.toLowerCase();
  
  // 매핑 테이블 (필요한 경우)
  const roleMapping: Record<string, string> = {
    'admin': 'admin',
    'administrator': 'admin',
    'teacher': 'teacher',
    'instructor': 'teacher',
    'student': 'student',
    'learner': 'student',
    'user': 'user',
    // 필요한 다른 매핑 추가
  };
  
  return roleMapping[lowerRole] || lowerRole;
}

function UserAvatar({ user }: { user: UserWithRole }) {
  // 역할 정규화
  const normalizedRole = normalizeRole(user.role);
  
  // 상세 디버깅 정보
  console.log('User data:', user);
  console.log('Original role:', user.role);
  console.log('Normalized role:', normalizedRole);
  console.log('Available badges:', Object.keys(roleBadges));
  
  // 정규화된 역할로 뱃지 찾기
  const badge = normalizedRole ? roleBadges[normalizedRole] : undefined;
  
  // 디버깅: 뱃지 찾았는지 확인
  console.log('Found badge:', badge);

  return (
    <div className="relative">
      {user.image ? (
        <img
          src={user.image}
          alt={user.name || ''}
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-sm font-medium">
            {user.name?.[0] || '?'}
          </span>
        </div>
      )}
      {badge && (
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${badge.color} text-white text-xs flex items-center justify-center font-bold ring-2 ring-background`}>
          {badge.text}
        </div>
      )}
    </div>
  )
}

export function ClassHeader() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { data, loading, error } = useQuery<CategoryData>(GET_CATEGORIES)
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">JNJ</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
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
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form onSubmit={handleSearch} className="flex items-center">
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
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-2">
                <UserAvatar user={session.user} />
                <button
                  onClick={() => signOut()}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                className="whitespace-nowrap text-sm font-medium bg-primary text-primary-foreground px-6 py-2 rounded-md min-w-[100px] text-center shrink-0"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 