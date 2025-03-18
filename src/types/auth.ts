export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  USER = 'user',
  // USER = 'USER',       // 일반 사용자
  // STUDENT = 'STUDENT', // 수강생
  // TEACHER = 'TEACHER', // 강사
  // ADMIN = 'ADMIN'      // 관리자
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
}

// NextAuth와 함께 사용하기 위한 타입 확장
declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}