export default function AuthError() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">로그인 오류</h2>
        <p className="text-muted-foreground">
          로그인 중 오류가 발생했습니다.
        </p>
        <div className="mt-4">
          <a
            href="/auth/signin"
            className="text-sm text-primary hover:text-primary/80"
          >
            다시 로그인하기
          </a>
        </div>
      </div>
    </div>
  )
} 