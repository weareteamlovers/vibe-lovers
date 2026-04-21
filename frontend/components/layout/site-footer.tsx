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

      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex w-full items-center justify-between gap-4">
          <p className="shrink-0 text-left text-[11px] font-semibold tracking-[0.12em] text-paper sm:text-sm md:text-base">
            팀사랑꾼들닷컴 © 2026
          </p>

          <p className="max-w-[210px] text-right text-[10px] leading-relaxed text-paper/85 sm:max-w-[320px] sm:text-xs md:max-w-none md:text-sm">
            팀사랑꾼들은 한국의 락 밴드이자 AI Engineering Group 입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}