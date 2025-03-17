'use client'

import { useEffect, useState } from 'react'

interface VideoPlayerProps {
  classId: string   // 예: "65953072d3cfc0000e6707f0"
  lectureId: string // 예: "659b48907b9c8e000e802f74"
  title: string
  poster?: string
}

export function VideoPlayer({ classId, lectureId, title, poster }: VideoPlayerProps) {
  const [apiPath, setApiPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVideoPath() {
      try {
        const response = await fetch(`/api/video?classId=${classId}&lectureId=${lectureId}`)
        const data = await response.json()
        
        if (response.ok) {
          setApiPath(data.apiPath)
          setError(null)
        } else {
          setError(data.error || '비디오 경로를 가져오는데 실패했습니다.')
          setApiPath(null)
        }
      } catch (err) {
        setError('비디오 경로를 가져오는데 실패했습니다.')
        setApiPath(null)
      }
    }

    if (classId && lectureId) {
      fetchVideoPath()
    }
  }, [classId, lectureId])

  if (!classId || !lectureId) {
    return (
      <div className="w-full aspect-video bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">비디오를 불러올 수 없습니다.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (!apiPath) {
    return (
      <div className="w-full aspect-video bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">비디오 경로를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <video
      className="w-full aspect-video"
      controls
      poster={poster}
      preload="metadata"
      src={apiPath}
    >
      <source src={apiPath} type="video/mp4" />
      {title}
    </video>
  )
} 