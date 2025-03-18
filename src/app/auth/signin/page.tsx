import { SignIn } from '@/components/auth/sign-in'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '로그인',
  description: '로그인 페이지',
}

export default function SignInPage() {
  return <SignIn />
} 