import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/auth';
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route';
import { findUserByEmail } from '@/lib/user'

// * admin 여부
const isAdminBySession = async (data: any) : Promise<any> => {
  const user = await findUserByEmail(data.user.email)
  const rst = (user && user.role?.toString().toLowerCase() === UserRole.ADMIN.toString().toLowerCase())
  // console.log(`### user: ${JSON.stringify(user)}`)
  // console.log(`### rst: ${rst}`)
  return rst
}

// API 라우트 보호를 위한 헬퍼 함수
const withAuth = async (
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  requiredRole?: UserRole
) => {
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

export {
  isAdminBySession,
  withAuth
}