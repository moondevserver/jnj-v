const SEARCH_CLASSES = gql`
  query SearchClasses($keyword: String!) {
    searchClasses(keyword: $keyword) {
      id
      title
      imageIds
      subCategoryName
      authorName
    }
  }
`; 