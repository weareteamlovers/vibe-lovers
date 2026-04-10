'use client';

import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMounted } from '@/hooks/use-mounted';

export function CustomCursor() {
  const mounted = useMounted();
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 240, damping: 28, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 240, damping: 28, mass: 0.6 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMove = (event: MouseEvent) => {
      x.set(event.clientX - 18);
      y.set(event.clientY - 18);
    };

    const handlePointerOver = (event: Event) => {
      const target = event.target as HTMLElement | null;
      setHovering(Boolean(target?.closest('[data-cursor="interactive"]')));
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handlePointerOver);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handlePointerOver);
    };
  }, [prefersReducedMotion, x, y]);

  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[999] hidden h-9 w-9 rounded-full border border-paper/35 bg-paper/10 backdrop-blur-md md:block"
      style={{ x: springX, y: springY, scale: hovering ? 1.85 : 1 }}
    >
      <div className="absolute inset-2 rounded-full border border-paper/30" />
    </motion.div>
  );
}
