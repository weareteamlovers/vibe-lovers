import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function SectionShell({
  id,
  children,
  className
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn('relative w-full px-5 py-20 md:px-8 md:py-28 lg:px-12', className)}>
      <div className="mx-auto w-full max-w-[1500px]">{children}</div>
    </section>
  );
}
