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
`; 