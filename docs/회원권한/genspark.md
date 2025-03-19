- [회원권한 문의](https://www.genspark.ai/agents?id=687d926a-6468-4509-ac16-3e8f3820f087)

# NextJS에서 회원 권한 기능 구현하기

NextJS 애플리케이션에서 소셜 로그인(Google, Apple, Naver, Kakao)을 통한 회원 가입/로그인 및 권한에 따른 페이지와 API 접근 제한 기능을 구현하는 방법을 단계별로 설명해 드리겠습니다.

## **1. 기본 구조 이해하기:**

현재 코드는 NextAuth.js를 사용하여 소셜 로그인을 구현하고 있으며, 다음과 같은 주요 파일들이 있습니다:

- `/app/auth/signin/page.tsx`: 로그인 페이지
- `/app/auth/error/page.tsx`: 인증 오류 페이지
- `/components/auth/sign-in.tsx`: 로그인 UI 컴포넌트
- `/app/api/auth/[...nextauth]/route.ts`: NextAuth 설정 및 API 엔드포인트

## **2. 회원 권한 시스템 구현 단계:**

### **2.1 사용자 역할(Role) 정의:**

먼저 사용자 역할을 정의하는 타입을 생성합니다.

```typescript
// /src/types/auth.ts
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  EDITOR = 'editor',
  // 필요한 다른 역할들 추가
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
```

### **2.2 사용자 데이터 관리:**

사용자 정보를 저장할 `users.json` 파일 구조를 정의합니다.

```json
// /data/users.json
{
  "users": [
    {
      "id": "1",
      "email": "admin@example.com",
      "name": "관리자",
      "role": "admin"
    },
    {
      "id": "2",
      "email": "user@example.com",
      "name": "일반 사용자",
      "role": "user"
    }
  ]
}
```

### **2.3 사용자 권한 확인 미들웨어 구현:**

NextJS 미들웨어를 사용하여 접근 권한을 검사합니다.

```typescript
// /src/middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { UserRole } from '@/types/auth';

// 권한이 필요한 경로 정의
const adminRoutes = ['/admin', '/admin/users', '/admin/settings'];
const protectedRoutes = ['/dashboard', '/profile', '/settings'];
const authRoutes = ['/auth/signin', '/auth/error'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 토큰(세션) 가져오기
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // 인증이 필요한 페이지에 대한 접근 제어
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }
  
  // 관리자 전용 페이지에 대한 접근 제어
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!token || token.role !== UserRole.ADMIN) {
      // 관리자가 아닌 사용자는 접근 거부 페이지로 리디렉션
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  // 이미 로그인한 사용자가 로그인 페이지에 접근하는 경우
  if (authRoutes.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * 미들웨어를 적용할 경로 패턴 지정
     * - 정적 파일은 제외
     * - API 경로 중 auth 관련 경로는 제외 (NextAuth 처리를 위해)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
```

### **2.4 권한 검사 훅 생성:**

클라이언트 컴포넌트에서 사용자 권한을 확인하는 훅을 만듭니다.

```typescript
// /src/hooks/useAuth.ts
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/types/auth';

export function useRequireAuth(requiredRole?: UserRole) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'loading') return;
    
    // 로그인되지 않은 경우
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }
    
    // 권한 검사
    if (requiredRole && session?.user.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [session, status, router, requiredRole]);
  
  return { session, status };
}
```

### **2.5 API 라우트 보호:**

API 라우트에서 권한을 확인하는 헬퍼 함수를 만듭니다.

```typescript
// /src/lib/auth.ts
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/auth';
import { handler as authOptions } from '@/app/api/auth/[...nextauth]/route';

// API 라우트 보호를 위한 헬퍼 함수
export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  requiredRole?: UserRole
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: Authentication required' },
      { status: 401 }
    );
  }
  
  if (requiredRole && session.user.role !== requiredRole) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return handler(req);
}
```

### **2.6 사용자 관리 기능 구현:**

신규 사용자 등록 및 기존 사용자 정보 업데이트 기능을 구현합니다.

```typescript
// /src/lib/user.ts
import fs from 'fs/promises';
import path from 'path';
import { UserRole } from '@/types/auth';

interface UserData {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: UserRole;
  provider?: string;
  providerAccountId?: string;
}

interface UsersData {
  users: UserData[];
}

const USER_FILE_PATH = path.join(process.env.DATA_ROOT_PATH || '', 'users.json');

// 모든 사용자 가져오기
export async function getAllUsers(): Promise<UserData[]> {
  try {
    const data = await fs.readFile(USER_FILE_PATH, 'utf-8');
    const users: UsersData = JSON.parse(data);
    return users.users || [];
  } catch (error) {
    console.error('Failed to read users:', error);
    return [];
  }
}

// 사용자 찾기
export async function findUserByEmail(email: string): Promise<UserData | null> {
  const users = await getAllUsers();
  return users.find(user => user.email === email) || null;
}

// 사용자 찾기 (소셜 계정 ID로)
export async function findUserByProviderAccount(
  provider: string,
  providerAccountId: string
): Promise<UserData | null> {
  const users = await getAllUsers();
  return users.find(
    user => user.provider === provider && user.providerAccountId === providerAccountId
  ) || null;
}

// 새 사용자 생성
export async function createUser(userData: Omit<UserData, 'id'>): Promise<UserData> {
  const users = await getAllUsers();
  
  // 새 ID 생성
  const newId = (Math.max(...users.map(u => parseInt(u.id)), 0) + 1).toString();
  
  const newUser: UserData = {
    id: newId,
    ...userData,
    role: userData.role || UserRole.USER
  };
  
  // 사용자 추가
  users.push(newUser);
  
  // 파일에 저장
  await fs.writeFile(
    USER_FILE_PATH,
    JSON.stringify({ users }, null, 2),
    'utf-8'
  );
  
  return newUser;
}

// 사용자 정보 업데이트
export async function updateUser(
  id: string,
  userData: Partial<Omit<UserData, 'id'>>
): Promise<UserData | null> {
  const users = await getAllUsers();
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) return null;
  
  // 사용자 정보 업데이트
  users[userIndex] = {
    ...users[userIndex],
    ...userData
  };
  
  // 파일에 저장
  await fs.writeFile(
    USER_FILE_PATH,
    JSON.stringify({ users }, null, 2),
    'utf-8'
  );
  
  return users[userIndex];
}
```

### **2.7 NextAuth 콜백 개선:**

NextAuth의 콜백 함수들을 개선하여 사용자 관리 기능을 통합합니다.

```typescript
// /src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import NaverProvider from 'next-auth/providers/naver'
import KakaoProvider from 'next-auth/providers/kakao'
import AppleProvider from 'next-auth/providers/apple'
import { UserRole } from '@/types/auth'
import { findUserByEmail, findUserByProviderAccount, createUser, updateUser } from '@/lib/user'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        url: "https://kauth.kakao.com/oauth/authorize",
        params: {
          scope: "profile_nickname profile_image account_email"
        }
      },
      token: {
        url: "https://kauth.kakao.com/oauth/token",
      },
      userinfo: {
        url: "https://kapi.kakao.com/v2/user/me",
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.properties?.nickname || '',
          email: profile.kakao_account?.email,
          image: profile.properties?.profile_image,
        }
      }
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          console.warn('User email is missing');
          return false;
        }
        
        // 기존 사용자 검색
        let existingUser = await findUserByEmail(user.email);
        
        // 사용자가 없으면 새로 생성
        if (!existingUser) {
          existingUser = await createUser({
            email: user.email,
            name: user.name || '',
            image: user.image || '',
            role: UserRole.USER,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
          });
          
          console.log(`New user created: ${user.email}`);
        } else {
          // 기존 사용자 정보 업데이트
          await updateUser(existingUser.id, {
            name: user.name || existingUser.name,
            image: user.image || existingUser.image,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
          });
        }
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    
    async jwt({ token, account, profile, user }) {
      try {
        // 처음 로그인할 때만 실행
        if (user && account) {
          const existingUser = await findUserByEmail(user.email as string);
          
          if (existingUser) {
            token.id = existingUser.id;
            token.role = existingUser.role;
          } else {
            token.role = UserRole.USER;
          }
        }
        
        return token;
      } catch (error) {
        console.error('Error in jwt callback:', error);
        token.role = UserRole.USER;
        return token;
      }
    },
    
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as UserRole,
        }
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }
```

### **2.8 접근 제한 페이지 컴포넌트 생성:**

권한이 없는 사용자에게 보여줄 페이지를 만듭니다.

```tsx
// /src/app/unauthorized/page.tsx
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">접근 권한 없음</h2>
        <p className="text-muted-foreground">
          이 페이지에 접근할 권한이 없습니다.
        </p>
        <div className="mt-4">
          <Link
            href="/"
            className="text-sm text-primary hover:text-primary/80"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
```

## **3. 권한 제한 페이지 구현 예시:**

### **3.1 관리자 전용 페이지:**

```tsx
// /src/app/admin/page.tsx
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { handler as authOptions } from '@/app/api/auth/[...nextauth]/route';
import { UserRole } from '@/types/auth';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  // 서버 컴포넌트에서 권한 검사
  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect('/unauthorized');
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">관리자 대시보드</h1>
      <p>이 페이지는 관리자만 볼 수 있습니다.</p>
      {/* 관리자 기능들 */}
    </div>
  );
}
```

### **3.2 로그인 필요 페이지 (클라이언트 컴포넌트):**

```tsx
// /src/app/profile/page.tsx
'use client';

import { useRequireAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { session, status } = useRequireAuth();
  
  if (status === 'loading') {
    return <div>로딩 중...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">내 프로필</h1>
      <div>
        <p>이름: {session?.user.name}</p>
        <p>이메일: {session?.user.email}</p>
        <p>권한: {session?.user.role}</p>
      </div>
    </div>
  );
}
```

### **3.3 보호된 API 라우트:**

```typescript
// /src/app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    return NextResponse.json({ message: '인증된 사용자만 접근 가능한 데이터' });
  });
}

export async function POST(req: NextRequest) {
  return withAuth(
    req,
    async () => {
      const data = await req.json();
      // 데이터 처리 로직
      return NextResponse.json({ success: true, data });
    },
    UserRole.ADMIN // 관리자만 접근 가능
  );
}
```

## **4. 환경 설정:**

`.env.local` 파일에 필요한 환경 변수를 설정합니다.

```
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# OAuth Providers
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret

APPLE_ID=your_apple_client_id
APPLE_SECRET=your_apple_client_secret

# Data Path
DATA_ROOT_PATH=/volume1/docker/frontend/nextjs/sites/jnj-v/data
```

## **5. 사용자 인터페이스 확장:**

### **5.1 로그인 상태 표시 및 로그아웃 버튼:**

```tsx
// /src/components/auth/user-menu.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { UserRole } from '@/types/auth';

export function UserMenu() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />;
  }
  
  if (status === 'unauthenticated') {
    return (
      <Link
        href="/auth/signin"
        className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
      >
        로그인
      </Link>
    );
  }
  
  return (
    <div className="relative group">
      <button className="flex items-center space-x-2">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || '사용자'}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600">{session.user.name?.charAt(0) || '?'}</span>
          </div>
        )}
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
        <div className="px-4 py-2 border-b">
          <p className="text-sm font-medium">{session.user.name}</p>
          <p className="text-xs text-gray-500">{session.user.email}</p>
        </div>
        
        <div className="py-1">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            프로필
          </Link>
          
          {session.user.role === UserRole.ADMIN && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              관리자 페이지
            </Link>
          )}
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
```

## **6. 전체 기능 통합:**

이제 모든 구성 요소를 통합하여 완전한 회원 권한 시스템을 구현했습니다. 주요 기능은 다음과 같습니다:

1. 소셜 로그인(Google, Apple, Naver, Kakao) 지원
2. 사용자 역할 기반 접근 제어(RBAC)
3. 페이지 및 API 라우트 보호
4. 서버 및 클라이언트 측 권한 검사
5. 사용자 관리 기능(생성, 조회, 업데이트)

## **7. 테스트 및 검증:**

구현된 기능을 다음과 같이 테스트할 수 있습니다:

1. 소셜 로그인 테스트
2. 권한에 따른 페이지 접근 제한 테스트
3. 권한에 따른 API 접근 제한 테스트
4. 사용자 정보 업데이트 테스트

이 구현은 JSON 파일을 사용하여 사용자 데이터를 관리하지만, 실제 프로덕션 환경에서는 데이터베이스(MongoDB, PostgreSQL 등)를 사용하는 것이 좋습니다. 필요에 따라 `lib/user.ts`의 함수들을 데이터베이스 작업으로 대체할 수 있습니다.


---

# NextJS 회원 인증 시스템 구현을 위한 필수 패키지

NextJS에서 회원 인증 시스템을 구현하기 위해 설치해야 하는 주요 패키지들을 안내해 드리겠습니다.

## **핵심 패키지:**

1. **next-auth** - 인증 시스템의 기반
   ```bash
   npm install next-auth
   # 또는
   yarn add next-auth
   ```

2. **소셜 로그인 제공자 관련 패키지**
   ```bash
   # 이미 next-auth에 포함되어 있으므로 별도 설치 불필요
   # 각 제공자(Google, Apple, Naver, Kakao)는 next-auth/providers에서 가져올 수 있음
   ```

## **유틸리티 및 보안 관련 패키지:**

3. **jsonwebtoken** - JWT 토큰 관리 (next-auth가 내부적으로 사용하지만, 추가 커스터마이징이 필요할 경우)
   ```bash
   npm install jsonwebtoken
   # 또는
   yarn add jsonwebtoken
   ```

4. **@types/jsonwebtoken** - TypeScript 사용 시 필요한 타입 정의
   ```bash
   npm install --save-dev @types/jsonwebtoken
   # 또는
   yarn add --dev @types/jsonwebtoken
   ```

## **환경 변수 관리:**

5. **dotenv** - 환경 변수 관리 (NextJS는 기본적으로 .env 파일을 지원하지만, 추가 기능이 필요할 경우)
   ```bash
   npm install dotenv
   # 또는
   yarn add dotenv
   ```

## **데이터 관리 (JSON 파일 대신 데이터베이스 사용 시):**

6. **데이터베이스 클라이언트** (선택 사항)
   ```bash
   # MongoDB 사용 시
   npm install mongodb
   # 또는
   yarn add mongodb

   # Prisma ORM 사용 시 (여러 데이터베이스 지원)
   npm install prisma @prisma/client
   # 또는
   yarn add prisma @prisma/client
   ```

## **설치 명령어 종합:**

다음 명령어로 필수 패키지들을 한 번에 설치할 수 있습니다:

```bash
# npm 사용 시
npm install next-auth jsonwebtoken
npm install --save-dev @types/jsonwebtoken

# yarn 사용 시
yarn add next-auth jsonwebtoken
yarn add --dev @types/jsonwebtoken
```

## **참고사항:**

1. **TypeScript 사용 시**: NextJS 프로젝트가 TypeScript를 사용한다면, 위에서 언급한 `@types/` 패키지들이 필요합니다.

2. **데이터베이스 선택**: 현재 코드는 JSON 파일을 사용하고 있지만, 실제 프로덕션 환경에서는 데이터베이스를 사용하는 것이 좋습니다. 선택한 데이터베이스에 따라 추가 패키지가 필요할 수 있습니다.

3. **환경 설정**: 패키지 설치 후, `.env.local` 파일에 필요한 환경 변수를 설정해야 합니다(OAuth 클라이언트 ID/Secret, NextAuth Secret 등).

4. **NextAuth 버전 호환성**: NextJS 버전에 맞는 next-auth 버전을 설치해야 합니다. NextJS 13 이상을 사용한다면 next-auth v4 이상을 사용해야 합니다.