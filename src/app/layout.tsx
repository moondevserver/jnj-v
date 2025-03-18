import { ApolloWrapper } from '@/lib/apollo-provider'
import { SessionProvider } from '@/components/providers/session-provider';
import './globals.css'

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
