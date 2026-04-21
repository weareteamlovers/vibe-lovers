'use client';

import type { CSSProperties, ReactNode } from 'react';

import { motion, useReducedMotion } from 'framer-motion';

import { staggerContainer, revealUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  eyebrow?: string;
  title: string;
  mobileTitle?: string;
  desktopTitle?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  balanceTitle?: boolean;
  useDefaultTitleSizing?: boolean;
  titleClassName?: string;
  descriptionClassName?: string;
  singleLineTitle?: boolean;
}

const titleBaseClassName =
  'max-w-5xl break-keep font-semibold tracking-tight text-paper';

const defaultTitleSizeClassName =
  'text-3xl leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl';

const defaultDescriptionClassName =
  'max-w-2xl break-keep text-sm leading-relaxed text-paper/65 md:text-base';

const balancedWrapStyle: CSSProperties = {
  textWrap: 'balance'
};

function renderFixedLines(text: string): ReactNode {
  const lines = text.split('\n');

  return lines.map((line, index) => (
    <span
      key={`${line}-${index}`}
      className="block whitespace-nowrap"
    >
      {line}
    </span>
  ));
}

function ResponsiveTitle({
  title,
  mobileTitle,
  desktopTitle
}: {
  title: string;
  mobileTitle?: string;
  desktopTitle?: string;
}) {
  const mobileText = mobileTitle ?? title;
  const desktopText = desktopTitle ?? title;

  const mobileHasManualBreaks = mobileText.includes('\n');
  const desktopHasManualBreaks = desktopText.includes('\n');

  if (!mobileTitle && !desktopTitle) {
    return mobileHasManualBreaks ? renderFixedLines(title) : <>{title}</>;
  }

  return (
    <>
      <span className="block md:hidden">
        {mobileHasManualBreaks ? renderFixedLines(mobileText) : mobileText}
      </span>

      <span className="hidden md:block">
        {desktopHasManualBreaks ? renderFixedLines(desktopText) : desktopText}
      </span>
    </>
  );
}

export function AnimatedHeading({
  eyebrow,
  title,
  mobileTitle,
  desktopTitle,
  description,
  align = 'left',
  className,
  balanceTitle = false,
  useDefaultTitleSizing = true,
  titleClassName,
  descriptionClassName,
  singleLineTitle = false
}: AnimatedHeadingProps) {
  const prefersReducedMotion = useReducedMotion();

  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-start text-left';

  const effectiveMobileTitle = mobileTitle ?? title;
  const effectiveDesktopTitle = desktopTitle ?? title;

  const hasManualBreaks =
    effectiveMobileTitle.includes('\n') || effectiveDesktopTitle.includes('\n');

  const titleStyle =
    balanceTitle && !hasManualBreaks && !singleLineTitle
      ? balancedWrapStyle
      : undefined;

  const resolvedTitleClassName = cn(
    titleBaseClassName,
    singleLineTitle
      ? 'whitespace-nowrap'
      : hasManualBreaks
        ? 'whitespace-normal'
        : 'whitespace-pre-line',
    useDefaultTitleSizing && defaultTitleSizeClassName,
    titleClassName
  );

  const resolvedDescriptionClassName = cn(
    defaultDescriptionClassName,
    descriptionClassName
  );

  if (prefersReducedMotion) {
    return (
      <div className={cn('flex flex-col gap-4', alignment, className)}>
        {eyebrow ? (
          <p className="break-keep text-xs uppercase tracking-[0.35em] text-paper/50">
            {eyebrow}
          </p>
        ) : null}

        <h2 className={resolvedTitleClassName} style={titleStyle}>
          <ResponsiveTitle
            title={title}
            mobileTitle={mobileTitle}
            desktopTitle={desktopTitle}
          />
        </h2>

        {description ? (
          <p className={resolvedDescriptionClassName}>{description}</p>
        ) : null}
      </div>
    );
  }

  return (
    <motion.div
      className={cn('flex flex-col gap-4', alignment, className)}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px' }}
    >
      {eyebrow ? (
        <motion.p
          className="break-keep text-xs uppercase tracking-[0.35em] text-paper/50"
          variants={revealUp}
        >
          {eyebrow}
        </motion.p>
      ) : null}

      <motion.h2
        className={resolvedTitleClassName}
        style={titleStyle}
        variants={revealUp}
      >
        <ResponsiveTitle
          title={title}
          mobileTitle={mobileTitle}
          desktopTitle={desktopTitle}
        />
      </motion.h2>

      {description ? (
        <motion.p className={resolvedDescriptionClassName} variants={revealUp}>
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}