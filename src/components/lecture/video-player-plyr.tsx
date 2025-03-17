'use client'

import { useEffect, useRef } from 'react'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

interface VideoPlayerProps {
  videoUrl: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current) return;
    
    const player = new Plyr(videoRef.current, {
      controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
    });

    return () => {
      player.destroy();
    }
  }, [videoUrl]);

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/x-matroska" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
} 