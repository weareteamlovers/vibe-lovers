'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Bagel_Fat_One } from 'next/font/google';

import { siteIntro } from '@/content/site';

const HERO_TITLE = '팀사랑꾼들.';
const HERO_TITLE_COLOR = '#FFF099';
const BANNER_TEXT_COLOR = '#fff4ea';
const HERO_BANNER_REPEAT_COUNT = 6;

const bannerFont = Bagel_Fat_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

function BannerBurst() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-5 w-5 shrink-0 md:h-6 md:w-6 lg:h-7 lg:w-7"
      fill="currentColor"
    >
      <polygon points="24,0 28,14 40,4 34,18 48,24 34,30 40,44 28,34 24,48 20,34 8,44 14,30 0,24 14,18 8,4 20,14" />
    </svg>
  );
}

function BannerSequence() {
  return (
    <>
      {Array.from({ length: HERO_BANNER_REPEAT_COUNT }).map((_, index) => (
        <div
          key={index}
          className="flex shrink-0 items-center gap-3 md:gap-4 lg:gap-5"
          style={{ marginRight: '1.6rem' }}
        >
          <span
            className="banner-text text-[clamp(1.32rem,2.31vw,2.75rem)] leading-none tracking-[-0.03em] md:text-[clamp(1.38rem,1.98vw,2.42rem)]"
            style={{
              color: BANNER_TEXT_COLOR,
              wordSpacing: '0.4em',
            }}
          >
            {siteIntro.marquee}
          </span>
          <BannerBurst />
        </div>
      ))}
    </>
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

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/media/images/banners.avif"
            alt="Banner background"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="banner-marquee-shell relative overflow-hidden">
          <div
            className={`banner-marquee-track banner-marquee-track-a ${bannerFont.className}`}
            aria-hidden="true"
            style={{ color: BANNER_TEXT_COLOR }}
          >
            <BannerSequence />
          </div>

          <div
            className={`banner-marquee-track banner-marquee-track-b ${bannerFont.className}`}
            aria-hidden="true"
            style={{ color: BANNER_TEXT_COLOR }}
          >
            <BannerSequence />
          </div>
        </div>
      </div>

      <style jsx>{`
        .banner-marquee-shell {
          height: 72px;
        }

        .banner-marquee-track {
          position: absolute;
          top: 50%;
          left: 0;
          display: flex;
          align-items: center;
          width: max-content;
          transform: translate3d(0, -50%, 0);
          will-change: transform;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        .banner-marquee-track-a {
          animation: banner-marquee-a 48s linear infinite;
        }

        .banner-marquee-track-b {
          animation: banner-marquee-b 48s linear infinite;
        }

        .banner-text {
          white-space: nowrap;
        }

        @keyframes banner-marquee-a {
          from {
            transform: translate3d(0%, -50%, 0);
          }
          to {
            transform: translate3d(-100%, -50%, 0);
          }
        }

        @keyframes banner-marquee-b {
          from {
            transform: translate3d(100%, -50%, 0);
          }
          to {
            transform: translate3d(0%, -50%, 0);
          }
        }

        @media (min-width: 768px) {
          .banner-marquee-shell {
            height: 80px;
          }
        }

        @media (min-width: 1024px) {
          .banner-marquee-shell {
            height: 86px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .banner-marquee-track-a,
          .banner-marquee-track-b {
            animation: none;
          }

          .banner-marquee-track-b {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}