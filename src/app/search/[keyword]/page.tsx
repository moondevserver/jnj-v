import { Metadata } from "next"
import SearchResultsClient from "./search-results-client"

interface SearchPageProps {
  params: {
    keyword: string
  }
}

export function generateMetadata({ params }: SearchPageProps): Metadata {
  return {
    title: `"${decodeURIComponent(params.keyword)}" 검색 결과`,
    description: `"${decodeURIComponent(params.keyword)}" 검색 결과 페이지`,
  }
}

export default function SearchPage({ params }: SearchPageProps) {
  const decodedKeyword = decodeURIComponent(params.keyword)
  return <SearchResultsClient keyword={decodedKeyword} />
} 