'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

import { siteIntro } from '@/content/site';

const HERO_TITLE = '팀사랑꾼들';
const HERO_TITLE_COLOR = '#FFF099';
const BANNER_COLOR = '#ff6267';
const HERO_BANNER_REPEAT_COUNT = 4;

function BannerFlower() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-5 w-5 shrink-0 md:h-7 md:w-7"
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

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ backgroundColor: BANNER_COLOR }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[2px]"
          style={{ backgroundColor: BANNER_COLOR }}
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />

        <div className="relative flex min-w-max animate-marquee whitespace-nowrap py-3 will-change-transform md:py-4">
          {[0, 1].map((group) => (
            <div
              key={group}
              className="flex shrink-0 items-center gap-4 pr-4 md:gap-6 md:pr-6"
              style={{ color: BANNER_COLOR }}
            >
              {Array.from({ length: HERO_BANNER_REPEAT_COUNT }).map((_, index) => (
                <Fragment key={`${group}-${index}`}>
                  <span
                    className="text-[clamp(1.1rem,2.2vw,2.7rem)] font-semibold leading-none tracking-[-0.05em]"
                    style={{
                      fontFamily:
                        '"SF Pro Text", "SF Pro Display", "Apple SD Gothic Neo", -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif',
                    }}
                  >
                    {siteIntro.marquee}
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