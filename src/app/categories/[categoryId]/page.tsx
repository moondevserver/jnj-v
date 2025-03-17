import { Metadata } from "next"
import CategoryPageClient from "./category-page-client"
import { gql } from "@apollo/client"

export const metadata: Metadata = {
  title: "카테고리",
  description: "카테고리 페이지",
}

interface CategoryPageProps {
  params: {
    categoryId: string
  }
}

const GET_CLASSES = gql`
  query GetClasses($categoryId: ID!) {
    classesByCategory(categoryId: $categoryId) {
      id
      title
      imageIds
      subCategoryName
      authorName
    }
  }
`;

export default async function CategoryPage(props: CategoryPageProps) {
  // Next.js 15에서는 props를 통해 params에 접근
  const { params } = props;
  
  // 비동기 작업을 수행하여 params가 준비되었음을 확인
  await Promise.resolve();
  
  return (
    <CategoryPageClient 
      categoryId={String(params.categoryId)} 
    />
  )
}