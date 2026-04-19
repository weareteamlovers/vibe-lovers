'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MediaItem } from '@/lib/types';

function getPrimaryVideo(items: MediaItem[]) {
  return [...items]
    .filter((item) => item.type === 'video' && item.src)
    .sort((a, b) => a.order - b.order)[0] ?? null;
}

function getVideoMimeType(src: string) {
  const normalized = src.toLowerCase().split('?')[0];

  if (normalized.endsWith('.webm')) return 'video/webm';
  if (normalized.endsWith('.mov')) return 'video/quicktime';
  return 'video/mp4';
}

export function FullVideoSection({ items }: { items: MediaItem[] }) {
  const video = useMemo(() => getPrimaryVideo(items), [items]);

  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [shouldLoadSource, setShouldLoadSource] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadSource(true);
        }

        setShouldPlay(entry.intersectionRatio >= 0.35);
      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: [0, 0.35, 0.75]
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    if (shouldLoadSource) {
      node.load();
    }
  }, [shouldLoadSource]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    if (shouldPlay) {
      const playPromise = node.play();
      if (playPromise) {
        playPromise.catch(() => {
          // autoplay policy 등으로 실패해도 UI 깨지지 않게 무시
        });
      }
      return;
    }

    node.pause();
  }, [shouldPlay]);

  if (!video) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="exhibition"
      aria-label={video.title || video.alt || 'Featured video'}
      className="relative w-full overflow-hidden bg-black"
    >
      <div className="relative h-[100svh] min-h-[560px] w-full">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          poster={video.poster ?? undefined}
          aria-label={video.title || video.alt || 'Featured video'}
        >
          {shouldLoadSource ? (
            <source src={video.src} type={getVideoMimeType(video.src)} />
          ) : null}
        </video>
      </div>
    </section>
  );
}