import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import NaverProvider from 'next-auth/providers/naver'
import KakaoProvider from 'next-auth/providers/kakao'
import AppleProvider from 'next-auth/providers/apple'
import { UserRole } from '@/types/auth'
import { findUserByEmail, findUserByProviderAccount, createUser, updateUser } from '@/lib/user'

// 환경 변수 확인 로깅 - 여기에 추가
console.log('Environment variables check:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('GOOGLE_ID exists:', !!process.env.GOOGLE_ID);
console.log('GOOGLE_SECRET exists:', !!process.env.GOOGLE_SECRET);
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
        }
      }
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        url: "https://kauth.kakao.com/oauth/authorize",
        params: {
          scope: "profile_nickname profile_image account_email"
        }
      },
      token: {
        url: "https://kauth.kakao.com/oauth/token",
      },
      userinfo: {
        url: "https://kapi.kakao.com/v2/user/me",
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.properties?.nickname || '',
          email: profile.kakao_account?.email,
          image: profile.properties?.profile_image,
        }
      }
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          console.warn('User email is missing');
          return false;
        }
        
        // 기존 사용자 검색
        let existingUser = await findUserByEmail(user.email);
        
        // 사용자가 없으면 새로 생성
        if (!existingUser) {
          existingUser = await createUser({
            email: user.email,
            name: user.name || '',
            image: user.image || '',
            role: UserRole.USER,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
          });
          
          console.log(`New user created: ${user.email}`);
        } else {
          // 기존 사용자 정보 업데이트
          await updateUser(existingUser.id, {
            name: user.name || existingUser.name,
            image: user.image || existingUser.image,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
          });
        }
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    
    async jwt({ token, account, profile, user }) {
      try {
        // 처음 로그인할 때만 실행
        if (user && account) {
          const existingUser = await findUserByEmail(user.email as string);
          
          if (existingUser) {
            token.id = existingUser.id;
            token.role = existingUser.role;
          } else {
            token.role = UserRole.USER;
          }
        }
        
        return token;
      } catch (error) {
        console.error('Error in jwt callback:', error);
        token.role = UserRole.USER;
        return token;
      }
    },
    
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as UserRole,
        }
      };
    },

    async redirect({ url, baseUrl }) {
      console.log('Redirect callback - URL:', url);
      console.log('Redirect callback - BaseUrl:', baseUrl);
      
      // baseUrl을 명시적으로 설정
      const customBaseUrl = process.env.NEXTAUTH_URL!;
      
      // 상대 URL인 경우 (예: /profile)
      if (url.startsWith('/')) {
        return `${customBaseUrl}${url}`;
      }
      // 이미 절대 URL인 경우
      else if (new URL(url).origin === customBaseUrl) {
        return url;
      }
      // 다른 도메인으로의 리디렉션 (기본적으로 허용하지 않음)
      return customBaseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }