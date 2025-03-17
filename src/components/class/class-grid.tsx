'use client'

import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'
import { getClassThumbnailUrl } from "@/lib/image-utils"

const GET_CLASSES_BY_CATEGORY = gql`
  query GetClassesByCategory($categoryId: ID!) {
    classesByCategory(categoryId: $categoryId) {
      id
      title
      imageIds
      subCategoryName
      authorName
    }
  }
`

const GET_CLASSES_BY_MAIN_CATEGORY = gql`
  query GetClassesByMainCategory($mainCategoryId: ID!) {
    classesByMainCategory(mainCategoryId: $mainCategoryId) {
      id
      title
      imageIds
      subCategoryName
      authorName
    }
  }
`

const GET_ALL_CLASSES = gql`
  query GetAllClasses {
    classes {
      id
      title
      imageIds
      subCategoryName
      authorName
    }
  }
`

interface ClassGridProps {
  classes?: any[];
  categoryId?: string;
  isMainCategory?: boolean;
  isAllClasses?: boolean;
}

export function ClassGrid({ classes, categoryId, isMainCategory, isAllClasses }: ClassGridProps) {
  let query = GET_CLASSES_BY_CATEGORY;
  let variables: { categoryId?: string; mainCategoryId?: string } = { categoryId };

  if (isMainCategory) {
    query = GET_CLASSES_BY_MAIN_CATEGORY;
    variables = { mainCategoryId: categoryId };
  } else if (isAllClasses) {
    query = GET_ALL_CLASSES;
    variables = {};
  }
  
  const { data, loading, error } = useQuery(query, { 
    variables: isAllClasses ? undefined : variables,
    skip: !!classes,
    fetchPolicy: 'network-only',
  });

  if (loading) return <ClassGridSkeleton />
  if (error) return <div>에러가 발생했습니다: {error.message}</div>
  
  const displayClasses = classes || (
    isAllClasses ? data?.classes :
    isMainCategory ? data?.classesByMainCategory :
    data?.classesByCategory
  ) || [];
    
  if (displayClasses.length === 0) {
    return <div>강의가 없습니다.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {displayClasses.map((classItem: any) => {
        const imageUrl = getClassThumbnailUrl(classItem.imageIds?.[0]);
          
        return (
          <Link 
            href={`/classes/${classItem.id}`} 
            key={classItem.id}
            className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-video relative">
              <img
                src={imageUrl}
                alt={classItem.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium line-clamp-2">{classItem.title}</h3>
              <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                <span>{classItem.subCategoryName}</span>
                <span>{classItem.authorName}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  )
}

function ClassGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-0">
            <div className="aspect-video animate-pulse bg-muted" />
          </div>
          <div className="p-4">
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            <div className="mt-2 h-4 w-2/3 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="p-4 pt-0">
            <div className="h-3 w-1/2 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
} 