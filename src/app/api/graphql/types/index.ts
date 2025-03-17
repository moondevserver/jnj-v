export interface SubCategory {
  id: string
  name: string
  count: number
}

export interface Category {
  id: string
  name: string
  description: string
  subCategories: SubCategory[]
}

export interface Creator {
  id: string
  name: string
  avatarUrl: string
}

export interface Class {
  id: string
  title: string
  description: string
  creator: Creator
  thumbnailUrl: string
  level: string
  totalDuration: string
  languages: string[]
  audioLanguage: string
  bookmarkCount: number
  categoryId: string
  subCategoryId?: string
}

export interface Chapter {
  id: string
  classId: string
  title: string
  order: number
}

export interface Lecture {
  id: string
  classId: string
  chapterId: string
  title: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
  order: number
} 