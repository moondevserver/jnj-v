import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bookmark, Share2 } from "lucide-react"

interface ClassDetailProps {
  classId: string
}

export function ClassDetail({ classId }: ClassDetailProps) {
  return (
    <div className="container py-8">
      <div className="flex gap-8">
        {/* 좌측: 이미지 슬라이더 */}
        <div className="relative aspect-[4/3] w-[600px] overflow-hidden rounded-lg">
          <Image
            src="https://images.unsplash.com/photo-1633356122544-f134324a6cee"
            alt="ChatGPT로 빠르게 필로위 늘리는 뷰케 만들기"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <span className="rounded-full bg-black/60 px-2 py-1 text-xs text-white">1/6</span>
          </div>
        </div>

        {/* 우측: 강의 정보 */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            챗GPT로 빠르게 필로위 늘리는 뷰케 만들기
          </h1>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="김윤경"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium">김윤경 x 허민 대표</span>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>중급</span>
              <span>•</span>
              <span>챕터 6개 · 3시간 56분</span>
            </div>
            <div className="flex items-center gap-2">
              <span>한국어 · 영어 · 일본어</span>
              <span>•</span>
              <span>오디오 한국어</span>
            </div>
          </div>

          <div className="mt-8">
            <Button className="h-12 w-full text-base" size="lg">
              수강하기
            </Button>
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
                </Button>
                <span className="mt-1 text-sm text-muted-foreground">7,219</span>
              </div>
              <div className="flex flex-col items-center">
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
                <span className="mt-1 text-sm text-muted-foreground">공유</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 