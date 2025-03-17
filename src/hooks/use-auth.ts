import { useSession } from 'next-auth/react'
import { UserRole, UserSession } from '@/types/auth'

export function useAuth(requiredRoles?: UserRole[]) {
  const { data: session, status } = useSession() as { data: UserSession | null, status: string }
  
  const hasRequiredRole = !requiredRoles || 
    (session?.user?.role && requiredRoles.includes(session.user.role))

  return {
    session,
    status,
    isAuthenticated: !!session,
    isAuthorized: hasRequiredRole,
    role: session?.user?.role
  }
} 