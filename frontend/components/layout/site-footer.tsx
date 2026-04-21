import Image from 'next/image';

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="absolute inset-0">
        <Image
          src="/media/images/banners.avif"
          alt="Footer banner background"
          fill
          sizes="100vw"
          quality={100}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold tracking-[0.14em] text-paper md:text-base">
            팀사랑꾼들닷컴 © 2026
          </p>

          <p className="text-right text-xs text-paper/85 md:text-sm">
            팀사랑꾼들은 한국의 락 밴드이자 AI Engineering Group 입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}