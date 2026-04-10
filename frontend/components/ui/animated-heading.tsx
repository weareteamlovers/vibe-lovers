'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, revealUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function AnimatedHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className
}: AnimatedHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  if (prefersReducedMotion) {
    return (
      <div className={cn('flex flex-col gap-4', alignment, className)}>
        {eyebrow ? <p className="text-xs uppercase tracking-[0.35em] text-paper/50">{eyebrow}</p> : null}
        <h2 className="max-w-5xl text-4xl font-semibold leading-none tracking-tight text-paper md:text-6xl">
          {title}
        </h2>
        {description ? <p className="max-w-2xl text-sm text-paper/65 md:text-base">{description}</p> : null}
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
        <motion.p className="text-xs uppercase tracking-[0.35em] text-paper/50" variants={revealUp}>
          {eyebrow}
        </motion.p>
      ) : null}
      <motion.h2
        className="max-w-5xl text-4xl font-semibold leading-none tracking-tight text-paper md:text-6xl lg:text-7xl"
        variants={revealUp}
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p className="max-w-2xl text-sm text-paper/65 md:text-base" variants={revealUp}>
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
