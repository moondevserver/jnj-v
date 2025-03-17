import fs from 'fs'
import path from 'path'
import { getVideoApiUrl, getFilePaths } from '@/utils/class101'
import { loadJson } from 'jnu-abc'
import { DATA_ROOT_PATH } from '@/config'

interface MainCategoryData {
  categoryId0: string
  title0: string
  categoryId: string
  title: string
}

interface SubCategoryData {
  ancestorId: string
  categoryId: string
  title: string
}

interface ClassData {
  title: string
  classId: string
  productId: string
  categoryId: string
  authorId: string
  step: string
  imageId?: string
  imageIds?: string[]
}

interface LectureData {
  sn: number
  chapter: string
  title: string
  duration: number
  commentCount: number
  hasMission: boolean
  hasAttachment: boolean
  lectureId: string
  subtitles: Array<{ lang: string, name: string }>
  attachments: string[]
}

interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
}

const findSubCategoryName = (categoryId: string, env: any): { subCategoryName: string } => {
  try {
    const categories = loadJson(`${env.DATA_ROOT_PATH}/class101/json/categories.json`);
    
    // 모든 메인 카테고리를 순회
    for (const mainCategory of categories) {
      // 메인 카테고리와 일치하는지 확인
      if (mainCategory.id === categoryId) {
        return { subCategoryName: mainCategory.name };
      }
      
      // 서브 카테고리 확인
      if (mainCategory.subCategories) {
        const subCategory = mainCategory.subCategories.find(sub => sub.id === categoryId);
        if (subCategory) {
          return { subCategoryName: subCategory.name };
        }
      }
    }
    
    return { subCategoryName: '' };
  } catch (error) {
    console.error('Error in findSubCategoryName:', error);
    return { subCategoryName: '' };
  }
};

const loadMainCategories = (): MainCategoryData[] => {
  const dataPath = path.join(process.env.DATA_ROOT_PATH || '', 'class101/json/mainCategories.json')
  const rawData = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(rawData)
}

const loadSubCategories = (): SubCategoryData[] => {
  const dataPath = path.join(process.env.DATA_ROOT_PATH || '', 'class101/json/subCategories.json')
  const rawData = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(rawData)
}

const loadClasses = (): ClassData[] => {
  const dataPath = path.join(process.env.DATA_ROOT_PATH || '', 'class101/json/myclasses.json')
  const rawData = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(rawData)
}

const loadLectures = (classId: string): LectureData[] => {
  try {
    const dataPath = path.join(process.env.DATA_ROOT_PATH || '', `class101/json/classes/${classId}.json`)
    const rawData = fs.readFileSync(dataPath, 'utf-8')
    return JSON.parse(rawData)
  } catch (error) {
    console.error(`Error loading lectures for class ${classId}:`, error)
    return []
  }
}

const mainCategoriesData = loadMainCategories()
const subCategoriesData = loadSubCategories()
const classesData = loadClasses()

const rootCategories = Array.from(new Set(mainCategoriesData.map((item: MainCategoryData) => item.categoryId0))).map(id => ({
  id,
  name: mainCategoriesData.find((item: MainCategoryData) => item.categoryId0 === id)?.title0 || '',
}))

const mainCategories = mainCategoriesData.map((item: MainCategoryData) => ({
  id: item.categoryId,
  name: item.title,
  rootCategoryId: item.categoryId0,
}))

const subCategories = subCategoriesData.map((item: SubCategoryData) => ({
  id: item.categoryId,
  name: item.title,
  mainCategoryId: item.ancestorId,
}))

const classes = classesData.map((item: ClassData) => ({
  id: item.classId,
  title: item.title,
  productId: item.productId,
  categoryId: item.categoryId,
  authorId: item.authorId,
  step: item.step,
  imageId: item.imageId,
  imageIds: item.imageIds || [],
}))

interface MainCategory {
  id: string
  name: string
  rootCategoryId: string
}

interface SubCategory {
  id: string
  name: string
  mainCategoryId: string
}

interface Class {
  id: string
  title: string
  productId: string
  categoryId: string
  authorId: string
  step: string
  imageId?: string
  imageIds?: string[]
}

interface Lecture {
  id: string
  sn: number
  chapter: string
  title: string
  duration: number
  commentCount: number
  hasMission: boolean
  hasAttachment: boolean
  videoPath: string
  attachments: string[]
}

// 클래스 데이터 매핑을 위한 공통 함수
const mapClassData = (c: any) => ({
  id: c.classId,
  title: c.title,
  productId: c.productId || null,
  categoryId: c.categoryId || null,
  authorId: c.authorId || null,
  step: c.step || null,
  imageId: Array.isArray(c.imageIds) && c.imageIds.length > 0 ? c.imageIds[0] : null,
  imageIds: Array.isArray(c.imageIds) ? c.imageIds : []
});

export const resolvers = {
  Query: {
    rootCategories: () => rootCategories,
    rootCategory: (_: unknown, { id }: { id: string }) => 
      rootCategories.find(c => c.id === id),
    mainCategories: () => mainCategories,
    mainCategory: (_: unknown, { id }: { id: string }) => 
      mainCategories.find((c: MainCategory) => c.id === id),
    subCategories: (_: unknown, { mainCategoryId }: { mainCategoryId: string }) => 
      subCategories.filter((sc: SubCategory) => sc.mainCategoryId === mainCategoryId),
    subCategory: (_: unknown, { id }: { id: string }) => 
      subCategories.find((sc: SubCategory) => sc.id === id),
    classes: async (_: any, __: any, context: any) => {
      try {
        const { env } = context;
        const classes = loadJson(`${env.DATA_ROOT_PATH}/class101/json/myclasses.json`);
        const creators = loadJson(`${env.DATA_ROOT_PATH}/class101/json/creators.json`);
        
        return classes.map((c: any) => {
          let authorName = '';
          if (c.authorId) {
            const creator = creators.find((creator: any) => creator.authorId === c.authorId);
            authorName = creator?.authorName || '';
          }
          
          const category = findSubCategoryName(c.categoryId, env);
          
          return {
            id: c.classId,
            title: c.title,
            imageIds: Array.isArray(c.imageIds) ? c.imageIds : [],
            subCategoryName: category.subCategoryName,
            authorName
          };
        });

      } catch (error) {
        console.error('Error in classes resolver:', error);
        return [];
      }
    },
    classesByCategory: async (_: any, { categoryId }: { categoryId: string }, context: any) => {
      try {
        const { env } = context;
        const classes = loadJson(`${env.DATA_ROOT_PATH}/class101/json/myclasses.json`);
        const creators = loadJson(`${env.DATA_ROOT_PATH}/class101/json/creators.json`);
        
        console.log('Searching for categoryId:', categoryId);
        console.log('Available categoryIds:', classes.map((c: any) => c.categoryId));
        
        const filteredClasses = classes.filter((c: any) => c.categoryId === categoryId);
        
        console.log('Found classes:', filteredClasses.length);
        
        return filteredClasses.map((c: any) => {
          let authorName = '';
          if (c.authorId) {
            const creator = creators.find((creator: any) => creator.authorId === c.authorId);
            authorName = creator?.authorName || '';
          }
          
          const category = findSubCategoryName(c.categoryId, env);
          
          return {
            ...c,
            id: c.classId,
            subCategoryName: category.subCategoryName,
            authorName
          };
        });
      } catch (error) {
        console.error('Error in classesByCategory:', error);
        return [];
      }
    },
    class: (_: unknown, { id }: { id: string }) => {
      const myclasses = loadClasses();
      const classData = myclasses.find((c: any) => c.classId === id);
      if (!classData) return null;
      return mapClassData(classData);
    },
    classesByMainCategory: async (_: any, { mainCategoryId }: { mainCategoryId: string }, context: any) => {
      try {
        const { env } = context;
        console.log('Finding classes for main category:', mainCategoryId);

        const classes = loadJson(`${env.DATA_ROOT_PATH}/class101/json/myclasses.json`);
        const creators = loadJson(`${env.DATA_ROOT_PATH}/class101/json/creators.json`);
        const categories = loadJson(`${env.DATA_ROOT_PATH}/class101/json/categories.json`);

        // 메인 카테고리에 속한 모든 서브카테고리 ID 찾기
        const mainCategory = categories.find((cat: any) => cat.id === mainCategoryId);
        console.log('Found main category:', mainCategory?.name);
        
        if (!mainCategory) {
          console.log('Main category not found');
          return [];
        }

        const subCategoryIds = mainCategory.subCategories?.map((sub: any) => sub.id) || [];
        subCategoryIds.push(mainCategoryId); // 메인 카테고리 ID도 포함
        console.log('Category IDs to search:', subCategoryIds);

        // 해당 카테고리들에 속한 모든 강의 필터링
        const filteredClasses = classes.filter((c: any) => subCategoryIds.includes(c.categoryId));
        console.log('Found classes count:', filteredClasses.length);

        return filteredClasses.map((c: any) => {
          let authorName = '';
          if (c.authorId) {
            const creator = creators.find((creator: any) => creator.authorId === c.authorId);
            authorName = creator?.authorName || '';
          }
          
          const category = findSubCategoryName(c.categoryId, env);
          
          return {
            id: c.classId,
            classId: c.classId,
            title: c.title,
            imageIds: Array.isArray(c.imageIds) ? c.imageIds : [],
            subCategoryName: category.subCategoryName,
            authorName
          };
        });

      } catch (error) {
        console.error('Error in classesByMainCategory:', error);
        return [];
      }
    },
    lectures: (_: any, { classId }: { classId: string }) => {
      const lectures = loadJson(`${process.env.DATA_ROOT_PATH}/class101/json/classes/${classId}.json`);
      return lectures.map((lecture: any) => ({
        ...lecture,
        id: lecture.lectureId,
        videoPath: `/api/stream/${classId}/${lecture.lectureId}`,
        attachments: lecture.attachments?.map((attachment: any) => ({
          id: attachment.id,
          name: attachment.name,
          path: `/api/files/${classId}/${lecture.lectureId}/${attachment.name}`,
          size: attachment.size,
          type: attachment.type
        })) || []
      }));
    },
    searchClasses: async (_: any, { keyword }: { keyword: string }, context: any) => {
      try {
        console.log('Searching with keyword:', keyword)
        const { env } = context;

        // 클래스 목록과 작성자 정보 로드
        const classes = loadJson(`${env.DATA_ROOT_PATH}/class101/json/myclasses.json`);
        const creators = loadJson(`${env.DATA_ROOT_PATH}/class101/json/creators.json`);
        
        if (!Array.isArray(classes)) {
          console.error('Invalid classes data:', typeof classes)
          return []
        }

        // 검색 결과 필터링 및 매핑
        return classes
          .filter(c => c?.title?.toLowerCase().includes(keyword.toLowerCase()))
          .map(c => {
            let authorName = '';
            if (c.authorId) {
              const creator = creators.find((creator: any) => creator.authorId === c.authorId);
              authorName = creator?.authorName || '';
            }
            
            const category = findSubCategoryName(c.categoryId, env);
            
            return {
              id: c.classId,
              classId: c.classId,
              title: c.title,
              imageIds: Array.isArray(c.imageIds) ? c.imageIds : [],
              subCategoryName: category.subCategoryName,
              authorName
            };
          });

      } catch (error) {
        console.error('Search error:', error)
        return []
      }
    },
    myClasses: async (_: any, __: any, context: any) => {
      try {
        const { env } = context;
        const classes = loadJson(`${env.DATA_ROOT_PATH}/class101/json/myclasses.json`);
        const creators = loadJson(`${env.DATA_ROOT_PATH}/class101/json/creators.json`);

        return classes.map((c: any) => {
          let authorName = '';
          if (c.authorId) {
            const creator = creators.find((creator: any) => creator.authorId === c.authorId);
            authorName = creator?.authorName || '';
          }
          
          const category = findSubCategoryName(c.categoryId, env);
          
          return {
            id: c.classId,
            title: c.title,
            imageIds: Array.isArray(c.imageIds) ? c.imageIds : [],
            subCategoryName: category.subCategoryName,
            authorName
          };
        });

      } catch (error) {
        console.error('Error in myClasses:', error);
        return [];
      }
    },
    lecture: async (_: any, { classId, lectureId }: { classId: string, lectureId: string }, context: any) => {
      try {
        const { env } = context;
        const lectures = loadJson(`${env.DATA_ROOT_PATH}/class101/json/classes/${classId}.json`);
        const lecture = lectures.find((l: any) => l.lectureId === lectureId);
        
        if (!lecture) {
          return null;
        }

        return {
          ...lecture,
          id: lecture.lectureId,
          videoPath: `/api/stream/${classId}/${lecture.lectureId}`,
          attachments: lecture.attachments?.map((attachment: any) => ({
            id: attachment.id,
            name: attachment.name,
            path: `/api/files/${classId}/${lecture.lectureId}/${attachment.name}`,
            size: attachment.size,
            type: attachment.type
          })) || []
        };
      } catch (error) {
        console.error('Error in lecture resolver:', error);
        return null;
      }
    },
  },
  RootCategory: {
    mainCategories: (parent: { id: string }) => 
      mainCategories.filter((mc: MainCategory) => mc.rootCategoryId === parent.id),
  },
  MainCategory: {
    subCategories: (parent: { id: string }) => 
      subCategories.filter((sc: SubCategory) => sc.mainCategoryId === parent.id),
    classes: (parent: { id: string }) => {
      const subCategoryIds = subCategories
        .filter((sc: SubCategory) => sc.mainCategoryId === parent.id)
        .map((sc: SubCategory) => sc.id);
      
      subCategoryIds.push(parent.id);
      
      return classes.filter((c: Class) => subCategoryIds.includes(c.categoryId));
    },
  },
  SubCategory: {
    classes: (parent: { id: string }) => 
      classes.filter((c: Class) => c.categoryId === parent.id),
  },
  Class: {
    lectures: (parent: { id: string }) => {
      const lecturesData = loadLectures(parent.id);
      return lecturesData.map((item: LectureData) => ({
        id: item.lectureId,
        sn: item.sn,
        chapter: item.chapter,
        title: item.title,
        duration: item.duration,
        commentCount: item.commentCount,
        hasMission: item.hasMission,
        hasAttachment: item.hasAttachment,
        classId: parent.id
      }));
    },
  },
  Lecture: {
    videoPath: (parent: any) => {
      return getVideoApiUrl(parent.classId, parent.id);
  },
    attachments: (parent: any) => {
      return getFilePaths(parent.classId, parent.id);
    }
  }
} 