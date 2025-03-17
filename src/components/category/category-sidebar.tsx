'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SubCategory {
  id: string
  name: string
}

interface CategorySidebarProps {
  mainCategoryId: string
  mainCategoryName: string
  subCategories: SubCategory[]
  selectedSubCategoryId: string | null
}

export function CategorySidebar({ 
  mainCategoryId, 
  mainCategoryName,
  subCategories,
  selectedSubCategoryId
}: CategorySidebarProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{mainCategoryName}</h2>
      <div className="space-y-1">
        <Link 
          href={`/categories/${mainCategoryId}`}
          className={cn(
            "block rounded-md px-3 py-2 text-sm font-medium",
            !selectedSubCategoryId 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-muted"
          )}
        >
          전체
        </Link>
        {subCategories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className={cn(
              "block rounded-md px-3 py-2 text-sm font-medium",
              selectedSubCategoryId === category.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  )
} 