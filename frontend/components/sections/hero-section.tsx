'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

import { siteIntro } from '@/content/site';

const HERO_TITLE = '팀사랑꾼들';
const HERO_TITLE_COLOR = '#475FD5';

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-5 pb-4 pt-10 md:px-8 lg:px-12">
      <div className="absolute inset-0">
        <Image
          src="/media/images/hero.avif"
          alt="Hero background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/0" />
      </div>

      <div className="noise-overlay" />

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <h1
            className="font-garet-black whitespace-nowrap text-[18vw] leading-[0.9] tracking-[-0.08em] md:text-[12vw] lg:text-[10.5vw]"
            style={{ color: HERO_TITLE_COLOR }}
          >
            {HERO_TITLE}
          </h1>
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