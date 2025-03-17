import { Metadata } from "next"
import HomeClient from "./home-client"

export const metadata: Metadata = {
  title: "JNJ Video",
  description: "온라인 강의 플랫폼",
}

export default function HomePage() {
  return <HomeClient />
} 