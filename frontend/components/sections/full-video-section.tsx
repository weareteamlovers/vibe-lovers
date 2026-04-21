'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MediaItem } from '@/lib/types';

type ResolvedVideo = {
  src: string;
  poster?: string;
  title?: string;
  alt?: string;
};

function getVideoMimeType(src: string) {
  const normalized = src.toLowerCase().split('?')[0];

  if (normalized.endsWith('.webm')) return 'video/webm';
  if (normalized.endsWith('.mov')) return 'video/quicktime';
  return 'video/mp4';
}

function getPrimaryVideo(items: MediaItem[]): ResolvedVideo | null {
  const video = [...items]
    .filter((item) => item.type === 'video' && item.src)
    .sort((a, b) => a.order - b.order)[0];

  if (!video) return null;

  return {
    src: video.src,
    poster: video.poster || undefined,
    title: video.title || undefined,
    alt: video.alt || undefined,
  };
}

export function FullVideoSection({ items = [] }: { items?: MediaItem[] }) {
  const resolvedVideo = useMemo<ResolvedVideo>(() => {
    return (
      getPrimaryVideo(items) ?? {
        src: '/media/videos/works.mp4',
        poster: undefined,
        title: 'Featured video',
        alt: 'Featured video',
      }
    );
  }, [items]);

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
        threshold: [0, 0.35, 0.75],
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !shouldLoadSource) return;
    node.load();
  }, [shouldLoadSource, resolvedVideo.src]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !shouldLoadSource) return;

    if (shouldPlay) {
      const playPromise = node.play();
      if (playPromise) {
        playPromise.catch(() => {});
      }
    } else {
      node.pause();
    }
  }, [shouldPlay, shouldLoadSource]);

  return (
    <section
      ref={sectionRef}
      id="exhibition"
      aria-label={resolvedVideo.title || resolvedVideo.alt || 'Featured video'}
      className="relative w-full overflow-hidden bg-black"
    >
      <div className="relative w-full bg-black aspect-video md:aspect-auto md:h-[100svh] md:min-h-[560px]">
        <video
          ref={videoRef}
          key={resolvedVideo.src}
          className="absolute inset-0 h-full w-full object-contain md:object-cover"
          muted
          loop
          playsInline
          preload="none"
          poster={resolvedVideo.poster}
          aria-label={resolvedVideo.title || resolvedVideo.alt || 'Featured video'}
        >
          {shouldLoadSource ? (
            <source
              src={resolvedVideo.src}
              type={getVideoMimeType(resolvedVideo.src)}
            />
          ) : null}
        </video>
      </div>
    </section>
  );
}