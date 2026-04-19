'use client';

import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { siteIntro } from '@/content/site';

import { SectionBackground } from '@/components/ui/section-background';

import heroBackground from '../../public/media/images/hero.avif';

const HERO_BANNER_TEXT = 'MORE THAN JUST MUSIC';
const HERO_BANNER_REPEAT_COUNT = 4;

function BannerFlower() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-5 w-5 shrink-0 text-[#ff6267] md:h-7 md:w-7"
      fill="currentColor"
    >
      <rect x="19" y="2" width="10" height="18" rx="5" />
      <rect x="28" y="19" width="18" height="10" rx="5" />
      <rect x="19" y="28" width="10" height="18" rx="5" />
      <rect x="2" y="19" width="18" height="10" rx="5" />
    </svg>
  );
}

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-5 pb-4 pt-10 md:px-8 lg:px-12">
      <SectionBackground
        src={heroBackground}
        overlayClassName="bg-black/0"
        priority
        quality={100}
      />
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
              AI Engineer • 싱어송라이터 • 사랑꾼
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

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-[#89c2b1]" />
        <div className="absolute inset-x-0 top-px h-px bg-[#ff6267]/45" />
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#ff6267]" />
        <div className="absolute inset-0 bg-paper/10 backdrop-blur-[1px]" />

        <div className="relative flex min-w-max animate-marquee whitespace-nowrap py-3 will-change-transform md:py-4">
          {[0, 1].map((group) => (
            <div
              key={group}
              className="flex shrink-0 items-center gap-4 pr-4 md:gap-6 md:pr-6"
            >
              {Array.from({ length: HERO_BANNER_REPEAT_COUNT }).map((_, index) => (
                <Fragment key={`${group}-${index}`}>
                  <span className="text-[clamp(1.15rem,2.45vw,2.75rem)] font-semibold uppercase leading-none tracking-[-0.06em] text-[#ff6267]">
                    {HERO_BANNER_TEXT}
                  </span>
                  <BannerFlower />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}