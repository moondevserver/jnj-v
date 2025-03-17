import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ClassTabs() {
  return (
    <div className="border-b">
      <div className="container">
        <Tabs defaultValue="intro" className="w-full">
          <TabsList className="h-12">
            <TabsTrigger value="intro" className="text-sm">클래스 소개</TabsTrigger>
            <TabsTrigger value="curriculum" className="text-sm">준비물</TabsTrigger>
            <TabsTrigger value="creator" className="text-sm">커리큘럼</TabsTrigger>
            <TabsTrigger value="reviews" className="text-sm">크리에이터</TabsTrigger>
            <TabsTrigger value="community" className="text-sm">추천</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
} 