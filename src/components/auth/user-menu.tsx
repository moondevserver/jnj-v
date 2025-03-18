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