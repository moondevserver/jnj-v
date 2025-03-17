import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type RootCategory {
    id: ID!
    name: String!
    mainCategories: [MainCategory!]!
  }

  type MainCategory {
    id: ID!
    name: String!
    rootCategoryId: ID!
    subCategories: [SubCategory!]!
    classes: [Class!]!
  }

  type SubCategory {
    id: ID!
    name: String!
    mainCategoryId: ID!
    classes: [Class!]!
  }

  type Class {
    id: ID!
    title: String!
    productId: String
    categoryId: String
    imageIds: [String]
    subCategoryName: String
    authorName: String
    lectures: [Lecture]
  }

  type AttachmentFile {
    name: String!
    path: String!
  }

  type Lecture {
    id: ID!
    sn: Int
    chapter: String
    title: String!
    duration: Int
    commentCount: Int
    hasMission: Boolean
    hasAttachment: Boolean
    videoPath: String
    attachments: [Attachment]
  }

  type Attachment {
    id: ID!
    name: String!
    path: String!
    size: Int
    type: String
  }

  type Query {
    rootCategories: [RootCategory!]!
    rootCategory(id: ID!): RootCategory
    mainCategories: [MainCategory!]!
    mainCategory(id: ID!): MainCategory
    subCategories(mainCategoryId: ID!): [SubCategory!]!
    subCategory(id: ID!): SubCategory
    classes: [Class!]!
    classesByCategory(categoryId: ID!): [Class!]!
    classesByMainCategory(mainCategoryId: ID!): [Class!]!
    class(id: ID!): Class
    lectures(classId: ID!): [Lecture]!
    lecture(classId: ID!, lectureId: ID!): Lecture
    searchClasses(keyword: String!): [Class!]!
    myClasses: [Class!]!
  }
` 