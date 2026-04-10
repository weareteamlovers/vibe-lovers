'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { MediaItem } from '@/lib/types';
import { SectionShell } from '@/components/layout/section-shell';
import { AnimatedHeading } from '@/components/ui/animated-heading';

export function MediaGallerySection({ items }: { items: MediaItem[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionShell id="exhibition" className="relative overflow-hidden pt-10 md:pt-16">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/media/images/fruit.jpg"
          alt="Exhibition background"
          fill
          className="object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-black/0" />
      </div>

      <AnimatedHeading
        eyebrow="Exhibition"
        title="빛과 소리와 장면을 한 장씩 넘기듯 감상하는 전시형 공간"
        description="사진, 포스터, 짧은 영상이 섞여 흐르는 갤러리입니다. 레이아웃은 일부러 비대칭으로 설계해 잡지와 전시장 사이의 리듬을 만들었습니다."
      />

      <div className="mt-14 columns-1 gap-5 md:columns-2 xl:columns-3 [&>*:not(:first-child)]:mt-5">
        {items.map((item, index) => (
          <motion.article
            key={item.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 36, filter: 'blur(14px)', scale: 0.98 }}
            whileInView={
              prefersReducedMotion
                ? undefined
                : { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, transition: { duration: 0.8, delay: index * 0.05 } }
            }
            viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
            whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.012 }}
            className="group relative mb-5 break-inside-avoid overflow-hidden rounded-[30px] border border-line bg-white/[0.03] p-3 shadow-soft"
            data-cursor="interactive"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-[22px]">
              {item.type === 'video' ? (
                <video
                  className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={item.poster ?? undefined}
                >
                  <source src={item.src} />
                </video>
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt ?? item.title}
                  width={item.width ?? 1000}
                  height={item.height ?? 1400}
                  className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              )}
            </div>
            <div className="relative flex items-end justify-between gap-4 px-2 pb-2 pt-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-paper/40">{item.type}</p>
                <h3 className="mt-2 text-lg font-medium text-paper">{item.title}</h3>
              </div>
              {item.caption ? <p className="max-w-[14rem] text-right text-xs leading-relaxed text-paper/50">{item.caption}</p> : null}
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}
