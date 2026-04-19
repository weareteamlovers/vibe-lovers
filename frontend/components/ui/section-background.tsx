import Image, { StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';

type SectionBackgroundProps = {
  src: StaticImageData;
  alt?: string;
  overlayClassName?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
};

export function SectionBackground({
  src,
  alt = '',
  overlayClassName = 'bg-black/20',
  className,
  priority = false,
  quality = 95,
  sizes = '100vw'
}: SectionBackgroundProps) {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        placeholder="blur"
        sizes={sizes}
        quality={quality}
        className={cn('object-cover object-center', className)}
      />
      <div className={cn('absolute inset-0', overlayClassName)} />
    </div>
  );
}