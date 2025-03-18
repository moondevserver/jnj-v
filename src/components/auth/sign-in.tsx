'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

export function SignIn() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">로그인</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            소셜 계정으로 로그인하세요
          </p>
        </div>

        <div className="space-y-4">
          {/* 카카오 로그인 */}
          <button
            onClick={() => signIn('kakao', { callbackUrl })}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-[#FEE500] px-4 py-3 text-sm font-medium text-[#000000] hover:bg-[#FEE500]/90"
          >
            <Image
              src="/images/kakao.svg"
              alt="Kakao"
              width={20}
              height={20}
            />
            카카오로 시작하기
          </button>

          {/* 네이버 로그인 */}
          <button
            onClick={() => signIn('naver', { callbackUrl })}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-[#03C75A] px-4 py-3 text-sm font-medium text-white hover:bg-[#03C75A]/90"
          >
            <Image
              src="/images/naver.svg"
              alt="Naver"
              width={20}
              height={20}
            />
            네이버로 시작하기
          </button>

          {/* 구글 로그인 */}
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-3 text-sm font-medium text-black hover:bg-gray-50 border"
          >
            <Image
              src="/images/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Google로 시작하기
          </button>

          {/* Apple 로그인 */}
          <button
            onClick={() => signIn('apple', { callbackUrl })}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-black px-4 py-3 text-sm font-medium text-white hover:bg-black/90"
          >
            <Image
              src="/images/apple.svg"
              alt="Apple"
              width={20}
              height={20}
            />
            Apple로 시작하기
          </button>
        </div>
      </div>
    </div>
  )
} 