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