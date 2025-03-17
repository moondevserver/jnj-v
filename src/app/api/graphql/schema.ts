export const typeDefs = `#graphql
  type Class {
    id: ID!
    classId: String!
    title: String!
    imageIds: [String!]!
    subCategoryName: String
    authorName: String
    lectures: [Lecture!]!
  }

  type Lecture {
    id: ID!
    sn: Int!
    chapter: String!
    title: String!
    duration: Int!
    commentCount: Int!
    hasMission: Boolean!
    hasAttachment: Boolean!
    videoPath: String
    attachments: [Attachment!]!
  }

  type Attachment {
    name: String!
    path: String!
  }

  type Query {
    classes: [Class!]!
    class(id: ID!): Class
    classesByMainCategory(mainCategoryId: ID!): [Class!]!
    lecture(classId: ID!, lectureId: ID!): Lecture
    searchClasses(keyword: String!): [Class!]!
    search(keyword: String!): [Class!]!
    classesByCategory(categoryId: ID!): [Class!]!
  }
` 