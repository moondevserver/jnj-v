export enum UserRole {
  USER = 'USER',       // 일반 사용자
  STUDENT = 'STUDENT', // 수강생
  TEACHER = 'TEACHER', // 강사
  ADMIN = 'ADMIN'      // 관리자
}

// 카카오 프로필 타입
interface KakaoProfile {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account: {
    email?: string;
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    profile_needs_agreement?: boolean;
  };
}

// next-auth의 Session 타입 확장
declare module 'next-auth' {
  interface User {
    role: UserRole;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
    }
  }

  interface Profile extends KakaoProfile {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
  }
} 