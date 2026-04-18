'use client';

import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring
} from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMounted } from '@/hooks/use-mounted';

const CURSOR_SRC = '/cursor/custom-cursor.png';
const CURSOR_SIZE = 40;
const HOTSPOT_X = CURSOR_SIZE / 2;
const HOTSPOT_Y = CURSOR_SIZE / 2;
const DEFAULT_SCALE = 1;
const INTERACTIVE_SCALE = 1.12;

function isInteractiveTarget(target: HTMLElement | null) {
  return Boolean(
    target?.closest(
      [
        'a',
        'button',
        'summary',
        'select',
        'label[for]',
        '[role="button"]',
        '[data-cursor="interactive"]'
      ].join(', ')
    )
  );
}

function isTextEditableTarget(target: HTMLElement | null) {
  return Boolean(
    target?.closest(
      [
        'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="reset"])',
        'textarea',
        '[contenteditable="true"]'
      ].join(', ')
    )
  );
}

export function CustomCursor() {
  const mounted = useMounted();
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const springX = useSpring(x, {
    stiffness: 420,
    damping: 32,
    mass: 0.45
  });

  const springY = useSpring(y, {
    stiffness: 420,
    damping: 32,
    mass: 0.45
  });

  const [visible, setVisible] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);
  const [overTextEditable, setOverTextEditable] = useState(false);

  useEffect(() => {
    if (!mounted || prefersReducedMotion) return;

    const root = document.documentElement;
    root.classList.add('cursor-custom-enabled');

    const hideCursor = () => {
      setVisible(false);
      setHoveringInteractive(false);
      setOverTextEditable(false);
      x.set(-200);
      y.set(-200);
    };

    const handleMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      x.set(event.clientX - HOTSPOT_X);
      y.set(event.clientY - HOTSPOT_Y);

      setVisible(true);
      setHoveringInteractive(isInteractiveTarget(target));
      setOverTextEditable(isTextEditableTarget(target));
    };

    const handleOver = (event: Event) => {
      const target = event.target as HTMLElement | null;
      setHoveringInteractive(isInteractiveTarget(target));
      setOverTextEditable(isTextEditableTarget(target));
    };

    const handleWindowMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        hideCursor();
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver);
    window.addEventListener('mouseout', handleWindowMouseOut);
    window.addEventListener('blur', hideCursor);

    return () => {
      root.classList.remove('cursor-custom-enabled');
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleWindowMouseOut);
      window.removeEventListener('blur', hideCursor);
    };
  }, [mounted, prefersReducedMotion, x, y]);

  if (!mounted || prefersReducedMotion || overTextEditable) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden select-none md:block"
      style={{
        x: springX,
        y: springY,
        opacity: visible ? 1 : 0,
        scale: hoveringInteractive ? INTERACTIVE_SCALE : DEFAULT_SCALE
      }}
    >
      <div
        className="relative"
        style={{
          width: CURSOR_SIZE,
          height: CURSOR_SIZE
        }}
      >
        <Image
          src={CURSOR_SRC}
          alt=""
          fill
          priority
          sizes={`${CURSOR_SIZE}px`}
          draggable={false}
          className="object-contain"
        />
      </div>
    </motion.div>
  );
}