'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { MediaItem } from '@/lib/types';
import { SectionShell } from '@/components/layout/section-shell';
import { AnimatedHeading } from '@/components/ui/animated-heading';

type LazyVideoProps = {
  src: string;
  poster?: string;
  title?: string;
};

// 나중에 사진 배경으로 되돌리고 싶으면 'image' 로만 바꾸면 됨.
const GALLERY_BACKGROUND_MODE: 'solid' | 'image' = 'image';
const GALLERY_BACKGROUND_COLOR = '#FFFFCC'
const GALLERY_BACKGROUND_IMAGE_SRC = '/media/images/team.jpg';

function GalleryBackground() {
  if (GALLERY_BACKGROUND_MODE === 'image') {
    return (
      <div className="absolute inset-0 -z-10">
        <Image
          src={GALLERY_BACKGROUND_IMAGE_SRC}
          alt="Exhibition background"
          fill
          sizes="100vw"
          quality={100}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/0" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: GALLERY_BACKGROUND_COLOR }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.55), transparent 28%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.35), transparent 30%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.28), transparent 32%)'
        }}
      />
    </div>
  );
}

function LazyVideo({ src, poster, title }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '300px 0px'
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible]);

  return (
    <video
      ref={videoRef}
      className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]"
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={title}
    >
      {isVisible ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}

export function MediaGallerySection({ items }: { items: MediaItem[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionShell id="exhibition" className="relative overflow-hidden pt-10 md:pt-16">
      <GalleryBackground />

      <div className="[&_h2]:!text-[#24181d] [&_p]:!text-[#6b4d56]">
        <AnimatedHeading eyebrow="" title="팀사랑꾼들이 사랑하는 앨범들" description="" />
      </div>

      <div className="mt-14 columns-1 gap-5 md:columns-2 xl:columns-3 [&>*:not(:first-child)]:mt-5">
        {items.map((item, index) => (
          <motion.article
            key={item.id}
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: 36, filter: 'blur(14px)', scale: 0.98 }
            }
            whileInView={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    scale: 1,
                    transition: { duration: 0.8, delay: index * 0.05 }
                  }
            }
            viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
            whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.012 }}
            className="group relative mb-5 break-inside-avoid overflow-hidden rounded-[30px] border border-black/10 bg-white/72 p-3 shadow-soft backdrop-blur-sm"
            data-cursor="interactive"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative overflow-hidden rounded-[22px]">
              {item.type === 'video' ? (
                <LazyVideo
                  src={item.src}
                  poster={item.poster ?? undefined}
                  title={item.title}
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt ?? item.title}
                  width={item.width ?? 1000}
                  height={item.height ?? 1400}
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  quality={70}
                  className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              )}
            </div>

            <div className="relative flex items-end justify-between gap-4 px-2 pb-2 pt-4">
              <div>
                <h3 className="text-lg font-medium text-[#24181d]">{item.title}</h3>
              </div>

              {item.caption ? (
                <p className="max-w-[14rem] text-right text-xs leading-relaxed text-[#6b4d56]">
                  {item.caption}
                </p>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}