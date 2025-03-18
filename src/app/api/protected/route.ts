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