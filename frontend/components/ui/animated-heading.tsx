'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
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
  'max-w-5xl break-keep text-3xl font-semibold leading-[1.08] tracking-tight text-paper sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl';

const descriptionClassName =
  'max-w-2xl break-keep text-sm leading-relaxed text-paper/65 md:text-base';

function splitWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function measureTextWidth(
  text: string,
  context: CanvasRenderingContext2D,
  letterSpacing: number
) {
  const baseWidth = context.measureText(text).width;
  const extraSpacing = letterSpacing > 0 ? Math.max(text.length - 1, 0) * letterSpacing : 0;
  return baseWidth + extraSpacing;
}

function buildBalancedLines(text: string, element: HTMLElement, maxLines: number) {
  const words = splitWords(text);

  if (words.length < 2) {
    return null;
  }

  const availableWidth = element.clientWidth;

  if (!availableWidth) {
    return null;
  }

  const context = document.createElement('canvas').getContext('2d');

  if (!context) {
    return null;
  }

  const style = window.getComputedStyle(element);
  const letterSpacing =
    style.letterSpacing === 'normal' ? 0 : Number.parseFloat(style.letterSpacing) || 0;

  context.font = `${style.fontStyle} ${style.fontVariant} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

  const wordWidths = words.map((word) => measureTextWidth(word, context, letterSpacing));
  const spaceWidth = measureTextWidth(' ', context, letterSpacing);

  let requiredLineCount = 1;
  let currentLineWidth = 0;

  for (const wordWidth of wordWidths) {
    if (currentLineWidth === 0) {
      currentLineWidth = wordWidth;
      continue;
    }

    const nextWidth = currentLineWidth + spaceWidth + wordWidth;

    if (nextWidth <= availableWidth) {
      currentLineWidth = nextWidth;
      continue;
    }

    requiredLineCount += 1;
    currentLineWidth = wordWidth;
  }

  const lineCount = Math.min(Math.max(requiredLineCount, 1), Math.min(maxLines, words.length));

  if (lineCount <= 1) {
    return null;
  }

  const prefixWidths = [0];

  for (const width of wordWidths) {
    prefixWidths.push(prefixWidths[prefixWidths.length - 1] + width);
  }

  const getLineWidth = (start: number, endExclusive: number) =>
    prefixWidths[endExclusive] - prefixWidths[start] + spaceWidth * Math.max(endExclusive - start - 1, 0);

  const totalWidth = getLineWidth(0, words.length);
  const targetWidth = totalWidth / lineCount;

  const dp = Array.from({ length: lineCount + 1 }, () =>
    Array(words.length + 1).fill(Number.POSITIVE_INFINITY)
  );
  const prev = Array.from({ length: lineCount + 1 }, () =>
    Array(words.length + 1).fill(-1)
  );

  dp[0][0] = 0;

  for (let line = 1; line <= lineCount; line += 1) {
    for (let end = line; end <= words.length; end += 1) {
      for (let start = line - 1; start < end; start += 1) {
        const remainingWords = words.length - end;
        const remainingLines = lineCount - line;

        if (remainingWords < remainingLines) {
          continue;
        }

        const segmentWidth = getLineWidth(start, end);
        const segmentWordCount = end - start;
        const overflow = Math.max(segmentWidth - availableWidth, 0);

        if (overflow > 0 && segmentWordCount > 1) {
          continue;
        }

        const balanceCost = Math.pow(segmentWidth - targetWidth, 2);
        const overflowCost = overflow > 0 ? Math.pow(overflow, 2) * 40 : 0;
        const lastLinePenalty = line === lineCount ? Math.pow(segmentWidth - targetWidth, 2) * 0.35 : 0;

        const nextScore = dp[line - 1][start] + balanceCost + overflowCost + lastLinePenalty;

        if (nextScore < dp[line][end]) {
          dp[line][end] = nextScore;
          prev[line][end] = start;
        }
      }
    }
  }

  if (!Number.isFinite(dp[lineCount][words.length])) {
    return null;
  }

  const lines: string[] = [];
  let end = words.length;

  for (let line = lineCount; line >= 1; line -= 1) {
    const start = prev[line][end];

    if (start < 0) {
      return null;
    }

    lines.unshift(words.slice(start, end).join(' '));
    end = start;
  }

  return lines.length > 1 ? lines : null;
}

function renderBalancedText(text: string, lines: string[] | null) {
  if (!lines || lines.length === 0) {
    return text;
  }

  return lines.map((line, index) => (
    <Fragment key={`${line}-${index}`}>
      {index > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}

export function AnimatedHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  balanceTitle = false,
  titleMaxLines = 4
}: AnimatedHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [balancedTitleLines, setBalancedTitleLines] = useState<string[] | null>(null);

  useEffect(() => {
    if (!balanceTitle) {
      setBalancedTitleLines(null);
      return;
    }

    const element = titleRef.current;

    if (!element) {
      return;
    }

    let frameId = 0;

    const updateBalancedLines = () => {
      cancelAnimationFrame(frameId);

      frameId = window.requestAnimationFrame(() => {
        const nextLines = buildBalancedLines(title, element, titleMaxLines);
        const nextSignature = nextLines?.join('\n') ?? '';
        setBalancedTitleLines((currentLines) => {
          const currentSignature = currentLines?.join('\n') ?? '';
          return currentSignature === nextSignature ? currentLines : nextLines;
        });
      });
    };

    updateBalancedLines();

    const resizeObserver = new ResizeObserver(() => {
      updateBalancedLines();
    });

    resizeObserver.observe(element);
    window.addEventListener('orientationchange', updateBalancedLines);

    document.fonts?.ready
      .then(() => {
        updateBalancedLines();
      })
      .catch(() => undefined);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('orientationchange', updateBalancedLines);
    };
  }, [balanceTitle, title, titleMaxLines]);

  const renderedTitle = renderBalancedText(title, balanceTitle ? balancedTitleLines : null);

  if (prefersReducedMotion) {
    return (
      <div className={cn('flex flex-col gap-4', alignment, className)}>
        {eyebrow ? (
          <p className="break-keep text-xs uppercase tracking-[0.35em] text-paper/50">
            {eyebrow}
          </p>
        ) : null}

        <h2 ref={titleRef} className={titleClassName}>
          {renderedTitle}
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

      <motion.h2 ref={titleRef} className={titleClassName} variants={revealUp}>
        {renderedTitle}
      </motion.h2>

      {description ? (
        <motion.p className={descriptionClassName} variants={revealUp}>
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}