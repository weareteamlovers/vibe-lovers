'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Bagel_Fat_One } from 'next/font/google';

import { siteIntro } from '@/content/site';

const HERO_TITLE = '팀사랑꾼들';
const HERO_TITLE_COLOR = '#FFF099';
const BANNER_BG_COLOR = '#ff6267';
const BANNER_TEXT_COLOR = '#fff4ea';
const HERO_BANNER_REPEAT_COUNT = 4;

const bannerFont = Bagel_Fat_One({
  weight: '400',
  display: 'swap',
  preload: false,
});

function BannerBurst() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-7 w-7 shrink-0 md:h-9 md:w-9 lg:h-10 lg:w-10"
      fill="currentColor"
    >
      <polygon points="24,0 28,14 40,4 34,18 48,24 34,30 40,44 28,34 24,48 20,34 8,44 14,30 0,24 14,18 8,4 20,14" />
    </svg>
  );
}

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-5 pb-0 pt-10 md:px-8 lg:px-12">
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
            className="text-balance text-[18vw] leading-[0.9] tracking-[-0.08em] md:text-[12vw] lg:text-[10.5vw]"
            style={{
              color: HERO_TITLE_COLOR,
              fontFamily:
                '"SF Pro Text", "SF Pro Display", "Apple SD Gothic Neo", -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif',
              fontWeight: 700,
            }}
          >
            {HERO_TITLE}
          </h1>
        </motion.div>
      </div>

      <div
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
        style={{ backgroundColor: BANNER_BG_COLOR }}
      >
        <div className="relative flex min-w-max animate-marquee whitespace-nowrap py-4 will-change-transform md:py-5 lg:py-6">
          {[0, 1].map((group) => (
            <div
              key={group}
              className={`flex shrink-0 items-center gap-5 pr-5 md:gap-7 md:pr-7 lg:gap-8 lg:pr-8 ${bannerFont.className}`}
              style={{ color: BANNER_TEXT_COLOR }}
            >
              {Array.from({ length: HERO_BANNER_REPEAT_COUNT }).map((_, index) => (
                <Fragment key={`${group}-${index}`}>
                  <span className="text-[clamp(2.2rem,5vw,5.8rem)] leading-[0.82] tracking-[-0.045em]">
                    {siteIntro.marquee}
                  </span>
                  <BannerBurst />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}