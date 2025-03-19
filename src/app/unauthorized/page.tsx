import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">접근 권한 없음</h2>
        <p className="text-muted-foreground">
          이 페이지에 접근할 권한이 없습니다.
        </p>
        <div className="mt-4">
          <Link
            href="/"
            className="text-sm text-primary hover:text-primary/80"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}