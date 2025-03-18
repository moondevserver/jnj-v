import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/auth';
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route';

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