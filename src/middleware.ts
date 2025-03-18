import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { UserRole } from '@/types/auth';

// 권한이 필요한 경로 정의
const adminRoutes = ['/admin', '/admin/users', '/admin/settings'];
const protectedRoutes = ['/dashboard', '/profile', '/settings'];
const authRoutes = ['/auth/signin', '/auth/error'];

// * admin 여부
const isAdmin = (token: any) : boolean => token && token.role?.toLowerCase() === UserRole.ADMIN.toLowerCase()

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 토큰(세션) 가져오기
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log(`#### token: ${JSON.stringify(token)} UserRole.ADMIN: ${UserRole.ADMIN}`)
  
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
    if (!isAdmin(token)) {
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