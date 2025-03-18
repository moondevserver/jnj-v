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