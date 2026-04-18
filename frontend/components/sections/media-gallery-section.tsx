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
    <SectionShell
      id="exhibition"
      className="relative overflow-hidden pt-10 md:pt-16"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/media/images/textile.jpg"
          alt="Exhibition background"
          fill
          sizes="100vw"
          quality={60}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      <AnimatedHeading eyebrow="" title="팀사랑꾼들이 사랑하는 앨범들" description="" />

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
            className="group relative mb-5 break-inside-avoid overflow-hidden rounded-[30px] border border-line bg-white/[0.03] p-3 shadow-soft"
            data-cursor="interactive"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

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
                <h3 className="text-lg font-medium text-paper">{item.title}</h3>
              </div>
              {item.caption ? (
                <p className="max-w-[14rem] text-right text-xs leading-relaxed text-paper/50">
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