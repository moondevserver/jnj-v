"use client"

import { useEffect, useState } from 'react'

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [finalVideoUrl, setFinalVideoUrl] = useState(videoUrl);

  useEffect(() => {
    const checkAndSetVideoUrl = async () => {
      if (videoUrl?.endsWith('.mkv')) {
        const mp4Url = videoUrl.replace('.mkv', '.mp4');
        try {
          const response = await fetch(mp4Url, { method: 'HEAD' });
          if (response.ok) {
            setFinalVideoUrl(mp4Url);
          } else {
            setFinalVideoUrl(videoUrl);
          }
        } catch {
          setFinalVideoUrl(videoUrl);
        }
      } else {
        setFinalVideoUrl(videoUrl);
      }
    };

    checkAndSetVideoUrl();
  }, [videoUrl]);

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        className="w-full h-full"
        controls
        playsInline
        preload="metadata"
        title={title}
      >
        <source src={finalVideoUrl} />
        <p>
          죄송합니다. 현재 브라우저에서는 이 비디오를 재생할 수 없습니다.<br />
          데스크톱 브라우저에서 시청해주세요.
        </p>
      </video>
    </div>
  );
} 