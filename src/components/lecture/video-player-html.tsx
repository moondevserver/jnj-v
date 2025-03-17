"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Pause, Play, SkipBack, SkipForward, Volume2, Maximize, Minimize } from "lucide-react"

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [finalVideoUrl, setFinalVideoUrl] = useState(videoUrl);
  const [videoType, setVideoType] = useState('');

  useEffect(() => {
    const checkAndSetVideoUrl = async () => {
      // MKV 파일인 경우에만 MP4 확인
      if (videoUrl?.endsWith('.mkv')) {
        const mp4Url = videoUrl.replace('.mkv', '.mp4');
        
        try {
          const response = await fetch(mp4Url, { method: 'HEAD' });
          if (response.ok) {
            setFinalVideoUrl(mp4Url);
            setVideoType('video/mp4');
          } else {
            setFinalVideoUrl(videoUrl);
            setVideoType('application/x-matroska');
          }
        } catch {
          setFinalVideoUrl(videoUrl);
          setVideoType('application/x-matroska');
        }
      } else {
        setFinalVideoUrl(videoUrl);
        setVideoType('video/mp4');
      }
    };

    checkAndSetVideoUrl();
  }, [videoUrl]);

  return (
    <div className="relative aspect-video w-full bg-black">
      {/* 비디오 배경 (오렌지색 배경) */}
      <div className="absolute inset-0 bg-[#FF4D00]">
        <div className="flex h-full flex-col items-center justify-center text-white">
          <div className="max-w-2xl text-center text-3xl font-bold leading-relaxed">
            온라인 자동 수익화를 담당해 줄 나만의 매력적인 부캐가 갖게 되는 새로운 기회요인과 강점에 대해서 살펴봅니다
          </div>
        </div>
      </div>

      {/* 컨트롤 바 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="flex items-center gap-4 text-white">
          {/* 재생 컨트롤 */}
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:text-white/80">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:text-white/80">
              <Play className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:text-white/80">
              <SkipForward className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span>00:00</span>
              <span>/</span>
              <span>00:00</span>
            </div>
          </div>

          {/* 프로그레스 바 */}
          <div className="flex-1">
            <div className="h-1 rounded-full bg-white/30">
              <div className="h-full w-0 rounded-full bg-white" />
            </div>
          </div>

          {/* 볼륨 및 전체화면 */}
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:text-white/80">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:text-white/80">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          className="w-full h-full"
          controls
          playsInline
          preload="metadata"
          title={title}
        >
          <source src={finalVideoUrl} type={videoType} />
          <p>
            죄송합니다. 현재 브라우저에서는 이 비디오를 재생할 수 없습니다.<br />
            데스크톱 브라우저에서 시청해주세요.
          </p>
        </video>
      </div>
    </div>
  )
} 