'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { siteIntro } from '@/content/site';

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-5 pb-4 pt-10 md:px-8 lg:px-12">
      <div className="absolute inset-0">
        <Image
          src="/media/images/teen.jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="noise-overlay" />
      <div className="relative mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-8 text-center"
        >
          <div className="flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.45em] text-paper/40 md:text-xs">
              싱어송라이터 • AI Engineer • 사랑꾼
            </span>
            <h1 className="text-balance text-[18vw] font-semibold leading-[0.9] tracking-[-0.08em] text-paper md:text-[12vw] lg:text-[10.5vw]">
              {siteIntro.title}
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-paper/65 md:text-lg">
            {siteIntro.subtitle}
          </p>
        </motion.div>
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] overflow-hidden border-y border-line py-3 text-xs uppercase tracking-[0.25em] text-paper/55 md:text-sm">
        <div className="flex min-w-max animate-marquee gap-8 whitespace-nowrap will-change-transform">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index}>{siteIntro.marquee}</span>
          ))}
        </div>
      </div>
    </section>
  );
}