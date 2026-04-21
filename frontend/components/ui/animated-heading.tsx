'use client';

import type { CSSProperties } from 'react';

import { motion, useReducedMotion } from 'framer-motion';

import { staggerContainer, revealUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  balanceTitle?: boolean;
  titleMaxLines?: number;
}

const titleClassName =
  'max-w-5xl whitespace-pre-line break-keep text-3xl font-semibold leading-[1.08] tracking-tight text-paper sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl';

const descriptionClassName =
  'max-w-2xl break-keep text-sm leading-relaxed text-paper/65 md:text-base';

const balancedWrapStyle: CSSProperties = {
  textWrap: 'balance'
};

export function AnimatedHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  balanceTitle = false
}: AnimatedHeadingProps) {
  const prefersReducedMotion = useReducedMotion();

  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-start text-left';

  const titleStyle = balanceTitle ? balancedWrapStyle : undefined;

  if (prefersReducedMotion) {
    return (
      <div className={cn('flex flex-col gap-4', alignment, className)}>
        {eyebrow ? (
          <p className="break-keep text-xs uppercase tracking-[0.35em] text-paper/50">
            {eyebrow}
          </p>
        ) : null}

        <h2 className={titleClassName} style={titleStyle}>
          {title}
        </h2>

        {description ? <p className={descriptionClassName}>{description}</p> : null}
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

      <motion.h2 className={titleClassName} style={titleStyle} variants={revealUp}>
        {title}
      </motion.h2>

      {description ? (
        <motion.p className={descriptionClassName} variants={revealUp}>
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}