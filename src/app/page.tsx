import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Next.js + Shadcn + Tailwind</CardTitle>
          <CardDescription>현대적인 웹 애플리케이션 스택</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            이 프로젝트는 Next.js, TypeScript, Shadcn UI, Tailwind CSS를 사용하여 구축되었습니다.
          </p>
        </CardContent>
        <CardFooter>
          <Button>시작하기</Button>
        </CardFooter>
      </Card>
    </main>
  );
}