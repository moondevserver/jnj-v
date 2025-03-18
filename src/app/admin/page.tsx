import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route';
import { UserRole } from '@/types/auth';
import { Session } from 'next-auth';
import { isAdminBySession } from '@/lib/auth'

// 세션 타입 확장 (필요한 경우)
interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions) as CustomSession | null;
  // 서버 컴포넌트에서 권한 검사
  if (!(await isAdminBySession(session))) {
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