'use client'

import { gql, useQuery } from '@apollo/client'
import { ClassHeader } from "@/components/class/class-header"
import { ClassGrid } from "@/components/class/class-grid"
import { CategorySidebar } from "@/components/category/category-sidebar"
import { useEffect, useState } from 'react'

const GET_CATEGORY_DATA = gql`
  query GetCategoryData($categoryId: ID!) {
    mainCategory(id: $categoryId) {
      id
      name
      subCategories {
        id
        name
      }
    }
    subCategory(id: $categoryId) {
      id
      name
      mainCategoryId
    }
  }
`

const GET_SUBCATEGORIES = gql`
  query GetSubCategories($mainCategoryId: ID!) {
    mainCategory(id: $mainCategoryId) {
      id
      name
    }
    subCategories(mainCategoryId: $mainCategoryId) {
      id
      name
    }
  }
`

interface CategoryPageClientProps {
  categoryId: string
}

export default function CategoryPageClient({ categoryId }: CategoryPageClientProps) {
  // 클라이언트 사이드 렌더링을 위한 상태 추가
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 클라이언트 사이드에서만 쿼리 실행
  const { data, loading, error } = useQuery(GET_CATEGORY_DATA, {
    variables: { categoryId },
    skip: !isMounted, // 클라이언트 사이드에서만 쿼리 실행
  });

  // 현재 카테고리가 서브 카테고리인 경우
  const isSubCategory = data?.subCategory && !data?.mainCategory
  
  // 서브 카테고리인 경우 메인 카테고리 ID를 가져옴
  const mainCategoryId = isSubCategory ? data?.subCategory?.mainCategoryId : categoryId
  
  // 메인 카테고리 ID로 서브 카테고리 목록 조회
  const { data: subCategoriesData } = useQuery(GET_SUBCATEGORIES, {
    variables: { mainCategoryId },
    skip: !mainCategoryId || !isMounted, // 클라이언트 사이드에서만 쿼리 실행
  });

  // 서버 사이드 렌더링 중에는 로딩 상태 표시
  if (!isMounted) return <div>로딩 중...</div>;
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다: {error.message}</div>;

  const mainCategory = data?.mainCategory || subCategoriesData?.mainCategory;
  const subCategories = data?.mainCategory?.subCategories || subCategoriesData?.subCategories || [];
  
  // 현재 선택된 카테고리 ID (메인 카테고리면 null, 서브 카테고리면 해당 ID)
  const selectedSubCategoryId = isSubCategory ? categoryId : null;

  return (
    <div className="flex min-h-screen flex-col">
      <ClassHeader />
      <div className="container grid grid-cols-5 gap-6 py-8">
        <div className="col-span-1">
          <CategorySidebar 
            mainCategoryId={mainCategoryId} 
            mainCategoryName={mainCategory?.name || ''}
            subCategories={subCategories}
            selectedSubCategoryId={selectedSubCategoryId}
          />
        </div>
        <div className="col-span-4">
          <h1 className="text-2xl font-bold mb-6">
            {isSubCategory ? data?.subCategory?.name : mainCategory?.name}
          </h1>
          <ClassGrid 
            categoryId={selectedSubCategoryId || mainCategoryId} 
            isMainCategory={!isSubCategory}
          />
        </div>
      </div>
    </div>
  )
} 