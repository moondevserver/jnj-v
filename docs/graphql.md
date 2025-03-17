## category

### mainCategory

query GetCategoryData($categoryId: ID!) {
    mainCategory(id: $categoryId) {
        id
        name
        subCategories {
        id
        name
        }
    }
}

{
    "categoryId": "604f1c9756c3676f1ed0030e"
}

### subCategory

query GetCategoryData($categoryId: ID!) {
    subCategory(id: $categoryId) {
        id
        name
        mainCategoryId
    }
}

{
    "categoryId": "613070fa5b76158cac88344a"
}

## class

### classesByCategory
query GetClasses($categoryId: ID!) {
  classesByCategory(categoryId: $categoryId) {
    id
    title
    imageIds
    subCategoryName
    authorName
  }
}

{
    "categoryId": "613070fa5b76158cac88344b"
}

###

query GetClasses {
  classes {
    id
    title
  }
}

### 
query GetClass($id: ID!) {
  class(id: $id) {
    id
    title
    imageIds
    subCategoryName
    authorName
    lectures {
      id
      sn
      chapter
      title
      duration
      commentCount
      hasMission
      hasAttachment
    }
  }
}

{
  "id": "5c6f91d274eabcfdafa1e5ff"
}

